# Reforge AI: Autonomous Security & Code Reforging Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack: Next.js 14](https://img.shields.io/badge/Stack-Next.js%2014-blue)](https://nextjs.org/)
[![Security: AI-Powered](https://img.shields.io/badge/Security-AI--Powered-green)](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

**Reforge AI** is a state-of-the-art autonomous security platform that orchestrates a multi-agent LLM workflow to detect, audit, and automatically patch software vulnerabilities. It doesn't just find bugs; it "reforges" insecure code into secure systems through a self-healing loop.

---

## 🛡️ Core Capabilities

### 1. Multi-Agent Orchestration Engine
Reforge AI employs a sophisticated pipeline of specialized AI agents, each handling a distinct phase of the security lifecycle:
*   **Architect Agent (DeepSeek-R1)**: Analyzes project structure and maps the attack surface.
*   **Builder Agent (Llama 3)**: Constructs targeted scanning strategies based on architectural insights.
*   **Critic Agent**: Reviews scanning strategies to ensure maximum coverage and high precision.
*   **Sentinel Agent**: Executes deep code analysis using context-aware LLM reasoning.

### 2. Autonomous Patch Generation
Leveraging **Gemini 2.0 Flash**, Reforge AI generates context-sensitive, secure patches for identified vulnerabilities (SQLi, XSS, CSRF, etc.) that aren't just fixes—they're security upgrades.

### 3. Red Team Validation Gate
A proactive security engine that attempts to exploit identified vulnerabilities and validate patches using offensive security techniques (Neurosploit integration), ensuring that no fix leaves a new hole behind.

### 4. Interactive Command Center
A premium, cyber-modern dashboard featuring:
*   **Red-Team Terminal**: Real-time visualization of agent thinking and offensive probes.
*   **Vulnerability Timeline**: Historical tracking of security posture and remediation.
*   **Interactive Diffs**: Side-by-side comparison of insecure code vs. AI-reforged secure code.

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
-   **Backend**: Supabase (PostgreSQL + Auth + Storage)
-   **AI Foundation**:
    -   **Azure OpenAI**: Core logic and LLM orchestration.
    -   **DeepSeek-R1**: Architectural reasoning.
    -   **Gemini 2.0 Flash**: High-speed patch generation.
    -   **Azure AI Content Safety**: Real-time validation of AI outputs.
-   **Security Integration**: Octokit (GitHub), Neurosploit (Offensive Validation)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- OpenAI / Azure OpenAI API keys

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Aradhya012/HACK-IT-UP-.git
    cd reforge-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env.local` file and add:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    AZURE_OPENAI_API_KEY=your_key
    # Add other agent keys (Groq, Together, DeepSeek)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the Command Center.

---

## 🗺️ Roadmap

- [ ] **Phase 1**: Advanced Agent Orchestration & Basic Patching (Current)
- [ ] **Phase 2**: Multi-Language Support (Python, Go, Rust)
- [ ] **Phase 3**: CI/CD Plugin for Automated Patch Pull Requests
- [ ] **Phase 4**: Enterprise-Grade RBAC and Custom Security Polices

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Developed at Hackzion V3 (AMC Engineering College) under the Cybersecurity Track.**
