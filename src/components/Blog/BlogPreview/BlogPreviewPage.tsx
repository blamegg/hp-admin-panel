import React from "react";
import he from "he";
import { FaCalendarAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import LoaderWrapper from "@/components/common/LoaderWrapper";
import PreviewBlog from "./PreviewBlog";
import RecentBlogs from "./RecentBlogs";

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
    updatedAt:string;
  };
}

const decodeHtml = (html: string) => he.decode(html);

const BlogPreviewPage: React.FC<BlogPreviewPageProps> = ({ blog }) => {
  const loading = useSelector((state: RootState) => state.blogs.loading);
  return (
    <LoaderWrapper loading={loading}>
      <div className="w-full flex px-4 gap-10">
        <div className="flex flex-col w-3/4 ">
          <div>
            <div className="w-full">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#222222]  mb-4 font-montserrat tracking-tight leading-loose">{blog.title}</h1>
                {blog.shortDescription && (
                  <p className="text-xl md:text-2xl text-gray-500 mb-6 font-inter leading-relaxed">{blog.shortDescription}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary text-xs md:text-sm rounded-full px-3 py-1 font-semibold">#{tag}</span>
                ))}
              </div>
              <div className="my-6">
                {blog.coverPage && (() => {
                  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${blog.coverPage}`;
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(blog.coverPage);
                  if (isVideo) {
                    return (
                      <video className="w-full rounded-xl my-4 block shadow" autoPlay controls>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                  return (
                    <img src={url} alt={blog.coverPage} className="w-full rounded-xl my-4 block shadow" />
                  );
                })()}
              </div>

              {/* Author */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <IoPerson className="text-primary text-lg" />
                  <span className="font-medium">{blog.author.name}</span>
                </div>
                {blog?.publishedAt ? (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <span>{blog?.publishedAt?.split('T')[0]}</span>
                  </div>
                ): (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <span>{blog?.updatedAt?.split('T')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <PreviewBlog htmlContent={decodeHtml(blog.content)} />
        </div>
        <div className="hidden lg:block w-1/4">
        <h1 className="text-xl text-black font-bold mb-2">Recent blogs</h1>
        <RecentBlogs />
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default BlogPreviewPage; 