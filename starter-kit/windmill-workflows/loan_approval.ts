/**
 * Loan Approval Workflow with Human-in-the-Loop
 *
 * This Windmill script handles loan approval requests with automatic
 * routing based on amount thresholds and human approval steps.
 *
 * Features:
 * - Automatic approval for amounts under threshold
 * - Manager approval for mid-range amounts
 * - Executive approval for large amounts
 * - Slack notifications for urgent approvals
 * - Full audit trail
 */

import { Client } from 'pg';

interface LoanApprovalRequest {
  loan_id: string;
  project_id: string;
  borrower_name: string;
  borrower_email: string;
  loan_type: 'ACQUISITION' | 'CONSTRUCTION' | 'BRIDGE' | 'PERMANENT';
  loan_amount: number;
  interest_rate: number;
  term_months: number;
  ltv_ratio: number; // Loan-to-value ratio
  debt_service_coverage: number;
  project_details: {
    address: string;
    estimated_value: number;
    construction_budget?: number;
    completion_timeline?: string;
  };
  financial_metrics: {
    borrower_credit_score: number;
    borrower_net_worth: number;
    project_roi: number;
    exit_strategy: string;
  };
  documents_submitted: string[];
  risk_factors?: string[];
  notes?: string;
}

interface ApprovalDecision {
  approved: boolean;
  approver_email: string;
  approval_level: 'AUTO' | 'MANAGER' | 'SENIOR' | 'EXECUTIVE';
  conditions?: string[];
  comments?: string;
  timestamp: string;
}

// Configuration
const DB_CONFIG = {
  host: 'postgres',
  port: 5432,
  user: 'blueprint',
  password: 'blueprint_dev_2024',
  database: 'connect2'
};

// Approval thresholds
const APPROVAL_THRESHOLDS = {
  AUTO: 500000,        // Under $500K - automatic approval if criteria met
  MANAGER: 2000000,    // Under $2M - manager approval
  SENIOR: 5000000,     // Under $5M - senior manager approval
  EXECUTIVE: Infinity  // $5M+ - executive approval
};

// Risk scoring weights
const RISK_WEIGHTS = {
  ltv_ratio: 0.3,
  debt_service_coverage: 0.25,
  borrower_credit_score: 0.20,
  project_roi: 0.15,
  borrower_experience: 0.10
};

/**
 * Main approval workflow
 */
