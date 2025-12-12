import { Link } from "react-router-dom";
import { formatDate } from "../utils/helpers";

const BlogCard = ({ blog, showFeaturedBadge = false }) => {
  const {
    title,
    slug,
    summary,
    tags = [],
    publishedAt,
    readTime,
    featured,
  } = blog || {};

  return (
    <article className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      <div className="p-6">
        {/* Featured Badge */}
        {showFeaturedBadge && featured && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{summary}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-block text-gray-500 text-xs px-2 py-1">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          <span>{readTime} min read</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
