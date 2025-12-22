// Test: Most complex real-world workflow Windmill can handle
// This simulates Blueprint's loan processing workflow

interface LoanApplication {
  id: string;
  applicantName: string;
  loanAmount: number;
  propertyAddress: string;
  documents: Document[];
  status: string;
  creditScore?: number;
  riskScore?: number;
  approvals: Approval[];
}

interface Document {
  type: string;
  url: string;
  extracted?: any;
  validated?: boolean;
}

interface Approval {
  role: string;
  approved?: boolean;
  comments?: string;
  timestamp?: Date;
}

export async function main(
  application: Partial<LoanApplication>,
  pgClient: any,
  s3Client: any
): Promise<any> {
  console.log('Starting complex loan processing workflow...');

  const workflowId = `loan-${Date.now()}`;
  const results = {
    workflowId,
    startTime: new Date(),
    stages: [] as any[],
    finalStatus: 'pending',
    errors: [] as string[],
    performance: {} as any
  };

  try {
    // Stage 1: Input Validation and Enrichment
    console.log('Stage 1: Input validation and enrichment...');
    const stage1Result = await stage1_validateAndEnrich(application);
    results.stages.push(stage1Result);

    if (!stage1Result.success) {
      throw new Error('Validation failed');
    }

    // Stage 2: Document Processing (Parallel)
    console.log('Stage 2: Document processing...');
    const stage2Result = await stage2_processDocuments(
      stage1Result.data.documents,
      s3Client
    );
    results.stages.push(stage2Result);

    // Stage 3: Credit and Risk Assessment (Parallel)
    console.log('Stage 3: Credit and risk assessment...');
    const stage3Result = await stage3_assessCreditAndRisk(
      stage1Result.data,
      stage2Result.extractedData
    );
    results.stages.push(stage3Result);

    // Stage 4: Business Rules Engine
    console.log('Stage 4: Business rules evaluation...');
    const stage4Result = await stage4_evaluateBusinessRules(
      stage1Result.data,
      stage3Result
    );
    results.stages.push(stage4Result);

    // Stage 5: Human Approval (Conditional)
    if (stage4Result.requiresApproval) {
      console.log('Stage 5: Human approval required...');
      const stage5Result = await stage5_humanApproval(
        workflowId,
        stage4Result
      );
      results.stages.push(stage5Result);
    }

    // Stage 6: Database Operations
    console.log('Stage 6: Database operations...');
    const stage6Result = await stage6_databaseOperations(
      pgClient,
      workflowId,
      results
    );
    results.stages.push(stage6Result);

    // Stage 7: Notifications and Integrations
    console.log('Stage 7: Notifications and integrations...');
    const stage7Result = await stage7_notificationsAndIntegrations(
      workflowId,
      results
    );
    results.stages.push(stage7Result);

    // Stage 8: Generate Reports
    console.log('Stage 8: Report generation...');
    const stage8Result = await stage8_generateReports(
      workflowId,
      results,
      s3Client
    );
    results.stages.push(stage8Result);

    results.finalStatus = 'completed';

  } catch (error: any) {
    console.error('Workflow failed:', error);
    results.finalStatus = 'failed';
    results.errors.push(error.message);
  }

  // Calculate performance metrics
  results.performance = calculatePerformanceMetrics(results);

  return results;
}

