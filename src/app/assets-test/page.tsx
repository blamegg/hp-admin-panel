'use client';

import React, { useState } from 'react';
import { AssetsManager } from '@/components/AssetsManager';
import { Asset } from '@/types/asset';

const AssetsTestPage = () => {
  const [showAssetsManager, setShowAssetsManager] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    console.log('Selected asset:', asset);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Assets Manager Test</h1>
      
      <div className="mb-6">
        <button
          onClick={() => setShowAssetsManager(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Open Assets Manager
        </button>
      </div>

      {selectedAsset && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Selected Asset:</h2>
          <div className="flex items-center gap-4">
            <img 
              src={selectedAsset.url} 
              alt={selectedAsset.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p><strong>Title:</strong> {selectedAsset.title}</p>
              <p><strong>Type:</strong> {selectedAsset.type}</p>
              <p><strong>Size:</strong> {selectedAsset.size}</p>
              <p><strong>Uploaded:</strong> {selectedAsset.uploadedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      <AssetsManager
        open={showAssetsManager}
        onClose={() => setShowAssetsManager(false)}
        onSelect={handleAssetSelect}
        selectedAsset={selectedAsset}
      />
    </div>
  );
};

export default AssetsTestPage; 