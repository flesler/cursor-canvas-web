/**
 * Stub for IDE `hooks.d.ts` — the skills-cursor SDK snapshot omits `internal/`.
 * Keep in sync with Cursor's dispatch action union when syncing the SDK.
 */
export type CanvasAction =
  | { type: 'openAgent'; agentId: string }
  | { type: 'newComposerChat'; userPrompt?: string }
  | {
      type: 'openFile';
      path: string;
      selection?: {
        startLineNumber: number;
        startColumn: number;
        endLineNumber?: number;
        endColumn?: number;
      };
    };
