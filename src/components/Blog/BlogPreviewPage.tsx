import React from "react";
import PreviewBlog from "@/components/Blog/PreviewBlog";
import he from "he";
import { FaCalendarAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

interface BlogPreviewPageProps {
  blog: {
    coverPage?: string;
    title: string;
    shortDescription?: string;
    content: string;
    tags: string[];
    author: {
      name: string;
      _id: string;
    },
    publishedAt: string;
  };
}

const decodeHtml = (html: string) => he.decode(html);

const BlogPreviewPage: React.FC<BlogPreviewPageProps> = ({ blog }) => (
  <div className="main">
    <div className="blogdetailsleft">
      <div className="top">
        <div className="blogcard">
          <div className="info">
            <div className="titel">{blog.title}</div>
            {blog.shortDescription && (
              <div className="information">{blog.shortDescription}</div>
            )}
          </div>
          <div className="flex justify-start items-center flex-wrap gap-2">
            {blog.tags.map(tag => (
              <p key={tag} className="bg-white text-primary rounded-lg px-2 py-1 shadow-2">#{tag}</p>
            ))}
          </div>
          <div className="imgdiv">
            {blog.coverPage && (() => {
              const url = `${process.env.NEXT_PUBLIC_BASE_URL}${blog.coverPage}`;
              const isVideo = /\.(mp4|webm|ogg)$/i.test(blog.coverPage);
              if (isVideo) {
                return (
                  <video className="img" autoPlay controls style={{ maxWidth: '100%', borderRadius: 8, margin: '1rem 0', display: 'block' }}>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );
              }
              return (
                <img src={url} alt={blog.coverPage} className="img" />
              );
            })()}
          </div>

          {/* Auther */}
          <div className="flex justify-start items-center gap-10 mb-4">
            <div className="flex justify-start items-center gap-1">
              <IoPerson className="text-companyRed" />
              <p className="text-[#949494] font-[700]">{blog.author.name}</p>
            </div>
            <div className="flex justify-start items-center gap-1">
              <FaCalendarAlt className="text-companyRed" />
              <p className="text-[#949494] font-[700]">{blog?.publishedAt && blog?.publishedAt?.split('T')[0]}</p>
            </div>
          </div>

        </div>
      </div>
      <PreviewBlog htmlContent={decodeHtml(blog.content)} />
    </div>
    <div className="blogdetailsright">
    </div>
  </div>
);

export default BlogPreviewPage; 