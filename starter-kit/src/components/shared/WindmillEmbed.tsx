/**
 * WindmillEmbed Component
 *
 * Embeds Windmill content (apps, flows, scripts) in React applications via iframe.
 *
 * Usage Examples:
 *   // Embed an app dashboard
 *   <WindmillEmbed
 *     type="app"
 *     workspace="blueprint"
 *     path="u/clay/blueprint_loan_dashboard"
 *     height="800px"
 *   />
 *
 *   // Embed a flow form
 *   <WindmillEmbed
 *     type="flow"
 *     workspace="blueprint"
 *     path="f/approval_workflow"
 *     height="600px"
 *   />
 *
 *   // Embed a script (form to run script)
 *   <WindmillEmbed
 *     type="script"
 *     workspace="blueprint"
 *     path="u/clay/data_processor"
 *     height="500px"
 *   />
 */

import React from 'react';

type WindmillContentType = 'app' | 'flow' | 'script';

interface WindmillEmbedProps {
  /** Type of Windmill content to embed */
  type?: WindmillContentType;

  /** Windmill workspace name */
  workspace: string;

  /** Content path (e.g., 'u/clay/app_name' for apps, 'f/flow_name' for flows) */
  path: string;

  /** Windmill base URL (defaults to localhost:8000) */
  baseUrl?: string;

  /** iframe height */
  height?: string;

  /** iframe width */
  width?: string;

  /** Custom CSS class for container */
  className?: string;

  /** Additional iframe title for accessibility */
  title?: string;

  /** Hide Windmill sidebar (apps only) */
  hideSidebar?: boolean;

  /** @deprecated Use 'path' instead */
  appPath?: string;
}

export const WindmillEmbed: React.FC<WindmillEmbedProps> = ({
  type = 'app',
  workspace,
  path,
  appPath, // deprecated
  baseUrl = 'http://localhost:8000',
  height = '600px',
  width = '100%',
  className = '',
  title = 'Windmill Content',
  hideSidebar = true
}) => {
  // Support legacy appPath prop
  const contentPath = path || appPath;

  if (!contentPath) {
    console.error('WindmillEmbed: path or appPath prop is required');
    return null;
  }

  // Build the embed URL based on content type
  const getEmbedUrl = (): string => {
    switch (type) {
      case 'app':
        return `${baseUrl}/apps/get/${contentPath}`;
      case 'flow':
        // Flows use /flows/run/ endpoint with the flow path
        return `${baseUrl}/flows/run/${contentPath}`;
      case 'script':
        // Scripts use /scripts/run/ endpoint with the script path
        return `${baseUrl}/scripts/run/${contentPath}`;
      default:
        return `${baseUrl}/apps/get/${contentPath}`;
    }
  };

  const embedUrl = getEmbedUrl();

  // Calculate sidebar offset (only for apps with hideSidebar enabled)
  const sidebarOffset = type === 'app' && hideSidebar ? '-220px' : '0';
  const widthAdjustment = type === 'app' && hideSidebar ? ' + 220px' : '';

  return (
    <div
      className={`windmill-embed-container ${className}`}
      style={{
        position: 'relative',
        width: width,
        height: height,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        style={{
          position: 'absolute',
          top: 0,
          left: sidebarOffset,
          width: `calc(100%${widthAdjustment})`,
          height: '100%',
          border: 'none'
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-forms"
      />
    </div>
  );
};

export default WindmillEmbed;
