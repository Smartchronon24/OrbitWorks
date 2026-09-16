---
title: "ClaimEazy"
shortDescription: "A role-based insurance management application combining an Android client, Flask backend, MySQL transactional storage, and Firebase-powered realtime admin insights."
status: "Completed"
dates: "2026 — Present"
featured: false
order: 5
technologies:
  - "Kotlin"
  - "Jetpack Compose"
  - "Retrofit"
  - "Coroutines / Flow"
  - "Python"
  - "Flask"
  - "Pandas"
  - "REST APIs"
  - "MySQL"
  - "Firebase Realtime Database"
  - "Firebase Admin SDK"
  - "GitHub Actions"
  - "Ngrok"
  - "RBAC"
archFlow:
  - "Android / Jetpack Compose — Retrofit, Coroutines, Flow"
  - "REST / JSON"
  - "Flask API — RBAC, business logic, DataViewModel"
  - "MySQL — transactional source of truth"
  - "Firebase RTDB — derived administrative insights"
  - "Admin insights consumers"
overview: >
  ClaimEazy is a full insurance-management workflow spanning an Android application,
  Flask REST API, MySQL transactional storage, and Firebase-powered administrative insights.
  It centralizes users, customer profiles, policies, claims, payments, and role-aware processing.
problem: >
  Insurance operations needed a centralized workflow for account management, customer profiles,
  policies, claims, payments, and administrative metrics. The system had to connect a mobile
  client to a relational backend while giving administrators efficient access to derived business insights.
whatWasBuilt: >
  A role-based application with CLIENT, ADMIN, APPROVER, and ETL roles; CRUD workflows for
  users, customers, policies, claims, and payments; role-aware claim behavior; and backend-computed
  insight data published to Firebase Realtime Database. MySQL remains the transactional source of truth.
architecture: >
  The Android client communicates with Flask through REST/JSON using Retrofit, Coroutines, and Flow.
  Flask applies RBAC and business rules through a DataViewModel abstraction, writes transactional data
  to MySQL, and publishes derived insight data to Firebase RTDB for administrative consumers. Firebase
  is not the primary transactional database.
implementationDetails: >
  DataViewModel centralizes shared database operations such as get_df(), get_one(), insert(), update(),
  and delete(), while project-specific workflows handle ID generation, role resolution, claim assignment,
  and deassignment. Policies derive Active, Expired, and Upcoming insight categories from dates. Claim
  creation is restricted to Client and Admin roles: clients create claims linked through customer_id,
  while admins may create claims without customer association.
challenges: >
  Development involved resolving a ViewModel/Firebase circular import, preserving parent database
  initialization for inherited Firebase operations, converting Pandas numpy.int64 values to native Python
  integers for MySQL compatibility, and separating successful HTTP responses from failures in background
  Firebase synchronization. Firebase initialization was guarded against duplicate default-app creation.
decisions: >
  MySQL was retained as the transactional source of truth, while backend-owned aggregation keeps business
  statistics out of frontend clients. This separation prevents the mobile app from having to re-derive
  metrics from operational records while keeping data integrity in the relational layer. Simple insight
  changes use atomic counter updates; more complex transitions that affect multiple derived fields fall back
  to recomputation. Time-dependent policy insights are periodically synchronized because their state can
  change without a CRUD request. The project also centralized shared database logic behind a DataViewModel
  layer so repeated CRUD patterns were consistent across user, customer, policy, claim, and payment flows.
tradeoffs: >
  A generic data-access interface keeps CRUD behavior consistent across entities, with project-specific
  relationship and business rules layered above it. During Android-to-local-backend testing, Ngrok provided
  the development tunnel; production deployment and final CI/CD validation remain outside this case study.
results: >
  Built a complete role-based insurance-management workflow spanning Android, Flask APIs, MySQL storage,
  and Firebase-powered administrative insights. The system supports role-aware user and customer workflows,
  policy and claim lifecycle management, payment tracking, and derived analytics for admin-facing insight
  dashboards. This was delivered without claiming unverified production scale or deployment metrics.
futureWork: >
  Remaining areas include complete admin audit/activity logging, complete frontend Firebase listener
  implementation, full production deployment, final CI/CD validation, complete ETL details, final claim
  schema validation, authentication/security hardening, Firebase security rules, and additional policy
  lifecycle refinements for edge-case date transitions and admin reporting.
---

## Role-Based Workflow

ClaimEazy uses four roles. The backend resolves each role through `user_accounts.role_id` → `roles.role_id` → `roles.role_name`.

<div class="role-grid">
  <article class="role-card"><strong>CLIENT</strong><span>Customer-linked workflows and client-side claims.</span></article>
  <article class="role-card"><strong>ADMIN</strong><span>Broader operational management and claims without a customer link.</span></article>
  <article class="role-card"><strong>APPROVER</strong><span>Downstream approval and rejection workflow context.</span></article>
  <article class="role-card"><strong>ETL</strong><span>Operational data processing and insight synchronization.</span></article>
</div>

### Core records

- **Customers:** a client account can be paired with a customer profile through `customer_id`; staff roles do not require one.
- **Policies:** creation, updates, deletion, date-based lifecycle tracking, premium, coverage amount, and policy type.
- **Claims:** creation, updates, deletion, customer association, assignment/deassignment, and approval/rejection context.
- **Payments:** creation, updates, deletion, status, amount, and payment mode.

When customer claim lists change, current and new claims are compared using set difference; `assign_claim()` and `deassign_claim()` synchronize the relationship.

## Firebase Insight Architecture

The backend computes administrative metrics from MySQL and publishes derived data under `admin_insights/`, including customers, claims, payments, policies, and users. Examples include users by role, claim counts by status, approved claim amount, payment revenue, pending payment amount, payment-mode distribution, policy categories, customer age groups, and geographic distribution.

The synchronization strategy is hybrid:

- Simple changes use incremental atomic updates.
- Complex transitions such as `PENDING → APPROVED` recompute affected insight groups.
- Policy insights use periodic synchronization because time can change Active or Expired state without a CRUD event.

## Relational Model

The major entities are `roles`, `user_accounts`, `customer_info`, `claims_info`, `payment_info`, and `policy_info`. The established relationship flow is:

```text
roles → user_accounts → customer_info → claims_info
policy_info
payment_info
```

## Engineering Debugging Lessons

- A ViewModel/Firebase dependency cycle caused partially initialized module errors.
- Firebase operations inherited database behavior, so parent engine initialization had to be preserved in background work.
- Pandas `numpy.int64` values required conversion to native Python `int` before MySQL writes.
- A Flask request returning `200` did not guarantee a later background Firebase synchronization succeeded.
- Repeated Firebase initialization was guarded to avoid the default-app-already-exists error.
- Ngrok error `ERR_NGROK_3004` was traced through the Flask process and upstream response behavior during Android integration testing.
