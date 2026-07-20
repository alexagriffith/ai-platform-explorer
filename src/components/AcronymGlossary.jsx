import { useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { glossary } from '../data/glossary';
import { field, interactive, modal, text, typeScale } from '../lib/styleTokens';

/**
 * AcronymGlossary modal. Controlled by the caller:
 *   isOpen   — whether the modal is visible
 *   onClose  — called when the user dismisses the modal
 *
 * Content lives in src/data/glossary.js — this component only renders and filters.
 */
export default function AcronymGlossary({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGlossary = (glossary ?? []).filter(item =>
    item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div data-ui="overlay" data-acronym-glossary="true" className={modal.overlay}>
      <div data-ui="card" className={`${modal.panel} ${modal.panelWide} overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={modal.header}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen size={28} className="text-accent" />
              <h2 className={`${typeScale.pageTitle} ${text.ink}`}>Acronym Glossary</h2>
            </div>
            <button
              onClick={onClose}
              className={`rounded-card p-2 ${interactive.hoverTint} ${interactive.transition} ${interactive.focusRing}`}
            >
              <X size={24} />
            </button>
          </div>
          <p className={text.muted}>
            Plain English explanations of Red Hat AI terminology
          </p>
        </div>

        {/* Search */}
        <div className="border-b border-hair p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.faint}`} size={20} />
            <input
              type="text"
              placeholder="Search acronyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${field.input} pl-10`}
            />
          </div>
        </div>

        {/* Glossary Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-tint">
              <tr>
                <th className={`px-6 py-3 text-left ${typeScale.tableHeader} ${text.muted}`}>
                  Acronym
                </th>
                <th className={`px-6 py-3 text-left ${typeScale.tableHeader} ${text.muted}`}>
                  Full Name
                </th>
                <th className={`px-6 py-3 text-left ${typeScale.tableHeader} ${text.muted}`}>
                  What It Means
                </th>
                <th className={`px-6 py-3 text-left ${typeScale.tableHeader} ${text.muted}`}>
                  When to Use
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {filteredGlossary.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-tint ${interactive.transition}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${typeScale.componentName} text-link`}>
                      {item.acronym}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${typeScale.bodyStrong} ${text.ink}`}>
                      {item.fullName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${typeScale.body} ${text.muted}`}>
                      {item.explanation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${typeScale.body} ${text.muted}`}>
                      {item.whenToUse}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGlossary.length === 0 && (
            <div className={`py-12 text-center ${text.faint}`}>
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t border-hair bg-tint p-4 text-center ${typeScale.body} ${text.muted}`}>
          {filteredGlossary.length} {filteredGlossary.length === 1 ? 'term' : 'terms'} displayed
        </div>
      </div>
    </div>
  );
}
