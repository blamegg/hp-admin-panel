
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import BlogProfile from "../../../assets/blog/blogProfile.png"
import Image from "next/image";
import {AiFillLike} from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbMessageFilled } from "react-icons/tb";
import Button from "../../common/Button";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  replies: Comment[];
  likeCount: number;
  dislikeCount: number;
  status?: string;
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
  isExpanded?: boolean;
  // onToggleReplies?: () => void;
  handleCommentStatus?: (action: 'approve' | 'reject') => void;
}

const CommentItem: React.FC<CommentItemProps> = React.memo(({
  comment,
  level = 0,
  isEditing: controlledEditing,
  editValue: controlledEditValue,
  onEdit,
  onEditValueChange,
  onSave,
  onCancel,
  children,
  isReplying,
  replyValue,
  onReply,
  onReplyValueChange,
  onReplySubmit,
  onReplyCancel,
  onDelete,
  onLike,
  onDislike,
  isExpanded,
  // onToggleReplies,
  handleCommentStatus
}) => {
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

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    return new Date(comment.createdAt).toLocaleString();
  }, [comment.createdAt]);

  // Memoize dropdown direction calculation
  const calculateDropdownDirection = useCallback(() => {
    if (!triggerRef.current) return 'down';
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    return spaceBelow < 160 && spaceAbove > spaceBelow ? 'up' : 'down';
  }, []);

  // Optimized event handlers
  const handleDropdownToggle = useCallback(() => {
    if (!dropdownOpen) {
      setDropdownDirection(calculateDropdownDirection());
    }
    setDropdownOpen((open) => !open);
  }, [dropdownOpen, calculateDropdownDirection]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
      triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    setEditing(false);
    if (onSave) onSave();
  }, [setEditing, onSave]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    if (onCancel) onCancel();
  }, [setEditing, onCancel]);

  const handleEdit = useCallback(() => {
    setDropdownOpen(false);
    setEditing(true);
    if (onEdit) onEdit();
  }, [setEditing, onEdit]);

  const handleDelete = useCallback(() => {
    setDropdownOpen(false);
    if (onDelete) onDelete();
  }, [onDelete]);

  const handleLike = useCallback(() => {
    if (onLike) onLike();
  }, [onLike]);

  const handleDislike = useCallback(() => {
    if (onDislike) onDislike();
  }, [onDislike]);

  const handleReply = useCallback(() => {
    if (onReply) onReply();
  }, [onReply]);

  const handleReplySubmit = useCallback(() => {
    if (onReplySubmit) onReplySubmit();
  }, [onReplySubmit]);

  const handleReplyCancel = useCallback(() => {
    if (onReplyCancel) onReplyCancel();
  }, [onReplyCancel]);

  const handleEditValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, [setValue]);

  const handleReplyValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onReplyValueChange) onReplyValueChange(e.target.value);
  }, [onReplyValueChange]);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, handleClickOutside]);


  return (
    <div
      className={`pl-0 pt-2   ${level > 0 ? "border-transparent" : "border-transparent"}`}
      style={{ marginLeft }}
    >
      <div className="flex items-center  justify-start gap-3">
        <div className="w-[40px] h-[40px] rounded-full p-1 border-2 border-primary ">
          <Image src={BlogProfile} alt="👤" className="rounded-full" />
        </div>
        <div className="font-bold text-back text-sm">User Name</div>
        <div className="text-xs text-gray-500 mt-[2px]">{formattedDate}</div>
        <div className={`text-xs font-blod mt-[2px] rounded px-1 py-[2px] ${comment.status  === "Pending" ? "bg-warning text-white ":  comment.status  === "Rejected" ? "bg-danger text-white" : "bg-success text-white"}`}>{comment.status}</div>
      </div>
      <div className=" ps-8 ms-5  rounded">
        <div className="flex items-center justify-between gap-5">
          <p className="text-sm text-black font-medium w-full">
            {editing ? (
              <form className="flex items-center gap-3 pr-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <input
                  className="px-2 py-1 text-sm w-full border-b border-graydark/20 rounded-l outline-0"
                  value={value}
                  onChange={handleEditValueChange}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    name="Save"
                    className="px-2 py-1 bg-success text-white rounded text-xs"
                  ></Button>
                  <Button
                    type="button"
                    name="Cancel"
                    className="px-2 py-1 bg-graydark  rounded text-xs"
                    onClick={handleCancel}
                  ></Button>
                </div>
              </form>
            ) : (
              value
            )}
          </p>
        </div>
      
        {/* Actions like: likes,  dislikes, reply */}

       {!isReplying && !editing && (
        <div className="flex justify-start items-center gap-5 mt-1">
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
            <AiFillLike />
            <p className="text-xs">{comment.likeCount}</p>
          </div>
        </div>
        <TbMessageFilled onClick={handleReply} className="cursor-pointer" />
        <div className="relative" ref={dropdownRef}>
          <button ref={triggerRef} onClick={handleDropdownToggle}>
            <BsThreeDotsVertical />
          </button>
          {dropdownOpen && (
            <div
              className={`absolute z-10 right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg
                ${dropdownDirection === 'down' ? 'top-full' : 'bottom-full mb-2'}`}
            >
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={handleEdit}>Edit</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={handleDelete}>Delete</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setDropdownOpen(false); if (handleCommentStatus) handleCommentStatus('approve'); }}>Approve</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setDropdownOpen(false); if (handleCommentStatus) handleCommentStatus('reject'); }}>Reject</button>
            </div>
          )}
        </div>

        </div>
            )}
        {/* Reply input UI */}
        <div >
        {isReplying && (
          <form className="flex items-center gap-3 pr-3 mt-2" onSubmit={e => { e.preventDefault(); handleReplySubmit(); }}>
            <input
              className="px-2 py-1 text-sm w-full border-b border-graydark/20 rounded-l outline-0"
              value={replyValue}
              onChange={handleReplyValueChange}
              placeholder="Write a reply..."
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button
                type="submit"
                name="Reply"
                className="px-2 py-1 bg-success text-white rounded text-xs"
              />
              <Button
                type="button"
                name="Cancel"
                className="px-2 py-1 bg-graydark  rounded text-xs"
                onClick={handleReplyCancel}
              ></Button>
            </div>
          </form>
        )}
        </div>
        {/* Render nested replies (children) */}
        {children}
      </div>
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;
