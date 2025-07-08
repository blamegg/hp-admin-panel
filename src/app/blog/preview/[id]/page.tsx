"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogByIdFn } from "@/utility/queryFetcher";
import { useParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BlogPreviewPage from "@/components/Blog/BlogPreview/BlogPreviewPage";

const BlogPreviewPageWrapper = () => {
  const { id } = useParams();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogByIdFn(id as string),
    enabled: !!id,
  });
  console.log(blog)

  if (isLoading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error || !blog) return <div className="text-center py-10 text-lg">Blog not found</div>;

  return (
    <DefaultLayout >
      <Breadcrumb pageName="Blog" />
      <BlogPreviewPage blog={blog} />;
    </DefaultLayout>
  )
};

export default BlogPreviewPageWrapper; 