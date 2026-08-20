# 🚀 Offerly V2

A production-oriented **Multi-Tenant Affiliate Tracking SaaS Platform** built with modern backend architecture and scalable design principles.

Offerly enables organizations to manage affiliates, offers, tracking links, clicks, conversions, payouts, and analytics from completely isolated workspaces while providing a foundation for enterprise SaaS features.

---

# ✨ Features

* Multi-Tenant SaaS Architecture
* Secure JWT Authentication
* Role-Based Authorization
* Affiliate Management
* Offer Management
* Tracking Link Generation
* High-performance Click Tracking
* Redis Queue Processing with BullMQ
* Conversion Tracking
* Payout Management
* Analytics Dashboard
* Tenant Data Isolation
* RESTful API Design
* PostgreSQL Database
* Prisma ORM

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Redis
* BullMQ
* JWT Authentication

## Frontend

* React
* Vite
* JavaScript *(TypeScript migration planned)*
* Tailwind CSS

---

# 🏗 Architecture

```text
Client
   │
   ▼
Express API
   │
   ├── Authentication
   ├── Authorization
   ├── Tenant Isolation
   ├── Business Services
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL

──────────────

Click Tracking
      │
      ▼
BullMQ Queue
      │
      ▼
Worker
      │
      ├── PostgreSQL
      └── Redis Analytics
```

---

# ✅ Completed Milestones

## Phase 1 — Backend TypeScript Migration

Successfully migrated the complete backend from JavaScript to TypeScript.

### Highlights

* Complete backend migration
* Strong typing throughout the project
* Express type augmentation
* Typed BullMQ queues
* Improved maintainability
* End-to-end API verification

---

## Phase 2 — PostgreSQL + Prisma Migration

Successfully migrated the entire persistence layer from MongoDB/Mongoose to PostgreSQL using Prisma ORM.

### Highlights

* PostgreSQL integration
* Prisma ORM adoption
* Authentication migration
* Offer module migration
* Tracking module migration
* Click processing migration
* Conversion module migration
* Payout module migration
* Analytics migration
* Complete removal of Mongoose
* API verification after migration

---

## Phase 3 — Multi-Tenant SaaS Architecture

Implemented complete tenant isolation throughout the platform.

### Highlights

* Tenant registration
* Automatic workspace creation
* Tenant-aware JWT Authentication
* Tenant-aware Authorization
* Data isolation for:

  * Users
  * Affiliates
  * Offers
  * Tracking Links
  * Clicks
  * Conversions
  * Payouts
  * Analytics
* Redis analytics isolation
* Cross-tenant access protection

---

# 📌 Current Capabilities

The platform currently supports the complete affiliate marketing workflow:

* User Authentication
* Workspace Management
* Affiliate Management
* Offer Management
* Tracking Link Generation
* Click Tracking
* Background Queue Processing
* Conversion Tracking
* Payout Processing
* Analytics
* Tenant Isolation

---

# 🚧 Current Development

The project is currently focused on production-grade improvements.

### Currently Working On

* Zod Request Validation
* Validation Middleware
* Service Layer Refinement
* Prisma Query Optimization
* Database Index Optimization
* Improved Error Handling
* API Response Standardization
* Enhanced Logging
* Security Improvements
* Rate Limiting Enhancements

---

# 🗺 Roadmap

| Phase                              | Status      |
| ---------------------------------- | ----------- |
| ✅ Backend TypeScript Migration     | Complete    |
| ✅ PostgreSQL + Prisma Migration    | Complete    |
| ✅ Multi-Tenant SaaS Architecture   | Complete    |
| 🚧 Production Hardening             | Complete    |
| ⏳ Real-Time Dashboard (WebSockets) | Complete    |
| ⏳ Subscription & Billing           | Planned     |
| ⏳ Team Management & RBAC           | Planned     |
| ⏳ Email Notifications              | Planned     |
| ⏳ Webhooks                         | Planned     |
| ⏳ Docker & Containerization        | Planned     |
| ⏳ CI/CD Pipeline                   | Planned     |
| ⏳ Automated Testing                | Planned     |
| ⏳ Swagger / OpenAPI Documentation  | Planned     |
| ⏳ AWS Deployment                   | Planned     |
| ⏳ Monitoring & Observability       | Planned     |

---

# 🔮 Planned SaaS Features

* Team Management
* Sub Admins
* Advanced RBAC
* Workspace Settings
* Advertiser Portal
* Affiliate Invitations
* Offer Approval Workflow
* Subscription Plans
* Payment Gateway Integration
* Usage Limits
* Audit Logs
* Custom Tracking Domains
* Email Notifications
* Webhook Integrations
* Real-Time Analytics Dashboard
* Unique Offer Determination
* When admin create affiliate it must send details like name, password, email to affiliate email
* 2 step verification

---

# 📦 Project Status

**Version**

`v3.2.0`

**Status**

🚧 Active Development

**Architecture**

Multi-Tenant SaaS Platform

The core affiliate tracking platform is fully functional and production-oriented. Current development is focused on enterprise SaaS capabilities, production hardening, infrastructure, testing, deployment, and scalability enhancements.

---

# 👨‍💻 Author

**Ritik Kumar Gupta**

Building production-grade SaaS applications with modern backend architecture using TypeScript, PostgreSQL, Prisma, Redis, BullMQ, and React.
