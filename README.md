# Red Hat AI Platform Explorer

Interactive workshop tool for exploring Red Hat AI platform architectures. Helps facilitators and customers align on capabilities, tradeoffs, and next steps.

**Key features:** Architecture builder, decision guides, use case patterns, product catalog, dual-view product comparison (bill of materials + capabilities, draft), PNG export, and copyable stack summaries.

**Current scope:** Workshop assistant for discussion and alignment. Not a live configurator or automated SKU generator.

**Roadmap:** [docs/ROADMAP.md](docs/ROADMAP.md)

**🌐 Live Site:** [https://alexagriffith.github.io/ai-platform-explorer/](https://alexagriffith.github.io/ai-platform-explorer/)

> **⚠️ Work In Progress:** This tool is actively being developed and improved. Content and features are subject to change.

## Application state (V1 blueprint)

The **architecture workshop stack** is driven by a single in-memory object in `App.jsx`:

| State | Role |
|--------|------|
| **`selectedCapabilities`** | **Canonical blueprint** — flat map of `capabilityId → optionId`. This is what **Build Your Stack** reads and writes, what the Decision Guide applies into, and what the Interactive Builder syncs into when the guided flow finishes. |
| `selectedProducts` | Highlights in the **Products** tab only. It is **not** the stack blueprint (product ↔ capability derivation is optional later work). |
| `customerEnv` | Inputs for **Generate from Environment** — used for copyable suggestion previews; it does **not** auto-apply to `selectedCapabilities`. |

Utilities for converting wizard layer maps and flow-visualization shapes live in `src/lib/capabilityBlueprint.js`. **Container ↔ AI pairing** (OpenShift + RHOAI/RHAIE vs non-OCP Kubernetes + RHAI) is enforced in `src/lib/platformAiConstraints.js`.

## ✨ Features

- **Export Stack (PNG)** — From **Build Your Stack**, use **Export Stack** for a snapshot of the layer canvas (selected components and legend).

### 🏗️ Interactive Architecture Builder
- **Layer-by-Layer Construction**: Build your AI stack from infrastructure up through applications
- **Flexible Options**: Choose between Red Hat solutions or bring your own components
- **Visual Stack View**: See your complete architecture with clear layer organization
- **Bottom-Up or Top-Down**: Toggle between infrastructure-first or application-first views

### 🔄 Data Flow Visualization
- **Technical Architecture Diagrams**: See how components connect and interact
- **Expandable Components**: Drill into internal architecture (MCP, OpenShift AI, etc.)
- **Request Flow Paths**: Understand how data flows through your stack
- **Color-Coded Layers**: Clear visual distinction between component types

### 🧭 Decision Flowcharts
- **Product Selection**: Which Red Hat AI product should I use?
- **Deployment Models**: Where should I deploy (cloud, on-prem, hybrid)?
- **Architecture Patterns**: How should I architect my solution?
- **Tradeoff Analysis**: Understand pros/cons of each decision

### 🔀 Deployment Impact
- **Before/After Deployment Comparison**: See what changes when moving between deployment patterns
- **Resource Trees**: Kubernetes resource definitions with expandable details
- **YAML Diff**: Side-by-side configuration differences

### ⚖️ Product Comparison
- **Dual-View Product Comparison**: Compare two Red Hat AI products (Red Hat AI Inference Server vs Red Hat OpenShift AI) in a bill of materials (BOM) view — what ships in each — and a capability view — what each can do and where they overlap. Ships with illustrative placeholder data behind a visible draft banner, pending human curation.

### 💡 Use Case Guides
- Model Inference & Serving
- Model Training & Fine-tuning
- Full ML Lifecycle
- Experimentation & POCs
- Agentic AI & Orchestration
- RAG (Retrieval Augmented Generation)

### 📚 Built-In Guides
- **What it is**: Clear explanations of each component
- **Why choose**: Benefits and use cases
- **When to use**: Ideal scenarios
- **Best for**: Target audiences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Unit tests (workshop lib)

```bash
npm test
```

Covers pure helpers in `src/lib` (architecture flow clipboard text, reconcile rules, flow shape, decision patches). See `docs/V1_MANUAL_TEST_MATRIX.md` for manual smoke checks.

## 🎯 Usage

### Building a Stack

- **Architecture Tab**: Configure capabilities layer by layer
  - Green = Red Hat solutions
  - Blue = Customer solutions
  - Purple = Partner solutions

- **Interactive Builder**: Guided step-by-step configuration

- **Generate from Environment**: Create suggested stack from customer context

- **View Data Flow**: Technical architecture diagrams with component relationships

### Decision Guides

Navigate to the **Decision Guides** tab and follow the guided questions for personalized recommendations.

## 🛠️ Technology Stack

- React 19
- Vite
- Tailwind CSS v3
- Lucide React (icons)

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── CapabilityArchitectureView.jsx
│   ├── InteractiveBuilder.jsx
│   ├── FlowVisualization.jsx
│   ├── DecisionFlowchart.jsx
│   └── ...
├── data/            # Data definitions
│   ├── capabilities.js
│   ├── optionGuides.js
│   ├── subComponents.js
│   └── ...
└── App.jsx
```

## 🔑 Key Concepts

### Capability-Based Architecture
Focus on **capabilities** (e.g., "Model Serving") rather than forcing specific products. Choose your preferred provider:
- Red Hat solutions
- Customer-owned solutions  
- Partner solutions

### Layer Organization
- **Infrastructure**: Container platforms and accelerators
- **Platform**: AI/ML platforms and data storage
- **AI Services**: Sub-layered into base (serving), adjacent (registry, vector DB), wrapper (observability, governance), orchestration (MCP, evaluation)
- **Application**: API gateways, workflow orchestration, tools

## 📋 Roadmap & Development

**For contributors/developers:**

- **[Roadmap](docs/ROADMAP.md)** - V1 scope, V2 plans, future enhancements
- **[Manual Test Matrix](docs/V1_MANUAL_TEST_MATRIX.md)** - Smoke test checklist

---

## 📄 License

Provided as-is for demonstration and educational purposes.

## 🙏 Acknowledgments

Built to help navigate the Red Hat AI ecosystem.