# Super Admin Enterprise Portal

A multi-tenant administrative portal designed for enterprise SaaS governance, organizational hierarchy management, granular role-based access control (RBAC), subscription lifecycle management, and security compliance auditing.

---

## Default Access Credentials

For demonstration and testing purposes, use the default administrator credentials on the login screen:

| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `admin123` |
| **Assigned Role** | `Super Administrator` |

---

## Key Modules & Capabilities

### 1. Authentication & Route Protection
- **Session Isolation**: Client-side session state management using React Context with local persistence.
- **Route Guarding**: All administrative endpoints (`/dashboard`, `/tenants`, `/users`, etc.) require an active session; unauthorized requests redirect to `/login`.
- **Global Sign Out**: Secure logout button in the top navigation header to terminate the session.

### 2. Global Dashboard & Analytics
- Multi-tenant health metrics (Active, Suspended, Inactive).
- Resource usage indicators (Database, API Gateway, CPU, and Storage).
- Interactive tenant and user growth trajectories using Recharts.
- Live administrative activity stream.

### 3. Tenant Operations
- **Batch Tenant Provisioning**: Bulk-import organization rosters into a target tenant workspace, with a running import history showing per-batch success and failure counts.
- **Data Isolation & Recovery**: On-demand snapshot creation per tenant workspace, with point-in-time restore and a full snapshot history log.
- **Platform Health & Alerts**: Publish and expire maintenance advisories and status banners, scoped to all tenants or a specific workspace, with severity tiers.
- **Tenant Quotas & Billing**: Per-tenant seat, storage, and API usage tracking against plan limits, with invoice export and payment status management.

### 4. Tenant & Organization Hierarchy
- **Tenant Management**: Tenant provisioning, tier assignment (Basic, Pro, Enterprise), and status toggling (Active/Suspended).
- **Organizational Structure**: Multi-level organizational hierarchy covering Companies, Business Units, Departments, Branches, Cost Centers, and Locations.

### 5. Identity, Access Management & RBAC
- **User Directory**: Centralized user management with status indicators, department assignments, and contact records.
- **Roles & Permissions**: Fine-grained capability definitions and permission sets.
- **Role Assignments**: Direct user-to-role mappings with organizational scope boundaries.
- **Data Permissions**: Row- and column-level data scoping rules across business units.

### 6. Platform Settings & Subscriptions
- **Platform Configuration**: Global system flags, session timeout parameters, and rate-limiting rules.
- **Feature Management**: Modular feature flag toggles across tenant tiers.
- **Subscription & Licensing**: Seat allocation, license key issuance, and renewal status tracking.
- **Security Policies**: Multi-factor authentication (MFA) enforcement rules, IP throttling, and password complexity standards.

### 7. Monitoring, Compliance & Audit
- **Audit Logs**: Immutable event ledger tracking administrative operations, actor identity, IP addresses, affected entities, and before/after property diffs. CSV export capability included.
- **Notifications & Alerts**: Category-based alerts (Security, System, Billing, Compliance) with priority tiers, unread counters, and inline action triggers.

---

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Tooling**: Vite
- **Styling**: Tailwind CSS with custom enterprise palette
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State & Server Cache**: TanStack React Query

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Compile production build
npm run build
```
