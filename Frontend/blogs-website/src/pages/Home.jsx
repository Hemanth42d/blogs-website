import { Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { getFeaturedBlogs, getLatestBlogs, loading } = useBlog();

  const featuredBlogs = getFeaturedBlogs();
  const latestBlogs = getLatestBlogs(4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hi, I'm <span className="text-blue-600">Hemanth</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              A curious student documenting my learning journey. I write about 
              the topics I explore, the skills I'm building, and the lessons 
              I pick up along the way. Welcome to my digital notebook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() =>
                  document.getElementById("featured-posts").scrollIntoView({ behavior: "smooth" })
                }
              >
                Read My Blog
              </Button>
              <a
                href="https://www.youtube.com/@HemanthCodeHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube Channel
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section id="featured-posts" className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Posts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Highlights from my learning journey — topics that taught me the most.
            </p>
          </div>

          {featuredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} showFeaturedBadge={true} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-12">No featured posts yet.</p>
          )}

          <div className="text-center">
            <Link to="/blog">
              <Button variant="outline" size="lg">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Latest Posts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fresh notes from what I've been learning recently.
            </p>
          </div>

          {latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
