'use client';

import React from 'react';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { Asset } from '../../types/asset';

interface AssetGridProps {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
  selectedAsset?: Asset | null;
  isLoading?: boolean;
}

const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  onSelect,
  selectedAsset,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
        <p className="text-gray-500">Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset._id}
          asset={asset}
          isSelected={selectedAsset?._id === asset._id}
          onSelect={() => onSelect(asset)}
        />
      ))}
    </div>
  );
};

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, isSelected, onSelect }) => {
  if (!asset || !asset._id || !asset.url) return null;
  const isImage = asset.mimetype?.startsWith('image/');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return (
    <div
      className={`relative group border cursor-pointer rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-primary shadow-lg'
          : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <CheckIcon className="text-primary bg-white rounded-full" />
        </div>
      )}

      {/* Asset Preview */}
      <div className="rounded-t-lg overflow-hidden h-[60px]  bg-gray-100">
        {isImage ? (
          <img
            src={`${baseUrl}/${asset.url.replace(/^\/+/,'')}`}
            alt={asset.originalName}
            className="w-full  object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Use a data URI SVG as fallback
              if (!target.src.startsWith('data:image/svg+xml')) {
                target.src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><rect width="120" height="90" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14">No Image</text></svg>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-4xl">📄</div>
          </div>
        )}
      </div>

      {/* Asset Info */}
      <div className="px-2 py-1">
        <h4 className="font-medium text-sm text-gray-900 truncate ">
          {asset.originalName}
        </h4>
        <div className="flex items-center justify-between text-[10px] 2xl:text-[12px] ">
          <span>{(asset.size / 1024).toFixed(1)} KB</span>
          <span className=''>{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : ''}</span>
        </div>
        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AssetGrid; 