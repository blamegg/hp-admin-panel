import React from "react";
import CommentList from "@/components/BlogComments";

const comments = [
    {
        "_id": "686bac30ddb4c54e4a01d9bd",
        "blog": "68676a33eb37473f29ce42fa",
        "parentComment": null,
        "content": "This breakdown made a complex topic so much easier to understand. Thanks for sharing!",
        "status": "Pending",
        "likeCount": 5,
        "dislikeCount": 14,
        "replyCount": 3,
        "createdAt": "2025-07-07T11:14:56.202Z",
        "updatedAt": "2025-07-07T11:19:10.596Z",
        "__v": 0,
        "replies": [
            {
                "_id": "686bad2eddb4c54e4a01dad6",
                "blog": "68676a33eb37473f29ce42fa",
                "parentComment": "686bac30ddb4c54e4a01d9bd",
                "content": "Really appreciated the code snippets — super helpful for beginners like me.",
                "status": "Pending",
                "likeCount": 25,
                "dislikeCount": 15,
                "replyCount": 1,
                "createdAt": "2025-07-07T11:19:10.591Z",
                "updatedAt": "2025-07-07T11:19:41.017Z",
                "__v": 0,
                "replies": [
                    {
                        "_id": "686bad4dddb4c54e4a01dada",
                        "blog": "68676a33eb37473f29ce42fa",
                        "parentComment": "686bad2eddb4c54e4a01dad6",
                        "content": "Would love to see a follow-up post diving deeper into this framework!",
                        "status": "Pending",
                        "likeCount": 50,
                        "dislikeCount": 10,
                        "replyCount": 0,
                        "createdAt": "2025-07-07T11:19:41.013Z",
                        "updatedAt": "2025-07-07T11:19:41.013Z",
                        "__v": 0,
                        "replies": []
                    }
                ]
            },
            {
                "_id": "686bacb0ddb4c54e4a01dab2",
                "blog": "68676a33eb37473f29ce42fa",
                "parentComment": "686bac30ddb4c54e4a01d9bd",
                "content": "Well explained! I’ve read about this topic before, but your explanation finally made it click.",
                "status": "Pending",
                "likeCount": 10,
                "dislikeCount": 30,
                "replyCount": 0,
                "createdAt": "2025-07-07T11:17:04.230Z",
                "updatedAt": "2025-07-07T11:17:04.230Z",
                "__v": 0,
                "replies": []
            },
            {
                "_id": "686baca3ddb4c54e4a01da87",
                "blog": "68676a33eb37473f29ce42fa",
                "parentComment": "686bac30ddb4c54e4a01d9bd",
                "content": "I appreciate how you break down complex topics into simple steps.",
                "status": "Pending",
                "likeCount": 100,
                "dislikeCount": 40,
                "replyCount": 0,
                "createdAt": "2025-07-07T11:16:51.872Z",
                "updatedAt": "2025-07-07T11:16:51.872Z",
                "__v": 0,
                "replies": []
            }
        ]
    },
    {
        "_id": "686bab40acec0c437d5bee5d",
        "blog": "68676a33eb37473f29ce42fa",
        "parentComment": null,
        "content": "Can you share how this tech compares with [alternative tech]? Would be interesting to see.",
        "status": "Pending",
        "likeCount": 20,
        "dislikeCount": 10,
        "replyCount": 0,
        "createdAt": "2025-07-07T11:10:56.858Z",
        "updatedAt": "2025-07-07T11:10:56.858Z",
        "__v": 0,
        "replies": []
    }
];

export default function CommentsPage() {
 
  return (
    <div >
      <CommentList />
    </div>
  );
}