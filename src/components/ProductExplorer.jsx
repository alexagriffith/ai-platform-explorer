import { useState } from 'react';
import { Search, Filter, ExternalLink, Check } from 'lucide-react';
import { products } from '../data/products';

export default function ProductExplorer({ selectedProducts, setSelectedProducts }) {
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

  const toggleProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product?.required) return;

    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GA': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Tech Preview': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Dev Preview': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product Catalog</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="GA">GA</option>
            <option value="Tech Preview">Tech Preview</option>
            <option value="Dev Preview">Dev Preview</option>
          </select>

          <select
            value={filterLayer}
            onChange={(e) => setFilterLayer(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          const isSelected = selectedProducts.includes(product.id);
          const isRequired = product.required;

          return (
            <div
              key={product.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex-1">
                    {product.name}
                  </h3>
                  {!isRequired && (
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className={`p-2 rounded-full transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {product.category}
                  </span>
                  {isRequired && (
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-medium">
                      Required
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {product.description}
                </p>

                {product.useCases && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      USE CASES
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {product.useCases.slice(0, 2).map((useCase, i) => (
                        <li key={i}>• {useCase}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.customerProfile && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      TYPICAL USERS
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {product.customerProfile.slice(0, 2).map((profile, i) => (
                        <span key={i} className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                          {profile}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.resources?.docs && (
                  <a
                    href={product.resources.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
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
          <Filter size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No products match your filters</p>
        </div>
      )}
    </div>
  );
}
