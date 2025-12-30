#!/usr/bin/env python3
"""
Identify missing stories by comparing PRD features against current Track 3 backlog.

Usage:
    python scripts/identify-missing-stories.py
"""

import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load the Track 3 analysis
with open('track3-analysis.json', 'r') as f:
    track3_data = json.load(f)

# Extract all current story/task summaries
current_stories = set()
for analysis in track3_data['analyses']:
    for child in analysis['children']:
        summary = child['fields']['summary'].lower()
        current_stories.add(summary)

print(f"[INFO] Loaded {len(current_stories)} existing Track 3 stories/tasks\n")

# PRD Feature Requirements (extracted from PRODUCT_REQUIREMENTS_DOCUMENT.md)
prd_features = {
    "Lead Intake & Management": [
        "Lead submission form (mobile-responsive)",
        "Auto-assignment of leads (round-robin or rules-based)",
        "Lead queue & prioritization with AI scoring",
        "Lead status tracking (real-time updates)",
        "Duplicate lead detection (address normalization)",
        "Internal notes with RBAC",
        "Lead analytics dashboard (conversion funnel, source analysis)",
    ],
    "Feasibility & Due Diligence": [
        "Feasibility record auto-creation from lead approval",
        "Consultant ordering system (bulk or selective)",
        "Consultant portal (external user access)",
        "Document AI extraction (AWS Textract for reports)",
        "Document summarization (GPT-based)",
        "Proforma builder with auto-calculated ROI",
        "Viability decision workflow (GO/PASS)",
        "Feasibility dashboard (real-time project status)",
    ],
    "Entitlement & Design": [
        "Project auto-creation from feasibility GO decision",
        "Plan library integration (1,500+ plan sets, searchable)",
        "Design customization interface",
        "Consultant task management with deadlines",
        "SLA tracking & alerts for overdue deliverables",
        "Permit packet generation from templates",
        "Permit submission tracking workflow",
        "Correction cycle management (city feedback)",
        "Timeline forecasting with ML model",
        "Cross-team visibility (servicing can see entitlement status)",
    ],
    "Lending & Loan Origination": [
        "Auto loan creation from project data",
        "Borrower/guarantor management (contact management)",
        "Loan terms configuration with defaults (rules engine)",
        "Budget & proforma tracking (budget vs. actuals)",
        "Audit & validation (pre-funding checks)",
        "Document generation from templates (e-signature integration)",
        "Builder assignment with AI recommendations",
        "Funding workflow (mark funded, assign to borrowing base)",
    ],
    "Servicing & Draws": [
        "Draw set creation (automated monthly cycle)",
        "iPad app integration (API to existing app)",
        "Inspection upload (nightly sync)",
        "Draw review dashboard",
        "Automated condition checks (credit, insurance, lien waivers)",
        "Draw approval workflow with payment processing",
        "Builder draw visibility in BPO",
        "Monthly statement generation and email",
        "Payoff quote generation",
        "Loan modifications/extensions workflow",
        "Reconveyance tracking (lien releases)",
        "Month-end balancing with accounting",
        "Borrowing base reporting for Columbia Bank",
    ],
    "Contacts & Relationships": [
        "Contact creation (agents, builders, consultants, borrowers)",
        "Company/LLC tracking (entity management)",
        "Relationship mapping (contacts to projects/loans/tasks)",
        "Contact history (activity feed)",
        "Auto-contact creation from workflow triggers",
        "Duplicate contact prevention (fuzzy matching)",
    ],
    "Documents & Collaboration": [
        "Document upload with tagging",
        "Document viewer (in-browser PDF/image/plans)",
        "Document versioning",
        "E-signature integration (DocuSign/Authentisign)",
        "Internal messaging (team chat within project/loan context)",
        "External messaging (agents/builders, shaded conversations)",
        "Multi-party conversations (group messaging)",
        "Notification preferences (user settings)",
    ],
    "Analytics & Dashboards": [
        "Executive dashboard (KPIs, deals, conversion, cycle times, revenue)",
        "Acquisitions dashboard (lead funnel, feasibility pipeline)",
        "Entitlement dashboard (permit status, consultant performance)",
        "Servicing dashboard (active loans, draw cycle, delinquencies)",
        "Builder performance scorecards",
        "Market trends analysis",
        "Custom reports & export (Excel/CSV)",
    ],
    "Technical Foundation (Platform)": [
        "OAuth 2.0 authentication system",
        "Role-based access control (RBAC)",
        "API versioning (/api/v1/)",
        "Pagination (limit/offset or cursor-based)",
        "Filtering & sorting on list endpoints",
        "Error handling with consistent JSON format",
        "Object storage integration (S3)",
        "Email service integration (notifications)",
        "SMS service integration (alerts)",
        "Webhook system for external integrations",
        "Workflow engine (state machines)",
        "Rules engine (configurable business logic)",
        "Audit logging system",
        "Multi-tenant foundation (logical isolation)",
    ],
    "Integration Points": [
        "BPO API integration (read project data, write status updates)",
        "iPad inspection app API integration (existing app)",
        "DocuSign/Authentisign API integration",
        "Azure Document Intelligence integration (Textract alternative)",
        "Accounting system integration (month-end balancing)",
        "Bank reporting integration (Columbia Bank borrowing base)",
        "Email service provider (SendGrid, AWS SES)",
        "SMS service provider (Twilio)",
    ],
}

