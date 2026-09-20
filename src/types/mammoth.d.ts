declare module 'mammoth' {
  export interface ConversionResult {
    value: string;
    messages: any[];
  }
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<ConversionResult>;
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<ConversionResult>;
}
