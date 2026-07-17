import { Shield, Lock, Eye, FileCheck, Users, Key } from 'lucide-react';

export const securityLayers = [
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
