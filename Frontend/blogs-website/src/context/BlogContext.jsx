import { createContext, useContext, useReducer, useEffect } from "react";
import { blogAPI } from "../utils/api";

const initialState = {
  blogs: [],
  loading: true,
  error: null,
};

const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_BLOGS: "SET_BLOGS",
  ADD_BLOG: "ADD_BLOG",
  UPDATE_BLOG: "UPDATE_BLOG",
  DELETE_BLOG: "DELETE_BLOG",
};

function blogReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_BLOGS:
      return { ...state, blogs: action.payload, loading: false };
    case ACTIONS.ADD_BLOG:
      return { ...state, blogs: [action.payload, ...state.blogs] };
    case ACTIONS.UPDATE_BLOG:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        ),
      };
    case ACTIONS.DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog._id !== action.payload),
      };
    default:
      return state;
  }
}

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const blogs = await blogAPI.getAll();
      dispatch({ type: ACTIONS.SET_BLOGS, payload: blogs });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const addBlog = async (blogData) => {
    try {
      const newBlog = await blogAPI.create(blogData);
      dispatch({ type: ACTIONS.ADD_BLOG, payload: newBlog });
      return { success: true, blog: newBlog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateBlog = async (slug, blogData) => {
    try {
      const updatedBlog = await blogAPI.update(slug, blogData);
      dispatch({ type: ACTIONS.UPDATE_BLOG, payload: updatedBlog });
      return { success: true, blog: updatedBlog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await blogAPI.delete(blogId);
      dispatch({ type: ACTIONS.DELETE_BLOG, payload: blogId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getBlogBySlug = (slug) => {
    return state.blogs.find((blog) => blog.slug === slug);
  };

  const getFeaturedBlogs = () => {
    return state.blogs.filter((blog) => blog.featured);
  };

  const getLatestBlogs = (count = 4) => {
    return [...state.blogs]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, count);
  };

  const value = {
    ...state,
    fetchBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogBySlug,
    getFeaturedBlogs,
    getLatestBlogs,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}

export default BlogContext;
