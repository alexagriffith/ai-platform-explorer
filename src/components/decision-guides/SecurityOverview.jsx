import { Shield } from 'lucide-react';
import { typeScale, density, border, surface, text } from '../../lib/styleTokens';
import { securityLayers } from '../../data/securityLayers';

export default function SecurityOverview() {
  return (
    <div>
      <div data-ui="section-header" className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield className={`${text.muted} flex-shrink-0`} size={15} />
          <h3 className={`${typeScale.componentName} ${text.ink}`}>Enterprise Security & Governance</h3>
        </div>
        <p className={`${typeScale.secondary} ${text.muted}`}>
          Security building blocks for authentication, access control, and compliance
        </p>
      </div>

      <div className={`flex flex-wrap justify-center ${density.rowGap} mb-3`}>
        {securityLayers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <div key={index} data-ui="card" className={`flex-none w-full md:w-96 rounded-card ${surface.tint} overflow-hidden`}>
              {/* Header — hairline separator */}
              <div className={`border-b ${border.hair} px-3 py-2`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon size={13} className={`${text.muted} flex-shrink-0`} />
                  <h4 className={`${typeScale.secondary} font-bold ${text.ink}`}>{layer.name}</h4>
                </div>
                <p className={`${typeScale.meta} ${text.muted} pl-4`}>{layer.provider}</p>
              </div>

              {/* Content */}
              <div className="px-3 py-2">
                <ul className="space-y-1">
                  {layer.methods.map((method, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className={`text-accent mt-0.5 flex-shrink-0 ${typeScale.caption}`}>•</span>
                      <div className="flex-1">
                        <div className={`${typeScale.secondary} font-semibold ${text.ink}`}>{method.name}</div>
                        <div className={`${typeScale.meta} ${text.muted}`}>{method.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary — section divider, not a nested card */}
      <div data-ui="prose-list" className={`border-t ${border.hair} pt-3`}>
        <h4 className={`${typeScale.secondary} font-semibold ${text.ink} mb-1`}>Defense-in-Depth Strategy</h4>
        <p className={`${typeScale.secondary} ${text.muted}`}>
          Red Hat AI provides multiple layers of security from authentication at the gateway, through role-based access
          control in OpenShift, to governance and explainability with TrustyAI. Red Hat's supply chain practices include
          scanning and signing for Red Hat-shipped content; extend the same controls to your own models and assets
          before deployment.
        </p>
      </div>
    </div>
  );
}
