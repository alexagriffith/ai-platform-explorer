# Roadmap

## V1: Workshop Architecture Builder (Current)

**Goal:** Interactive tool for Red Hat AI workshop facilitators and customers to explore, discuss, and document platform architecture choices.

**What V1 includes:**

- **Build Your Stack** - Layer-by-layer architecture configuration with visual stack view
- **Interactive Builder** - Guided step-by-step capability selection
- **Decision Guides** - Flowchart-based product and architecture recommendations
- **Use Case Patterns** - Pre-configured reference architectures for common scenarios
- **Product Catalog** - Searchable Red Hat AI product reference
- **Generate from Environment** - Customer context capture with suggested stack
- **Data Flow Visualization** - Technical architecture diagrams showing component interactions
- **Export Capabilities** - PNG stack export and copyable text summaries

**Platform constraints:**
- OpenShift pairs with RHOAI/RHAIE
- Non-OpenShift Kubernetes pairs with RHAI
- RHEL bare metal/VMs pair with RHEL AI
- MCP and Llama Stack require OpenShift in current modeling

**Explicitly deferred from V1:**

- Live cluster integration / automated configuration
- URL sharing or cloud-based stack persistence
- SKU/pricing calculation
- Multi-user collaboration features
- Full export formats (JSON, Terraform, YAML)

## V2: Deployment Impact Explorer (Planned)

**Goal:** Technical deep-dive tool for understanding migration impact when changing deployment patterns.

**Planned features:**

- Before/after comparison for deployment changes (e.g., vLLM → KServe)
- Control plane vs data plane impact analysis
- Kubernetes resource definitions with clickable details
- Migration effort estimation
- Component dependency visualization

**Target use case:** Technical architects evaluating migration paths, not initial architecture design.

## Potential Future Enhancements

- **Constraint validation** - Check for incompatible component pairings
- **Custom component definitions** - Add customer-specific components to stack
- **Architecture templates** - Save and share complete stack configurations
- **Integration guides** - Step-by-step setup instructions for selected components
- **Cost modeling** - Rough infrastructure sizing and cost estimates

## Contributing

See project structure and development guides in main [README](../README.md).

## Testing

- Unit tests: `npm test` (covers `src/lib` helpers)
- Manual test matrix: [V1_MANUAL_TEST_MATRIX.md](V1_MANUAL_TEST_MATRIX.md)
