'use client'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateBlogComment, deleteBlogComment, addBlogCommentReply, likeBlogComment, dislikeBlogComment, fetchBlogComments } from '@/redux/slice/blog/blogCommentsSlice';
import CommentItem from "./CommentItem";

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

const CommentList: React.FC<{ blogId: string }> = ({ blogId }) => {
  const dispatch = useDispatch();
  const { comments: reduxComments, loading, error } = useSelector((state: RootState) => state.blogComments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyValue, setReplyValue] = useState<string>("");


  useEffect(() => {
  if (blogId) {
    dispatch(fetchBlogComments(blogId));
  }
}, [dispatch, blogId]);

  console.log("reduxComments", reduxComments);
  // When edit is clicked
  const handleEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

  // When save is clicked
  const handleSave = (id: string) => {
    if (editValue.trim()) {
      dispatch(updateBlogComment({ blogId, commentId: id, content: editValue }));
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
    dispatch(deleteBlogComment({ blogId, commentId: id }));
  };

  // When reply is clicked
  const handleReply = (id: string) => {
    setReplyingId(id);
    setReplyValue("");
  };

  // When reply is submitted
  const handleReplySubmit = (id: string) => {
    if (replyValue.trim()) {
      dispatch(addBlogCommentReply({ blogId, commentId: id, content: replyValue }));
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
    dispatch(likeBlogComment({ blogId, commentId: id }));
  };

  // Dislike
  const handleDislike = (id: string) => {
    dispatch(dislikeBlogComment({ blogId, commentId: id }));
  };

  // Helper to render comments recursively
  function renderComment(comment: LocalComment, level = 0) {
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
      >
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-1">
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </CommentItem>
    );
  }

  return (
    <div className="flex flex-col gap-0 bg-white mb-5 pb-10">
      {loading && <div className="text-center py-2">Loading comments...</div>}
      {error && <div className="text-center py-2 text-danger">{error}</div>}
      {reduxComments.length === 0 && !loading && <div className="text-center py-2">No comments yet.</div>}
      {reduxComments.map(comment => renderComment(comment))}
    </div>
  );
};

export default CommentList; 