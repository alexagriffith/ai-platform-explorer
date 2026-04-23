import { useState } from 'react';
import { Shield, Database, Package, Workflow, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function MCPEcosystemFull() {
  const [expandedCategory, setExpandedCategory] = useState('red-hat');

  const mcpServers = {
    'red-hat': {
      title: 'Red Hat',
      color: 'red',
      servers: [
        { name: 'OpenShift', description: 'Kubernetes cluster management and deployment automation' },
        { name: 'Ansible Automation Platform', description: 'Infrastructure and application automation' },
        { name: 'Insights', description: 'Proactive issue detection and remediation' }
      ]
    },
    'isv-partners': {
      title: 'Technology Partners',
      color: 'blue',
      servers: [
        { name: 'Confluent Cloud', description: 'Apache Kafka managed streaming platform' },
        { name: 'EDB Postgres® AI', description: 'Enterprise PostgreSQL with AI extensions' },
        { name: 'HashiCorp (Terraform)', description: 'Infrastructure as code and cloud provisioning' },
        { name: 'Microsoft Azure', description: 'Azure cloud services and resources' },
        { name: 'Dynatrace', description: 'Application performance monitoring and observability' },
        { name: 'Elastic', description: 'Search, observability, and security platform' }
      ]
    },
    'community': {
      title: 'Community',
      color: 'green',
      servers: [
        { name: 'MongoDB', description: 'NoSQL document database' },
        { name: 'MariaDB', description: 'Open source relational database' },
        { name: 'PostgreSQL', description: 'Advanced open source database' },
        { name: 'GitHub', description: 'Code repository and version control' },
        { name: 'GitLab', description: 'DevOps platform and CI/CD' }
      ]
    }
  };

  const components = [
    {
      id: 'registry',
      name: 'MCP Registry',
      role: 'System of Record',
      subtitle: 'Governance Backbone • Source of Truth',
      color: 'green',
      icon: Database,
      description: 'Central system of record for all MCP servers with governance and metadata management'
    },
    {
      id: 'catalog',
      name: 'MCP Catalog',
      role: 'Discover • Browse • Launch',
      color: 'blue',
      icon: Package,
      description: 'User-facing interface to discover, browse, and deploy MCP servers'
    },
    {
      id: 'lifecycle',
      name: 'Lifecycle Operator',
      role: 'Deploy • Configure • Update',
      color: 'yellow',
      icon: Workflow,
      description: 'Kubernetes operator managing MCP server lifecycle on OpenShift'
    },
    {
      id: 'gateway',
      name: 'MCP Gateway',
      role: 'Secure • Aggregate • Enforce',
      color: 'purple',
      icon: Shield,
      description: 'Centralized access control, tool aggregation, and policy enforcement'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-300 dark:border-red-700',
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-600'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-300 dark:border-blue-700',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-600'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-300 dark:border-green-700',
        text: 'text-green-700 dark:text-green-300',
        badge: 'bg-green-600'
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-300 dark:border-yellow-700',
        text: 'text-yellow-700 dark:text-yellow-300',
        badge: 'bg-yellow-600'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        border: 'border-purple-300 dark:border-purple-700',
        text: 'text-purple-700 dark:text-purple-300',
        badge: 'bg-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          The MCP Ecosystem on OpenShift AI
        </h2>
        <p className="text-purple-100 mb-4">
          A platform approach for discovering, deploying, securing, and governing MCP servers
        </p>
        <a
          href="https://solaius.github.io/ai-asset-registry/mcps/ecosystem/mcp-ecosystem.html#s=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <ExternalLink size={16} />
          <span className="text-sm font-medium">View Full MCP Ecosystem Guide</span>
        </a>
      </div>

      {/* Ingestion Pipeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Ingestion Pipeline
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['Validate', 'Scan', 'Sign', 'Certify', 'Publish'].map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 font-medium text-sm">
                {stage}
              </div>
              {index < 4 && <div className="text-gray-400">→</div>}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3">
          Every MCP server goes through security scanning and certification before being published
        </p>
      </div>

      {/* Core Components */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Core Platform Components
        </h3>

        {/* Registry at center */}
        <div className="mb-6">
          <div className={`border-2 ${getColorClasses('green').border} ${getColorClasses('green').bg} rounded-lg p-4 text-center`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Database className="text-green-600" size={24} />
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                MCP Registry
              </h4>
            </div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
              System of Record • Governance Backbone
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Central repository for all MCP server metadata, certification status, and governance
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
              SOURCE OF TRUTH
            </div>
          </div>
        </div>

        {/* Other components */}
        <div className="grid md:grid-cols-3 gap-4">
          {components.filter(c => c.id !== 'registry').map((component) => {
            const Icon = component.icon;
            const colors = getColorClasses(component.color);

            return (
              <div
                key={component.id}
                className={`border-2 ${colors.border} ${colors.bg} rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${colors.badge} text-white p-2 rounded-lg`}>
                    <Icon size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {component.name}
                  </h4>
                </div>
                <p className={`text-xs font-semibold ${colors.text} mb-2`}>
                  {component.role}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {component.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-purple-700 dark:text-purple-300">Feeds & Informs:</strong> The Registry feeds metadata to the Catalog, Lifecycle Operator, and Gateway - ensuring all components work from the same source of truth
          </p>
        </div>
      </div>

      {/* AI Assets + Playground + Agents */}
      <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">
          AI Assets • Playground • Agents
        </h3>
        <p className="text-green-100 text-sm">
          Enterprise users consume governed MCP tools through OpenShift AI
        </p>
      </div>

      {/* Ready-to-Use MCP Servers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Ready-to-Use MCP Servers
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ecosystem grows each release — partners onboard through Red Hat's certification pipeline
        </p>

        <div className="space-y-4">
          {Object.entries(mcpServers).map(([key, category]) => {
            const colors = getColorClasses(category.color);
            const isExpanded = expandedCategory === key;

            return (
              <div key={key} className={`border-2 ${colors.border} rounded-lg overflow-hidden`}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : key)}
                  className={`w-full ${colors.bg} p-4 flex items-center justify-between hover:opacity-80 transition-opacity`}
                >
                  <h4 className={`font-bold ${colors.text}`}>
                    {category.title} ({category.servers.length})
                  </h4>
                  {isExpanded ? (
                    <ChevronUp className={colors.text} size={20} />
                  ) : (
                    <ChevronDown className={colors.text} size={20} />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-gray-800 space-y-2">
                    {category.servers.map((server, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <div className={`w-2 h-2 ${colors.badge} rounded-full mt-1.5`}></div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {server.name}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
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