# Check for missing stories
print("="*80)
print("MISSING STORIES ANALYSIS")
print("="*80)

missing_by_module = {}

for module, features in prd_features.items():
    missing_features = []

    for feature in features:
        feature_lower = feature.lower()

        # Check if any existing story/task matches this feature
        found = False
        for story in current_stories:
            # Fuzzy matching - check for key terms
            key_terms = [
                word for word in feature_lower.split()
                if len(word) > 4 and word not in ['based', 'system', 'with', 'from', 'for', 'the']
            ]

            if len(key_terms) == 0:
                continue

            # If 50% of key terms are in the story, consider it covered
            matches = sum(1 for term in key_terms if term in story)
            if matches / len(key_terms) >= 0.5:
                found = True
                break

        if not found:
            missing_features.append(feature)

    if missing_features:
        missing_by_module[module] = missing_features

# Print missing stories
total_missing = sum(len(features) for features in missing_by_module.values())

print(f"\n[SUMMARY] Found {total_missing} missing features across {len(missing_by_module)} modules\n")

for module, features in missing_by_module.items():
    print(f"\n### {module} ({len(features)} missing features)")
    print("-" * 80)
    for feature in features:
        print(f"  - {feature}")

# Generate proposed new stories
print("\n\n")
print("="*80)
print("PROPOSED NEW STORIES (Feature-Level)")
print("="*80)

story_proposals = {}

# Lead Intake Module
if "Lead Intake & Management" in missing_by_module:
    story_proposals["Lead Intake & Management"] = [
        {
            "title": "Lead Submission & Intake Form",
            "description": "Mobile-responsive lead submission form for agents with address, price, attachments",
            "features": ["Lead submission form (mobile-responsive)", "Lead status tracking (real-time updates)"],
            "epic": "NEW EPIC: Lead Intake Module"
        },
        {
            "title": "Lead Assignment & Routing",
            "description": "Automated lead assignment using round-robin or rules-based routing",
            "features": ["Auto-assignment of leads (round-robin or rules-based)"],
            "epic": "NEW EPIC: Lead Intake Module"
        },
        {
            "title": "Lead Queue & Duplicate Detection",
            "description": "Lead queue management with duplicate detection and prioritization",
            "features": ["Lead queue & prioritization with AI scoring", "Duplicate lead detection (address normalization)"],
            "epic": "NEW EPIC: Lead Intake Module"
        },
        {
            "title": "Lead Analytics Dashboard",
            "description": "Lead conversion funnel, source analysis, and cycle time metrics",
            "features": ["Lead analytics dashboard (conversion funnel, source analysis)"],
            "epic": "NEW EPIC: Lead Intake Module"
        },
    ]

