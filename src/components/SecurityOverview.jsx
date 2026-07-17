import { Shield } from 'lucide-react';
import { typeScale, density } from '../lib/styleTokens';
import { securityLayers } from '../data/securityLayers';

export default function SecurityOverview() {
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
