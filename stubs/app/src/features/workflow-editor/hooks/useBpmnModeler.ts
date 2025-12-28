/**
 * BPMN Modeler Hook
 *
 * Manages bpmn-js modeler instance lifecycle and provides
 * methods for interacting with the diagram.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';

interface UseBpmnModelerOptions {
  container: HTMLElement | null;
  initialXml?: string;
  onChanged?: (xml: string) => void;
}

interface UseBpmnModelerReturn {
  modeler: BpmnModeler | null;
  isLoading: boolean;
  error: string | null;
  getXml: () => Promise<string | null>;
  importXml: (xml: string) => Promise<void>;
  zoomFit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export function useBpmnModeler({
  container,
  initialXml,
  onChanged,
}: UseBpmnModelerOptions): UseBpmnModelerReturn {
  const modelerRef = useRef<BpmnModeler | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize modeler when container is available
  useEffect(() => {
    if (!container) return;

    const modeler = new BpmnModeler({
      container,
      keyboard: { bindTo: document },
    });

    modelerRef.current = modeler;

    // Listen for changes
    const eventBus = modeler.get('eventBus') as { on: (event: string, callback: () => void) => void };
    eventBus.on('commandStack.changed', () => {
      if (onChanged) {
        modeler.saveXML().then(({ xml }) => {
          if (xml) onChanged(xml);
        });
      }
    });

    // Import initial XML if provided
    if (initialXml) {
      setIsLoading(true);
      modeler
        .importXML(initialXml)
        .then(() => {
          setError(null);
          const canvas = modeler.get('canvas') as { zoom: (level: string) => void };
          canvas.zoom('fit-viewport');
        })
        .catch((err: Error) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      modeler.destroy();
      modelerRef.current = null;
    };
  }, [container, initialXml, onChanged]);

  const getXml = useCallback(async (): Promise<string | null> => {
    if (!modelerRef.current) return null;
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      return xml ?? null;
    } catch {
      return null;
    }
  }, []);

  const importXml = useCallback(async (xml: string): Promise<void> => {
    if (!modelerRef.current) return;
    setIsLoading(true);
    try {
      await modelerRef.current.importXML(xml);
      setError(null);
      const canvas = modelerRef.current.get('canvas') as { zoom: (level: string) => void };
      canvas.zoom('fit-viewport');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import XML');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const zoomFit = useCallback(() => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as { zoom: (level: string) => void };
    canvas.zoom('fit-viewport');
  }, []);

  const zoomIn = useCallback(() => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as { zoom: (level: string) => void };
    canvas.zoom('in');
  }, []);

  const zoomOut = useCallback(() => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as { zoom: (level: string) => void };
    canvas.zoom('out');
  }, []);

  return {
    modeler: modelerRef.current,
    isLoading,
    error,
    getXml,
    importXml,
    zoomFit,
    zoomIn,
    zoomOut,
  };
}
