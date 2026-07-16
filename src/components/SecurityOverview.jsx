import { Shield, Lock, Eye, FileCheck, Users, Key } from 'lucide-react';
import { typeScale, density } from '../lib/styleTokens';

export default function SecurityOverview() {
  const securityLayers = [
    {
      name: 'Authentication',
      icon: Key,
      provider: 'Red Hat Connectivity Link (Authorino)',
      methods: [
        { name: 'OAuth 2.0', description: 'Industry-standard authorization framework' },
        { name: 'OpenID Connect (OIDC)', description: 'Identity layer built on OAuth 2.0' },
        { name: 'API Keys', description: 'Simple token-based authentication' },
        { name: 'Mutual TLS (mTLS)', description: 'Certificate-based authentication in both directions' }
      ]
    },
    {
      name: 'Rate Limiting & Quotas',
      icon: Shield,
      provider: 'Kuadrant',
      methods: [
        { name: 'Per-User Limits', description: 'Individual user rate limiting' },
        { name: 'Tenant Quotas', description: 'Multi-tenant resource allocation' },
        { name: 'Token Budgets', description: 'Cost control per API key' },
        { name: 'Burst Protection', description: 'Smooth out sudden traffic spikes' }
      ]
    },
    {
      name: 'Access Control',
      icon: Lock,
      provider: 'OpenShift role-based access control (RBAC)',
      methods: [
        { name: 'Role-Based Access Control (RBAC)', description: 'Grant access based on user roles' },
        { name: 'Project-Level Permissions', description: 'Namespace isolation' },
        { name: 'Admin Controls', description: 'Administrative access management' },
        { name: 'Policy Enforcement', description: 'Centralized policy management' }
      ]
    },
    {
      name: 'Governance & Explainability',
      icon: Eye,
      provider: 'TrustyAI',
      methods: [
        { name: 'Bias Detection', description: 'Identify fairness issues' },
        { name: 'Explainability (LIME, SHAP)', description: 'Understand model decisions' },
        { name: 'Audit Trails', description: 'Detailed inference logging' },
        { name: 'Compliance Reporting', description: 'Regulatory documentation' }
      ]
    },
    {
      name: 'Model & Asset Security',
      icon: FileCheck,
      provider: 'Model Context Protocol (MCP) Ingestion Pipeline',
      methods: [
        { name: 'Vulnerability (CVE) Scanning', description: 'Detection of known vulnerabilities (Common Vulnerabilities and Exposures)' },
        { name: 'Cryptographic Signing', description: 'Trust and provenance' },
        { name: 'Certification', description: 'Red Hat trusted signatures' },
        { name: 'Malware Detection', description: 'Security scanning' }
      ]
    },
    {
      name: 'Multi-Tenancy',
      icon: Users,
      provider: 'OpenShift & AI Gateway',
      methods: [
        { name: 'Namespace Isolation', description: 'Hard tenant boundaries' },
        { name: 'Network Policies', description: 'Traffic segmentation' },
        { name: 'Resource Quotas', description: 'Fair resource allocation' },
        { name: 'Separate Billing', description: 'Usage tracking per tenant' }
      ]
    }
  ];

  return (
    <div className="rounded-card bg-surface px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="text-muted flex-shrink-0" size={15} />
        <h3 className={`${typeScale.componentName} text-ink`}>Enterprise Security & Governance</h3>
        <p className={`${typeScale.secondary} text-muted`}>Security building blocks for authentication, access control, and compliance</p>
      </div>

      {/* Security layers — no outer border cards, use tint + hairline header separator */}
      <div className={`grid md:grid-cols-3 ${density.rowGap} mb-2`}>
        {securityLayers.map((layer, index) => {
          const Icon = layer.icon;

          return (
            <div key={index} className="rounded-card bg-tint overflow-hidden">
              {/* Header — hairline separator, no full border */}
              <div className="border-b border-hair px-3 py-1.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon size={13} className="text-muted flex-shrink-0" />
                  <h4 className={`${typeScale.secondary} font-bold text-ink`}>{layer.name}</h4>
                </div>
                <p className={`${typeScale.meta} text-muted pl-4`}>{layer.provider}</p>
              </div>

              {/* Content */}
              <div className="px-3 py-1.5">
                <ul className="space-y-1">
                  {layer.methods.map((method, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-accent mt-0.5 flex-shrink-0 text-xs">•</span>
                      <div className="flex-1">
                        <div className={`${typeScale.secondary} font-semibold text-ink`}>{method.name}</div>
                        <div className={`${typeScale.meta} text-muted`}>{method.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary — tint strip, no border */}
      <div className="rounded-card bg-tint px-3 py-2">
        <h4 className={`${typeScale.secondary} font-semibold text-ink mb-0.5`}>Defense-in-Depth Strategy</h4>
        <p className={`${typeScale.secondary} text-muted`}>
          Red Hat AI provides multiple layers of security from authentication at the gateway, through role-based access
          control in OpenShift, to governance and explainability with TrustyAI. Red Hat's supply chain practices include
          scanning and signing for Red Hat-shipped content; extend the same controls to your own models and assets
          before deployment.
        </p>
      </div>
    </div>
  );
}
