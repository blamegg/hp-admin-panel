import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchBlogsFn, createBlogFn, updateBlogFn, deleteBlogFn, fetchBlogByIdFn, deleteBlogsBulkFn, deleteBlogsByStatusFn } from "@/utility/queryFetcher";

export interface Blog {
  _id: string;
  title: string;
  content: any;
  coverPage?: string;
  url?: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogState {
  blogs: Blog[];
  blog?: Blog | null;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
}

const initialState: BlogState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    title?: string;
    author?: string;
    status?: string;
    category?: string[];
    tag?: string[];
  }, { rejectWithValue }) => {
    try {
      const response = await fetchBlogsFn(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch blogs");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await createBlogFn(payload);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      return await updateBlogFn(id, payload);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteBlogFn(id);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to delete blog");
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchBlogByIdFn(id);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch blog");
    }
  }
);

// Bulk delete blogs by IDs
export const deleteBlogsBulk = createAsyncThunk(
  "blogs/deleteBlogsBulk",
  async (ids: string[], { rejectWithValue }) => {
    try {
      return await deleteBlogsBulkFn(ids);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Delete blogs by status
export const deleteBlogsByStatus = createAsyncThunk(
  "blogs/deleteBlogsByStatus",
  async (status: string, { rejectWithValue }) => {
    try {
      return await deleteBlogsByStatusFn(status);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);



const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        console.log("actions", action.payload)
        state.loading = false;
        state.blogs = action.payload.data.blogs || [];
        state.total = action.payload.data.pagination.total || 0;
        state.currentPage = action.payload.data.pagination.page || 1;
        state.limit = action.payload.data.pagination.limit || 10;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload.blog || null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default blogSlice.reducer; 