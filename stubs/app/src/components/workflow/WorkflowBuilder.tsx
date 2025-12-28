/**
 * BPMN Workflow Builder component using bpmn-js.
 *
 * This component provides a visual editor for creating and editing BPMN workflows.
 * It integrates with the bpmn-js library for standard BPMN 2.0 editing.
 *
 * @requires npm install bpmn-js
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// bpmn-js CSS - REQUIRED for diagrams to display
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

// Component styles
import '@/styles/workflow-builder.css';

// For now, we'll use dynamic imports to handle the case where packages aren't installed
interface BpmnModelerType {
  importXML: (xml: string) => Promise<{ warnings: string[] }>;
  saveXML: (options?: { format?: boolean }) => Promise<{ xml: string }>;
  saveSVG: () => Promise<{ svg: string }>;
  destroy: () => void;
  get: (name: string) => unknown;
  on: (event: string, callback: (event: unknown) => void) => void;
}

interface WorkflowBuilderProps {
  /** Initial BPMN XML to load */
  initialXml?: string;
  /** Callback when user saves the workflow */
  onSave?: (xml: string) => void;
  /** Callback when BPMN content changes */
  onChange?: (xml: string) => void;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Height of the canvas */
  height?: string | number;
  /** Custom class name */
  className?: string;
}

/**
 * EMPTY_DIAGRAM is used as the default template when:
 * 1. Creating a new workflow (clicking "New" button)
 * 2. No initialXml is provided to the WorkflowBuilder
 * It provides a minimal valid BPMN with Start -> End flow.
 */
const EMPTY_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" name="New Workflow" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="180" y="160" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="412" y="160" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="216" y="178"/>
        <di:waypoint x="412" y="178"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Canvas interface with overloaded zoom function
interface BpmnCanvas {
  zoom(level: 'fit-viewport'): void;
  zoom(level: number): void;
  zoom(): number;
}

export function WorkflowBuilder({
  initialXml,
  onSave,
  onChange,
  readOnly = false,
  height = '600px',
  className = '',
}: Readonly<WorkflowBuilderProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModelerType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelerReady, setIsModelerReady] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize the BPMN modeler
  useEffect(() => {
    if (!containerRef.current) return;

    let modeler: BpmnModelerType | null = null;
    let isCancelled = false;

    // Clear any existing content in the container (handles StrictMode double-render)
    containerRef.current.innerHTML = '';

    const initModeler = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import of bpmn-js
        const BpmnModeler = (await import('bpmn-js/lib/Modeler')).default;

        // Check if effect was cancelled during async import
        if (isCancelled) return;

        // Create modeler instance (container is guaranteed non-null by early return check)
        modeler = new BpmnModeler({
          container: containerRef.current!,
        }) as BpmnModelerType;

        modelerRef.current = modeler;

        // Load initial diagram
        const xml = initialXml || EMPTY_DIAGRAM;
        await modeler.importXML(xml);

        // Check again after async import
        if (isCancelled) {
          modeler.destroy();
          return;
        }

        // Listen for changes
        modeler.on('commandStack.changed', () => {
          setHasChanges(true);
          if (onChange) {
            modeler?.saveXML({ format: true }).then(({ xml }) => {
              onChange(xml);
            });
          }
        });

        // Fit the diagram to the canvas viewport with padding
        const canvas = modeler.get('canvas') as BpmnCanvas;
        if (canvas) {
          // First fit to viewport, then zoom out slightly for padding
          canvas.zoom('fit-viewport');
          // Reduce zoom by 10% to add visual padding around the diagram
          const currentZoom = canvas.zoom();
          canvas.zoom(currentZoom * 0.9);
        }

        setIsModelerReady(true);
        setIsLoading(false);
      } catch (err) {
        if (isCancelled) return;
        const message = err instanceof Error ? err.message : 'Failed to initialize BPMN editor';
        setError(message);
        setIsLoading(false);
      }
    };

    initModeler();

    // Cleanup on unmount
    return () => {
      isCancelled = true;
      if (modeler) {
        modeler.destroy();
      }
      modelerRef.current = null;
    };
  }, []); // Only run once on mount

  // Update diagram when initialXml changes (after initial load)
  useEffect(() => {
    if (modelerRef.current && isModelerReady && initialXml) {
      modelerRef.current.importXML(initialXml).catch((err) => {
        setError(`Failed to load diagram: ${err.message}`);
      });
      setHasChanges(false);
    }
  }, [initialXml, isModelerReady]);

  const handleSave = useCallback(async () => {
    if (!modelerRef.current || !onSave) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      onSave(xml);
      setHasChanges(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save diagram';
      setError(`Save failed: ${message}`);
    }
  }, [onSave]);

  const handleDownload = useCallback(async () => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workflow.bpmn';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download';
      setError(`Download failed: ${message}`);
    }
  }, []);

  const handleDownloadSvg = useCallback(async () => {
    if (!modelerRef.current) return;

    try {
      const { svg } = await modelerRef.current.saveSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workflow.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download SVG';
      setError(`Download failed: ${message}`);
    }
  }, []);

  const handleNewDiagram = useCallback(async () => {
    if (!modelerRef.current) return;

    try {
      await modelerRef.current.importXML(EMPTY_DIAGRAM);
      setHasChanges(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create new diagram';
      setError(message);
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as BpmnCanvas;
    if (canvas) {
      const currentZoom = canvas.zoom();
      canvas.zoom(currentZoom * 1.2);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as BpmnCanvas;
    if (canvas) {
      const currentZoom = canvas.zoom();
      canvas.zoom(currentZoom * 0.8);
    }
  }, []);

  const handleZoomFit = useCallback(() => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as BpmnCanvas;
    if (canvas) {
      // Fit to viewport then zoom out 10% for padding
      canvas.zoom('fit-viewport');
      const currentZoom = canvas.zoom();
      canvas.zoom(currentZoom * 0.9);
    }
  }, []);

  return (
    <div className={`workflow-builder ${className}`}>
      {/* Toolbar */}
      <div className="workflow-builder-toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNewDiagram}
            disabled={isLoading || readOnly}
          >
            New
          </button>
          <span className="toolbar-separator" />
          <button
            type="button"
            className="btn btn-icon"
            onClick={handleZoomIn}
            disabled={isLoading}
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            className="btn btn-icon"
            onClick={handleZoomOut}
            disabled={isLoading}
            title="Zoom Out"
          >
            −
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleZoomFit}
            disabled={isLoading}
            title="Fit to viewport"
          >
            Fit
          </button>
          <span className="toolbar-separator" />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownload}
            disabled={isLoading}
          >
            Download BPMN
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownloadSvg}
            disabled={isLoading}
          >
            Download SVG
          </button>
        </div>
        <div className="toolbar-right">
          {hasChanges && <span className="unsaved-indicator">Unsaved changes</span>}
          {onSave && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isLoading || readOnly}
            >
              Save Workflow
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="workflow-builder-error">
          <span className="error-icon">!</span>
          <span className="error-message">{error}</span>
          <button
            type="button"
            className="error-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            x
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="workflow-builder-loading">
          <div className="loading-spinner" />
          <span>Loading BPMN Editor...</span>
        </div>
      )}

      {/* BPMN Canvas */}
      <div
        ref={containerRef}
        className="workflow-builder-canvas"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      />
    </div>
  );
}

export { EMPTY_DIAGRAM };
