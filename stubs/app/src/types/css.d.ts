/**
 * Type declarations for CSS imports
 *
 * This allows importing CSS files as side-effect modules.
 */

// Allow importing any CSS file
declare module '*.css';

// Explicit declarations for our style files (using @/ path alias)
declare module '@/styles/workflow-builder.css';
declare module '@/styles/workflow-definitions.css';
