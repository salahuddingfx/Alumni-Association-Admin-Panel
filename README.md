<div align="center">

# 🛡️ Admin — CMS Dashboard
### Alumni Associations Dpian · অ্যাডমিন ড্যাশবোর্ড

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-cyan)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-analytics-orange)](https://recharts.org)

> Internal CMS and management dashboard for superadmins, admins, and moderators. Manage members, events, registrations, donations, notices, blog content, gallery, partners, and site-wide settings.

</div>

---

## 🚫 Access Control

The admin dashboard is **private** and not linked from the public website.

| Role | Access Level |
|---|---|
| `superadmin` | Full access — user management, settings, all modules |
| `admin` | Event, member, registration, notice, blog, gallery, partner management |
| `moderator` | Limited — approvals, comment moderation |

> ⚠️ Admin accounts must be created directly in the database or promoted by a superadmin via the User Manager module.

---

## 📁 Project Structure

```
admin/
├── public/
│   └── admin_logo.png         # Admin panel branding logo
├── src/
│   ├── api/
│   │   └── api.js             # Axios instance with interceptors
│   ├── context/
│   │   └── AuthContext.jsx    # JWT auth context (login, logout, me)
│   ├── pages/
│   │   ├── Login.jsx          # Admin login page
│   │   ├── Dashboard.jsx      # Overview with stats, recent activity
│   │   ├── Members.jsx        # Member approval & management table
│   │   ├── Events.jsx         # Event CRUD with banner upload
│   │   ├── Registrations.jsx  # Event registration tracker
│   │   ├── Donations.jsx      # Donation log + Recharts analytics
│   │   ├── Notices.jsx        # Notice create/edit/delete
│   │   ├── Blogs.jsx          # Blog/news post management
│   │   ├── Committee.jsx      # Executive committee management
│   │   ├── Gallery.jsx        # Photo gallery album management
│   │   ├── Partners.jsx       # Sponsors & partners logo manager
│   │   ├── Settings.jsx       # CMS site-wide settings
│   │   ├── Users.jsx          # User & role management
│   │   └── Volunteer.jsx      # Volunteer check-in module
│   ├── components/
│   │   ├── Sidebar.jsx        # Collapsible navigation sidebar
│   │   ├── Topbar.jsx         # Header with user info + notifications
│   │   └── PrivateRoute.jsx   # Route guard requiring auth
│   └── main.jsx               # App entry point
├── .env.example               # Environment variable template
├── vite.config.js
└── tailwind.config.js
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🚀 Development

```bash
npm install
npm run dev       # Start dev server on http://localhost:5174
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## 📊 Dashboard Modules

### Member Management
- View all registered members with pagination, search, and filter
- Approve / suspend / delete member accounts
- View full member profile & digital ID card preview
- Export member data

### Event Management
- Create events with banner image upload (Cloudinary)
- Set event type (meeting, social, workshop, etc.), date, venue, seats
- Manage event capacity and registration cutoff dates
- Close registration early or extend deadlines

### Registration Tracker
- View all event registrations with payment status
- Verify payment screenshots (bKash/Nagad/bank)
- Mark registration as confirmed, pending, or rejected
- Generate attendee list

### Donation Manager
- Full donation history table with filters
- Amount breakdown by payment method
- Recharts line/bar charts for monthly totals
- CSV export

### Notice Board Manager
- Create notices with rich text editor
- Set notice as **Sticky** (pinned) or **High Priority** (red)
- Publish → triggers Socket.io broadcast to all connected clients

### Blog / News Manager
- WYSIWYG blog editor with image embedding
- Draft / publish / archive states
- Bangla and English titles + content

### CMS Settings
- Upload and manage hero carousel slides
- Update association name, tagline, contact info
- Social media links, school timeline entries
- Advisor messages from President/Secretary

### User & Role Manager
- View all registered user accounts
- Promote / demote roles (`user` → `member` → `moderator` → `admin`)
- Block or delete accounts

---

## 🔐 Authentication Flow

1. Admin logs in at `/login` with email + password
2. Server issues `accessToken` (15 min) + `refreshToken` (7 days) via HttpOnly cookies
3. All API calls include `Authorization: Bearer <accessToken>` header
4. Token is refreshed automatically via Axios interceptor on 401 responses
5. On logout, both tokens are invalidated server-side

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react-router-dom` | Navigation & routing |
| `axios` | HTTP client |
| `recharts` | Charts & analytics |
| `lucide-react` | Icons |
| `react-hot-toast` | Toast notifications |
| `tailwindcss` | Styling |

---

© 2026 Practon Alumni Association
