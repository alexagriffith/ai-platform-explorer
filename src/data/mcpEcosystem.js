import { Shield, Package, Workflow } from 'lucide-react';

export const mcpServers = {
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

export const mcpEcosystemComponents = [
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
