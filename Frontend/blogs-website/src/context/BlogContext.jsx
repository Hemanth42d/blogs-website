import { createContext, useContext, useReducer, useEffect } from "react";

// Initial state with some sample blog data
const initialState = {
  blogs: [
    {
      id: 1,
      title: "The Art of Writing Clean Code",
      slug: "art-of-writing-clean-code",
      summary:
        "Exploring principles and practices that make code more readable, maintainable, and elegant.",
      content: `<h2>Introduction</h2><p>Writing clean code is more art than science. It requires practice, dedication, and a deep understanding of software principles.</p><h2>Key Principles</h2><p>Clean code should be readable, simple, and focused. Every function should do one thing well.</p>`,
      tags: ["programming", "best-practices", "software-engineering"],
      publishedAt: "2024-10-20",
      readTime: 8,
      featured: true,
    },
    {
      id: 2,
      title: "Building Scalable React Applications",
      slug: "building-scalable-react-applications",
      summary:
        "Learn how to structure React applications that can grow with your team and requirements.",
      content: `<h2>Component Architecture</h2><p>The foundation of any scalable React application starts with proper component architecture.</p><h2>State Management</h2><p>Choose the right state management solution for your application's complexity.</p>`,
      tags: ["react", "javascript", "architecture"],
      publishedAt: "2024-10-18",
      readTime: 12,
      featured: true,
    },
    {
      id: 3,
      title: "Modern CSS Techniques and Best Practices",
      slug: "modern-css-techniques",
      summary:
        "Discover the latest CSS features and how to use them effectively in modern web development.",
      content: `<h2>CSS Grid and Flexbox</h2><p>Master these layout methods to create responsive designs.</p><h2>Custom Properties</h2><p>CSS variables make styling more maintainable and dynamic.</p>`,
      tags: ["css", "web-design", "frontend"],
      publishedAt: "2024-10-15",
      readTime: 6,
      featured: false,
    },
    {
      id: 4,
      title: "The Future of Web Development",
      slug: "future-of-web-development",
      summary:
        "Exploring emerging technologies and trends that will shape the future of web development.",
      content: `<h2>Emerging Technologies</h2><p>WebAssembly, Progressive Web Apps, and AI integration are changing the landscape.</p><h2>Performance Optimization</h2><p>Core Web Vitals and user experience remain paramount.</p>`,
      tags: ["web-development", "technology", "trends"],
      publishedAt: "2024-10-12",
      readTime: 10,
      featured: true,
    },
  ],
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  ADD_BLOG: "ADD_BLOG",
  UPDATE_BLOG: "UPDATE_BLOG",
  DELETE_BLOG: "DELETE_BLOG",
  SET_BLOGS: "SET_BLOGS",
};

// Reducer function
function blogReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_BLOGS:
      return { ...state, blogs: action.payload };
    case ACTIONS.ADD_BLOG:
      return {
        ...state,
        blogs: [...state.blogs, { ...action.payload, id: Date.now() }],
      };
    case ACTIONS.UPDATE_BLOG:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog
        ),
      };
    case ACTIONS.DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog.id !== action.payload),
      };
    default:
      return state;
  }
}

// Create context
const BlogContext = createContext();

// Context provider component
export function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Load blogs from localStorage on mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem("blogs");
    if (savedBlogs) {
      try {
        const parsedBlogs = JSON.parse(savedBlogs);
        dispatch({ type: ACTIONS.SET_BLOGS, payload: parsedBlogs });
      } catch (error) {
        console.error("Error parsing saved blogs:", error);
      }
    }
  }, []);

  // Save blogs to localStorage whenever blogs change
  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(state.blogs));
  }, [state.blogs]);

  // Actions
  const addBlog = (blogData) => {
    dispatch({ type: ACTIONS.ADD_BLOG, payload: blogData });
    // TODO: Call backend API to create blog
  };

  const updateBlog = (blogData) => {
    dispatch({ type: ACTIONS.UPDATE_BLOG, payload: blogData });
    // TODO: Call backend API to update blog
  };

  const deleteBlog = (blogId) => {
    dispatch({ type: ACTIONS.DELETE_BLOG, payload: blogId });
    // TODO: Call backend API to delete blog
  };

  const getBlogBySlug = (slug) => {
    return state.blogs.find((blog) => blog.slug === slug);
  };

  const getFeaturedBlogs = () => {
    return state.blogs.filter((blog) => blog.featured);
  };

  const getLatestBlogs = (count = 4) => {
    return state.blogs
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, count);
  };

  const value = {
    ...state,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogBySlug,
    getFeaturedBlogs,
    getLatestBlogs,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

// Custom hook to use the blog context
export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}

export default BlogContext;
