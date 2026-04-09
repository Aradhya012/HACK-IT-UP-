/**
 * Centralized brand configuration for Reforge AI.
 * All branding strings should reference this file to prevent drift.
 */
export const BRAND = {
  /** Full product name */
  name: 'Reforge AI',
  /** Short name for navbar, sidebar, compact UI */
  short: 'Reforge',
  /** One-line tagline */
  tagline: 'Reforging insecure code into secure systems',
  /** Description for SEO / metadata */
  description: 'Reforge AI - Autonomous AI security platform that reforges insecure code into secure systems',
  /** Tmp directory prefix used for project extraction */
  tmpPrefix: 'reforge',
  /** Default branch name for security fix commits */
  defaultBranch: 'reforge-fixes',
  /** Default commit message */
  defaultCommitMessage: 'Apply security fixes from Reforge AI',
  /** PR body text */
  prBody: 'Automated security fixes from Reforge AI',
  /** Contact / admin email */
  adminEmail: 'admin@reforge.ai',
} as const;
