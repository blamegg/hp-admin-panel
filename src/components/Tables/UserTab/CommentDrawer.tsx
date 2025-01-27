import React, { useState } from "react";
import { Drawer, Button, TextField, IconButton } from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

interface CommentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    task: any; // Task object containing standup and report data
    onAddComment: (comment: string) => void;
    onDeleteComment: (index: number, isStandup: boolean) => void;
    onEditComment: (index: number, newComment: string, isStandup: boolean) => void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
    isOpen,
    onClose,
    task,
    onAddComment,
    onDeleteComment,
    onEditComment,
}) => {
    const [newComment, setNewComment] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [isStandup, setIsStandup] = useState<boolean>(false);

    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    const handleEditStart = (index: number, currentComment: string) => {
        setEditingIndex(index);
        setEditingText(currentComment);
    };

    const handleEditSave = () => {
        if (editingText.trim() && editingIndex !== null) {
            onEditComment(editingIndex, editingText, isStandup);
            setEditingIndex(null);
            setEditingText("");
            setIsStandup(isStandup);
            setIsStandup(false);
        }
    };

    const handleEditCancel = () => {
        setEditingIndex(null);
        setEditingText("");
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "25%",
                    padding: "16px",
                },
            }}
        >
            <div className="flex flex-col h-full">
                <h3 className="font-semibold mb-4">Comments</h3>

                <div
                    className="comments-list  flex-grow overflow-auto border-2 border-strokedark p-4 rounded-lg"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                    {task?.report?.comments?.map((comment: string, index: number) => (
                        <div
                            key={index}
                            className={`mb-3 flex ${index % 2 === 0 ? "justify-start" : ""
                                }`}
                        >
                            <div
                                className={`p-1 rounded-lg ${index % 2 === 0
                                    ? "bg-gray-200 text-black"
                                    : "bg-gray-200 text-black"
                                    } w-[95%] flex flex-col`}
                            >
                                {editingIndex === index ? (
                                    <>
                                        <TextField
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                        />
                                        <div className="flex justify-end  gap-2 mt-1">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={handleEditSave}
                                            >
                                                <Save />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={handleEditCancel}
                                            >
                                                <Cancel />
                                            </IconButton>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mt-1 w-full">
                                            <div className="w-full bg-blue-100 rounded-lg p-1.5" >
                                                <p className="text-sm   rounded ">{comment}</p>
                                                <div className="flex justify-end items-center gap-1">
                                                    <span className="text-xs text-gray-500">Created by : Admin</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date().toLocaleDateString()}
                                                    </span>

                                                    <div className="flex">
                                                        <div className="flex">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleEditStart(index, comment)}
                                                            >
                                                                <Edit className="!w-3 !h-3" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => onDeleteComment(index, isStandup)}
                                                            >
                                                                <Delete className="!w-3 !h-3" />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 mt-auto py-1">
                    <TextField
                        label="Add Comment"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddComment}
                        className="mt-4"
                    >
                        Add Comment
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default CommentDrawer;