# Feasibility Module (separate from current DP01-35)
if "Feasibility & Due Diligence" in missing_by_module:
    story_proposals["Feasibility & Due Diligence"] = [
        {
            "title": "Consultant Ordering System",
            "description": "Bulk or selective ordering of consultant reports (survey, title, arborist)",
            "features": ["Consultant ordering system (bulk or selective)"],
            "epic": "DP01-35 (or NEW: Feasibility Module)"
        },
        {
            "title": "Consultant Portal",
            "description": "External portal for consultants to view tasks and upload deliverables",
            "features": ["Consultant portal (external user access)"],
            "epic": "DP01-35 (or NEW: Feasibility Module)"
        },
        {
            "title": "Proforma Builder",
            "description": "Financial proforma builder with auto-calculated ROI and budget tracking",
            "features": ["Proforma builder with auto-calculated ROI"],
            "epic": "DP01-35 (or NEW: Feasibility Module)"
        },
    ]

# Entitlement Module
if "Entitlement & Design" in missing_by_module:
    story_proposals["Entitlement & Design"] = [
        {
            "title": "Plan Library Integration",
            "description": "Searchable plan library with 1,500+ plan sets for selection",
            "features": ["Plan library integration (1,500+ plan sets, searchable)"],
            "epic": "NEW EPIC: Entitlement Module"
        },
        {
            "title": "Design Customization Interface",
            "description": "Interface for architects to customize selected plans for site constraints",
            "features": ["Design customization interface"],
            "epic": "NEW EPIC: Entitlement Module"
        },
        {
            "title": "Timeline Forecasting",
            "description": "ML-based prediction of entitlement completion timeline",
            "features": ["Timeline forecasting with ML model"],
            "epic": "NEW EPIC: Entitlement Module"
        },
    ]

# Lending Module
if "Lending & Loan Origination" in missing_by_module:
    story_proposals["Lending & Loan Origination"] = [
        {
            "title": "Loan Creation & Configuration",
            "description": "Auto-create loans from project data with configurable terms and defaults",
            "features": ["Auto loan creation from project data", "Loan terms configuration with defaults (rules engine)"],
            "epic": "NEW EPIC: Lending Module"
        },
        {
            "title": "Borrower & Guarantor Management",
            "description": "Manage borrowers, guarantors, and relationships",
            "features": ["Borrower/guarantor management (contact management)"],
            "epic": "NEW EPIC: Lending Module"
        },
        {
            "title": "Budget & Proforma Tracking",
            "description": "Import proforma, track budget vs. actuals throughout construction",
            "features": ["Budget & proforma tracking (budget vs. actuals)"],
            "epic": "NEW EPIC: Lending Module"
        },
        {
            "title": "Pre-Funding Audit & Validation",
            "description": "Automated checks for missing docs, stale credit reports before funding",
            "features": ["Audit & validation (pre-funding checks)"],
            "epic": "NEW EPIC: Lending Module"
        },
        {
            "title": "Loan Document Generation & E-Signature",
            "description": "Generate loan documents from templates and send for e-signature",
            "features": ["Document generation from templates (e-signature integration)"],
            "epic": "NEW EPIC: Lending Module"
        },
        {
            "title": "Builder Assignment & Recommendations",
            "description": "Assign builders to projects with AI-powered recommendations",
            "features": ["Builder assignment with AI recommendations"],
            "epic": "NEW EPIC: Lending Module"
        },
    ]

