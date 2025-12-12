import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { generateSlug, calculateReadTime } from "../../utils/helpers";
import Button from "../../components/Button";
import Input from "../../components/Input";
import RichTextEditor from "../../components/RichTextEditor";

const BlogEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addBlog, updateBlog, getBlogBySlug } = useBlog();

  const isEditing = Boolean(slug);
  const existingBlog = isEditing ? getBlogBySlug(slug) : null;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    tags: "",
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing && existingBlog) {
      setFormData({
        title: existingBlog.title,
        slug: existingBlog.slug,
        summary: existingBlog.summary,
        content: existingBlog.content,
        tags: existingBlog.tags ? existingBlog.tags.join(", ") : "",
        featured: existingBlog.featured || false,
      });
    }
  }, [isEditing, existingBlog]);

  useEffect(() => {
    if (!isEditing && formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, isEditing]);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    const contentText = formData.content.replace(/<[^>]*>/g, "").trim();
    if (!formData.content.trim() || !contentText) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const blogData = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0),
      featured: formData.featured,
      readTime: calculateReadTime(formData.content),
    };

    try {
      let result;
      if (isEditing) {
        result = await updateBlog(slug, blogData);
      } else {
        result = await addBlog(blogData);
      }

      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setErrors({ submit: result.error || "Failed to save blog" });
      }
    } catch (error) {
      setErrors({ submit: error.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  if (isEditing && !existingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h1>
              <p className="mt-1 text-gray-600">{isEditing ? "Update your blog post content" : "Write and publish a new blog post"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>{showPreview ? "Hide Preview" : "Show Preview"}</Button>
              <Button variant="secondary" onClick={() => navigate("/admin/dashboard")}>Cancel</Button>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Blog Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} placeholder="Enter blog title" required />
                <Input label="Slug" name="slug" value={formData.slug} onChange={handleInputChange} error={errors.slug} placeholder="blog-post-url-slug" required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary <span className="text-red-500">*</span></label>
                  <textarea name="summary" rows={3} value={formData.summary} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Brief description of the blog post" />
                  {errors.summary && <p className="text-sm text-red-600 mt-1">{errors.summary}</p>}
                </div>
                <Input label="Tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="react, javascript, programming (comma separated)" />
                <div className="flex items-center">
                  <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">Featured post</label>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Content</h2>
              <RichTextEditor value={formData.content} onChange={handleChange("content")} placeholder="Start writing your blog post content..." />
              {errors.content && <p className="text-sm text-red-600 mt-4">{errors.content}</p>}
              <div className="mt-16 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Estimated read time: {calculateReadTime(formData.content)} minutes</div>
                  <Button type="submit" onClick={handleSubmit} disabled={loading} size="lg">
                    {loading ? "Publishing..." : isEditing ? "Update Post" : "Publish Post"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Live Preview</h2>
                <article className="prose prose-lg max-w-none">
                  {formData.title && <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>}
                  {formData.summary && <p className="text-lg text-gray-600 mb-6 italic">{formData.summary}</p>}
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formData.tags.split(",").map((tag, index) => tag.trim() && (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">#{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700" dangerouslySetInnerHTML={{ __html: formData.content }} />
                </article>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
