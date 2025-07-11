'use client'

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateBlogComment, deleteBlogComment, addBlogCommentReply, likeBlogComment, dislikeBlogComment, fetchBlogComments, fetchCommentReplies, loadMoreComments, updateBlogCommentStatus } from '@/redux/slice/blog/blogCommentsSlice';
import CommentItem from "./CommentItem";
import { useParams } from 'next/navigation';
import { toast } from "sonner";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomPagination from "@/components/CustomPagination";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}

interface LocalComment extends Omit<Comment, 'replies'> {
  likeCount: number;
  dislikeCount: number;
  replies: LocalComment[];
}



const CommentList: React.FC = () => {
  const dispatch = useDispatch();
  const { comments: blogComments, loading, error, total, currentPage: reduxPage, limit: reduxLimit, moreCommentsLoading, replies, repliesLoading, repliesPagination } = useSelector((state: RootState) => state.blogComments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyValue, setReplyValue] = useState<string>("");
  const blogParams = useParams();
  const blogId = Array.isArray(blogParams.blogId) ? blogParams.blogId[0] : blogParams.blogId;
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [repliesOpen, setRepliesOpen] = useState<{ [commentId: string]: boolean }>({});
  const [repliesPage, setRepliesPage] = useState<{ [commentId: string]: number }>({});

  useEffect(() => {
    console.log("comments", blogComments);
    console.log('replies', replies);
  }, [blogComments, replies]);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogComments({ blogId, status: statusFilter, page: currentPage, limit: rowsPerPage }) as any);
    }
  }, [dispatch, blogId, statusFilter, currentPage, rowsPerPage]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, blogId]);

  // When edit is clicked
  const handleEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
    setReplyingId(null); // Close reply if open
  };

  // When save is clicked
  const handleSave = (id: string) => {
    if (editValue.trim()) {
      dispatch(updateBlogComment({ blogId, commentId: id, content: editValue }) as any);
    }
    setEditingId(null);
    setEditValue("");
  };

  // When cancel is clicked
  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  // When delete is clicked
  const handleDelete = (id: string) => {
    dispatch(deleteBlogComment({ blogId, commentId: id }) as any);
  };

  // When reply is clicked
  const handleReply = (id: string) => {
    setReplyingId(id);
    setReplyValue("");
    setEditingId(null); // Close edit if open
  };

  // When reply is submitted
  const handleReplySubmit = (id: string) => {
    console.log("pId", id);
    if (replyValue.trim()) {
      dispatch(addBlogCommentReply({ blogId, commentId: id, content: replyValue }) as any)
        .then(() => {
          // After replying, fetch replies for this comment to update UI
          dispatch(fetchCommentReplies({ blogId, commentId: id, page: 1, status: statusFilter, limit: 3 }) as any);
        });
    }
    setReplyingId(null);
    setReplyValue("");
  };

  // When reply is cancelled
  const handleReplyCancel = () => {
    setReplyingId(null);
    setReplyValue("");
  };

  // Like
  const handleLike = (id: string) => {
    dispatch(likeBlogComment({ blogId, commentId: id }) as any);
  };

  // Dislike
  const handleDislike = (id: string) => {
    dispatch(dislikeBlogComment({ blogId, commentId: id }) as any);
  };

  const handleToggleReplies = (id: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };


  // Helper to render replies
  function renderReplies(commentId: string) {
    const replyList = replies[commentId] || [];
    const isLoading = repliesLoading[commentId];
    const pagination = repliesPagination[commentId] || { page: 1, hasNext: false };
    return (
      <div className="ml-8 mt-2">
        {isLoading && <div className="py-2 text-center text-gray-400">Loading replies...</div>}
        {replyList.map(reply => renderComment(reply, 1))}
        {pagination.hasNext && !isLoading && (
          <button
            className="mt-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm text-primary"
            onClick={() => {
              const nextPage = (pagination.page || 1) + 1;
              setRepliesPage(prev => ({ ...prev, [commentId]: nextPage }));
              dispatch(fetchCommentReplies({ blogId, commentId, page: nextPage, status: statusFilter, limit: 3 }) as any);
            }}
          >
            Load More Replies
          </button>
        )}
      </div>
    );
  }

  // Helper to render comments recursively (top-level only calls this for replies)
  function renderComment(comment: LocalComment, level = 0) {
    const isExpanded = expandedReplies.has(comment._id);
    const showReplies = repliesOpen[comment._id];
    // Handler for dropdown actions
    const handleCommentStatus = async (action: 'approve' | 'reject') => {
      const status = action === 'approve' ? 'Approved' : 'Rejected';
      await dispatch(updateBlogCommentStatus({ blogId, commentId: comment._id, status }) as any);
      toast.success('Status updated successfully');
      await dispatch(fetchBlogComments({ blogId, status: statusFilter }) as any);
    };
    return (
      <div key={comment._id} className="mb-4">
        <CommentItem
          comment={comment}
          level={level}
          isEditing={editingId === comment._id}
          editValue={editingId === comment._id ? editValue : comment.content}
          onEdit={() => handleEdit(comment._id, comment.content)}
          onEditValueChange={setEditValue}
          onSave={() => handleSave(comment._id)}
          onCancel={handleCancel}
          isReplying={replyingId === comment._id}
          replyValue={replyingId === comment._id ? replyValue : ""}
          onReply={() => handleReply(comment._id)}
          onReplyValueChange={setReplyValue}
          onReplySubmit={() => handleReplySubmit(comment._id)}
          onReplyCancel={handleReplyCancel}
          onDelete={() => handleDelete(comment._id)}
          onLike={() => handleLike(comment._id)}
          onDislike={() => handleDislike(comment._id)}
          isExpanded={isExpanded}
          handleCommentStatus={handleCommentStatus}
        />
        {/* Replies Button for all levels, only if there are replies or more can be loaded */}
        {(repliesPagination[comment._id]?.hasNext || (replies[comment._id] && replies[comment._id].length > 0)) && (
          <button
            className="ml-4 mt-1 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-sm text-blue-700"
            onClick={() => {
              if (!showReplies) {
                setRepliesOpen(prev => ({ ...prev, [comment._id]: true })); // Only open this one
              } else {
                setRepliesOpenRecursive(comment._id, false); // Recursively close all descendants
              }
            }}
          >
            {showReplies ? 'Hide Replies' : 'Replies'}
          </button>
        )}
        {/* Replies List - only show if open */}
        {showReplies && renderReplies(comment._id)}
      </div>
    );
  }

  // Add useEffect in main component to auto-fetch replies for all comments/replies
  useEffect(() => {
    function fetchRepliesRecursively(comments :any) {
      comments.forEach((comment: any) => {
        if (!replies[comment._id] || replies[comment._id].length === 0) {
          dispatch(fetchCommentReplies({ blogId, commentId: comment._id, page: 1, status: statusFilter, limit: 3 }) as any);
        }
        if (comment.replies && comment.replies.length > 0) {
          fetchRepliesRecursively(comment.replies);
        }
      });
    }
    if (blogComments && blogComments.length > 0) {
      fetchRepliesRecursively(blogComments);
    }
  }, [blogComments, replies, blogId, statusFilter]);

  // Helper to recursively set repliesOpen for all descendants
  function setRepliesOpenRecursive(commentId: string, open: boolean) {
    setRepliesOpen(prev => {
      const updated = { ...prev, [commentId]: open };
      const childReplies: LocalComment[] = replies[commentId] || [];
      childReplies.forEach((child: LocalComment) => {
        Object.assign(updated, setRepliesOpenRecursiveHelper(child._id, open));
      });
      return updated;
    });
  }
  function setRepliesOpenRecursiveHelper(commentId: string, open: boolean) {
    const updated = { [commentId]: open };
    const childReplies: LocalComment[] = replies[commentId] || [];
    childReplies.forEach((child: LocalComment) => {
      Object.assign(updated, setRepliesOpenRecursiveHelper(child._id, open));
    });
    return updated;
  }

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  return (
    <div className="flex min-h-screen flex-col gap-0 bg-white md:py-6 md:px-20">
      {blogComments.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6">
            {/* You can use a local SVG/PNG or emoji for illustration */}
            <span style={{ fontSize: 64, color: '#e0e7ef' }}>💬</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Comments</h2>
          <p className="text-gray-500 text-lg">There are no comments for this blog post yet.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <label className="font-medium">Filter by status:</label>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as '' | 'Pending' | 'Approved' | 'Rejected')}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem
                    key={status}
                    value={status === 'All' ? '' : status}
                  >
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {loading && <div className="text-center py-2">Loading comments...</div>}
          {error && <div className="text-center py-2 text-danger">{error}</div>}
          <h2 className="font-bold md:text-xl">Comments</h2>
          {blogComments.map(comment => renderComment(comment))}
          {/* Load More Button */}
          {total > blogComments.length && !loading && (
            <div className="flex justify-center mt-6">
              <button
                className="px-5 py-2 rounded bg-primary text-white hover:bg-primary/90 font-semibold text-base shadow"
                onClick={() => {
                  dispatch(loadMoreComments({ blogId, page: Math.floor(blogComments.length / rowsPerPage) + 1, limit: rowsPerPage, status: statusFilter }) as any);
                }}
                disabled={moreCommentsLoading}
              >
                {moreCommentsLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList; 