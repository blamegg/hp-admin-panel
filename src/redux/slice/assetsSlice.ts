import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAssetsFn, uploadAssetFn, deleteAssetFn, updateAssetFn } from "@/utility/queryFetcher";
import { Asset, AssetSearchParams } from "@/types/asset";

export interface AssetsState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadError: string | null;
  searchParams: AssetSearchParams;
  totalCount: number;
  latestRequestId?: number;
}

const initialState: AssetsState = {
  assets: [],
  loading: false,
  error: null,
  uploading: false,
  uploadError: null,
  searchParams: {
    query: '',
    type: '',
    tags: [],
    page: 1,
    limit: 20
  },
  totalCount: 0
};

// Async thunks
export const fetchAssets = createAsyncThunk(
  "assets/fetchAssets",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await fetchAssetsFn(params);
      console.log("api", response)
      return { ...response, requestId: params.requestId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch assets");
    }
  }
);

export const uploadAsset = createAsyncThunk(
  "assets/uploadAsset",
  async (files: FileList, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('file', file);
      });

      const response = await uploadAssetFn(formData);
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to upload assets");
    }
  }
);

export const deleteAsset = createAsyncThunk(
  "assets/deleteAsset",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAssetFn(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to delete asset");
    }
  }
);

export const updateAsset = createAsyncThunk(
  "assets/updateAsset",
  async ({ id, payload }: { id: string; payload: Partial<Asset> }, { rejectWithValue }) => {
    try {
      const response = await updateAssetFn(id, payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update asset");
    }
  }
);

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<AssetSearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
      state.uploadError = null;
    },
    clearAssets: (state) => {
      state.assets = [];
      state.totalCount = 0;
    }
  },
  extraReducers: (builder) => {
    // Fetch assets
    builder
      .addCase(fetchAssets.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (action.meta && action.meta.arg && action.meta.arg.requestId) {
          state.latestRequestId = action.meta.arg.requestId;
        }
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        console.log("assets action", action);
        state.assets = action.payload.data.files;
        state.totalCount = action.payload.data.pagination.total;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload assets
    builder
      .addCase(uploadAsset.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadAsset.fulfilled, (state, action) => {
        state.uploading = false;
        console.log('Upload response:', action.payload);
        // Add new assets to the beginning of the list
        let newAssets = [];
        if (action.payload.data) {
          newAssets = Array.isArray(action.payload.data)
            ? action.payload.data.filter((asset: any) => asset && asset.id) // Filter out invalid assets
            : [action.payload.data].filter((asset: any) => asset && asset.id);
        }
        console.log('Filtered new assets:', newAssets);
        state.assets = [...newAssets, ...state.assets];
        state.totalCount += newAssets.length;
      })
      .addCase(uploadAsset.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload as string;
      });

    // Delete asset
    builder
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter(asset => asset.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
      });

    // Update asset
    builder
      .addCase(updateAsset.fulfilled, (state, action) => {
        const updatedAsset = action.payload.data;
        const index = state.assets.findIndex(asset => asset.id === updatedAsset.id);
        if (index !== -1) {
          state.assets[index] = updatedAsset;
        }
      });
  },
});

export const { setSearchParams, clearError, clearAssets } = assetsSlice.actions;
export default assetsSlice.reducer; 