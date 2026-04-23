import { useState } from 'react';
import { Info, ExternalLink, Users, Plus, X, Minus, ChevronRight, ZoomIn, ZoomOut, Layers as LayersIcon, Network } from 'lucide-react';
import { products, layers } from '../data/products';
import { componentDetails } from '../data/componentDetails';

export default function ArchitectureView({ selectedProducts, setSelectedProducts, customerEnv }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drilledComponent, setDrilledComponent] = useState(null);
  const [viewMode, setViewMode] = useState('layers'); // 'layers' or 'drilled'
  const [detailLevel, setDetailLevel] = useState(1); // 1: basic, 2: detailed, 3: technical

  const toggleProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product?.required) return;

    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const drillInto = (productId) => {
    setDrilledComponent(productId);
    setViewMode('drilled');
  };

  const drillOut = () => {
    setDrilledComponent(null);
    setViewMode('layers');
  };

  const getProductsByLayer = (layerId) => {
    return products.filter(p =>
      p.layer === layerId && selectedProducts.includes(p.id)
    );
  };

  const getAvailableProductsByLayer = (layerId) => {
    return products.filter(p =>
      p.layer === layerId && !selectedProducts.includes(p.id) && !p.required
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GA': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'Tech Preview': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case 'Dev Preview': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const ComponentBlock = ({ product, layerColor }) => {
    const isSelected = selectedProducts.includes(product.id);
    const canToggle = !product.required;
    const hasDetails = componentDetails[product.id];

    return (
      <div
        className={`relative group transition-all ${
          isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`p-3 rounded-lg border-2 shadow-md hover:shadow-xl transition-all cursor-pointer ${
            getStatusColor(product.status)
          }`}
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: layerColor
          }}
          onClick={() => hasDetails && detailLevel >= 2 ? drillInto(product.id) : setSelectedProduct(product)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">
                {product.name.replace('Red Hat ', '')}
              </h4>
              {product.required && (
                <span className="text-xs font-medium opacity-75">Core</span>
              )}
            </div>
            <div className="flex gap-1">
              {hasDetails && detailLevel >= 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    drillInto(product.id);
                  }}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="Drill down into components"
                >
                  <ZoomIn size={14} />
                </button>
              )}
              {canToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProduct(product.id);
                  }}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="Remove component"
                >
                  <Minus size={14} />
                </button>
              )}
            </div>
          </div>
          {detailLevel >= 2 && product.byoOption && (
            <div className="mt-1 text-xs flex items-center gap-1 opacity-75">
              <Info size={10} />
              <span>BYO Option</span>
            </div>
          )}
          {detailLevel >= 3 && hasDetails && (
            <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-75">
              {componentDetails[product.id].subComponents?.length || 0} sub-components
            </div>
          )}
        </div>
      </div>
    );
  };

  const AddComponentButton = ({ product, layerColor }) => (
    <button
      onClick={() => toggleProduct(product.id)}
      className="p-3 rounded-lg border-2 border-dashed hover:border-solid transition-all hover:shadow-md group"
      style={{ borderColor: layerColor + '80' }}
      title={`Add ${product.name}`}
    >
      <div className="flex items-center gap-2">
        <Plus size={14} className="opacity-50 group-hover:opacity-100" />
        <span className="text-xs font-medium opacity-50 group-hover:opacity-100 truncate">
          {product.name.replace('Red Hat ', '')}
        </span>
      </div>
    </button>
  );

  const DrilledView = () => {
    const product = products.find(p => p.id === drilledComponent);
    const details = componentDetails[drilledComponent];
    if (!product || !details) return null;

    return (
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={drillOut}
            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
          >
            <ZoomOut size={16} />
            Back to Stack View
          </button>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-900 dark:text-white font-semibold">{product.name}</span>
        </div>

        {/* Component Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-purple-100 mb-4">{product.description}</p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{product.category}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{product.status}</span>
          </div>
        </div>

        {/* Sub-components */}
        {details.subComponents && details.subComponents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LayersIcon size={20} />
              Internal Components
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {details.subComponents.map((subComp) => (
                <div
                  key={subComp.id}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">{subComp.name}</h4>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                      {subComp.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{subComp.description}</p>
                  {detailLevel >= 3 && subComp.techDetails && (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">TECHNICAL DETAILS:</div>
                      {subComp.techDetails.map((detail, i) => (
                        <div key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                          <span className="text-purple-600">•</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Infrastructure */}
        {detailLevel >= 3 && details.infrastructure && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Network size={20} />
              Infrastructure Requirements
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {details.infrastructure.map((infra, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{infra.type}</h4>
                  <ul className="space-y-1">
                    {infra.items.map((item, j) => (
                      <li key={j} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                        <span className="text-purple-600">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {detailLevel >= 2 && details.integrations && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Integrations</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {details.integrations.map((integration, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{integration.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{integration.purpose}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {viewMode === 'drilled' ? 'Component Deep Dive' : 'Architecture Stack View'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {viewMode === 'drilled'
                ? 'Exploring internal components and integrations'
                : 'Build your stack • Hover to add • Click to drill down'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Detail Level Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Detail Level:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(level => (
                  <button
                    key={level}
                    onClick={() => setDetailLevel(level)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      detailLevel === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title={level === 1 ? 'Basic' : level === 2 ? 'Detailed' : 'Technical'}
                  >
                    {level === 1 ? 'Basic' : level === 2 ? 'Detailed' : 'Technical'}
                  </button>
                ))}
              </div>
            </div>
            {/* Component Count */}
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {selectedProducts.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'drilled' ? (
        <DrilledView />
      ) : (
        /* Stack Diagram */
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto space-y-1">
            {[...layers].reverse().map((layer, index) => {
              const layerProducts = getProductsByLayer(layer.id);
              const availableProducts = getAvailableProductsByLayer(layer.id);
              const hasProducts = layerProducts.length > 0;

              return (
                <div
                  key={layer.id}
                  className="relative transition-all hover:scale-[1.01] hover:z-10"
                >
                  <div
                    className={`rounded-lg border-2 transition-all ${
                      hasProducts
                        ? 'bg-white dark:bg-gray-800 shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-dashed'
                    }`}
                    style={{
                      borderColor: layer.color + (hasProducts ? '' : '40')
                    }}
                  >
                    <div
                      className="px-4 py-3 flex items-center justify-between rounded-t-lg"
                      style={{
                        background: `linear-gradient(135deg, ${layer.color}15, ${layer.color}05)`,
                        borderBottom: hasProducts ? `2px solid ${layer.color}30` : 'none'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: layer.color }}
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {layer.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {layerProducts.length} active
                            {availableProducts.length > 0 && (
                              <span className="ml-2 opacity-60">
                                • {availableProducts.length} available
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: layer.color + '20',
                          color: layer.color
                        }}
                      >
                        L{4 - index}
                      </div>
                    </div>

                    <div className="p-4">
                      {hasProducts || availableProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {layerProducts.map(product => (
                            <ComponentBlock
                              key={product.id}
                              product={product}
                              layerColor={layer.color}
                            />
                          ))}
                          {availableProducts.map(product => (
                            <AddComponentButton
                              key={product.id}
                              product={product}
                              layerColor={layer.color}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                          No components available in this layer
                        </div>
                      )}
                    </div>
                  </div>

                  {index < layers.length - 1 && hasProducts && (
                    <div className="flex justify-center py-1">
                      <div
                        className="w-0.5 h-4"
                        style={{ backgroundColor: layer.color + '40' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
            <div className="flex items-center gap-2">
              <Plus size={12} />
              <span>Click dashed boxes to add</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomIn size={12} />
              <span>Drill down for details</span>
            </div>
            <div className="flex items-center gap-2">
              <Info size={12} />
              <span>Set detail level above</span>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && viewMode !== 'drilled' && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {selectedProduct.description}
            </p>

            {componentDetails[selectedProduct.id] && (
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  drillInto(selectedProduct.id);
                }}
                className="w-full mb-4 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <ZoomIn size={18} />
                Drill Down into Technical Components
              </button>
            )}

            {selectedProduct.useCases && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Use Cases</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {selectedProduct.useCases.map((useCase, i) => (
                    <li key={i}>{useCase}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedProduct.customerProfile && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Users size={18} />
                  Typical Customers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.customerProfile.map((profile, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      {profile}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.resources && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h4>
                <div className="space-y-2">
                  {selectedProduct.resources.docs && (
                    <a
                      href={selectedProduct.resources.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <ExternalLink size={16} />
                      Documentation
                    </a>
                  )}
                  {selectedProduct.resources.contacts && (
                    <div className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Contacts: </span>
                      {selectedProduct.resources.contacts.map((contact, i) => (
                        <span key={i} className="text-gray-600 dark:text-gray-400">
                          {contact}{i < selectedProduct.resources.contacts.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
