import path from 'path';
import { promises as fs } from 'fs';

export interface Patch {
  file: string;
  change: string;
  before?: string;
  after?: string;
}

/**
 * Apply patches to files in a project
 */
export async function applyPatches(projectPath: string, patches: Patch[]): Promise<{ success: boolean; applied: number; errors: string[] }> {
  const errors: string[] = [];
  let applied = 0;

  // Validate project path
  if (!projectPath || typeof projectPath !== 'string') {
    errors.push('Invalid project path');
    return { success: false, applied: 0, errors };
  }

  // Normalize project path
  const normalizedProjectPath = path.resolve(projectPath);

  for (const patch of patches) {
    try {
      if (!patch.file || !patch.after) {
        errors.push(`Invalid patch: missing file or after content`);
        continue;
      }

      const filePath = path.join(normalizedProjectPath, patch.file);
      
      // Validate file path is within project directory (prevent path traversal)
      const relativePath = path.relative(normalizedProjectPath, filePath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        errors.push(`Invalid file path (path traversal prevented): ${patch.file}`);
        continue;
      }

      // Ensure the directory exists
      const dirPath = path.dirname(filePath);
      try {
        await fs.access(dirPath);
      } catch {
        // Directory doesn't exist, create it
        await fs.mkdir(dirPath, { recursive: true });
      }

      // Read current file content
      let fileContent: string;
      try {
        fileContent = await fs.readFile(filePath, 'utf8');
      } catch (readError) {
        // File doesn't exist, create it with the patch content
        try {
          await fs.writeFile(filePath, patch.after, 'utf8');
          applied++;
          continue;
        } catch (writeError) {
          errors.push(`Failed to create file ${patch.file}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
          continue;
        }
      }

      // Apply patch
      let newContent: string;
      if (patch.before && fileContent.includes(patch.before)) {
        // Replace specific content
        newContent = fileContent.replace(patch.before, patch.after);
      } else if (!patch.before) {
        // For patches without before content, we'll replace the entire file
        // This is a fallback for AI-generated patches
        newContent = patch.after;
      } else {
        // Try fuzzy matching for minor differences
        const trimmedBefore = patch.before.trim();
        if (fileContent.includes(trimmedBefore)) {
          newContent = fileContent.replace(trimmedBefore, patch.after);
        } else {
          errors.push(`Could not find before content in file ${patch.file}`);
          continue;
        }
      }

      // Write updated content back to file
      try {
        await fs.writeFile(filePath, newContent, 'utf8');
        applied++;
      } catch (writeError) {
        errors.push(`Failed to write file ${patch.file}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
      }
    } catch (error) {
      errors.push(`Failed to apply patch to ${patch.file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    success: errors.length === 0,
    applied,
    errors
  };
}

/**
 * Create a backup of a project before applying patches
 */
export async function createBackup(projectPath: string, backupPath: string): Promise<boolean> {
  try {
    // Validate paths
    if (!projectPath || !backupPath) {
      throw new Error('Invalid paths provided');
    }

    // Normalize paths
    const normalizedProjectPath = path.resolve(projectPath);
    const normalizedBackupPath = path.resolve(backupPath);

    // Create backup directory if it doesn't exist
    try {
      await fs.access(normalizedBackupPath);
    } catch {
      await fs.mkdir(normalizedBackupPath, { recursive: true });
    }

    // Copy all files recursively
    await copyDirectory(normalizedProjectPath, normalizedBackupPath);
    return true;
  } catch (error) {
    console.error('Failed to create backup:', error);
    return false;
  }
}

/**
 * Restore a project from backup
 */
export async function restoreFromBackup(backupPath: string, projectPath: string): Promise<boolean> {
  try {
    // Validate paths
    if (!projectPath || !backupPath) {
      throw new Error('Invalid paths provided');
    }

    // Normalize paths
    const normalizedProjectPath = path.resolve(projectPath);
    const normalizedBackupPath = path.resolve(backupPath);

    // Remove current project directory
    await fs.rm(normalizedProjectPath, { recursive: true, force: true });
    
    // Copy backup to project directory
    await copyDirectory(normalizedBackupPath, normalizedProjectPath);
    return true;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
}

/**
 * Helper function to copy directory recursively
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true });

  // Create destination directory
  await fs.mkdir(dest, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and other large directories
      if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
        await copyDirectory(srcPath, destPath);
      }
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}