import { ProcessDefinition, ProcessType } from '../types';

/**
 * Process definitions - operations that can be performed on properties
 */
export const PROCESS_DEFINITIONS: Record<ProcessType, ProcessDefinition> = {
  'intake-qualification': {
    type: 'intake-qualification',
    name: 'Intake Qualification',
    description: 'Initial property screening and viability assessment',
    estimatedDurationDays: 2,
    requiredFor: ['subdivision', 'multi-family-rehab', 'land-banking', 'adaptive-reuse'],
    outputs: ['initialScore', 'marketAnalysis', 'quickReject']
  },

  'feasibility-analysis': {
    type: 'feasibility-analysis',
    name: 'Feasibility Analysis',
    description: 'Comprehensive due diligence and viability assessment',
    estimatedDurationDays: 14,
    requiredFor: ['subdivision', 'multi-family-rehab', 'land-banking', 'adaptive-reuse'],
    prerequisites: ['intake-qualification'],
    outputs: ['estimatedBuildableSF', 'coverageRatio', 'viabilityScore', 'goNoGoDecision']
  },

  'zoning-review': {
    type: 'zoning-review',
    name: 'Zoning Review',
    description: 'Review zoning compliance and identify constraints',
    estimatedDurationDays: 5,
    requiredFor: ['subdivision', 'multi-family-rehab', 'land-banking', 'adaptive-reuse'],
    outputs: ['zoningDistrict', 'setbacks', 'heightLimits', 'usageRestrictions']
  },

  'title-review': {
    type: 'title-review',
    name: 'Title Review',
    description: 'Review title report for liens, easements, and encumbrances',
    estimatedDurationDays: 7,
    requiredFor: ['subdivision', 'multi-family-rehab', 'adaptive-reuse'],
    outputs: ['titleClear', 'liens', 'easements', 'legalDescription']
  },

  'environmental-assessment': {
    type: 'environmental-assessment',
    name: 'Environmental Assessment',
    description: 'Assess environmental risks and requirements',
    estimatedDurationDays: 14,
    requiredFor: ['subdivision', 'adaptive-reuse'],
    outputs: ['wetlands', 'contaminatedSoil', 'treeCount', 'protectedSpecies']
  },

  'arborist-review': {
    type: 'arborist-review',
    name: 'Arborist Review',
    description: 'Tree inventory and removal restrictions assessment',
    estimatedDurationDays: 5,
    requiredFor: ['subdivision', 'adaptive-reuse'],
    outputs: ['treeCount', 'significantTrees', 'removalRestrictions']
  },

  'entitlement-preparation': {
    type: 'entitlement-preparation',
    name: 'Entitlement Preparation',
    description: 'Prepare permit application and coordinate consultants',
    estimatedDurationDays: 42,
    requiredFor: ['subdivision', 'adaptive-reuse'],
    prerequisites: ['feasibility-analysis', 'zoning-review'],
    outputs: ['permitPackage', 'consultantDrawings', 'applicationNumber']
  },

  'permit-submission': {
    type: 'permit-submission',
    name: 'Permit Submission',
    description: 'Submit permit application to jurisdiction',
    estimatedDurationDays: 60,
    requiredFor: ['subdivision', 'adaptive-reuse'],
    prerequisites: ['entitlement-preparation'],
    outputs: ['applicationNumber', 'submissionDate', 'expectedApprovalDate']
  },

  'construction-start': {
    type: 'construction-start',
    name: 'Construction Start',
    description: 'Begin construction phase',
    estimatedDurationDays: 1,
    requiredFor: ['subdivision', 'multi-family-rehab', 'adaptive-reuse'],
    prerequisites: [], // Varies by property type
    outputs: ['constructionStartDate', 'builderAssigned']
  }
};

/**
 * Get process definition by type
 */
export function getProcessDefinition(type: ProcessType): ProcessDefinition {
  return PROCESS_DEFINITIONS[type];
}

/**
 * Get all process definitions for a property type
 */
export function getProcessesForPropertyType(propertyType: string): ProcessDefinition[] {
  return Object.values(PROCESS_DEFINITIONS).filter(
    def => def.requiredFor.includes(propertyType as any)
  );
}

/**
 * Check if a process has all prerequisites completed
 */
export function hasPrerequisites(
  processType: ProcessType,
  completedProcesses: ProcessType[]
): boolean {
  const definition = PROCESS_DEFINITIONS[processType];
  if (!definition.prerequisites || definition.prerequisites.length === 0) {
    return true;
  }

  return definition.prerequisites.every(prereq =>
    completedProcesses.includes(prereq)
  );
}
