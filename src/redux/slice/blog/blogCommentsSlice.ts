import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchBlogCommentsFn, updateBlogCommentFn, deleteBlogCommentFn, addBlogCommentReplyFn, likeBlogCommentFn, dislikeBlogCommentFn, approveBlogCommentFn, rejectBlogCommentFn, fetchCommentRepliesFn } from '@/utility/queryFetcher';

export interface BlogComment {
  _id: string;
  content: string;
  createdAt: string;
  replies: BlogComment[];
  likeCount: number;
  dislikeCount: number;
  author?: any;
}

export interface BlogCommentsState {
  comments: BlogComment[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  repliesLoading: { [commentId: string]: boolean };
  moreCommentsLoading: boolean;
  replies: { [commentId: string]: BlogComment[] };
  repliesPagination: { [commentId: string]: { page: number, hasNext: boolean } };
}

const initialState: BlogCommentsState = {
  comments: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 4,
  repliesLoading: {},
  moreCommentsLoading: false,
  replies: {},
  repliesPagination: {},
};

export const fetchBlogComments = createAsyncThunk(
  "blogComments/fetchBlogComments",
  async (
    { blogId, status, page = 1, limit = 4 }: { blogId: string; status?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchBlogCommentsFn(blogId, status, page, limit);
  console.log("api", response)

      return response;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch blog comments");
    }
  }
);

// Update comment
export const updateBlogComment = createAsyncThunk(
  'blogComments/updateBlogComment',
  async ({ blogId, commentId, content }: { blogId: string; commentId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await updateBlogCommentFn(blogId, commentId, content);
      return { commentId, content, response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update comment');
    }
  }
);

// Delete comment
export const deleteBlogComment = createAsyncThunk(
  'blogComments/deleteBlogComment',
  async ({ blogId, commentId }: { blogId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await deleteBlogCommentFn(blogId, commentId);
      return { commentId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete comment');
    }
  }
);

// Add reply
export const addBlogCommentReply = createAsyncThunk(
  'blogComments/addBlogCommentReply',
  async ({ blogId, commentId, content }: { blogId: string; commentId: string; content: string }, { rejectWithValue }) => {
    try {
      // Use the API utility function for replying to a top-level comment
      const data = await addBlogCommentReplyFn(blogId, commentId, content);
      console.log('Reply API response:', data);
      return { commentId, reply: data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to add reply');
    }
  }
);

// Fetch replies for a comment
export const fetchCommentReplies = createAsyncThunk(
  'blogComments/fetchCommentReplies',
  async (
    { blogId, commentId, page = 1, limit = 5, status = 'Approved' }: { blogId: string; commentId: string; page?: number; limit?: number; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchCommentRepliesFn(blogId, commentId, page, limit, status);
      console.log("Api check commment", data)
      return { commentId, data, page };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch replies');
    }
  }
);

// Like comment
export const likeBlogComment = createAsyncThunk(
  'blogComments/likeBlogComment',
  async ({ blogId, commentId }: { blogId: string; commentId: string }, { rejectWithValue }) => {
    try {
      const response = await likeBlogCommentFn(blogId, commentId);
      return { commentId, response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to like comment');
    }
  }
);

// Dislike comment
export const dislikeBlogComment = createAsyncThunk(
  'blogComments/dislikeBlogComment',
  async ({ blogId, commentId }: { blogId: string; commentId: string }, { rejectWithValue }) => {
    try {
      const response = await dislikeBlogCommentFn(blogId, commentId);
      return { commentId, response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to dislike comment');
    }
  }
);

// Combined approve/reject comment thunk
export const updateBlogCommentStatus = createAsyncThunk(
  'blogComments/updateBlogCommentStatus',
  async (
    { blogId, commentId, status }: { blogId: string; commentId: string; status: 'Approved' | 'Rejected' },
    { rejectWithValue }
  ) => {
    try {
      // Use the approve or reject API based on status
      const response = await (status === 'Approved'
        ? approveBlogCommentFn(blogId, commentId)
        : rejectBlogCommentFn(blogId, commentId));
      return { commentId, status, response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || `Failed to update comment status to ${status}`);
    }
  }
);


// Load more top-level comments
export const loadMoreComments = createAsyncThunk(
  'blogComments/loadMoreComments',
  async ({ blogId, page = 1, limit = 4, status }: { blogId: string; page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await fetchBlogCommentsFn(blogId, status, page, limit);
      return { data: response.data, pagination: response.pagination, page };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load more comments');
    }
  }
);

const blogCommentsSlice = createSlice({
  name: "blogComments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogComments.fulfilled, (state, action) => {
        state.loading = false;
        console.log("api", action.payload)
        state.comments = action.payload.data || [];
        state.total = action.payload.pagination?.total || 0;
        state.currentPage = action.payload.pagination?.page || 1;
        state.limit = action.payload.pagination?.limit || 4;
      })
      .addCase(fetchBlogComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update comment
      .addCase(updateBlogComment.fulfilled, (state, action) => {
        const { commentId, content } = action.payload;
        function updateComment(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, content }
              : { ...c, replies: updateComment(c.replies || []) }
          );
        }
        state.comments = updateComment(state.comments);
      })
      // Delete comment
      .addCase(deleteBlogComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        function deleteComment(comments: BlogComment[]): BlogComment[] {
          return comments.filter(c => c._id !== commentId).map(c => ({ ...c, replies: deleteComment(c.replies || []) }));
        }
        state.comments = deleteComment(state.comments);
      })
      // Add reply
      .addCase(addBlogCommentReply.fulfilled, (state, action) => {
        const { commentId, reply } = action.payload;
        function addReply(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, replies: [...(c.replies || []), reply] }
              : { ...c, replies: addReply(c.replies || []) }
          );
        }
        state.comments = addReply(state.comments);
      })
      // Like comment
      .addCase(likeBlogComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        function likeComment(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, likeCount: (c.likeCount || 0) + 1 }
              : { ...c, replies: likeComment(c.replies || []) }
          );
        }
        state.comments = likeComment(state.comments);
      })
      // Dislike comment
      .addCase(dislikeBlogComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        function dislikeComment(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, dislikeCount: (c.dislikeCount || 0) + 1 }
              : { ...c, replies: dislikeComment(c.replies || []) }
          );
        }
        state.comments = dislikeComment(state.comments);
      })
      // Approve/Reject comment (combined)
      .addCase(updateBlogCommentStatus.fulfilled, (state, action) => {
        const { commentId, status } = action.payload;
        function updateStatus(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, approved: status === 'Approved', rejected: status === 'Rejected' }
              : { ...c, replies: updateStatus(c.replies || []) }
          );
        }
        state.comments = updateStatus(state.comments);
      })
      // fetchCommentReplies
      .addCase(fetchCommentReplies.pending, (state, action) => {
        const { commentId } = action.meta.arg;
        state.repliesLoading[commentId] = true;
      })
      .addCase(fetchCommentReplies.fulfilled, (state, action) => {
        const { commentId, data, page } = action.payload;
        state.repliesLoading[commentId] = false;
        if (!state.replies[commentId] || page === 1) {
          state.replies[commentId] = data.data || [];
        } else {
          state.replies[commentId] = [...state.replies[commentId], ...(data.data || [])];
        }
        state.repliesPagination[commentId] = {
          page,
          hasNext: data.pagination?.hasNext || false,
        };
      })
      .addCase(fetchCommentReplies.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        state.repliesLoading[commentId] = false;
      })
      // loadMoreComments
      .addCase(loadMoreComments.pending, (state) => {
        state.moreCommentsLoading = true;
      })
      .addCase(loadMoreComments.fulfilled, (state, action) => {
        state.moreCommentsLoading = false;
        if (action.payload.page > 1) {
          state.comments = [...state.comments, ...(action.payload.data || [])];
        } else {
          state.comments = action.payload.data || [];
        }
        state.total = action.payload.pagination?.total || 0;
        state.currentPage = action.payload.pagination?.page || 1;
        state.limit = action.payload.pagination?.limit || 4;
      })
      .addCase(loadMoreComments.rejected, (state) => {
        state.moreCommentsLoading = false;
      });
  },
});

export default blogCommentsSlice.reducer;
