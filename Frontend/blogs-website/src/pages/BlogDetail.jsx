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

  // TODO: Fetch blog content from backend

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Back button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <time dateTime={blog.publishedAt}>
              {formatDate(blog.publishedAt)}
            </time>
            <span>•</span>
            <span>{blog.readTime} min read</span>
            {blog.featured && (
              <>
                <span>•</span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Featured
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-semibold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Thanks for reading! If you enjoyed this post, consider subscribing
              to my newsletter.
            </p>
            <Link
              to="/newsletter"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;
