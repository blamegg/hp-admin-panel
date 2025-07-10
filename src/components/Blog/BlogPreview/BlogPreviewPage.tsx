'use client'
import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LoaderWrapper from '@/components/common/LoaderWrapper';
import RecentBlogs from './RecentBlogs';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

interface BlogPreviewPageProps {
  blog: any;
}

function prependBaseUrlToImages(html: string, baseUrl: string) {
  if (!baseUrl) return html;
  const cleanBase = baseUrl.replace(/\/$/, '');
  // Replace <img src="..."> with <img src="BASE_URL/..."> for relative URLs
  return html.replace(/<img\s+([^>]*?)src=["'](?!https?:\/\/|\/\/)([^"'>]+)["']/gi, (match, pre, src) => {
    const cleanSrc = src.replace(/^\/+/, '');
    return `<img ${pre}src=\"${cleanBase}/${cleanSrc}\"`;
  });
}

const BlogPreviewPage: React.FC<BlogPreviewPageProps> = ({ blog }) => {
  const loading = useSelector((state: RootState) => state.blogs.loading);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const processedContent = prependBaseUrlToImages(blog.content, baseUrl);
  const router = useRouter()

  return (
    <LoaderWrapper loading={loading}>
      <div className="w-full flex gap-10">
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
                {blog.tags?.map((tag: string) => (
                  <span key={tag} className="bg-primary/10 text-primary text-xs md:text-sm rounded-full px-3 py-1 font-semibold">#{tag}</span>
                ))}
              </div>
              <div className="my-6">
                {blog.coverPage && (() => {
                  const url = blog.coverPage.startsWith('http')
                    ? blog.coverPage
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/${blog.coverPage.replace(/^\/+/, '')}`;
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                  if (isVideo) {
                    return (
                      <video className="w-full rounded-xl my-4 block shadow" autoPlay controls>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                  return (
                    <div className="relative w-full h-[400px] rounded-xl my-4 block shadow overflow-hidden">
                      <Image 
                        src={url} 
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority={true}
                        quality={85}
                      />
                    </div>
                  );
                })()}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/images/user/user-01.png"
                    alt="Author"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {blog.author
                      ? typeof blog.author === 'string'
                        ? blog.author
                        : blog.author.name || blog.author.email || 'Anonymous'
                      : 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/4">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg shadow-md py-6 px-4">
              <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                <RecentBlogs />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md py-3 px-4 my-5">
              <h3 className="text-lg font-semibold mb-4">Blog Comments </h3>
              <div className=" flex items-center justify-center">
                  <Button type='button' name='Comments' onClick={()=> router.push(`/blogs/comments/${blog._id}`)} className='bg-blue-400'   />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default BlogPreviewPage; 


