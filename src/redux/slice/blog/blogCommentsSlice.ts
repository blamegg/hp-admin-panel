import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchBlogCommentsFn, updateBlogCommentFn, deleteBlogCommentFn, addBlogCommentReplyFn, likeBlogCommentFn, dislikeBlogCommentFn, approveBlogCommentFn, rejectBlogCommentFn } from '@/utility/queryFetcher';

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
}

const initialState: BlogCommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchBlogComments = createAsyncThunk(
  "blogComments/fetchBlogComments",
  async ({ blogId, status }: { blogId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetchBlogCommentsFn(blogId, status);
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
      const response = await addBlogCommentReplyFn(blogId, commentId, content);
      return { commentId, reply: response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to add reply');
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

// Approve comment
export const approveBlogComment = createAsyncThunk(
  'blogComments/approveBlogComment',
  async ({ blogId, commentId }: { blogId: string; commentId: string }, { rejectWithValue }) => {
    try {
      const response = await approveBlogCommentFn(blogId, commentId);
      return { commentId, response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to approve comment');
    }
  }
);

// Reject comment
export const rejectBlogComment = createAsyncThunk(
  'blogComments/rejectBlogComment',
  async ({ blogId, commentId }: { blogId: string; commentId: string }, { rejectWithValue }) => {
    try {
      const response = await rejectBlogCommentFn(blogId, commentId);
      return { commentId, response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to reject comment');
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
        state.comments = action.payload;
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
              : { ...c, replies: updateComment(c.replies) }
          );
        }
        state.comments = updateComment(state.comments);
      })
      // Delete comment
      .addCase(deleteBlogComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        function deleteComment(comments: BlogComment[]): BlogComment[] {
          return comments.filter(c => c._id !== commentId).map(c => ({ ...c, replies: deleteComment(c.replies) }));
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
              : { ...c, replies: likeComment(c.replies) }
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
              : { ...c, replies: dislikeComment(c.replies) }
          );
        }
        state.comments = dislikeComment(state.comments);
      })
      // Approve comment
      .addCase(approveBlogComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        function approveComment(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, approved: true, rejected: false }
              : { ...c, replies: approveComment(c.replies) }
          );
        }
        state.comments = approveComment(state.comments);
      })
      // Reject comment
      .addCase(rejectBlogComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        function rejectComment(comments: BlogComment[]): BlogComment[] {
          return comments.map(c =>
            c._id === commentId
              ? { ...c, approved: false, rejected: true }
              : { ...c, replies: rejectComment(c.replies) }
          );
        }
        state.comments = rejectComment(state.comments);
      });
  },
});

export default blogCommentsSlice.reducer;