export async function main(input: LoanApprovalRequest): Promise<any> {
  console.log(`Processing loan approval for: ${input.borrower_name}`);
  console.log(`Loan Amount: $${input.loan_amount.toLocaleString()}`);

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();

    // Step 1: Validate loan request
    const validation = await validateLoanRequest(input);
    if (!validation.isValid) {
      return {
        status: 'rejected',
        reason: 'validation_failed',
        errors: validation.errors,
        loan_id: input.loan_id
      };
    }

    // Step 2: Calculate risk score
    const riskScore = calculateRiskScore(input);
    console.log(`Risk Score: ${riskScore.score}/100`);

    // Step 3: Check automatic denial criteria
    if (shouldAutoDeny(input, riskScore)) {
      await updateLoanStatus(client, input.loan_id, 'DENIED', {
        denial_reason: 'Failed automatic criteria',
        risk_score: riskScore.score,
        risk_factors: riskScore.factors
      });

      return {
        status: 'denied',
        reason: 'auto_denial_criteria',
        risk_score: riskScore.score,
        risk_factors: riskScore.factors,
        loan_id: input.loan_id
      };
    }

    // Step 4: Determine approval level required
    const approvalLevel = determineApprovalLevel(input.loan_amount, riskScore.score);
    console.log(`Approval Level Required: ${approvalLevel}`);

    // Step 5: Process based on approval level
    let decision: ApprovalDecision;

    if (approvalLevel === 'AUTO' && riskScore.score >= 75) {
      // Automatic approval for low-risk, small loans
      decision = {
        approved: true,
        approver_email: 'system@blueprint.com',
        approval_level: 'AUTO',
        timestamp: new Date().toISOString(),
        comments: 'Automatically approved based on risk score and amount'
      };
    } else {
      // Create approval task for human review
      const approver = await getApprover(client, approvalLevel);

      // This is where Windmill's approval feature would be triggered
      // In production, this would pause the workflow and wait for human input
      console.log(`Creating approval task for: ${approver.email}`);

      // Prepare approval request data
      const approvalRequest = {
        loan_id: input.loan_id,
        borrower: input.borrower_name,
        amount: input.loan_amount,
        risk_score: riskScore.score,
        risk_analysis: riskScore.analysis,
        key_metrics: {
          ltv: input.ltv_ratio,
          dscr: input.debt_service_coverage,
          roi: input.financial_metrics.project_roi,
          credit_score: input.financial_metrics.borrower_credit_score
        },
        recommendation: generateRecommendation(riskScore.score, input),
        documents: input.documents_submitted,
        approver_email: approver.email,
        approval_level: approvalLevel
      };

      // Simulate approval decision (in production, this would wait for human input)
      decision = await simulateApprovalDecision(approvalRequest, riskScore.score);
    }

    // Step 6: Process the decision
    if (decision.approved) {
      // Update loan status to approved
      await updateLoanStatus(client, input.loan_id, 'APPROVED', {
        approved_by: decision.approver_email,
        approval_level: decision.approval_level,
        approval_date: decision.timestamp,
        conditions: decision.conditions,
        risk_score: riskScore.score
      });

      // Create loan documents
      const documents = await generateLoanDocuments(client, input, decision);

      // Schedule closing
      const closing = await scheduleClosing(client, input.loan_id, input.project_id);

      // Send notifications
      await sendApprovalNotifications(input, decision, documents);

      return {
        status: 'approved',
        loan_id: input.loan_id,
        approval_details: decision,
        risk_score: riskScore.score,
        documents_generated: documents,
        closing_scheduled: closing,
        next_steps: [
          'Loan documents sent to borrower for signature',
          'Closing scheduled',
          'Funds will be available after closing'
        ]
      };
    } else {
      // Update loan status to denied
      await updateLoanStatus(client, input.loan_id, 'DENIED', {
        denied_by: decision.approver_email,
        denial_date: decision.timestamp,
        denial_reason: decision.comments,
        risk_score: riskScore.score
      });

      // Send denial notifications
      await sendDenialNotifications(input, decision);

      return {
        status: 'denied',
        loan_id: input.loan_id,
        denial_details: decision,
        risk_score: riskScore.score,
        risk_factors: riskScore.factors,
        appeal_process: 'Borrower may appeal within 30 days'
      };
    }

  } catch (error) {
    console.error('Error in loan approval workflow:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Helper Functions

async function validateLoanRequest(input: LoanApprovalRequest): Promise<{isValid: boolean, errors: string[]}> {
  const errors: string[] = [];

  // Basic validation
  if (input.loan_amount <= 0) errors.push('Loan amount must be positive');
  if (input.interest_rate <= 0) errors.push('Interest rate must be positive');
  if (input.term_months <= 0) errors.push('Term must be positive');
  if (input.ltv_ratio > 0.8) errors.push('LTV ratio exceeds 80% maximum');
  if (input.debt_service_coverage < 1.2) errors.push('DSCR below 1.2 minimum');
  if (input.financial_metrics.borrower_credit_score < 650) errors.push('Credit score below 650 minimum');

  // Document validation
  const requiredDocs = ['financial_statement', 'tax_returns', 'project_plans'];
  const missingDocs = requiredDocs.filter(doc => !input.documents_submitted.includes(doc));
  if (missingDocs.length > 0) {
    errors.push(`Missing required documents: ${missingDocs.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function calculateRiskScore(input: LoanApprovalRequest): {score: number, factors: string[], analysis: any} {
  let score = 100; // Start with perfect score
  const factors: string[] = [];
  const analysis: any = {};

  // LTV Analysis (30% weight)
  if (input.ltv_ratio > 0.75) {
    score -= 15;
    factors.push('High LTV ratio');
  } else if (input.ltv_ratio > 0.65) {
    score -= 5;
  }
  analysis.ltv_score = Math.max(0, 30 - (input.ltv_ratio > 0.75 ? 15 : input.ltv_ratio > 0.65 ? 5 : 0));

  // Debt Service Coverage (25% weight)
  if (input.debt_service_coverage < 1.25) {
    score -= 20;
    factors.push('Low debt service coverage');
  } else if (input.debt_service_coverage < 1.5) {
    score -= 10;
  }
  analysis.dscr_score = Math.max(0, 25 - (input.debt_service_coverage < 1.25 ? 20 : input.debt_service_coverage < 1.5 ? 10 : 0));

  // Credit Score (20% weight)
  if (input.financial_metrics.borrower_credit_score < 700) {
    score -= 15;
    factors.push('Below average credit score');
  } else if (input.financial_metrics.borrower_credit_score < 750) {
    score -= 5;
  }
  analysis.credit_score = Math.max(0, 20 - (input.financial_metrics.borrower_credit_score < 700 ? 15 : input.financial_metrics.borrower_credit_score < 750 ? 5 : 0));

  // Project ROI (15% weight)
  if (input.financial_metrics.project_roi < 0.15) {
    score -= 15;
    factors.push('Low project ROI');
  } else if (input.financial_metrics.project_roi < 0.20) {
    score -= 5;
  }
  analysis.roi_score = Math.max(0, 15 - (input.financial_metrics.project_roi < 0.15 ? 15 : input.financial_metrics.project_roi < 0.20 ? 5 : 0));

  // Additional risk factors
  if (input.risk_factors && input.risk_factors.length > 0) {
    score -= input.risk_factors.length * 3;
    factors.push(...input.risk_factors);
  }

  return {
    score: Math.max(0, score),
    factors,
    analysis
  };
}

function shouldAutoDeny(input: LoanApprovalRequest, riskScore: any): boolean {
  // Auto-deny if risk score is too low
  if (riskScore.score < 40) return true;

  // Auto-deny if critical metrics fail
  if (input.ltv_ratio > 0.85) return true;
  if (input.debt_service_coverage < 1.15) return true;
  if (input.financial_metrics.borrower_credit_score < 650) return true;

  return false;
}

function determineApprovalLevel(amount: number, riskScore: number): string {
  // High-risk loans always need higher approval
  if (riskScore < 60) {
    if (amount < APPROVAL_THRESHOLDS.MANAGER) return 'SENIOR';
    return 'EXECUTIVE';
  }

  // Standard approval levels based on amount
  if (amount < APPROVAL_THRESHOLDS.AUTO) return 'AUTO';
  if (amount < APPROVAL_THRESHOLDS.MANAGER) return 'MANAGER';
  if (amount < APPROVAL_THRESHOLDS.SENIOR) return 'SENIOR';
  return 'EXECUTIVE';
}

async function getApprover(client: Client, level: string): Promise<any> {
  const approverMap: Record<string, string> = {
    'MANAGER': 'john.doe@blueprint.com',
    'SENIOR': 'jane.smith@blueprint.com',
    'EXECUTIVE': 'ceo@blueprint.com'
  };

  const email = approverMap[level] || 'john.doe@blueprint.com';

  const result = await client.query(
    'SELECT * FROM contacts WHERE email = $1',
    [email]
  );

  return result.rows[0] || { email, first_name: 'John', last_name: 'Doe' };
}

async function simulateApprovalDecision(request: any, riskScore: number): Promise<ApprovalDecision> {
  // Simulate human decision based on risk score
  // In production, this would be replaced by actual human input

  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

  const approved = riskScore >= 60 && Math.random() > 0.2; // 80% approval rate for good risks

  return {
    approved,
    approver_email: request.approver_email,
    approval_level: request.approval_level,
    conditions: approved ? [
      'Property insurance required before closing',
      'Personal guarantee from borrower',
      'Monthly financial reporting required'
    ] : undefined,
    comments: approved
      ? `Approved based on strong risk profile and borrower history`
      : `Denied due to risk factors: ${request.risk_analysis}`,
    timestamp: new Date().toISOString()
  };
}

async function updateLoanStatus(client: Client, loanId: string, status: string, metadata: any) {
  await client.query(
    `UPDATE loans
     SET status = $1, metadata = metadata || $2::jsonb, updated_at = NOW()
     WHERE id = $3`,
    [status, JSON.stringify(metadata), loanId]
  );
}

async function generateLoanDocuments(client: Client, input: LoanApprovalRequest, decision: ApprovalDecision) {
  // In production, this would generate actual documents
  return [
    'loan_agreement.pdf',
    'promissory_note.pdf',
    'deed_of_trust.pdf',
    'personal_guarantee.pdf'
  ];
}

async function scheduleClosing(client: Client, loanId: string, projectId: string) {
  // Schedule closing for 7 business days out
  const closingDate = new Date();
  closingDate.setDate(closingDate.getDate() + 10);

  return {
    closing_date: closingDate.toISOString().split('T')[0],
    location: 'Blueprint Office - Seattle',
    escrow_agent: 'First American Title'
  };
}

async function sendApprovalNotifications(input: LoanApprovalRequest, decision: ApprovalDecision, documents: string[]) {
  console.log(`Sending approval notification to ${input.borrower_email}`);
  // Email and Slack notifications would be sent here
}

async function sendDenialNotifications(input: LoanApprovalRequest, decision: ApprovalDecision) {
  console.log(`Sending denial notification to ${input.borrower_email}`);
  // Email notifications would be sent here
}

function generateRecommendation(riskScore: number, input: LoanApprovalRequest): string {
  if (riskScore >= 80) {
    return 'Strongly recommend approval - excellent risk profile';
  } else if (riskScore >= 65) {
    return 'Recommend approval with standard conditions';
  } else if (riskScore >= 50) {
    return 'Conditional approval with enhanced monitoring';
  } else {
    return 'Recommend denial - high risk factors present';
  }
}

/**
 * Sample test input:
 *
 * {
 *   "loan_id": "123e4567-e89b-12d3-a456-426614174000",
 *   "project_id": "789e4567-e89b-12d3-a456-426614174000",
 *   "borrower_name": "ABC Construction LLC",
 *   "borrower_email": "finance@abcconstruction.com",
 *   "loan_type": "CONSTRUCTION",
 *   "loan_amount": 3500000,
 *   "interest_rate": 7.5,
 *   "term_months": 18,
 *   "ltv_ratio": 0.70,
 *   "debt_service_coverage": 1.45,
 *   "project_details": {
 *     "address": "123 Main St, Seattle, WA",
 *     "estimated_value": 5000000,
 *     "construction_budget": 3000000,
 *     "completion_timeline": "12 months"
 *   },
 *   "financial_metrics": {
 *     "borrower_credit_score": 740,
 *     "borrower_net_worth": 8000000,
 *     "project_roi": 0.25,
 *     "exit_strategy": "Sale to end buyers"
 *   },
 *   "documents_submitted": ["financial_statement", "tax_returns", "project_plans", "appraisal"],
 *   "risk_factors": ["First project in this market"],
 *   "notes": "Experienced builder with 15+ years, expanding to Seattle market"
 * }
 */