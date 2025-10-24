# Blog & Newsletter Website

A complete, professional frontend web application built with React (.jsx) and Tailwind CSS, inspired by the clean and minimal UI of joshwcomeau.com.

## 🚀 Features

### Public Section

- **Home Page** - Hero section, featured posts, and newsletter subscription
- **Blog List** - Grid layout showing all blog posts with filtering
- **Blog Detail** - Individual blog post view with rich formatting
- **Newsletter** - Subscription page with validation

### Admin Section

- **Login** - Secure admin authentication
- **Dashboard** - Blog management with stats and actions
- **Create/Edit Blog** - Rich text editor with live preview
- **Protected Routes** - Admin-only access control

## 🛠️ Tech Stack

- **React 19** with functional components and hooks
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Custom Rich Text Editor** - React 19 compatible editor with formatting toolbar
- **Context API** for state management
- **Date-fns** for date formatting
- **Vite** for build tooling

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── BlogCard.jsx
│   ├── LoadingSpinner.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── BlogList.jsx
│   ├── BlogDetail.jsx
│   ├── Newsletter.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       └── BlogEditor.jsx
├── context/            # Global state management
│   ├── BlogContext.jsx
│   └── AuthContext.jsx
├── utils/              # Helper functions
│   └── helpers.js
└── App.jsx            # Main app component
```

## 🎨 Design Philosophy

- **Minimal & Clean** - Inspired by Josh W Comeau's design aesthetic
- **Professional Typography** - Inter font with proper hierarchy
- **Consistent Colors** - Neutral palette with blue accent (#2563EB)
- **Responsive Design** - Mobile-first approach
- **Soft Shadows** - Subtle depth without overwhelming effects
- **Generous Spacing** - Breathing room for content

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 👨‍💻 Admin Access

The admin section is protected and accessible only via direct URL for security purposes.

**Access Methods:**

1. **Direct URL:** Navigate to `/admin/login`
2. **Footer Link:** Click the subtle "Admin" link in the footer (bottom-right)

**Demo Credentials:**

- **Email:** admin@mvhemanth.me
- **Password:** admin123

**Note:** The admin login button is intentionally hidden from the main navigation to keep the public interface clean and secure. Admin access is only available through direct URL navigation.

## 📝 Backend Integration

The application is designed to work with a backend API. Look for `// TODO` comments throughout the codebase that indicate where backend API calls should be integrated:

- Newsletter subscription
- Blog CRUD operations
- User authentication
- Content management

## 🎯 Key Features Implemented

### ✅ Public Features

- Responsive home page with hero section
- Blog listing with cards and metadata
- Individual blog post pages with rich content
- Newsletter subscription with validation
- Clean navigation and footer

### ✅ Admin Features

- Secure login with localStorage persistence
- Dashboard with blog statistics
- Custom rich text editor with formatting toolbar
- Live preview for blog editing
- Blog management (create, edit, delete)
- Protected routes for admin access

### ✅ Technical Features

- React Context for global state
- React Router v6 for navigation
- Responsive Tailwind CSS design
- Form validation and error handling
- Loading states and user feedback
- Clean, modular code architecture

## 🔮 Future Enhancements

- Backend API integration
- User registration and profiles
- Comment system
- Search functionality
- Categories and tags filtering
- SEO optimization
- Analytics integration
- Email newsletter automation

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop computers (1024px+)
- Large screens (1280px+)

## 🎨 Color Palette

- **Background:** #F9FAFB (gray-50)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #6B7280 (gray-500)
- **Accent:** #2563EB (blue-600)
- **Borders:** #E5E7EB (gray-200)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React and Tailwind CSS

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