# Servicing & Draws Module
if "Servicing & Draws" in missing_by_module:
    story_proposals["Servicing & Draws"] = [
        {
            "title": "Draw Set Creation & iPad Integration",
            "description": "Automated monthly draw set creation with iPad app sync",
            "features": ["Draw set creation (automated monthly cycle)", "iPad app integration (API to existing app)", "Inspection upload (nightly sync)"],
            "epic": "NEW EPIC: Servicing Module"
        },
        {
            "title": "Draw Review & Approval Dashboard",
            "description": "Dashboard for reviewing inspections, checking conditions, and approving draws",
            "features": ["Draw review dashboard", "Draw approval workflow with payment processing"],
            "epic": "NEW EPIC: Servicing Module"
        },
        {
            "title": "Automated Draw Condition Checks",
            "description": "Auto-check credit reports, insurance, lien waivers; flag issues",
            "features": ["Automated condition checks (credit, insurance, lien waivers)"],
            "epic": "NEW EPIC: Servicing Module"
        },
        {
            "title": "Monthly Statements & Borrower Communication",
            "description": "Auto-generate and email monthly statements to borrowers",
            "features": ["Monthly statement generation and email"],
            "epic": "NEW EPIC: Servicing Module"
        },
        {
            "title": "Payoff Quote & Reconveyance",
            "description": "One-click payoff quote generation and lien release tracking",
            "features": ["Payoff quote generation", "Reconveyance tracking (lien releases)"],
            "epic": "NEW EPIC: Servicing Module"
        },
        {
            "title": "Loan Modifications & Extensions",
            "description": "Workflow for creating loan modifications and extensions",
            "features": ["Loan modifications/extensions workflow"],
            "epic": "NEW EPIC: Servicing Module"
        },
        {
            "title": "Month-End Balancing & Bank Reporting",
            "description": "Reconcile loan balances with accounting and generate borrowing base reports",
            "features": ["Month-end balancing with accounting", "Borrowing base reporting for Columbia Bank"],
            "epic": "NEW EPIC: Servicing Module"
        },
    ]

# Contacts & Relationships (likely covered by DP01-35 Contact Management)
# Check if truly missing

# Documents & Collaboration
if "Documents & Collaboration" in missing_by_module:
    story_proposals["Documents & Collaboration"] = [
        {
            "title": "Document Viewer & Versioning",
            "description": "In-browser viewer for PDFs, images, and plans with version history",
            "features": ["Document viewer (in-browser PDF/image/plans)", "Document versioning"],
            "epic": "NEW EPIC: Documents Module or DP01-22"
        },
        {
            "title": "Internal Team Messaging",
            "description": "Team chat within project/loan context",
            "features": ["Internal messaging (team chat within project/loan context)"],
            "epic": "NEW EPIC: Collaboration Module"
        },
        {
            "title": "External Stakeholder Messaging",
            "description": "Messaging with agents/builders (shaded conversations) and multi-party support",
            "features": ["External messaging (agents/builders, shaded conversations)", "Multi-party conversations (group messaging)"],
            "epic": "NEW EPIC: Collaboration Module"
        },
        {
            "title": "Notification System",
            "description": "User notification preferences with email/SMS delivery",
            "features": ["Notification preferences (user settings)"],
            "epic": "DP01-23 or NEW: Notification Module"
        },
    ]

# Analytics & Dashboards
if "Analytics & Dashboards" in missing_by_module:
    story_proposals["Analytics & Dashboards"] = [
        {
            "title": "Executive Dashboard",
            "description": "KPIs, deals in pipeline, conversion rates, cycle times, revenue",
            "features": ["Executive dashboard (KPIs, deals, conversion, cycle times, revenue)"],
            "epic": "NEW EPIC: Analytics Module"
        },
        {
            "title": "Team-Specific Dashboards",
            "description": "Acquisitions, Entitlement, and Servicing team dashboards",
            "features": ["Acquisitions dashboard (lead funnel, feasibility pipeline)", "Entitlement dashboard (permit status, consultant performance)", "Servicing dashboard (active loans, draw cycle, delinquencies)"],
            "epic": "NEW EPIC: Analytics Module"
        },
        {
            "title": "Builder Performance Analytics",
            "description": "Builder scorecards with on-time %, cost variance, quality metrics",
            "features": ["Builder performance scorecards"],
            "epic": "NEW EPIC: Analytics Module"
        },
        {
            "title": "Custom Reports & Export",
            "description": "Ad-hoc report builder with Excel/CSV export",
            "features": ["Custom reports & export (Excel/CSV)"],
            "epic": "NEW EPIC: Analytics Module"
        },
    ]

