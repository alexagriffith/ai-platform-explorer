import { CheckCircle, Shield, FileCheck, Upload, ArrowRight } from 'lucide-react';

export default function MCPIngestionPipeline() {
  const stages = [
    {
      id: 'validate',
      name: 'Validate',
      icon: FileCheck,
      color: 'blue',
      description: 'Verifies asset integrity and schema compliance',
      details: [
        'Schema validation',
        'Integrity checks',
        'Format verification',
        'Compatibility testing'
      ]
    },
    {
      id: 'scan',
      name: 'Scan',
      icon: Shield,
      color: 'yellow',
      description: 'Performs deep security scanning for vulnerabilities',
      details: [
        'CVE detection',
        'Malware scanning',
        'Dependency analysis',
        'Security audits'
      ]
    },
    {
      id: 'certify',
      name: 'Sign & Certify',
      icon: CheckCircle,
      color: 'green',
      description: 'Applies Red Hat trusted signatures for authenticity',
      details: [
        'Cryptographic signing',
        'Trust verification',
        'Certification tagging',
        'Provenance tracking'
      ]
    },
    {
      id: 'publish',
      name: 'Publish',
      icon: Upload,
      color: 'purple',
      description: 'Makes the certified asset available in the MCP Catalog',
      details: [
        'Catalog registration',
        'Metadata indexing',
        'RBAC application',
        'Availability notification'
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
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-700',
        icon: 'bg-green-600'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700',
        icon: 'bg-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        MCP Ecosystem Ingestion Pipeline
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Every MCP server and tool goes through a rigorous 4-stage process to ensure security and reliability
      </p>

      {/* Pipeline Visualization */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const colors = getColorClasses(stage.color);

          return (
            <div key={stage.id} className="relative">
              {/* Arrow between stages */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-2 z-10">
                  <ArrowRight className="text-gray-400" size={20} />
                </div>
              )}

              {/* Stage Card */}
              <div className={`border-2 ${colors.border} ${colors.bg} rounded-lg p-4 relative z-20`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${colors.icon} text-white p-2 rounded-lg`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      STAGE {index + 1}
                    </div>
                    <h4 className={`font-bold ${colors.text}`}>
                      {stage.name}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {stage.description}
                </p>
                <ul className="space-y-1">
                  {stage.details.map((detail, i) => (
                    <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <span className={colors.text}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Partner Servers */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          CERTIFIED PARTNER MCP SERVERS
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Confluent', 'MongoDB', 'Elastic', 'Azure', 'AWS', 'Google Cloud'].map(partner => (
            <span
              key={partner}
              className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700"
            >
              {partner}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          All partner servers go through the same rigorous validation process
        </p>
      </div>
    </div>
  );
}
