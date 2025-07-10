'use client'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateBlogComment, deleteBlogComment, addBlogCommentReply, likeBlogComment, dislikeBlogComment, fetchBlogComments, approveBlogComment, rejectBlogComment } from '@/redux/slice/blog/blogCommentsSlice';
import CommentItem from "./CommentItem";
import { useParams } from 'next/navigation';
import { toast } from "sonner";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
  const { comments: reduxComments, loading, error } = useSelector((state: RootState) => state.blogComments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyValue, setReplyValue] = useState<string>("");
  const blogParams = useParams();
  const blogId = Array.isArray(blogParams.blogId) ? blogParams.blogId[0] : blogParams.blogId;
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected' | ''>('');

  console.log("comments", reduxComments);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogComments({ blogId, status: statusFilter }) as any);
    }
  }, [dispatch, blogId, statusFilter]);

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
    if (replyValue.trim()) {
      dispatch(addBlogCommentReply({ blogId, commentId: id, content: replyValue }) as any);
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


  // Helper to render comments recursively
  function renderComment(comment: LocalComment, level = 0) {
    const isExpanded = expandedReplies.has(comment._id);
    // Handler for dropdown actions

    const handleCommentStatus = async (action: 'approve' | 'reject') => {
      if (action === 'approve') {
        await dispatch(approveBlogComment({ blogId, commentId: comment._id }) as any);
        toast.success("Statu updated successfully")
        await dispatch(fetchBlogComments({ blogId, status: statusFilter }) as any);

      } else if (action === 'reject') {
        await dispatch(rejectBlogComment({ blogId, commentId: comment._id }) as any);
        toast.success("Statu updated successfully")
        await dispatch(fetchBlogComments({ blogId, status: statusFilter }) as any);

      }
    };


    return (
      <CommentItem
        key={comment._id}
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
        onToggleReplies={() => handleToggleReplies(comment._id)}
        handleCommentStatus={handleCommentStatus}
      >
        {comment.replies && comment.replies.length > 0 && isExpanded && (
          <div className="space-y-1">
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </CommentItem>
    );
  }

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  return (
    <div className="flex flex-col gap-0 bg-white md:py-6 md:px-20">
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
      {reduxComments.length === 0 && !loading && <div className="text-center py-2">No comments yet.</div>}
      <h2 className="font-bold md:text-xl">Comments</h2>
      {reduxComments?.map(comment => renderComment(comment))}
    </div>
  );
};

export default CommentList; 