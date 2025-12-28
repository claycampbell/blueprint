/**
 * BPMN Canvas
 *
 * Visual BPMN diagram editor using bpmn-js.
 */

import { useRef, useEffect, useState } from 'react';
import { useBpmnModeler } from '../hooks/useBpmnModeler';

interface BpmnCanvasProps {
  initialXml?: string;
  onChange?: (xml: string) => void;
  onGetXml?: (getter: () => Promise<string | null>) => void;
}

export function BpmnCanvas({ initialXml, onChange, onGetXml }: BpmnCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // Set container after mount
  useEffect(() => {
    setContainer(containerRef.current);
  }, []);

  const { isLoading, error, getXml, zoomFit, zoomIn, zoomOut } = useBpmnModeler({
    container,
    initialXml,
    onChanged: onChange,
  });

  // Expose getXml to parent
  useEffect(() => {
    if (onGetXml) {
      onGetXml(getXml);
    }
  }, [onGetXml, getXml]);

  return (
    <div>
      {/* Toolbar */}
      <div>
        <button onClick={zoomIn} title="Zoom In">+</button>
        <button onClick={zoomOut} title="Zoom Out">-</button>
        <button onClick={zoomFit} title="Fit to Viewport">Fit</button>
      </div>

      {/* Loading/Error states */}
      {isLoading && <div>Loading diagram...</div>}
      {error && <div>Error: {error}</div>}

      {/* Canvas container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
}
