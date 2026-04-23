import { Shield, Lock, Eye, FileCheck, Users, Key } from 'lucide-react';

export default function SecurityOverview() {
  const securityLayers = [
    {
      name: 'Authentication',
      icon: Key,
      color: 'blue',
      provider: 'Red Hat Connectivity Link (Authorino)',
      methods: [
        { name: 'OAuth 2.0', description: 'Industry-standard authorization framework' },
        { name: 'OIDC', description: 'OpenID Connect identity layer' },
        { name: 'API Keys', description: 'Simple token-based authentication' },
        { name: 'mTLS', description: 'Mutual TLS certificate-based auth' }
      ]
    },
    {
      name: 'Rate Limiting & Quotas',
      icon: Shield,
      color: 'yellow',
      provider: 'Kuadrant',
      methods: [
        { name: 'Per-User Limits', description: 'Individual user rate limiting' },
        { name: 'Tenant Quotas', description: 'Multi-tenant resource allocation' },
        { name: 'Token Budgets', description: 'Cost control per API key' },
        { name: 'Burst Protection', description: 'Prevent traffic spikes' }
      ]
    },
    {
      name: 'Access Control',
      icon: Lock,
      color: 'purple',
      provider: 'OpenShift RBAC',
      methods: [
        { name: 'RBAC', description: 'Role-Based Access Control' },
        { name: 'Project-Level Permissions', description: 'Namespace isolation' },
        { name: 'Admin Controls', description: 'Administrative access management' },
        { name: 'Policy Enforcement', description: 'Centralized policy management' }
      ]
    },
    {
      name: 'Governance & Explainability',
      icon: Eye,
      color: 'green',
      provider: 'TrustyAI',
      methods: [
        { name: 'Bias Detection', description: 'Identify fairness issues' },
        { name: 'Explainability (LIME, SHAP)', description: 'Understand model decisions' },
        { name: 'Audit Trails', description: 'Complete inference logging' },
        { name: 'Compliance Reporting', description: 'Regulatory documentation' }
      ]
    },
    {
      name: 'Model & Asset Security',
      icon: FileCheck,
      color: 'red',
      provider: 'MCP Ingestion Pipeline',
      methods: [
        { name: 'CVE Scanning', description: 'Vulnerability detection' },
        { name: 'Cryptographic Signing', description: 'Trust and provenance' },
        { name: 'Certification', description: 'Red Hat trusted signatures' },
        { name: 'Malware Detection', description: 'Security scanning' }
      ]
    },
    {
      name: 'Multi-Tenancy',
      icon: Users,
      color: 'indigo',
      provider: 'OpenShift & AI Gateway',
      methods: [
        { name: 'Namespace Isolation', description: 'Hard tenant boundaries' },
        { name: 'Network Policies', description: 'Traffic segmentation' },
        { name: 'Resource Quotas', description: 'Fair resource allocation' },
        { name: 'Separate Billing', description: 'Usage tracking per tenant' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700',
        icon: 'bg-blue-600'
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-300 dark:border-yellow-700',
        icon: 'bg-yellow-600'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700',
        icon: 'bg-purple-600'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-700',
        icon: 'bg-green-600'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-300 dark:border-red-700',
        icon: 'bg-red-600'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-300 dark:border-indigo-700',
        icon: 'bg-indigo-600'
      }
    };
    return colors[color];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-purple-600" size={28} />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Enterprise Security & Governance
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive security across authentication, access control, and compliance
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {securityLayers.map((layer, index) => {
          const Icon = layer.icon;
          const colors = getColorClasses(layer.color);

          return (
            <div
              key={index}
              className={`border-2 ${colors.border} rounded-lg overflow-hidden`}
            >
              {/* Header */}
              <div className={`${colors.bg} p-4 border-b-2 ${colors.border}`}>
                <div className="flex items-center gap-3 mb-1">
                  <div className={`${colors.icon} text-white p-2 rounded-lg`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${colors.text}`}>
                      {layer.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {layer.provider}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <ul className="space-y-2">
                  {layer.methods.map((method, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`${colors.text} mt-1`}>•</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {method.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {method.description}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Defense-in-Depth Strategy
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Red Hat AI provides multiple layers of security from authentication at the gateway, through RBAC in OpenShift,
          to governance and explainability with TrustyAI. Every asset is scanned, signed, and certified before deployment.
        </p>
      </div>
    </div>
  );
}
