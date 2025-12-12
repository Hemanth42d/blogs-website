const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Use Google DNS for MongoDB Atlas SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Admin = require('./models/Admin');
const Blog = require('./models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogs-website';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@mvhemanth.me',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });
    console.log('Admin created:', admin.email);

    // Create sample blogs
    const blogs = await Blog.insertMany([
      {
        title: 'Getting Started with React Hooks',
        slug: 'getting-started-with-react-hooks',
        summary: 'A comprehensive guide to understanding and using React Hooks effectively in your applications.',
        content: `<h2>Introduction to React Hooks</h2>
<p>React Hooks revolutionized how we write React components. Introduced in React 16.8, they allow you to use state and other React features without writing a class.</p>

<h2>useState Hook</h2>
<p>The useState hook is the most commonly used hook. It allows you to add state to functional components.</p>
<pre><code>const [count, setCount] = useState(0);</code></pre>

<h2>useEffect Hook</h2>
<p>useEffect lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.</p>

<h2>Custom Hooks</h2>
<p>You can create your own hooks to reuse stateful logic between components. Custom hooks are a convention that naturally follows from the design of Hooks.</p>`,
        tags: ['react', 'javascript', 'hooks', 'frontend'],
        featured: true,
        readTime: 8,
        publishedAt: new Date('2024-12-01')
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        slug: 'building-restful-apis-nodejs-express',
        summary: 'Learn how to create robust and scalable REST APIs using Node.js and Express framework.',
        content: `<h2>What is a REST API?</h2>
<p>REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD operations.</p>

<h2>Setting Up Express</h2>
<p>Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.</p>
<pre><code>const express = require('express');
const app = express();
app.use(express.json());</code></pre>

<h2>Creating Routes</h2>
<p>Routes define the endpoints of your API. Each route can handle different HTTP methods like GET, POST, PUT, and DELETE.</p>

<h2>Best Practices</h2>
<p>Always validate input, use proper HTTP status codes, implement error handling, and secure your API with authentication.</p>`,
        tags: ['nodejs', 'express', 'api', 'backend'],
        featured: true,
        readTime: 10,
        publishedAt: new Date('2024-11-25')
      },
      {
        title: 'MongoDB Fundamentals for Beginners',
        slug: 'mongodb-fundamentals-beginners',
        summary: 'A beginner-friendly introduction to MongoDB, covering basic concepts and operations.',
        content: `<h2>What is MongoDB?</h2>
<p>MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. It's designed for scalability and developer agility.</p>

<h2>Documents and Collections</h2>
<p>In MongoDB, data is stored in documents (similar to JSON objects) which are grouped into collections (similar to tables in SQL databases).</p>

<h2>CRUD Operations</h2>
<p>MongoDB provides intuitive methods for Create, Read, Update, and Delete operations:</p>
<ul>
<li>insertOne() / insertMany()</li>
<li>find() / findOne()</li>
<li>updateOne() / updateMany()</li>
<li>deleteOne() / deleteMany()</li>
</ul>

<h2>Mongoose ODM</h2>
<p>Mongoose is an Object Data Modeling library for MongoDB and Node.js. It provides schema validation and a straightforward API for interacting with MongoDB.</p>`,
        tags: ['mongodb', 'database', 'nosql', 'backend'],
        featured: false,
        readTime: 7,
        publishedAt: new Date('2024-11-20')
      },
      {
        title: 'CSS Grid Layout: A Complete Guide',
        slug: 'css-grid-layout-complete-guide',
        summary: 'Master CSS Grid Layout with this comprehensive guide covering all the essential concepts and techniques.',
        content: `<h2>Introduction to CSS Grid</h2>
<p>CSS Grid Layout is a two-dimensional layout system designed for the web. It lets you lay out items in rows and columns simultaneously.</p>

<h2>Grid Container</h2>
<p>To create a grid container, set display: grid on an element. All direct children become grid items.</p>
<pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}</code></pre>

<h2>Grid Lines and Tracks</h2>
<p>Grid lines are the dividing lines that make up the structure of the grid. Grid tracks are the spaces between grid lines.</p>

<h2>Responsive Grids</h2>
<p>CSS Grid makes it easy to create responsive layouts using auto-fit, auto-fill, and minmax() functions.</p>`,
        tags: ['css', 'grid', 'layout', 'frontend'],
        featured: true,
        readTime: 6,
        publishedAt: new Date('2024-11-15')
      },
      {
        title: 'Authentication Best Practices in Web Applications',
        slug: 'authentication-best-practices-web-apps',
        summary: 'Essential security practices for implementing authentication in modern web applications.',
        content: `<h2>Why Authentication Matters</h2>
<p>Authentication is the process of verifying the identity of a user. Proper implementation is crucial for protecting user data and preventing unauthorized access.</p>

<h2>Password Security</h2>
<p>Never store passwords in plain text. Always use strong hashing algorithms like bcrypt with proper salt rounds.</p>

<h2>JWT Tokens</h2>
<p>JSON Web Tokens (JWT) are a popular method for handling authentication in modern applications. They're stateless and can carry user information securely.</p>

<h2>Security Headers</h2>
<p>Implement security headers like HTTPS, CORS policies, and Content Security Policy to protect against common attacks.</p>`,
        tags: ['security', 'authentication', 'jwt', 'web-development'],
        featured: false,
        readTime: 9,
        publishedAt: new Date('2024-11-10')
      }
    ]);

    console.log(`Created ${blogs.length} blog posts`);
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
