import { useState } from 'react';
import { Layers, Shield, Package, GitBranch, CheckCircle2, ArrowRight, Users, ChevronRight } from 'lucide-react';

export default function MCPEcosystemView() {
  const [selectedSlide, setSelectedSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: 'The MCP Ecosystem on OpenShift AI',
      subtitle: 'A platform approach for discovering, deploying, securing, and governing MCP servers',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Red Hat's comprehensive platform for Model Context Protocol (MCP) server management
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Core Components</div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">10+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pre-loaded Servers</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3.4-3.6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">RHOAI Versions</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Package size={18} className="text-purple-600" />
                MCP Catalog
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Trusted storefront for discovering and launching MCP servers with one-click deployment
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers size={18} className="text-blue-600" />
                Lifecycle Operator
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Deploys and operates MCP servers as Kubernetes-native workloads
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield size={18} className="text-green-600" />
                MCP Gateway
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Secure control point for accessing and governing MCP tools
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <GitBranch size={18} className="text-orange-600" />
                MCP Registry
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                System of record for MCP server governance and lifecycle
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'MCP Catalog - Discovery',
      subtitle: 'Browse, filter, and deploy MCP servers with one click',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Curated MCP Server Marketplace</h3>
            <p className="text-purple-100">
              Pre-loaded with servers from Red Hat, technology partners, and community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white">Features</h4>
              <ul className="space-y-2">
                {['Browse by category', 'Filter by provider', 'Filter by capability', 'Trust tier filtering', 'One-click deployment'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white">Pre-loaded MCP Servers</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'OpenShift', provider: 'Red Hat', color: 'red' },
                  { name: 'Ansible', provider: 'Red Hat', color: 'red' },
                  { name: 'Insights', provider: 'Red Hat', color: 'red' },
                  { name: 'Confluent Cloud', provider: 'Partner', color: 'blue' },
                  { name: 'EDB Postgres AI', provider: 'Partner', color: 'blue' },
                  { name: 'HashiCorp Terraform', provider: 'Partner', color: 'blue' },
                  { name: 'Microsoft Azure', provider: 'Partner', color: 'blue' },
                  { name: 'Dynatrace', provider: 'Partner', color: 'blue' },
                  { name: 'MongoDB', provider: 'Community', color: 'green' },
                  { name: 'MariaDB', provider: 'Community', color: 'green' }
                ].map((server, i) => (
                  <div key={i} className={`px-3 py-2 rounded border text-sm ${
                    server.color === 'red' ? 'bg-red-50 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200' :
                    server.color === 'blue' ? 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200' :
                    'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200'
                  }`}>
                    <div className="font-semibold">{server.name}</div>
                    <div className="text-xs opacity-75">{server.provider}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Roadmap Status</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dev Preview (3.4)</strong> → <strong>Tech Preview (3.5)</strong> → <strong>GA (3.6)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'MCP Lifecycle Operator - Deployment',
      subtitle: 'Kubernetes-native management of MCP server workloads',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Declarative Deployment & Operations</h3>
            <p className="text-blue-100">
              Deploy MCP servers using MCPServer Custom Resource Definition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Key Features</h4>
              <div className="space-y-2">
                {[
                  { title: 'MCPServer CRD', desc: 'Declarative Kubernetes resource' },
                  { title: 'Automated Operations', desc: 'Services, configuration, connectivity' },
                  { title: 'Lifecycle Management', desc: 'Deployment, updates, rollbacks' },
                  { title: 'OpenShift Native', desc: 'Integrated with OpenShift platform' }
                ].map((feature, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{feature.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{feature.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Automated Operations</h4>
              <div className="space-y-3">
                {[
                  'Service creation and exposure',
                  'Configuration management',
                  'Network connectivity setup',
                  'Automated upgrades',
                  'Health monitoring',
                  'Resource scaling'
                ].map((op, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{op}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'MCP Gateway - Security & Control',
      subtitle: 'Centralized access control and policy enforcement',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Secure Control Point for MCP Tools</h3>
            <p className="text-green-100">
              Authentication, authorization, and observability for all MCP access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Access Control',
                icon: Shield,
                features: ['Authentication', 'Authorization', 'Policy enforcement', 'RBAC integration']
              },
              {
                title: 'Tool Aggregation',
                icon: Layers,
                features: ['Multiple backends', 'Unified interface', 'Load balancing', 'Failover handling']
              },
              {
                title: 'Observability',
                icon: CheckCircle2,
                features: ['Usage monitoring', 'Audit trails', 'Performance metrics', 'Compliance tracking']
              }
            ].map((section, i) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <section.icon size={20} className="text-green-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white">{section.title}</h4>
                </div>
                <ul className="space-y-2">
                  {section.features.map((feature, j) => (
                    <li key={j} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Roadmap Timeline</div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">Tech Preview (3.4)</span>
              <ChevronRight size={16} />
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">Tech Preview 2 (3.5)</span>
              <ChevronRight size={16} />
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded">GA (3.6)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'MCP Registry - Governance',
      subtitle: 'System of record for MCP server lifecycle and compliance',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Governance Backbone</h3>
            <p className="text-orange-100">
              Central metadata catalog with audit trails and certification tracking
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Core Capabilities</h4>
              <div className="space-y-2">
                {[
                  'Central metadata catalog',
                  'Server version tracking',
                  'Ownership management',
                  'Trust validation',
                  'Certification status',
                  'Audit trail logging'
                ].map((cap, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Lifecycle States</h4>
              <div className="space-y-2">
                {[
                  { state: 'Draft', desc: 'Initial development', color: 'gray' },
                  { state: 'Candidate', desc: 'Testing phase', color: 'yellow' },
                  { state: 'Published', desc: 'Production ready', color: 'green' },
                  { state: 'Deprecated', desc: 'Planned retirement', color: 'orange' },
                  { state: 'Retired', desc: 'No longer available', color: 'red' }
                ].map((lifecycle, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className={`w-3 h-3 rounded-full ${
                      lifecycle.color === 'gray' ? 'bg-gray-400' :
                      lifecycle.color === 'yellow' ? 'bg-yellow-400' :
                      lifecycle.color === 'green' ? 'bg-green-400' :
                      lifecycle.color === 'orange' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{lifecycle.state}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{lifecycle.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Availability</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Tech Preview (3.5)</strong> → <strong>GA (3.6)</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Ingestion Pipeline - Supply Chain Security',
      subtitle: 'Enterprise-grade validation and certification process',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Secure Supply Chain</h3>
            <p className="text-purple-100">
              Multi-stage validation ensuring trust and security
            </p>
          </div>

          <div className="flex items-center justify-between">
            {['Validate', 'Scan', 'Sign', 'Certify', 'Publish'].map((stage, i) => (
              <div key={i} className="flex items-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mb-2">
                    {i + 1}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">{stage}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {i === 0 && 'Schema & syntax'}
                    {i === 1 && 'Security CVE'}
                    {i === 2 && 'Cryptographic'}
                    {i === 3 && 'Quality check'}
                    {i === 4 && 'To registry'}
                  </div>
                </div>
                {i < 4 && (
                  <ArrowRight className="mx-2 text-gray-400" size={24} />
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Validation Checks</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Schema validation</li>
                <li>• Syntax verification</li>
                <li>• Dependency analysis</li>
                <li>• Compliance checks</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Security Scanning</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• CVE detection</li>
                <li>• Vulnerability assessment</li>
                <li>• Code analysis</li>
                <li>• License verification</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
            <div className="font-semibold text-gray-900 dark:text-white mb-2">Roadmap</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Tech Preview expected in RHOAI 3.6</strong>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          MCP Ecosystem on OpenShift AI
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Comprehensive platform for Model Context Protocol server management
        </p>

        {/* Slide Navigation */}
        <div className="flex flex-wrap gap-2">
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => setSelectedSlide(slide.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSlide === slide.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {slide.title.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h3 className="text-3xl font-bold mb-2">{slides[selectedSlide].title}</h3>
          <p className="text-purple-100">{slides[selectedSlide].subtitle}</p>
        </div>

        <div className="p-8">
          {slides[selectedSlide].content}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedSlide(Math.max(0, selectedSlide - 1))}
            disabled={selectedSlide === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Slide {selectedSlide + 1} of {slides.length}
          </div>

          <button
            onClick={() => setSelectedSlide(Math.min(slides.length - 1, selectedSlide + 1))}
            disabled={selectedSlide === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Peter Double, Principal Product Manager, Red Hat</p>
      </div>
    </div>
  );
}
