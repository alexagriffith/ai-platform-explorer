import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { products } from '../data/products';
import { text, surface, border, interactive, field, productStatus, density, typeScale } from '../lib/styleTokens';

function statusTextClass(s) {
  return productStatus[s] ?? 'text-faint';
}

export default function ProductExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLayer, setFilterLayer] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesLayer = filterLayer === 'all' || product.layer === filterLayer;

    return matchesSearch && matchesStatus && matchesLayer;
  });

  return (
    <div data-tab="products" className={density.stackGap}>
      {/* Filters — flat section, no box container (inputs are boxed themselves) */}
      <div>
        <div className="mb-2">
          <h2 className={`${typeScale.componentName} ${text.ink}`}>Red Hat AI Product Catalog</h2>
          <p className={`${typeScale.secondary} ${text.muted} mt-0.5`}>Browse Red Hat AI portfolio components, maturity status, and documentation</p>
        </div>

        <div className={`grid md:grid-cols-3 ${density.rowGap}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 ${text.faint}`} size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${field.input} pl-9`}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={field.input}
          >
            <option value="all">All Status</option>
            <option value="GA">GA</option>
            <option value="Tech Preview">Tech Preview</option>
            <option value="Dev Preview">Dev Preview</option>
          </select>

          <select
            value={filterLayer}
            onChange={(e) => setFilterLayer(e.target.value)}
            className={field.input}
          >
            <option value="all">All Layers</option>
            <option value="application">Application</option>
            <option value="services">AI Services</option>
            <option value="platform">Platform</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${density.rowGap}`}>
        {filteredProducts.map(product => {
          return (
            <div
              key={product.id}
              className={`rounded-card border ${border.hair} ${surface.raised} hover:-translate-y-0.5 ${interactive.transitionAll}`}
            >
              <div className={density.sectionPad}>
                <div className="mb-1 text-center">
                  <h3 className={`${typeScale.componentName} ${text.ink}`}>
                    {product.name}
                  </h3>
                </div>

                {/* Status and category — text-only, no bordered badges inside card */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <span className={`${typeScale.meta} font-semibold uppercase tracking-wide ${statusTextClass(product.status)}`}>
                    {product.status}
                  </span>
                  <span className={`${typeScale.meta} ${text.faint}`}>
                    {product.category}
                  </span>
                </div>

                <p className={`${typeScale.secondary} ${text.muted} mb-2`}>
                  {product.description}
                </p>

                {product.useCases && (
                  <div className="mb-2">
                    <h4 className={`${typeScale.meta} font-semibold ${text.faint} uppercase tracking-wide mb-1`}>
                      Use Cases
                    </h4>
                    <ul className={`${typeScale.secondary} ${text.muted} space-y-0.5`}>
                      {product.useCases.slice(0, 2).map((useCase, i) => (
                        <li key={i}>• {useCase}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.customerProfile && (
                  <div className="mb-2">
                    <h4 className={`${typeScale.meta} font-semibold ${text.faint} uppercase tracking-wide mb-1`}>
                      Typical Users
                    </h4>
                    <p className={`${typeScale.secondary} ${text.muted}`}>
                      {product.customerProfile.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                )}

                {product.resources?.docs && (
                  <a
                    href={product.resources.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 ${typeScale.secondary} text-link hover:underline ${interactive.transition} ${interactive.focusRing} mt-1`}
                  >
                    Documentation
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <Filter size={36} className={`mx-auto ${text.faint} mb-2`} />
          <p className={`${typeScale.secondary} ${text.muted}`}>No products match your filters</p>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterLayer('all'); }}
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card border border-edge text-sm font-medium ${text.ink} hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page transition-colors duration-150 ease-out motion-reduce:transition-none`}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
