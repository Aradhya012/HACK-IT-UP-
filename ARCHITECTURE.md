# Reforge AI Architecture

## Overview
Reforge AI is a secure-by-design autonomous development platform using a **multi-agent LLM pipeline** (Architect → Builder → Critic → Sentinel) to scan, detect, and patch vulnerabilities. The platform features automated GitHub pull requests, real-time dashboard with vulnerability analytics, and Supabase-powered backend for project management and timeline tracking.

## High-Level Architecture
```
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│   Architect     │    │   Builder    │    │   Critic     │
│  (Planning)     │───▶│ (Strategy)   │───▶│ (Review)     │
└─────────────────┘    └──────────────┘    └──────────────┘
                                                 │
                                                 ▼
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sentinel      │◀───│  Dashboard   │◀───│   Timeline   │
│  (Scanning)     │    │   (UI)       │    │   (Events)   │
└─────────────────┘    └──────────────┘    └──────────────┘
         │                       │                  │
         ▼                       ▼                  ▼
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│    Patcher      │    │   Supabase   │    │   GitHub     │
│  (Auto-fix)     │    │  (Storage)   │    │ (Integration)│
└─────────────────┘    └──────────────┘    └──────────────┘
```

## Multi-Agent Orchestration

### 1. Planner Agent (Architect)
- **Role**: Analyzes project structure and creates security scanning plans
- **Implementation**: [architectAgent()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L88-L120) in [lib/orchestrator.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts)
- **LLM Provider**: Uses OpenRouter with DeepSeek R1 FREE model
- **Functionality**: Identifies high-risk areas like auth, data handling, API integrations, file operations, and network communications

### 2. Auditor Agent (Sentinel)
- **Role**: Performs security scanning and vulnerability detection
- **Implementation**: [sentinelAgent()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L192-L197) and [scanProject()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/sentinel.ts#L154-L204) in [lib/sentinel.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/sentinel.ts)
- **LLM Provider**: Uses OpenRouter with DeepSeek R1 FREE model for vulnerability analysis
- **Functionality**: 
  - Scans for eval(), exec(), hardcoded secrets, SQL injection patterns, and XSS via innerHTML
  - Performs pattern matching and LLM-based code analysis
  - Returns vulnerability findings with type, severity, file, line, and snippet

### 3. DevOps Agent (Builder + Critic + Patcher)
- **Builder Role**: Creates detailed scanning strategies based on architectural analysis
  - **Implementation**: [builderAgent()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L123-L155) in [lib/orchestrator.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts)
  - **LLM Provider**: Uses Groq with Llama3 model
  - **Functionality**: Defines specific patterns to look for in code including input validation, injection vulnerabilities, auth flaws, data exposure, and security misconfigurations

- **Critic Role**: Reviews scanning approaches and suggests improvements
  - **Implementation**: [criticAgent()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L158-L189) in [lib/orchestrator.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts)
  - **LLM Provider**: Uses Together AI with Llama-3-70b-chat-hf model
  - **Functionality**: Identifies gaps in coverage, suggests false positive reduction techniques, performance optimization, and accuracy improvements

- **Patcher Role**: Generates and applies security patches
  - **Implementation**: [applyAutoPatches()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L200-L261) and [applyPatches()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/patcher.ts#L14-L104) in [lib/patcher.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/patcher.ts)
  - **LLM Provider**: Uses Gemini with gemini-2.0-flash model for patch generation
  - **Functionality**: Generates intelligent patches, validates them with a Validator Agent, and applies them to fix vulnerabilities

### 4. Validator Agent
- **Role**: Performs dry-run builds/tests after patch generation to ensure code integrity
- **Implementation**: [validatePatches()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L273-L347) and [runValidation()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts#L350-L414) in [lib/orchestrator.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts)
- **Functionality**:
  - Creates temporary backups before patch application
  - Runs npm install, tests, and build processes to validate patches
  - Implements iterative patch validation to identify problematic patches
  - Restores from backup if validation fails

## Azure Integration

### Azure OpenAI Service
- **Provider Configuration**: [lib/llm.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/llm.ts) includes Azure OpenAI provider
- **Environment Variables**:
  - `AZURE_OPENAI_API_KEY`
  - `AZURE_OPENAI_ENDPOINT`
  - `AZURE_OPENAI_DEPLOYMENT_NAME`
- **Implementation**: Standard OpenAI-compatible API calls with Azure-specific authentication

### Azure AI Content Safety
- **Provider Configuration**: [lib/azure-content-safety.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/azure-content-safety.ts)
- **Environment Variables**:
  - `AZURE_CONTENT_SAFETY_KEY`
  - `AZURE_CONTENT_SAFETY_ENDPOINT`
- **Functionality**: Analyzes content for Hate, SelfHarm, Sexual, and Violence categories with severity scoring

## System Components

### Core Libraries
- [lib/llm.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/llm.ts): Unified LLM router with support for multiple providers (Azure, OpenRouter, Gemini, Groq, Together)
- [lib/orchestrator.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/orchestrator.ts): Multi-agent pipeline coordination
- [lib/sentinel.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/sentinel.ts): Security scanning and vulnerability detection
- [lib/patcher.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/patcher.ts): Secure patch application with path traversal prevention
- [lib/azure-content-safety.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/azure-content-safety.ts): Azure Content Safety integration

### API Routes
- [app/api/orchestrate/route.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/app/api/orchestrate/route.ts): Main orchestration endpoint
- [app/api/scan/route.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/app/api/scan/route.ts): Direct scanning endpoint
- [app/api/patch/route.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/app/api/patch/route.ts): Patch application endpoint
- [app/api/test-llm/route.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/app/api/test-llm/route.ts): LLM connectivity testing

### Frontend Components
- [components/Navbar.tsx](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/components/Navbar.tsx): Microsoft Fluent Design navigation
- [components/Sidebar.tsx](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/components/Sidebar.tsx): Application sidebar
- [components/ScanResults.tsx](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/components/ScanResults.tsx): Vulnerability display
- [components/PatchDiff.tsx](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/components/PatchDiff.tsx): Patch visualization

## Security Features
- **Path Traversal Prevention**: All file operations are validated in [lib/patcher.ts](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/patcher.ts)
- **Input Validation**: Comprehensive validation on all API endpoints
- **Secure LLM Routing**: Centralized LLM provider management with error handling
- **Backup/Restore**: Automatic backups before applying patches using [createBackup()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/patcher.ts#L110-L134) and [restoreFromBackup()](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/lib/patcher.ts#L140-L159)
- **Audit Trail**: Complete timeline of all security events in [app/timeline/server-page.tsx](file:///c:/Users/Naveen%20Patil/OneDrive/Desktop/Reforge%20AI/app/timeline/server-page.tsx)
- **System Guard Prompts**: Protection against prompt injection and jailbreak attempts in all LLM calls
- **Azure Content Safety**: Additional content filtering for sensitive content

## Deployment Architecture
- **Frontend**: Next.js 14 App Router deployed on Vercel
- **Backend**: Next.js API Routes with serverless functions
- **Database**: Supabase (PostgreSQL) for project management and timeline tracking
- **Storage**: Supabase Storage for project files
- **Authentication**: Supabase Auth with email-based login
- **CDN**: Vercel Edge Network for global content delivery