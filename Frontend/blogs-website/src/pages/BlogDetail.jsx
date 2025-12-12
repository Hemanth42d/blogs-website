import { useParams, Navigate, Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { formatDate } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

const BlogDetail = () => {
  const { slug } = useParams();
  const { getBlogBySlug, loading } = useBlog();

  const blog = getBlogBySlug(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mb-6">
            <Link to="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all posts
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                H
              </div>
              <span className="font-medium text-gray-700">Hemanth</span>
            </div>
            <span className="text-gray-300">•</span>
            <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
            <span className="text-gray-300">•</span>
            <span>{blog.readTime} min read</span>
            {blog.featured && (
              <>
                <span className="text-gray-300">•</span>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  Featured
                </span>
              </>
            )}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <style>{`
          .blog-content {
            font-size: 1.125rem;
            line-height: 1.9;
            color: #374151;
          }
          
          .blog-content h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #111827;
            margin: 2.5rem 0 1rem 0;
            line-height: 1.3;
          }
          
          .blog-content h2 {
            font-size: 1.75rem;
            font-weight: 600;
            color: #1f2937;
            margin: 2rem 0 1rem 0;
            line-height: 1.4;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .blog-content h3 {
            font-size: 1.375rem;
            font-weight: 600;
            color: #374151;
            margin: 1.75rem 0 0.75rem 0;
            line-height: 1.4;
          }
          
          .blog-content h4 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #4b5563;
            margin: 1.5rem 0 0.5rem 0;
          }
          
          .blog-content p {
            margin: 1.25rem 0;
            line-height: 1.9;
          }
          
          .blog-content ul {
            list-style-type: disc;
            margin: 1.5rem 0;
            padding-left: 1.75rem;
          }
          
          .blog-content ol {
            list-style-type: decimal;
            margin: 1.5rem 0;
            padding-left: 1.75rem;
          }
          
          .blog-content li {
            margin: 0.75rem 0;
            line-height: 1.8;
            padding-left: 0.5rem;
          }
          
          .blog-content li::marker {
            color: #6b7280;
          }
          
          .blog-content blockquote {
            margin: 2rem 0;
            padding: 1.25rem 1.5rem;
            border-left: 4px solid #3b82f6;
            background: linear-gradient(to right, #f8fafc, transparent);
            color: #4b5563;
            font-style: italic;
            border-radius: 0 8px 8px 0;
          }
          
          .blog-content blockquote p {
            margin: 0;
          }
          
          .blog-content a {
            color: #2563eb;
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: color 0.2s;
          }
          
          .blog-content a:hover {
            color: #1d4ed8;
          }
          
          .blog-content strong {
            font-weight: 600;
            color: #1f2937;
          }
          
          .blog-content em {
            font-style: italic;
          }
          
          .blog-content hr {
            margin: 3rem 0;
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, #d1d5db, transparent);
          }
          
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .blog-content code {
            background: #fef2f2;
            color: #dc2626;
            padding: 0.2em 0.5em;
            border-radius: 4px;
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
            font-size: 0.875em;
            font-weight: 500;
          }
          
          .blog-content .code-block {
            margin: 2rem 0;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #334155;
            background: #0f172a;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .blog-content .code-block .code-lang {
            background: #1e293b;
            color: #94a3b8;
            padding: 0.75rem 1.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-bottom: 1px solid #334155;
          }
          
          .blog-content .code-block pre {
            background: #0f172a;
            color: #e2e8f0;
            padding: 1.25rem 1.5rem;
            margin: 0;
            font-family: 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', monospace;
            font-size: 0.9rem;
            line-height: 1.75;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          .blog-content .code-block pre code {
            background: transparent;
            padding: 0;
            color: inherit;
            font-size: inherit;
            font-weight: normal;
          }
          
          .blog-content pre {
            background: #0f172a;
            color: #e2e8f0;
            padding: 1.25rem 1.5rem;
            border-radius: 12px;
            overflow-x: auto;
            margin: 2rem 0;
            font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
            font-size: 0.9rem;
            line-height: 1.75;
            border: 1px solid #334155;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          .blog-content pre code {
            background: transparent;
            padding: 0;
            color: inherit;
            font-size: inherit;
            font-weight: normal;
          }
          
          .blog-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
          }
          
          .blog-content th,
          .blog-content td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem 1rem;
            text-align: left;
          }
          
          .blog-content th {
            background: #f9fafb;
            font-weight: 600;
          }
          
          .blog-content tr:hover {
            background: #f9fafb;
          }
        `}</style>
      </article>

      {/* Article Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              H
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Written by Hemanth</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              A curious student sharing learnings and discoveries. Thanks for reading!
            </p>
            <a 
              href="https://www.youtube.com/@HemanthCodeHub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail;
