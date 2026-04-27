# Red Hat AI Platform Explorer

An interactive visualization tool for exploring and building Red Hat AI platform architectures. This tool helps customers, sales engineers, and architects understand how different Red Hat AI offerings work together and can be configured for various use cases.

**🌐 Live Site:** [https://alexagriffith.github.io/ai-platform-explorer/](https://alexagriffith.github.io/ai-platform-explorer/)

> **⚠️ Work In Progress:** This tool is actively being developed and improved. Content and features are subject to change.

## ✨ Features

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

## 🎯 Usage

### Building a Stack

1. **Architecture Tab**: Click on capability boxes to configure each layer
   - 🟢 Green boxes = Red Hat solutions (clickable for deep dive)
   - 🔵 Blue boxes = Customer-provided solutions
   - 🟣 Purple boxes = Partner/Other solutions

2. **Interactive Builder**: Step-by-step guided configuration
   - Click ❓ help icon next to each option to learn more
   - Progress through infrastructure → platform → services → application
   - Edit completed layers anytime

3. **View Data Flow**: See how your components interact
   - Click "See Data Flow" button after selecting components
   - Expand components to see internal architecture
   - Dark technical diagram with clear connections

### Using Decision Guides

1. Navigate to the **Use Cases** tab
2. Select a decision type (Product, Deployment, Architecture)
3. Answer questions to get personalized recommendations with tradeoffs

## 🛠️ Technology Stack

- React 18
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

## 📄 License

Provided as-is for demonstration and educational purposes.

## 🙏 Acknowledgments

Built to help navigate the Red Hat AI ecosystem.