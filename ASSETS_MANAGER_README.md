# Assets Manager for Blog Editor

This document describes the custom Assets Manager that has been integrated into the blog editor to replace the default ReactQuill image handler.

## Features

### 🖼️ **Image Selection**
- Browse and select from previously uploaded images
- Search images by title or tags
- Visual grid layout with image previews
- Click to select functionality

### 📤 **File Upload**
- Drag and drop file upload
- Click to browse local files
- Support for multiple file formats (JPG, PNG, GIF, WebP)
- File size validation (max 10MB per file)
- Real-time upload progress

### 🔍 **Search & Filter**
- Search by image title
- Search by tags
- Real-time search with debouncing
- Clear visual feedback

### 🎨 **Modern UI**
- Responsive design
- Material-UI components
- Smooth animations and transitions
- Loading states and error handling

## Components Structure

```
src/components/AssetsManager/
├── AssetsManager.tsx    # Main modal component
├── AssetGrid.tsx        # Grid display for assets
├── UploadZone.tsx       # Drag & drop upload area
└── index.tsx           # Export file
```

## Usage

### In Blog Editor

The Assets Manager is automatically integrated into the BlogEditor component. When users click the image button in the toolbar, the Assets Manager modal opens.

```tsx
// The BlogEditor component automatically handles this
<BlogEditor
  value={content}
  onChange={setContent}
  error={errors.content?.message}
/>
```

### Standalone Usage

You can also use the Assets Manager as a standalone component:

```tsx
import { AssetsManager } from '@/components/AssetsManager';
import { Asset } from '@/types/asset';

const MyComponent = () => {
  const [showAssetsManager, setShowAssetsManager] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    // Handle the selected asset
  };

  return (
    <>
      <button onClick={() => setShowAssetsManager(true)}>
        Select Image
      </button>

      <AssetsManager
        open={showAssetsManager}
        onClose={() => setShowAssetsManager(false)}
        onSelect={handleAssetSelect}
        selectedAsset={selectedAsset}
      />
    </>
  );
};
```

## API Integration

The Assets Manager uses Redux for state management and includes the following API endpoints:

### Endpoints
- `GET /api/v1/assets` - Fetch assets with search/filter
- `POST /api/v1/assets` - Upload new assets
- `PUT /api/v1/assets/:id` - Update asset metadata
- `DELETE /api/v1/assets/:id` - Delete asset

### Redux Store
The assets state is managed in `src/redux/slice/assetsSlice.ts` with the following structure:

```typescript
interface AssetsState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadError: string | null;
  searchParams: AssetSearchParams;
  totalCount: number;
}
```

## Asset Type Definition

```typescript
interface Asset {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video' | 'file';
  size: string;
  uploadedAt: Date;
  tags: string[];
  description?: string;
  alt?: string;
  width?: number;
  height?: number;
}
```

## Testing

You can test the Assets Manager by visiting `/assets-test` in your application. This page provides a standalone test environment for the Assets Manager functionality.

## Customization

### Styling
The components use Tailwind CSS classes and can be customized by modifying the className props.

### File Types
To support additional file types, modify the `accept` prop in the UploadZone component:

```tsx
<UploadZone accept="image/*,video/*" maxSize={20}>
  {/* content */}
</UploadZone>
```

### Search Parameters
Customize search behavior by modifying the `AssetSearchParams` interface and the search logic in the AssetsManager component.

## Error Handling

The Assets Manager includes comprehensive error handling:
- File validation errors (type, size)
- Upload failures
- Network errors
- Search errors

All errors are displayed as toast notifications using the Sonner library.

## Performance Considerations

- Images are loaded lazily in the grid
- Search is debounced to prevent excessive API calls
- File uploads are handled in batches
- Redux state is optimized for large asset collections

## Browser Support

The Assets Manager supports all modern browsers with:
- Drag and drop file upload
- File API
- ES6+ features
- CSS Grid and Flexbox

## Future Enhancements

Potential improvements for future versions:
- Image editing capabilities
- Bulk operations (delete, tag, etc.)
- Advanced filtering (date range, file type)
- Image optimization
- CDN integration
- Folder organization 