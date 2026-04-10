// Stub for offensive tools — not used in VulnGuard npm scanning flow
export class OffensiveTools {
  constructor(private projectPath: string) {}

  getAvailableTools() {
    return [];
  }

  async executeToolCall(call: { name: string; parameters: any }) {
    return { success: false, output: null, error: 'Offensive tools not configured' };
  }
}
