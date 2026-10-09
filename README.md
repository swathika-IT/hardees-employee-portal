# Hardee’s Restaurant Employee Management & Attendance System

A full-stack, enterprise-grade restaurant operations and employee management platform custom-built for **Hardee’s Restaurant #1502444** (Rockingham, NC). Inspired by the professional layout and structure of [A&C Solutions](https://aandc-solutions.onrender.com/), this platform combines a public restaurant landing page with an Employee Operations Portal and Store Manager Administration Platform.

---

## 🍔 Features Overview

### 1. Public Restaurant Website
- **Signature Hardee's Brand Identity**: Signature Red (`#C8202B`), Deep Burgundy (`#801820`), Golden Yellow (`#FFC928`), and Warm Ivory (`#FFF9EF`).
- **Interactive Navigation**: Home, Our Menu, About Hardee's, Locations & Hours, Careers, Contact, and Employee Portal.
- **Hero Showcase**: Food photography featuring charbroiled 100% Black Angus Thickburgers®, freshness cycle counters, and quick actions.
- **Operational Pillars (A&C Solutions Layout)**: Charbroiled Beef, Scratch Buttermilk Biscuits, Hand-Breaded Tenders, Speed of Service, Community Heart, and Crew Career Growth.
- **Menu Highlights**: Filterable menu (Thickburgers, Biscuits, Chicken, Sides) with calories, pricing, and tags.
- **Store Location & Hours**: Verified Rockingham store address (481 US Highway 1 S, Rockingham, NC), opening times, contact numbers, and guest inquiry form.
- **Careers Section**: Open position listings and online application inquiry.

### 2. Employee Operations & Attendance Portal
- **Secure Authentication**: Employee identifier login, BCrypt password hashing, session tokens, and show/hide password toggle.
- **Live Digital Clock**: Real-time localized store clock and formatted date.
- **Interactive Shift Punch Clock**:
  - Distinct statuses: `Not Checked In`, `On Shift`, or `Shift Completed`.
  - Duplicate shift prevention on both client and backend.
  - Optional shift note input (station assignment, prep tasks).
  - Exact server-generated timestamps (`LocalDateTime`) stored in MySQL.
- **Complete Attendance History**: Past shifts table with check-in, check-out, duration, and status.
- **Work Schedule**: Weekly published shift schedule.
- **Hours & Pay**: Gross pay, tax deductions, net pay statements, and hourly base rate display.
- **Profile View**: Verified staff details, department, and contact info.

### 3. Store Manager Administration Platform
- **Executive Operational Hub**:
  - Total Employees
  - Active Employees
  - Currently Checked In (Live on Shift)
  - Not Yet Checked In
  - Shifts Completed Today
  - Total Hours Worked Today
- **Employee Directory**:
  - Live search by code, full name, or email.
  - Department and account status filters.
  - **Add New Employee**: Full modal with code, role, department, wage rate, and initial password.
  - **Edit Employee**: Inline update modal.
  - **Account Status Toggle**: Activate or deactivate accounts with confirmation dialogs.
- **Shift Attendance Management**:
  - Filter by date and employee.
  - Open shift inspection.
- **One-Click CSV Exports**:
  - Export Attendance Reports to CSV.
  - Export Employee Directory Roster to CSV.

---

## 🛠️ Technology Stack

- **Frontend**: React (JavaScript `.jsx` files only — no TypeScript), CSS variables, modular classes, and responsive layouts.
- **Build Tool**: Vite.
- **Backend**: Java 17 + Spring Boot 3.2.5 REST API (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `spring-security-crypto`).
- **Database**: Relational MySQL Server 8.0 (persistent storage for `employees`, `user_accounts`, `attendance_records`).
- **Icons**: Lucide Icons.

---

## 🗄️ Database Configuration & Credentials

The application uses MySQL database `hardees_employee_portal`.

- **Database URL**: `jdbc:mysql://localhost:3306/hardees_employee_portal?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC`
- **Default Database Username**: `root`
- **Default Database Password**: Environment variable `DB_PASSWORD` (fallback: `Ramaswathi1487!`)

### Environment Variables (Optional Override)
```bash
set DB_URL=jdbc:mysql://localhost:3306/hardees_employee_portal?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
set DB_USERNAME=root
set DB_PASSWORD=your_mysql_password
set PORT=8080
```

---

## 🔑 Default Authorized Credentials

| Role | Employee ID | Password | Name | Access Level |
|---|---|---|---|---|
| **Store Manager** | `MGR001` | `Admin@123` | Sarah Jenkins | Full Administration & Reports |
| **Demo Crew Member** | `DEMO1001` | `Demo@123` | Jordan Miller | Punch Clock & Personal Shifts |
| **Shift Supervisor** | `EMP1003` | `Hardees@1003` | Elena Rostova | Store Operations & Supervisor |
| **Drive-Thru Lead** | `EMP1002` | `Hardees@1002` | Marcus Vance | Crew Member Operations |

*(Quick-fill buttons are provided on the login modal for instant testing).*

---

## 🚀 How to Run the Application

### 1. Run the Spring Boot Backend (Java 17)
Open a terminal in the `backend/` directory:
```bash
cd backend
mvn spring-boot:run
```
*(Or use `mvnw.cmd spring-boot:run`)*.
The backend REST API starts on `http://localhost:8080`.

### 2. Run the React Frontend (Vite)
Open a terminal in the project root:
```bash
npm install
npm run dev
```
The frontend starts on `http://localhost:5173` (or `http://localhost:5174` if 5173 is occupied) with automatic `/api` proxying to `http://localhost:8080`.

### 3. Run Production Build & Validation
```bash
# Build frontend bundle
npm run build

# Run existing validation test
npm test
# or: node tests/validate.mjs
```

---

## 🧪 Verification & Automated Tests Completed

1. **Frontend Production Build**: `vite build` completed in under 2 seconds producing optimized assets in `dist/`.
2. **Dashboard Validation Suite**: `node tests/validate.mjs` passed 10/10 requirements and 6/6 legacy compatibility checks.
3. **Manager Login API**: Authenticated `MGR001`, verified role `STORE_MANAGER`, received session token.
4. **Employee Login API**: Authenticated `DEMO1001`, verified role `EMPLOYEE`, received session token.
5. **Employee Creation**: Manager created new staff member `EMP999`, hashed password stored in MySQL.
6. **Shift Punch Clock**: `EMP999` logged in, checked in (Record #8 created), prevented duplicate check-in (HTTP 409 Conflict), checked out with calculated duration.
7. **Attendance History**: Verified history query returned persisted shift records.
8. **Role-Based Access Restrictions**: Verified non-manager employees receive HTTP 403 Forbidden when attempting manager administration endpoints.
9. **Data Persistence Across Restart**: Stopped Spring Boot process, queried MySQL directly via command line, verified attendance record #8 persisted in `attendance_records` table, restarted backend.
10. **CSV Exports**: Verified attendance CSV and employee directory CSV download streams.
