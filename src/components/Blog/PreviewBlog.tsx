import React from "react";

interface PreviewBlogProps {
  htmlContent: string;
}

const PreviewBlog: React.FC<PreviewBlogProps> = ({ htmlContent }) => (
  <div className="blog-preview" dangerouslySetInnerHTML={{ __html: htmlContent }} />
);

export default PreviewBlog;