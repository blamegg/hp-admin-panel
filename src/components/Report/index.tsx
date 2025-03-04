import React, { useState } from "react";
import { GoCommentDiscussion } from "react-icons/go";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import CommentDrawer from "../Tables/UserTab/CommentDrawer";

const Report = () => {
    // Example array of objects with standup and report tasks
    const data = [
        {
            date: "2025-01-22", // Today's date
            standup: {
                yesterdayTask: "Completed feature X implementation.",
                todayTask: "Work on bug fixing for feature Y.",
                comments: ["Good work on feature X!", "Make sure to test feature Y thoroughly."]
            },
            report: {
                todayTask: "Completed bug fixing for feature Y.",
                comments: ["Bug fixing looks great!"]
            },
        },
        {
            date: "2025-01-21", // Previous day's date
            standup: {
                yesterdayTask: "Refactored the authentication module.",
                todayTask: "Add new validation checks to the login process.",
                comments: ["Authentication module refactor looks good."]
            },
            report: {
                todayTask: "Added new validation checks to the login process.",
                comments: ["Validation checks added successfully."]
            },
        },
        {
            date: "2025-01-21", // Previous day's date
            standup: {
                yesterdayTask: "Refactored the authentication module.",
                todayTask: "Add new validation checks to the login process.",
                comments: ["Authentication module refactor looks good."]
            },
            report: {
                todayTask: "Added new validation checks to the login process.",
                comments: ["Validation checks added successfully."]
            },
        },
    ];

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<any>(null);

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };

    const handleCommentIconClick = (task: any) => {
        setCurrentTask(task); // Set current task to the one clicked
        toggleDrawer(true); // Open the drawer
    };

    const handleAddComment = (comment: string) => {
        if (currentTask) {
            currentTask.standup.comments.push(comment);
            currentTask.report.comments.push(comment);
        }
    };

    const handleEdit = (index: number, updatedComment: string, isStandup: boolean) => {
        if (currentTask) {
            setCurrentTask((prev: any) => {
                const comments = isStandup
                    ? [...prev.standup.comments]
                    : [...prev.report.comments];
                comments[index] = updatedComment;
                return {
                    ...prev,
                    [isStandup ? "standup" : "report"]: {
                        ...prev[isStandup ? "standup" : "report"],
                        comments,
                    },
                };
            });
        }
    }
    const handleDelete = (index: number, isStandup: boolean) => {
        if (currentTask) {
            setCurrentTask((prev: any) => {
                const comments = isStandup
                    ? [...prev.standup.comments]
                    : [...prev.report.comments];
                comments.splice(index, 1);
                return {
                    ...prev,
                    [isStandup ? "standup" : "report"]: {
                        ...prev[isStandup ? "standup" : "report"],
                        comments,
                    },
                };
            });
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-indigo-100 ">
            <div className="max-w-7xl mx-auto px-4">
                <Typography variant="h6" className="text-center font-semibold text-gray-800 py-3">
                    Task Reports & Comments
                </Typography>

                {data.map((item, index) => (
                    <Card key={index} className="mb-6 bg-white shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <div className="w-3/4">
                                <Typography className="font-bold text-gray-800 mb-2 text-sm">{item.date}</Typography>

                                {/* Standup Section */}
                                <div className="mb-1">
                                    <Typography className="!text-form-strokedark !text-base font-semibold"># Standup</Typography>
                                    <Typography className="text-gray-600 !text-xs"><span className="!font-semibold">Yesterday's Task:</span> {item.standup.yesterdayTask}</Typography>
                                    <Typography className="text-gray-600 !text-xs"><span className="!font-semibold">Today's Task:</span> {item.standup.todayTask}</Typography>
                                </div>

                                {/* Report Section */}
                                <div>
                                    <Typography className="font-semibold text-gray-700 !text-form-strokedark  !text-base"># Report</Typography>
                                    <Typography className="text-gray-600 !text-xs"><span className="!font-semibold">Today's Task:</span> {item.report.todayTask}</Typography>
                                </div>
                            </div>

                            {/* Comment Icon and Count */}
                            <div className="flex flex-col items-center justify-center ">
                                <GoCommentDiscussion
                                    onClick={() => handleCommentIconClick(item)} // Open the comment drawer for the selected task
                                    className="cursor-pointer text-gray-600 hover:text-blue-500 transition-all mb-2"
                                    size={30}
                                />
                                <Typography className="text-sm text-gray-600">
                                    {item.standup.comments.length + item.report.comments.length} Comments
                                </Typography>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Comment Drawer */}
                <CommentDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => toggleDrawer(false)}
                    task={currentTask}
                    onAddComment={handleAddComment}
                    onDeleteComment={(index, isStandup) => handleDelete(index, isStandup)}
                    onEditComment={(index, newComment, isStandup) => handleEdit(index, newComment, isStandup)}
                />
            </div>
        </div>
    );
};

export default Report;
