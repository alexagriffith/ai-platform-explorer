import { useState } from 'react';
import { Shield, Database, Package, Workflow, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function MCPEcosystemFull() {
  const [expandedCategory, setExpandedCategory] = useState('red-hat');

  const mcpServers = {
    'red-hat': {
      title: 'Red Hat',
      servers: [
        { name: 'OpenShift', description: 'Kubernetes cluster management and deployment automation' },
        { name: 'Ansible Automation Platform', description: 'Infrastructure and application automation' },
        { name: 'Insights', description: 'Proactive issue detection and remediation' }
      ]
    },
    'isv-partners': {
      title: 'Technology Partners',
      servers: [
        { name: 'Confluent Cloud', description: 'Apache Kafka managed streaming platform' },
        { name: 'EDB Postgres AI', description: 'Enterprise PostgreSQL with AI extensions' },
        { name: 'HashiCorp (Terraform)', description: 'Infrastructure as code and cloud provisioning' },
        { name: 'Microsoft Azure', description: 'Azure cloud services and resources' },
        { name: 'Dynatrace', description: 'Application performance monitoring and observability' },
        { name: 'Elastic', description: 'Search, observability, and security platform' }
      ]
    },
    'community': {
      title: 'Community',
      servers: [
        { name: 'MongoDB', description: 'Document database (stores JSON-like records)' },
        { name: 'MariaDB', description: 'Open source relational database' },
        { name: 'PostgreSQL', description: 'Advanced open source database' },
        { name: 'GitHub', description: 'Code repository and version control' },
        { name: 'GitLab', description: 'DevOps platform with built-in build and release automation' }
      ]
    }
  };

  const components = [
    {
      id: 'catalog',
      name: 'MCP Catalog',
      role: 'Discover • Browse • Launch',
      icon: Package,
      description: 'User-facing interface to discover, browse, and deploy MCP servers (Technology Preview)'
    },
    {
      id: 'lifecycle',
      name: 'Lifecycle Operator',
      role: 'Deploy • Configure • Update',
      icon: Workflow,
      description: 'Kubernetes operator managing MCP server lifecycle on OpenShift (Technology Preview)'
    },
    {
      id: 'gateway',
      name: 'MCP Gateway',
      role: 'Secure • Aggregate • Enforce',
      icon: Shield,
      description: 'Centralized access control, tool aggregation, and policy enforcement (Technology Preview)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header — no border on outer */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h2 className="text-2xl font-bold text-ink mb-1">
          The Model Context Protocol (MCP) Ecosystem on OpenShift AI
        </h2>
        <p className="text-muted text-sm mb-3">
          A platform approach for discovering, deploying, securing, and governing MCP servers
        </p>
        <p className="text-xs font-medium text-muted mb-3">
          Technology Preview — verify availability with your Red Hat account team
        </p>
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-link hover:text-accent transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          <ExternalLink size={13} />
          <span>MCP specification (modelcontextprotocol.io)</span>
        </a>
      </div>

      {/* Ingestion Pipeline — no border on outer, pipeline steps use tint */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-4">
          Ingestion Pipeline
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['Validate', 'Scan', 'Sign', 'Certify', 'Publish'].map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-card bg-tint text-ink font-medium text-sm">
                {stage}
              </div>
              {index < 4 && <div className="text-muted text-sm">→</div>}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted text-center mt-3">
          The planned ingestion workflow validates, scans, and signs MCP servers before publication — confirm certification status in product documentation.
        </p>
      </div>

      {/* Core Components — no border on outer, registry + components use tint */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-4">
          Core Platform Components
        </h3>

        {/* Registry at center — tint background, no border */}
        <div className="rounded-card bg-tint p-4 text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Database className="text-green-600" size={20} />
            <h4 className="text-base font-bold text-ink">
              MCP Registry
            </h4>
          </div>
          <p className="text-xs font-semibold text-muted mb-1">
            System of Record • Governance Backbone
          </p>
          <p className="text-xs text-muted">
            Central repository for all MCP server metadata, certification status, and governance
          </p>
          <div className="mt-2 inline-block rounded-full bg-page px-2.5 py-0.5 text-xs font-medium text-muted">
            System of record
          </div>
        </div>

        {/* Other components — tint, no border */}
        <div className="grid md:grid-cols-3 gap-4">
          {components.map((component) => {
            const Icon = component.icon;

            return (
              <div
                key={component.id}
                className="rounded-card bg-tint p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className="text-muted flex-shrink-0" />
                  <h4 className="font-bold text-ink text-sm">
                    {component.name}
                  </h4>
                </div>
                <p className="text-xs font-semibold text-muted mb-1">
                  {component.role}
                </p>
                <p className="text-xs text-muted">
                  {component.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t border-hair pt-3">
          <p className="text-sm text-ink">
            <strong>Registry role:</strong> The registry supplies metadata to the catalog, lifecycle operator, and gateway so components share one source of truth.
          </p>
        </div>
      </div>

      {/* AI assets section */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-1">
          AI assets, evaluation, and agents
        </h3>
        <p className="text-muted text-sm">
          Enterprise users consume governed MCP tools through OpenShift AI
        </p>
      </div>

      {/* Curated MCP Servers — disclosure, no border on cards */}
      <div className="rounded-card bg-surface px-6 py-5">
        <h3 className="text-lg font-bold text-ink mb-1">
          Curated MCP servers
        </h3>
        <p className="text-sm text-muted mb-4">
          Partner catalog expands over time; certification status belongs in product documentation.
        </p>

        <div className="space-y-2">
          {Object.entries(mcpServers).map(([key, category]) => {
            const isExpanded = expandedCategory === key;

            return (
              <div key={key}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : key)}
                  className="w-full rounded-card bg-tint px-4 py-2.5 flex items-center justify-between hover:bg-page transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                >
                  <h4 className="font-semibold text-ink text-sm">
                    {category.title} ({category.servers.length})
                  </h4>
                  {isExpanded ? (
                    <ChevronUp className="text-muted" size={16} />
                  ) : (
                    <ChevronDown className="text-muted" size={16} />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-4 divide-y divide-hair">
                    {category.servers.map((server, index) => (
                      <div
                        key={index}
                        className="py-2 flex items-start gap-3"
                      >
                        <div className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm text-ink">
                            {server.name}
                          </h5>
                          <p className="text-xs text-muted">
                            {server.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
