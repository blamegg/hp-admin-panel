"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogByIdFn } from "@/utility/queryFetcher";
import { useParams } from "next/navigation";
import BlogPreviewPage from "@/components/Blog/BlogPreview/BlogPreviewPage";

const BlogPreviewPageWrapper = () => {
  const { blogId: id } = useParams();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogByIdFn(id as string),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className=" px-10 py-10">
      <BlogPreviewPage blog={blog.data} />
    </div>
  )
};

export default BlogPreviewPageWrapper; 