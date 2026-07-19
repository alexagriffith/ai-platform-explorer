import { useState } from 'react';
import { Database, GraduationCap } from 'lucide-react';
import RAGArchitecture from './RAGArchitecture';
import TrainingDeepDive from './TrainingDeepDive';
import { interactive, text, typeScale } from '../lib/styleTokens';

const BLUEPRINTS = [
  {
    id: 'rag',
    name: 'RAG Pipeline',
    icon: Database,
    blurb: 'Retrieval-augmented generation reference architecture',
  },
  {
    id: 'training',
    name: 'Training & Fine-Tuning',
    icon: GraduationCap,
    blurb: 'Build, train, and fine-tune models at enterprise scale',
  },
];

/**
 * Blueprints mode — shows ONE pre-composed reference architecture at a time.
 * Previously both blueprints rendered stacked on one endless scroll; a selector
 * keeps the page focused (orient -> decide -> prove) and uncluttered.
 */
export default function BlueprintsView() {
  const [active, setActive] = useState('rag');
  const current = BLUEPRINTS.find((b) => b.id === active) || BLUEPRINTS[0];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Choose a blueprint" className="inline-flex gap-1">
        {BLUEPRINTS.map((bp) => {
          const Icon = bp.icon;
          const on = bp.id === active;
          return (
            <button
              key={bp.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(bp.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-card ${typeScale.navTab} ${interactive.transition} ${interactive.focusRing} ${
                on ? 'bg-tint text-ink' : `${text.muted} ${interactive.hoverTint}`
              }`}
            >
              <Icon size={15} className="shrink-0" aria-hidden />
              {bp.name}
            </button>
          );
        })}
      </div>
      <p className={`${typeScale.caption} ${text.muted}`}>{current.blurb}</p>
      {active === 'rag' ? <RAGArchitecture /> : <TrainingDeepDive />}
    </div>
  );
}
