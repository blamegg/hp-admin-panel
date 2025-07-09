
import React, { useRef, useState, useEffect } from "react";
import BlogProfile from "../../assets/blog/blogProfile.png"
import Image from "next/image";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbMessageFilled } from "react-icons/tb";
import Button from "../common/Button";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  replies: Comment[];
  likeCount: number;
  dislikeCount: number;
}

interface CommentItemProps {
  comment: Comment;
  level?: number;
  isEditing?: boolean;
  editValue?: string;
  onEdit?: () => void;
  onEditValueChange?: (v: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  isReplying?: boolean;
  replyValue?: string;
  onReply?: () => void;
  onReplyValueChange?: (v: string) => void;
  onReplySubmit?: () => void;
  onReplyCancel?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level = 0, isEditing: controlledEditing, editValue: controlledEditValue, onEdit, onEditValueChange, onSave, onCancel, children, isReplying, replyValue, onReply, onReplyValueChange, onReplySubmit, onReplyCancel, onDelete, onLike, onDislike }) => {
  const marginLeft = level * 5; // indentation per level
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Use controlled props if provided
  const editing = controlledEditing !== undefined ? controlledEditing : isEditing;
  const value = controlledEditValue !== undefined ? controlledEditValue : editValue;
  const setEditing = controlledEditing !== undefined ? (v: boolean) => { if (!v && onCancel) onCancel(); else if (v && onEdit) onEdit(); } : setIsEditing;
  const setValue = onEditValueChange || setEditValue;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Decide dropdown direction on open
  const handleDropdownToggle = () => {
    if (!dropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Assume dropdown height ~150px
      if (spaceBelow < 160 && spaceAbove > spaceBelow) {
        setDropdownDirection('up');
      } else {
        setDropdownDirection('down');
      }
    }
    setDropdownOpen((open) => !open);
  };

  console.log("comment line 89", comment);

  return (
    <div
      className={`pl-4 pt-3  ${level > 0 ? "border-gray-300" : "border-transparent"}`}
      style={{ marginLeft }}
    >
      <div className="flex items-center justify-start gap-3">
        <div className="w-[40px] h-[40px] rounded-full p-1 border-2 border-primary ">
          <Image src={BlogProfile} alt="👤" className="rounded-full" />
        </div>
        <div className="font-bold text-back text-sm">User Name</div>
        <div className="text-xs text-gray-500 mt-[2px]">{new Date(comment.createdAt).toLocaleString()}</div>
      </div>
      <div className=" ps-13 pb-1 rounded-md shadow-sm ">
        <div className="flex items-center justify-between gap-5  py-1  ">
          <p className="text-sm text-black font-medium w-full">
            {editing ? (
              <div className="flex items-center gap-3 pr-3">
                <input
                  className="px-2 py-1 text-sm w-full border-b border-graydark/20 rounded-l outline-0"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button
                  type="submit"
                  name="Save"
                    className="px-2 py-1 bg-success text-white rounded text-xs"
                    onClick={() => { setEditing(false); if (onSave) onSave(); }}
                  ></Button>
                  <Button
                  type="button"
                  name="Cancel"
                    className="px-2 py-1 bg-graydark  rounded text-xs"
                    onClick={() => { setEditing(false); if (onCancel) onCancel(); }}
                  ></Button>
                </div>
              </div>
            ) : (
              value
            )}
          </p>
        </div>
        {/* Actions like: likes,  dislikes, reply */}
        <div className="flex items-center justify-start gap-5 mt-2">
          {/* like and dislike */}
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center gap-1 cursor-pointer" onClick={onLike}>
              <AiFillLike />
              <p className="text-xs">{comment.likeCount}</p>
            </div>
            <div className="flex items-center gap-1 cursor-pointer" onClick={onDislike}>
              <AiFillDislike />
              <p className="text-xs">{comment.dislikeCount}</p>
            </div>
          </div>
          <TbMessageFilled onClick={onReply} className="cursor-pointer" />
          <div className="relative" ref={dropdownRef}>
            <button ref={triggerRef} onClick={handleDropdownToggle}>
              <BsThreeDotsVertical />
            </button>
            {dropdownOpen && (
              <div
                className={`absolute z-10 right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg
                  ${dropdownDirection === 'down' ? 'top-full' : 'bottom-full mb-2'}`}
              >
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setDropdownOpen(false); setEditing(true); if (onEdit) onEdit(); }}>Edit</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setDropdownOpen(false); if (onDelete) onDelete(); }}>Delete</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setDropdownOpen(false); /* handle report */ }}>Approve</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setDropdownOpen(false); /* handle report */ }}>Reject</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render replies recursively */}
      {children}
      {/* Reply input UI */}
      {isReplying && (
        <div className="flex items-center gap-3 pr-3 mt-2">
          <input
            className="px-2 py-1 text-sm w-full border-b border-graydark/20 rounded-l outline-0"
            value={replyValue}
            onChange={e => onReplyValueChange && onReplyValueChange(e.target.value)}
            placeholder="Write a reply..."
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              name="Reply"
              className="px-2 py-1 bg-primary text-white rounded text-xs"
              onClick={onReplySubmit}
            ></Button>
            <Button
              type="button"
              name="Cancel"
              className="px-2 py-1 bg-graydark rounded text-xs"
              onClick={onReplyCancel}
            ></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
