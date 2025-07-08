import React from "react";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level = 0 }) => {
  const marginLeft = level * 5; // indentation per level

  return (
    <div
      className={`pl-4 pt-3  ${level > 0 ? "border-gray-300" : "border-transparent"}`}
      style={{ marginLeft }}
    >
      <div className="flex items-center justify-between gap-5 bg-green-300 px-3 py-1  rounded-md shadow-sm">
        <p className="text-sm text-blue-800 font-medium">{comment.content}</p>
        <span className="text-xs text-gray-500 mt-[2px]">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>

      {/* Render replies recursively */}
      {comment.replies?.length > 0 && (
        <div className=" space-y-1">
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
