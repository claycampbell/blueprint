/**
 * Type declarations for bpmn-js CSS modules
 */

// CSS module declarations for bpmn-js assets
declare module 'bpmn-js/dist/assets/diagram-js.css';
declare module 'bpmn-js/dist/assets/bpmn-js.css';
declare module 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

// bpmn-js Modeler type (simplified)
declare module 'bpmn-js/lib/Modeler' {
  interface ModelerOptions {
    container?: string | HTMLElement;
    keyboard?: { bindTo?: HTMLElement | Document };
    additionalModules?: unknown[];
    moddleExtensions?: Record<string, unknown>;
  }

  interface Canvas {
    zoom(level: 'fit-viewport'): void;
    zoom(level: number): void;
    zoom(): number;
    viewbox(): { x: number; y: number; width: number; height: number };
  }

  interface ImportResult {
    warnings: string[];
  }

  interface SaveResult {
    xml: string;
  }

  interface SvgResult {
    svg: string;
  }

  class Modeler {
    constructor(options?: ModelerOptions);
    importXML(xml: string): Promise<ImportResult>;
    saveXML(options?: { format?: boolean }): Promise<SaveResult>;
    saveSVG(): Promise<SvgResult>;
    destroy(): void;
    get<T = unknown>(name: string): T;
    on(event: string, callback: (event: unknown) => void): void;
  }

  export default Modeler;
}
