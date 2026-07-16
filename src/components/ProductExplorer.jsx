import { useState } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { products } from '../data/products';
import { text, surface, border, interactive, field, productStatus } from '../lib/styleTokens';

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
    <div data-tab="products" className="space-y-6">
      {/* Filters — flat section, no box container (inputs are boxed themselves) */}
      <div>
        <div className="mb-4">
          <h2 className={`text-xl font-bold ${text.ink}`}>Red Hat AI Product Catalog</h2>
          <p className={`text-sm ${text.muted} mt-1`}>Browse Red Hat AI portfolio components, maturity status, and documentation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 ${text.faint}`} size={18} />
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          return (
            <div
              key={product.id}
              className={`rounded-card border ${border.hair} ${surface.raised} hover:-translate-y-0.5 ${interactive.transitionAll}`}
            >
              <div className="p-6">
                <div className="mb-2">
                  <h3 className={`font-bold text-lg ${text.ink}`}>
                    {product.name}
                  </h3>
                </div>

                {/* Status and category — text-only, no bordered badges inside card */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${statusTextClass(product.status)}`}>
                    {product.status}
                  </span>
                  <span className={`text-xs ${text.faint}`}>
                    {product.category}
                  </span>
                </div>

                <p className={`text-sm ${text.muted} mb-4`}>
                  {product.description}
                </p>

                {product.useCases && (
                  <div className="mb-4">
                    <h4 className={`text-xs font-semibold ${text.faint} uppercase tracking-wide mb-2`}>
                      Use Cases
                    </h4>
                    <ul className={`text-xs ${text.muted} space-y-1`}>
                      {product.useCases.slice(0, 2).map((useCase, i) => (
                        <li key={i}>• {useCase}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.customerProfile && (
                  <div className="mb-4">
                    <h4 className={`text-xs font-semibold ${text.faint} uppercase tracking-wide mb-2`}>
                      Typical Users
                    </h4>
                    <p className={`text-xs ${text.muted}`}>
                      {product.customerProfile.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                )}

                {product.resources?.docs && (
                  <a
                    href={product.resources.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-sm text-link hover:underline ${interactive.transition} mt-2`}
                  >
                    <ExternalLink size={14} />
                    Documentation
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Filter size={48} className={`mx-auto ${text.faint} mb-3`} />
          <p className={text.muted}>No products match your filters</p>
        </div>
      )}
    </div>
  );
}