async function stage1_validateAndEnrich(application: any): Promise<any> {
  const start = Date.now();

  try {
    // Validate required fields
    const required = ['applicantName', 'loanAmount', 'propertyAddress'];
    const missing = required.filter(field => !application[field]);

    if (missing.length > 0) {
      return {
        stage: 'Validation and Enrichment',
        success: false,
        duration: Date.now() - start,
        error: `Missing required fields: ${missing.join(', ')}`
      };
    }

    // Enrich data with external APIs
    const enrichedData = {
      ...application,
      id: `LOAN-${Date.now()}`,
      status: 'processing',
      createdAt: new Date(),
      // Simulate API calls
      propertyValue: Math.random() * 1000000 + 100000,
      neighborhoodData: {
        medianIncome: Math.random() * 100000 + 50000,
        crimeRate: Math.random() * 100,
        schoolRating: Math.random() * 10
      }
    };

    return {
      stage: 'Validation and Enrichment',
      success: true,
      duration: Date.now() - start,
      data: enrichedData
    };

  } catch (error: any) {
    return {
      stage: 'Validation and Enrichment',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function stage2_processDocuments(documents: any[], s3Client: any): Promise<any> {
  const start = Date.now();

  try {
    // Process documents in parallel
    const processPromises = documents.map(async (doc) => {
      // Simulate OCR/extraction
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

      return {
        ...doc,
        extracted: {
          text: `Extracted text from ${doc.type}`,
          confidence: Math.random(),
          entities: ['entity1', 'entity2']
        },
        validated: Math.random() > 0.2
      };
    });

    const processedDocs = await Promise.all(processPromises);

    // Simulate S3 upload
    const uploadPromises = processedDocs.map(async (doc) => {
      return {
        ...doc,
        s3Key: `documents/${Date.now()}-${doc.type}`,
        s3Bucket: 'blueprint-documents'
      };
    });

    const uploadedDocs = await Promise.all(uploadPromises);

    return {
      stage: 'Document Processing',
      success: true,
      duration: Date.now() - start,
      documentsProcessed: uploadedDocs.length,
      extractedData: uploadedDocs
    };

  } catch (error: any) {
    return {
      stage: 'Document Processing',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function stage3_assessCreditAndRisk(applicationData: any, documents: any): Promise<any> {
  const start = Date.now();

  try {
    // Parallel API calls to credit bureaus
    const creditChecks = await Promise.all([
      checkCreditBureau('Equifax', applicationData),
      checkCreditBureau('Experian', applicationData),
      checkCreditBureau('TransUnion', applicationData)
    ]);

    // Calculate average credit score
    const creditScore = Math.round(
      creditChecks.reduce((sum, check) => sum + check.score, 0) / creditChecks.length
    );

    // Risk assessment algorithm
    const riskFactors = {
      creditScore: creditScore < 650 ? 3 : creditScore < 750 ? 2 : 1,
      loanToValue: applicationData.loanAmount / applicationData.propertyValue,
      documentQuality: documents.filter((d: any) => d.validated).length / documents.length,
      neighborhoodRisk: applicationData.neighborhoodData.crimeRate / 100
    };

    const riskScore = calculateRiskScore(riskFactors);

    return {
      stage: 'Credit and Risk Assessment',
      success: true,
      duration: Date.now() - start,
      creditScore,
      riskScore,
      riskFactors,
      creditReports: creditChecks
    };

  } catch (error: any) {
    return {
      stage: 'Credit and Risk Assessment',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function checkCreditBureau(bureau: string, data: any): Promise<any> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

  return {
    bureau,
    score: Math.floor(Math.random() * 300 + 550),
    report: `Credit report from ${bureau}`,
    timestamp: new Date()
  };
}

function calculateRiskScore(factors: any): number {
  const weights = {
    creditScore: 0.4,
    loanToValue: 0.3,
    documentQuality: 0.2,
    neighborhoodRisk: 0.1
  };

  let score = 0;
  for (const [key, value] of Object.entries(factors)) {
    score += (value as number) * (weights[key as keyof typeof weights] || 0);
  }

  return Math.round(score * 100);
}

async function stage4_evaluateBusinessRules(application: any, assessment: any): Promise<any> {
  const start = Date.now();

  const rules = [
    {
      name: 'Minimum Credit Score',
      condition: assessment.creditScore >= 620,
      severity: 'critical'
    },
    {
      name: 'Maximum Loan Amount',
      condition: application.loanAmount <= 5000000,
      severity: 'critical'
    },
    {
      name: 'Risk Score Threshold',
      condition: assessment.riskScore < 70,
      severity: 'high'
    },
    {
      name: 'Document Completeness',
      condition: assessment.extractedData?.length >= 3,
      severity: 'medium'
    }
  ];

  const ruleResults = rules.map(rule => ({
    ...rule,
    passed: rule.condition
  }));

  const criticalFailures = ruleResults.filter(r => !r.passed && r.severity === 'critical');
  const highFailures = ruleResults.filter(r => !r.passed && r.severity === 'high');

  return {
    stage: 'Business Rules Evaluation',
    success: true,
    duration: Date.now() - start,
    rulesEvaluated: rules.length,
    ruleResults,
    requiresApproval: criticalFailures.length > 0 || highFailures.length > 1,
    approvalReason: criticalFailures.length > 0 ? 'Critical rule failure' : 'Multiple high-risk factors'
  };
}

async function stage5_humanApproval(workflowId: string, rulesResult: any): Promise<any> {
  const start = Date.now();

  // Simulate human approval process
  console.log('Waiting for human approval...');

  // In real implementation, this would:
  // 1. Create approval task in database
  // 2. Send notification to approver
  // 3. Wait for response (with timeout)

  await new Promise(resolve => setTimeout(resolve, 2000));

  const approved = Math.random() > 0.3; // 70% approval rate

  return {
    stage: 'Human Approval',
    success: true,
    duration: Date.now() - start,
    approved,
    approver: 'manager@blueprint.com',
    comments: approved ? 'Approved with conditions' : 'Rejected due to risk factors',
    timestamp: new Date()
  };
}

async function stage6_databaseOperations(pgClient: any, workflowId: string, data: any): Promise<any> {
  const start = Date.now();

  try {
    // Create tables if not exist
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS loan_applications (
        id VARCHAR(50) PRIMARY KEY,
        workflow_id VARCHAR(50),
        data JSONB,
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS workflow_logs (
        id SERIAL PRIMARY KEY,
        workflow_id VARCHAR(50),
        stage VARCHAR(50),
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Start transaction
    await pgClient.query('BEGIN');

    try {
      // Insert loan application
      await pgClient.query(
        `INSERT INTO loan_applications (id, workflow_id, data, status)
         VALUES ($1, $2, $3, $4)`,
        [data.stages[0]?.data?.id || workflowId, workflowId, JSON.stringify(data), data.finalStatus]
      );

      // Insert workflow logs
      for (const stage of data.stages) {
        await pgClient.query(
          `INSERT INTO workflow_logs (workflow_id, stage, data)
           VALUES ($1, $2, $3)`,
          [workflowId, stage.stage, JSON.stringify(stage)]
        );
      }

      await pgClient.query('COMMIT');

      return {
        stage: 'Database Operations',
        success: true,
        duration: Date.now() - start,
        recordsCreated: data.stages.length + 1
      };

    } catch (error) {
      await pgClient.query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    return {
      stage: 'Database Operations',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function stage7_notificationsAndIntegrations(workflowId: string, data: any): Promise<any> {
  const start = Date.now();

  const notifications = [];

  try {
    // Email notification
    notifications.push({
      type: 'email',
      to: 'applicant@example.com',
      subject: `Loan Application ${workflowId} Status Update`,
      status: 'sent'
    });

    // Slack notification
    notifications.push({
      type: 'slack',
      channel: '#loan-applications',
      message: `New loan application processed: ${workflowId}`,
      status: 'sent'
    });

    // Webhook to external system
    notifications.push({
      type: 'webhook',
      url: 'https://api.example.com/loan-updates',
      payload: { workflowId, status: data.finalStatus },
      status: 'sent'
    });

    // CRM update
    notifications.push({
      type: 'crm',
      system: 'Salesforce',
      recordId: workflowId,
      status: 'updated'
    });

    return {
      stage: 'Notifications and Integrations',
      success: true,
      duration: Date.now() - start,
      notificationsSent: notifications.length,
      notifications
    };

  } catch (error: any) {
    return {
      stage: 'Notifications and Integrations',
      success: false,
      duration: Date.now() - start,
      error: error.message,
      notificationsSent: notifications.length
    };
  }
}

async function stage8_generateReports(workflowId: string, data: any, s3Client: any): Promise<any> {
  const start = Date.now();

  try {
    const reports = [];

    // Generate PDF report
    const pdfReport = {
      type: 'pdf',
      name: `loan-application-${workflowId}.pdf`,
      size: Math.round(Math.random() * 1000000 + 100000),
      s3Key: `reports/${workflowId}/application.pdf`
    };
    reports.push(pdfReport);

    // Generate Excel summary
    const excelReport = {
      type: 'excel',
      name: `loan-summary-${workflowId}.xlsx`,
      size: Math.round(Math.random() * 500000 + 50000),
      s3Key: `reports/${workflowId}/summary.xlsx`
    };
    reports.push(excelReport);

    // Generate compliance report
    const complianceReport = {
      type: 'json',
      name: `compliance-${workflowId}.json`,
      data: {
        workflowId,
        complianceChecks: ['KYC', 'AML', 'OFAC'],
        status: 'passed',
        timestamp: new Date()
      }
    };
    reports.push(complianceReport);

    return {
      stage: 'Report Generation',
      success: true,
      duration: Date.now() - start,
      reportsGenerated: reports.length,
      reports
    };

  } catch (error: any) {
    return {
      stage: 'Report Generation',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

function calculatePerformanceMetrics(results: any): any {
  const totalDuration = results.stages.reduce((sum: number, stage: any) =>
    sum + (stage.duration || 0), 0
  );

  const successfulStages = results.stages.filter((s: any) => s.success).length;

  return {
    totalExecutionTime: totalDuration,
    averageStageTime: totalDuration / results.stages.length,
    successRate: (successfulStages / results.stages.length) * 100,
    complexity: 'High',
    stagesExecuted: results.stages.length,
    parallelOperations: 3,
    externalAPICalls: 5,
    databaseOperations: 10,
    verdict: totalDuration < 30000 ? 'Performant' : 'Needs Optimization'
  };
}