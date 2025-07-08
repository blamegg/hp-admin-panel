import LoaderWrapper from "@/components/common/LoaderWrapper";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";


interface PreviewBlogProps {
  htmlContent: string;
}

const PreviewBlog: React.FC<PreviewBlogProps> = ({ htmlContent }) => {
  const loading = useSelector((state: RootState) => state.blogs.loading);

  return (
    <LoaderWrapper loading={loading}>
      <div className="blog-preview" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </LoaderWrapper>
  );
};

export default PreviewBlog;