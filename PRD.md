# Product Requirements Document (PRD)
## Project: The Lenny Growth Assistant

---

### 1. Discovery Brief
Lenny’s Podcast is the premier knowledge hub for modern product management, growth loops, B2B sales, marketplaces, and high-agency leadership. With hundreds of hours of long-form interviews featuring world-class founders and executives (e.g., Shreyas Doshi, Elena Verna, Brian Chesky, Gustaf Alströmer, Casey Winters), practitioners struggle to quickly extract actionable frameworks, synthesize grounded arguments, or produce high-impact artifacts (such as Ship 30 for 30-style atomic essays or visual dashboards) without hours of manual searching.

**The Lenny Growth Assistant** is a full-stack, enterprise-grade AI conversational platform that ingests authoritative transcripts, performs dense vector semantic retrieval, strictly grounds answers against verified episode context, generates structured Ship 30 for 30 atomic essays, and produces secure rendered Markdown and HTML artifacts.

---

### 2. Target Users
1. **Product Managers & Growth Leaders**: Seeking battle-tested frameworks, metric definitions, and benchmarks directly sourced from recognized industry leaders.
2. **Founders & Operators**: Seeking high-agency strategic advice, retention loops, and tactical execution guides without generic LLM fluff.
3. **Writers & Content Marketers**: Seeking structured, punchy Ship 30 for 30-style educational essays grounded in authentic transcript insights.
4. **Customer Engineering Evaluators**: Assessing code quality, AI/RAG system architecture, security controls, observability, and local reproducibility.

---

### 3. Problem Statement
1. **Generic Hallucinations**: Standard public LLMs fabricate growth advice, misattribute quotes, and invent non-existent benchmarks.
2. **Lack of Traceability**: Users cannot verify whether advice actually came from Lenny's guests or from arbitrary internet crawl data.
3. **Format Friction**: Practitioners need diverse output modalities: quick QA answers, structured atomic essays (Ship 30 for 30), or live visual UI artifacts (calculators, dashboards, checklists).
4. **Security Vulnerability with Generated HTML**: LLMs generating custom HTML/CSS can easily introduce Cross-Site Scripting (XSS), data exfiltration, or interface hijacking if rendered naively.

---

### 4. Success Metrics
* **Grounded Accuracy**: $\ge 90\%$ citation support in evaluated answers (every factual claim is tied to an explicit transcript chunk and timestamp/source URL).
* **Task Completion**: $\ge 80\%$ task completion rate across evaluation scenarios (QA, Ship 30 generation, HTML dashboard creation).
* **Zero-Hallucination Acknowledgment**: 100% adherence to declining unsupported questions with explicit insufficient-context notices.
* **Fast Evaluator Onboarding**: A fresh engineer can clone the repository, run one setup command, and have the full application running in $\le 10$ minutes.
* **Local First Guarantee**: 100% functional on a local workstation using Ollama and local storage without requiring paid third-party API keys.

---

### 5. Assumptions
1. **Authoritative Knowledge Source**: Lenny’s Podcast transcripts stored in `data/transcripts/` represent the ground-truth knowledge base.
2. **Strict Grounding Rule**: The assistant must not invent unsupported facts or attribute ideas to guests unless supported by retrieved context.
3. **Storage & Vector Scalability**: PostgreSQL with `pgvector` provides sufficient index performance for the expected transcript corpus, with a zero-config local vector store fallback for instant zero-dependency execution.
4. **Default Provider**: Ollama is the default demo provider (running locally with `phi3-local` or `llama3`), while Anthropic Claude 3.5 Sonnet is supported as an optional cloud upgrade.
5. **Authentication Boundary**: Multi-user enterprise SSO and authentication are explicitly out of scope for this MVP; sessions are isolated via unique UUID session identifiers.
6. **Untrusted HTML**: All generated HTML is considered untrusted and must be sanitized on the server and isolated in the frontend using a sandboxed `<iframe>`.
7. **No Code Execution Sandbox**: Artifacts are visual/declarative (HTML/CSS/Markdown); server-side execution of generated Python/JS code is out of scope.

---

### 6. Scope
- **Ingestion Pipeline**: Clean transcript text, extract metadata (guest, title, source URL, date), chunk with token overlap, compute vector embeddings, and upsert to database.
- **Semantic Retrieval (RAG)**: Query embedding, pgvector cosine distance search, metadata ranking, and context injection.
- **Dynamic Skill Routing**: Intent classification separating Grounded QA, Ship 30 for 30 essays, and Artifact Generation.
- **Ship 30 for 30 Skill**: Structured atomic essays (~1,250 words) with headline hooks, 1-3-1 cadence, bolded concepts, actionable takeaways, and source citations.
- **Artifact Viewer**: Split-screen viewer rendering Markdown and sanitized HTML inside an isolated, non-executable iframe.
- **Observability & Error Handling**: Structured logging, request tracing, and informative UX alerts for missing models or empty retrieval.

---

### 7. Out of Scope
- User authentication, OAuth, and RBAC.
- Dynamic web crawling or real-time YouTube transcript scraping at query time.
- Voice/audio playback and real-time speech-to-text synthesis.
- Arbitrary server-side code execution.

---

### 8. Key User Flows
1. **Flow 1: Grounded QA**
   - User inputs question (e.g., *"How did Elena Verna define B2B Product-Led Growth?"*).
   - System embeds query, queries vector store, retrieves top chunks with metadata.
   - LLM produces concise, grounded response with source badges linking to episode title and URL.
2. **Flow 2: Ship 30 for 30 Essay**
   - User requests *"Write a Ship 30 style essay on high-agency product management based on Shreyas Doshi."*
   - Router detects Ship 30 intent; invokes `Ship30Skill`.
   - Skill structures hook, lead-in, core pillars, bold emphasis, actionable takeaway, and ~1,250 word target.
3. **Flow 3: Artifact Generation & Viewing**
   - User asks *"Generate an HTML growth funnel checklist artifact."*
   - Assistant generates HTML artifact, sanitizes content, saves artifact record in database.
   - Frontend splits screen, displays HTML in sandboxed iframe with Markdown source toggle.

---

### 9. Acceptance Criteria
- [x] Backend runs FastAPI with typed Pydantic models and structured error responses.
- [x] Ingestion script processes raw transcripts into clean, traceable chunks with embeddings.
- [x] Vector search retrieves relevant chunks and returns source URLs and episode titles.
- [x] Assistant declines to answer if retrieval produces zero supporting evidence.
- [x] Ship 30 skill produces structured, skimmable essays with required sections and actionable takeaways.
- [x] Artifact viewer renders HTML inside an iframe with `sandbox=""` without script execution.
- [x] Local LLM (Ollama) works out-of-the-box without requiring Anthropic API keys.
- [x] Comprehensive automated tests pass for API, retrieval, routing, providers, and security.

---

### 10. Risks & Mitigations
| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| Ollama service not running | App cannot generate responses | Health check diagnostics; UX toast with exact startup command `ollama serve` |
| Low similarity scores / Hallucination | Misleading product advice | Strict grounding prompt with refusal threshold when similarity is low |
| Malicious XSS in generated HTML | Parent app hijack or data theft | Multi-layered defense: BeautifulSoup sanitizer + strict sandboxed iframe (`sandbox=""`) |
| High latency on local embeddings | Slow query response | Lightweight optimized local vector engine with fast cosine math |
