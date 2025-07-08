import React from "react";
import CommentItem from "./CommentItem";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => (
  <div className="flex flex-col gap-0">
    {comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} />
    ))}
  </div>
);

export default CommentList; 