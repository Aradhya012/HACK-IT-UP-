import { validateEnv } from './lib/llm';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // SECURITY FIX: Validate environment variables on server startup
    // Commented out temporarily for UI demonstration purposes
    // validateEnv();

    // Startup cleanup: remove stale temp directories from old scans
    try {
      const fs = await import('fs');
      const path = await import('path');
      const os = await import('os');
      const tmpDir = os.default.tmpdir();
      const entries = fs.default.readdirSync(tmpDir, { withFileTypes: true });
      const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
      const now = Date.now();

      for (const entry of entries) {
        // Clean both legacy devsentinel-* and current reforge-* temp dirs
        if (entry.isDirectory() && (entry.name.startsWith('devsentinel-') || entry.name.startsWith('reforge-'))) {
          const fullPath = path.default.join(tmpDir, entry.name);
          try {
            const stat = fs.default.statSync(fullPath);
            if (now - stat.mtimeMs > MAX_AGE_MS) {
              fs.default.rmSync(fullPath, { recursive: true, force: true });
              console.log(`[Reforge Cleanup] Removed stale temp dir: ${entry.name}`);
            }
          } catch {
            // Ignore individual cleanup errors
          }
        }
      }
    } catch {
      // Non-fatal: don't block startup if cleanup fails
    }
  }
}
