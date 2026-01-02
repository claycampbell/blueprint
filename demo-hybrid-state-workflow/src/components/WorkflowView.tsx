import React from 'react';
import { Property } from '../types';
import WorkflowViewComponent from './workflow/WorkflowView';

interface WorkflowViewWrapperProps {
  property: Property;
  onCompleteProcess?: (processId: string) => void;
}

/**
 * WorkflowView Wrapper - Traditional stage-based workflow UI
 *
 * This represents the "old way" of thinking about property management:
 * - Linear progression through stages
 * - Stage gates and checklists
 * - Sequential process flow
 *
 * Now uses the comprehensive workflow components from ./workflow/
 */
export const WorkflowView: React.FC<WorkflowViewWrapperProps> = ({
  property
}) => {
  return <WorkflowViewComponent property={property} />;
};