# Technical Foundation (Platform)
if "Technical Foundation (Platform)" in missing_by_module:
    story_proposals["Technical Foundation (Platform)"] = [
        {
            "title": "Email & SMS Service Integration",
            "description": "Integrate email (SendGrid/SES) and SMS (Twilio) for notifications",
            "features": ["Email service integration (notifications)", "SMS service integration (alerts)"],
            "epic": "DP01-21 or NEW: Notification Module"
        },
        {
            "title": "Webhook System",
            "description": "Webhook infrastructure for external integrations",
            "features": ["Webhook system for external integrations"],
            "epic": "DP01-21 or DP01-40"
        },
        {
            "title": "Workflow Engine",
            "description": "State machine engine for workflow transitions (lead → feasibility → go, etc.)",
            "features": ["Workflow engine (state machines)"],
            "epic": "DP01-21 or NEW: Platform Services Epic"
        },
        {
            "title": "Rules Engine",
            "description": "Configurable business logic engine for lead routing, loan terms, etc.",
            "features": ["Rules engine (configurable business logic)"],
            "epic": "DP01-21 or NEW: Platform Services Epic"
        },
        {
            "title": "Multi-Tenant Foundation",
            "description": "Logical tenant isolation for future multi-tenant deployment",
            "features": ["Multi-tenant foundation (logical isolation)"],
            "epic": "DP01-21 or NEW: Platform Services Epic"
        },
    ]

# Integration Points
if "Integration Points" in missing_by_module:
    story_proposals["Integration Points"] = [
        {
            "title": "BPO API Integration",
            "description": "Read project data from BPO and write status updates back",
            "features": ["BPO API integration (read project data, write status updates)"],
            "epic": "NEW EPIC: Integrations"
        },
        {
            "title": "Azure Document Intelligence Integration",
            "description": "Document AI extraction for surveys, title reports, arborist reports",
            "features": ["Azure Document Intelligence integration (Textract alternative)"],
            "epic": "NEW EPIC: Integrations or DP01-35"
        },
        {
            "title": "Accounting System Integration",
            "description": "Month-end balancing with accounting system",
            "features": ["Accounting system integration (month-end balancing)"],
            "epic": "NEW EPIC: Integrations"
        },
        {
            "title": "Bank Reporting Integration",
            "description": "Automated borrowing base reporting for Columbia Bank",
            "features": ["Bank reporting integration (Columbia Bank borrowing base)"],
            "epic": "NEW EPIC: Integrations"
        },
    ]

# Print proposed new stories
for module, stories in story_proposals.items():
    print(f"\n### {module}")
    print("-" * 80)
    for story in stories:
        print(f"\n  Story: {story['title']}")
        print(f"  Epic: {story['epic']}")
        print(f"  Description: {story['description']}")
        print(f"  Covers:")
        for feature in story['features']:
            print(f"    - {feature}")

# Save results
output = {
    "total_missing": total_missing,
    "missing_by_module": missing_by_module,
    "story_proposals": story_proposals
}

with open('missing-stories-analysis.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n\n[OK] Analysis saved to missing-stories-analysis.json")
print(f"[SUMMARY] {total_missing} missing features identified")
print(f"[SUMMARY] {sum(len(stories) for stories in story_proposals.values())} new stories proposed")
