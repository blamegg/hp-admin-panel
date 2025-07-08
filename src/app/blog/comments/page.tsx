import React from "react";
import CommentList from "@/components/BlogComments";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const comments = [
    {
        "_id": "686bac30ddb4c54e4a01d9bd",
        "blog": "68676a33eb37473f29ce42fa",
        "parentComment": null,
        "content": "very good",
        "status": "Pending",
        "likeCount": 0,
        "replyCount": 3,
        "createdAt": "2025-07-07T11:14:56.202Z",
        "updatedAt": "2025-07-07T11:19:10.596Z",
        "__v": 0,
        "replies": [
            {
                "_id": "686bad2eddb4c54e4a01dad6",
                "blog": "68676a33eb37473f29ce42fa",
                "parentComment": "686bac30ddb4c54e4a01d9bd",
                "content": "absoultely",
                "status": "Pending",
                "likeCount": 0,
                "replyCount": 1,
                "createdAt": "2025-07-07T11:19:10.591Z",
                "updatedAt": "2025-07-07T11:19:41.017Z",
                "__v": 0,
                "replies": [
                    {
                        "_id": "686bad4dddb4c54e4a01dada",
                        "blog": "68676a33eb37473f29ce42fa",
                        "parentComment": "686bad2eddb4c54e4a01dad6",
                        "content": "fannn",
                        "status": "Pending",
                        "likeCount": 0,
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
                "content": "mind blowing ",
                "status": "Pending",
                "likeCount": 0,
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
                "content": "okay got itt ",
                "status": "Pending",
                "likeCount": 0,
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
        "content": "Nice blog!",
        "status": "Pending",
        "likeCount": 0,
        "replyCount": 0,
        "createdAt": "2025-07-07T11:10:56.858Z",
        "updatedAt": "2025-07-07T11:10:56.858Z",
        "__v": 0,
        "replies": []
    }
];

export default function CommentsPage() {
  return (
    <DefaultLayout >
      <Breadcrumb pageName="Comments" />
      <CommentList comments={comments} />
    </DefaultLayout>
  );
}