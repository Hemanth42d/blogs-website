const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/featured
// @desc    Get featured blogs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const blogs = await Blog.find({ featured: true }).sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/latest/:count
// @desc    Get latest blogs
// @access  Public
router.get('/latest/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 4;
    const blogs = await Blog.find().sort({ publishedAt: -1 }).limit(count);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get blog by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private
router.post('/', protect, [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, slug, summary, content, tags, featured, readTime } = req.body;

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ message: 'A blog with this slug already exists' });
    }

    const blog = await Blog.create({
      title,
      slug,
      summary,
      content,
      tags: tags || [],
      featured: featured || false,
      readTime: readTime || 5,
      publishedAt: new Date()
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/blogs/:slug
// @desc    Update a blog
// @access  Private
router.put('/:slug', protect, async (req, res) => {
  try {
    const { title, slug: newSlug, summary, content, tags, featured, readTime } = req.body;

    let blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if new slug already exists (if slug is being changed)
    if (newSlug && newSlug !== req.params.slug) {
      const existingBlog = await Blog.findOne({ slug: newSlug });
      if (existingBlog) {
        return res.status(400).json({ message: 'A blog with this slug already exists' });
      }
    }

    blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      {
        title,
        slug: newSlug || req.params.slug,
        summary,
        content,
        tags: tags || [],
        featured: featured || false,
        readTime: readTime || blog.readTime
      },
      { new: true, runValidators: true }
    );

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
