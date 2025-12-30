/**
 * Lead Intake Workflow
 *
 * This Windmill script processes new leads from real estate agents,
 * validates the data, creates a project record, and triggers notifications.
 *
 * To use in Windmill:
 * 1. Create a new Script (not Flow) in Windmill UI
 * 2. Select TypeScript as the language
 * 3. Copy this code into the script editor
 * 4. Save as "lead_intake"
 * 5. Test with the sample input below
 */

import { Client } from 'pg';

// Type definitions for our input
interface LeadInput {
  // Required fields
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  builder_name: string;
  builder_company?: string;
  builder_email?: string;
  builder_phone?: string;

  // Project details
  project_type: 'SINGLE_FAMILY' | 'TOWNHOME' | 'CONDO' | 'MIXED_USE';
  estimated_value?: number;
  estimated_units?: number;
  timeline?: string; // e.g., "Q1 2024"

  // Additional notes
  notes?: string;
  referral_source?: string;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Database configuration (Windmill provides these as resources)
const DB_CONFIG = {
  host: 'postgres',
  port: 5432,
  user: 'blueprint',
  password: 'blueprint_dev_2024',
  database: 'connect2'
};

/**
 * Main function that Windmill will execute
 */
export async function main(input: LeadInput) {
  console.log('Processing lead intake for:', input.property_address);

  // Initialize database client
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();

    // Step 1: Validate required fields
    const validation = validateLead(input);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Step 2: Check for duplicate leads
    const duplicate = await checkDuplicate(client, input.property_address);
    if (duplicate) {
      return {
        status: 'duplicate_found',
        message: 'This property already exists in the system',
        existing_project_id: duplicate.id,
        existing_project_number: duplicate.project_number
      };
    }

    // Step 3: Create or find agent contact
    const agentContact = await upsertContact(client, {
      type: 'AGENT',
      first_name: input.agent_name.split(' ')[0],
      last_name: input.agent_name.split(' ').slice(1).join(' ') || 'Unknown',
      email: input.agent_email,
      phone: input.agent_phone,
      company: input.referral_source || 'Unknown Agency'
    });

    // Step 4: Create or find builder contact
    let builderContact = null;
    if (input.builder_email || input.builder_phone) {
      builderContact = await upsertContact(client, {
        type: 'BUILDER',
        first_name: input.builder_name.split(' ')[0],
        last_name: input.builder_name.split(' ').slice(1).join(' ') || 'Unknown',
        email: input.builder_email,
        phone: input.builder_phone,
        company: input.builder_company
      });
    }

    // Step 5: Generate project number
    const projectNumber = await generateProjectNumber(client);

    // Step 6: Create the project
    const project = await createProject(client, {
      project_number: projectNumber,
      name: `${input.property_address} Development`,
      address: input.property_address,
      city: input.property_city,
      state: input.property_state,
      zip: input.property_zip,
      status: 'LEAD',
      stage: 'INTAKE',
      project_type: input.project_type,
      builder_id: builderContact?.id,
      metadata: {
        agent_id: agentContact.id,
        estimated_value: input.estimated_value,
        estimated_units: input.estimated_units,
        timeline: input.timeline,
        notes: input.notes,
        urgency: input.urgency || 'MEDIUM',
        lead_source: 'agent_referral',
        intake_date: new Date().toISOString()
      }
    });

    // Step 7: Assign to acquisition manager based on location
    const manager = await assignAcquisitionManager(client, input.property_city);
    if (manager) {
      await client.query(
        'UPDATE projects SET acquisition_manager_id = $1 WHERE id = $2',
        [manager.id, project.id]
      );
      project.acquisition_manager = manager;
    }

    // Step 8: Create initial workflow execution record
    await recordWorkflowExecution(client, {
      workflow_name: 'lead_intake',
      entity_type: 'project',
      entity_id: project.id,
      status: 'COMPLETED',
      input_data: input,
      output_data: { project_id: project.id, project_number: projectNumber }
    });

    // Step 9: Prepare notification data
    const notifications = prepareNotifications(project, input, manager);

    // Return success response
    return {
      status: 'success',
      project_id: project.id,
      project_number: projectNumber,
      assigned_to: manager?.email,
      notifications_queued: notifications.length,
      next_steps: [
        'Acquisition manager will review within 24 hours',
        'Initial feasibility assessment will be scheduled',
        'Builder will be contacted for additional information'
      ],
      dashboard_url: `http://localhost:3000/projects/${project.id}`
    };

  } catch (error) {
    console.error('Error in lead intake workflow:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Helper Functions

function validateLead(input: LeadInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.agent_email) errors.push('Agent email is required');
  if (!input.property_address) errors.push('Property address is required');
  if (!input.property_city) errors.push('Property city is required');
  if (!input.builder_name) errors.push('Builder name is required');

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (input.agent_email && !emailRegex.test(input.agent_email)) {
    errors.push('Invalid agent email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function checkDuplicate(client: Client, address: string) {
  const result = await client.query(
    'SELECT id, project_number FROM projects WHERE LOWER(address) = LOWER($1)',
    [address]
  );
  return result.rows[0] || null;
}

async function upsertContact(client: Client, contact: any) {
  // Try to find existing contact by email
  if (contact.email) {
    const existing = await client.query(
      'SELECT * FROM contacts WHERE email = $1',
      [contact.email]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }
  }

  // Create new contact
  const result = await client.query(
    `INSERT INTO contacts (type, first_name, last_name, email, phone, company)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [contact.type, contact.first_name, contact.last_name, contact.email, contact.phone, contact.company]
  );

  return result.rows[0];
}

async function generateProjectNumber(client: Client): Promise<string> {
  // Format: BP-YYYY-NNNN (e.g., BP-2024-0001)
  const year = new Date().getFullYear();

  const result = await client.query(
    `SELECT COUNT(*) as count FROM projects WHERE project_number LIKE $1`,
    [`BP-${year}-%`]
  );

  const count = parseInt(result.rows[0].count) + 1;
  return `BP-${year}-${String(count).padStart(4, '0')}`;
}

async function createProject(client: Client, projectData: any) {
  const result = await client.query(
    `INSERT INTO projects (
      project_number, name, address, city, state, zip,
      status, stage, project_type, builder_id, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      projectData.project_number,
      projectData.name,
      projectData.address,
      projectData.city,
      projectData.state,
      projectData.zip,
      projectData.status,
      projectData.stage,
      projectData.project_type,
      projectData.builder_id,
      JSON.stringify(projectData.metadata)
    ]
  );

  return result.rows[0];
}

async function assignAcquisitionManager(client: Client, city: string) {
  // Simple assignment logic based on city
  // In production, this would be more sophisticated
  const cityAssignments: Record<string, string> = {
    'Seattle': 'sarah.johnson@blueprint.com',
    'Bellevue': 'sarah.johnson@blueprint.com',
    'Tacoma': 'mike.chen@blueprint.com',
    'Phoenix': 'alex.rivera@blueprint.com',
    'Scottsdale': 'alex.rivera@blueprint.com',
    'Tempe': 'alex.rivera@blueprint.com'
  };

  const managerEmail = cityAssignments[city] || 'sarah.johnson@blueprint.com';

  // Find or create the manager contact
  const result = await client.query(
    'SELECT * FROM contacts WHERE email = $1',
    [managerEmail]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  // Create default manager if not found
  const [firstName, lastName] = managerEmail.split('@')[0].split('.');
  const newManager = await client.query(
    `INSERT INTO contacts (type, first_name, last_name, email, role)
     VALUES ('INTERNAL', $1, $2, $3, 'Acquisition Manager')
     RETURNING *`,
    [firstName, lastName, managerEmail]
  );

  return newManager.rows[0];
}

async function recordWorkflowExecution(client: Client, execution: any) {
  await client.query(
    `INSERT INTO workflow_executions
     (workflow_name, entity_type, entity_id, status, input_data, output_data, completed_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [
      execution.workflow_name,
      execution.entity_type,
      execution.entity_id,
      execution.status,
      JSON.stringify(execution.input_data),
      JSON.stringify(execution.output_data)
    ]
  );
}

function prepareNotifications(project: any, input: LeadInput, manager: any) {
  const notifications = [];

  // Notification to acquisition manager
  if (manager) {
    notifications.push({
      type: 'email',
      to: manager.email,
      subject: `New Lead: ${input.property_address}`,
      priority: input.urgency || 'MEDIUM',
      data: {
        project_id: project.id,
        address: input.property_address,
        builder: input.builder_name,
        agent: input.agent_name,
        estimated_value: input.estimated_value
      }
    });
  }

  // Confirmation to agent
  notifications.push({
    type: 'email',
    to: input.agent_email,
    subject: 'Lead Received - ' + input.property_address,
    template: 'agent_lead_confirmation',
    data: {
      project_number: project.project_number,
      manager_name: manager ? `${manager.first_name} ${manager.last_name}` : 'TBD'
    }
  });

  // Slack notification (if high priority)
  if (input.urgency === 'HIGH') {
    notifications.push({
      type: 'slack',
      channel: '#acquisitions-urgent',
      message: `🔥 High Priority Lead: ${input.property_address} from ${input.agent_name}`
    });
  }

  return notifications;
}

/**
 * Sample test input for Windmill UI testing:
 *
 * {
 *   "agent_name": "Jennifer Smith",
 *   "agent_email": "jennifer@realestate.com",
 *   "agent_phone": "206-555-0123",
 *   "property_address": "456 Pine Street",
 *   "property_city": "Seattle",
 *   "property_state": "WA",
 *   "property_zip": "98101",
 *   "builder_name": "Emerald Construction",
 *   "builder_company": "Emerald Construction LLC",
 *   "builder_email": "contact@emeraldconstruction.com",
 *   "builder_phone": "206-555-0456",
 *   "project_type": "TOWNHOME",
 *   "estimated_value": 2500000,
 *   "estimated_units": 6,
 *   "timeline": "Q2 2024",
 *   "notes": "Builder has completed 3 projects with us before. Very reliable.",
 *   "referral_source": "Windermere Real Estate",
 *   "urgency": "HIGH"
 * }
 */