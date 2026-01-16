# LUMINA - Feature Documentation

**Project**: E-Commerce Coaching Platform
**Purpose**: Onboard, track, and coach companies through their e-commerce journey
**Last Updated**: 2026-01-15

---

## Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Company Management](#2-company-management)
3. [Company Owners Management](#3-company-owners-management)
4. [Onboarding Checklist System](#4-onboarding-checklist-system)
5. [Performance Tracking](#5-performance-tracking)
6. [Event Management](#6-event-management)
7. [Analytics & Reporting Dashboard](#7-analytics--reporting-dashboard)
8. [User Settings & Profile](#8-user-settings--profile)
9. [Data Management & Media Handling](#9-data-management--media-handling)
10. [Data Querying & Filtering](#10-data-querying--filtering)

---

## 1. Authentication & User Management

### Features

#### Authentication
- User Registration with email validation
- Login/Logout functionality
- Email Verification flow
- Password Reset (Forgot Password)
- Two-Factor Authentication (2FA)
- Session Management with remember-me capability

#### User Management
- Create users (admin capability)
- Update user information and passwords
- Delete users
- User search and filtering (by name, email)
- User sorting (by name, email, role)
- Role-based access (coach, admin, owner)

### Test Use Cases

#### TC-AUTH-001: User Registration
- **Test**: Create new user account with valid email
- **Expected**: User created

#### TC-AUTH-002: Login with Valid Credentials
- **Test**: Login with registered email and password
- **Expected**: User authenticated, redirected to companies page
- **Validation**: Check session created, user data loaded

#### TC-AUTH-003: Login with Invalid Credentials
- **Test**: Login with incorrect password
- **Expected**: Error message displayed, no authentication
- **Validation**: User remains on login page, error shown


#### TC-USER-001: Create User as Admin
- **Test**: Admin creates new user
- **Expected**: User created, credentials generated
- **Validation**: New user can login, has correct permissions

#### TC-USER-002: Search Users
- **Test**: Search users by name or email
- **Expected**: Filtered results displayed
- **Validation**: Verify search results match criteria

#### TC-USER-003: Delete User
- **Test**: Admin deletes user account
- **Expected**: User removed from system
- **Validation**: User cannot login, data archived

---

## 2. Company Management

### Features

#### Company Operations
- Company registration/onboarding with external partnership form
- Create companies (admin)
- Edit company details, logos, owners
- View companies with search, filter, sort
- Delete companies
- File uploads: proof of payment, e-signatures, owner photos, company logo

#### Company Information
- Name, email, phone, address
- Status: active, inactive, terminated
- Notarization status: pending, done, rejected
- ERP status: active, inactive
- Sales activity: generating, testing, inactive
- Company level: educate, empowerment, enterprise, exponential
- Sponsor company assignment
- Coach assignment

#### Company Details View
- Complete company information
- All owners with profiles
- Onboarding progress percentage
- Assigned coach and sponsor
- Status and certification levels

### Test Use Cases

#### TC-COMP-001: Create New Company
- **Test**: Admin creates company with all required fields
- **Expected**: Company created successfully
- **Validation**: Company appears in list, all data saved correctly

#### TC-COMP-002: Upload Company Logo
- **Test**: Upload company logo (JPG/PNG)
- **Expected**: Logo uploaded and displayed
- **Validation**: Logo visible in company profile, file stored in media library

#### TC-COMP-003: Edit Company Information
- **Test**: Update company name, email, phone
- **Expected**: Changes saved successfully
- **Validation**: Updated information displayed in company details

#### TC-COMP-004: Assign Coach to Company
- **Test**: Select coach from dropdown, assign to company
- **Expected**: Coach assigned, relationship created
- **Validation**: Coach visible in company details

#### TC-COMP-005: Set Company Status
- **Test**: Change company status to inactive
- **Expected**: Status updated
- **Validation**: Status reflected in company list and details

#### TC-COMP-006: Search Companies
- **Test**: Search by company name or email
- **Expected**: Matching companies displayed
- **Validation**: Results match search criteria

#### TC-COMP-007: Filter Companies by Status
- **Test**: Filter to show only active companies
- **Expected**: Only active companies displayed
- **Validation**: All results have active status

#### TC-COMP-008: Sort Companies
- **Test**: Sort companies by name ascending
- **Expected**: Companies sorted alphabetically
- **Validation**: Order correct in table

#### TC-COMP-009: Delete Company
- **Test**: Admin deletes company
- **Expected**: Company removed, related data handled
- **Validation**: Company not in list, owners archived

#### TC-COMP-010: External Partnership Application
- **Test**: Submit partnership form with all uploads
- **Expected**: Application submitted, files uploaded
- **Validation**: Admin can review application, files accessible

#### TC-COMP-011: Set Sponsor Company
- **Test**: Assign sponsor company to new company
- **Expected**: Sponsor relationship created
- **Validation**: Sponsor visible in company details

#### TC-COMP-012: View Company Details
- **Test**: Click on company to view full details
- **Expected**: Details page loads with all information
- **Validation**: All data displayed correctly (owners, progress, coach, etc.)

---

## 3. Company Owners Management

### Features

- Add owners to companies
- Edit owner details (name, email, phone, address, birthdate, social media)
- Delete owners
- Owner profile photos
- Auto-generated credentials for owner login

### Test Use Cases

#### TC-OWNER-001: Add Owner to Company
- **Test**: Create new owner for existing company
- **Expected**: Owner added, credentials generated
- **Validation**: Owner appears in company details

#### TC-OWNER-002: Upload Owner Photo
- **Test**: Upload profile photo for owner
- **Expected**: Photo uploaded and displayed
- **Validation**: Photo visible in owner profile

#### TC-OWNER-003: Edit Owner Information
- **Test**: Update owner email and phone
- **Expected**: Changes saved
- **Validation**: Updated info displayed

#### TC-OWNER-004: Add Social Media Links
- **Test**: Add Facebook, Instagram, LinkedIn URLs
- **Expected**: Links saved
- **Validation**: Links accessible from profile

#### TC-OWNER-005: Delete Owner
- **Test**: Remove owner from company
- **Expected**: Owner removed
- **Validation**: Owner not listed, credentials disabled

#### TC-OWNER-006: Owner Login
- **Test**: Owner logs in with auto-generated credentials
- **Expected**: Owner authenticated
- **Validation**: Owner sees their company dashboard

---

## 4. Onboarding Checklist System

### Features

- Predefined onboarding checklist templates
- Track completion status per company
- Mark items complete/incomplete
- Real-time progress percentage calculation
- Add remarks and notes to items
- Attach files to checklist items

### Test Use Cases

#### TC-ONBOARD-001: View Company Checklist
- **Test**: Open onboarding tab for company
- **Expected**: All checklist items displayed
- **Validation**: Items match template, progress shown

#### TC-ONBOARD-002: Mark Item Complete
- **Test**: Check checkbox for checklist item
- **Expected**: Item marked complete, progress updates
- **Validation**: Progress percentage increases

#### TC-ONBOARD-003: Mark Item Incomplete
- **Test**: Uncheck completed item
- **Expected**: Item marked incomplete, progress decreases
- **Validation**: Progress percentage decreases

#### TC-ONBOARD-004: Add Remark to Item
- **Test**: Add note/comment to checklist item
- **Expected**: Remark saved and displayed
- **Validation**: Remark visible in item details

#### TC-ONBOARD-005: Attach File to Item
- **Test**: Upload supporting document to checklist item
- **Expected**: File attached and accessible
- **Validation**: File can be downloaded

#### TC-ONBOARD-006: Calculate Progress
- **Test**: Complete 5 of 10 checklist items
- **Expected**: Progress shows 50%
- **Validation**: Progress bar and percentage accurate

#### TC-ONBOARD-007: View Progress in Company List
- **Test**: View company list
- **Expected**: Onboarding progress visible for each company
- **Validation**: Progress percentages match actual completion

---

## 5. Performance Tracking

### Features

#### Performance Records
- Create performance records with date ranges
- Track testing vs scaling phases
- Record items tested
- Track average ad spend
- Measure ROAS (Return on Ad Spend)
- Measure RTS (Return to Sales) percentage
- Capture highlights, challenges, action plans
- Attach files (PDF, DOC, Excel, images)

#### Performance Analytics
- Calculate average ROAS
- Track maximum ROAS
- Rank top performers
- View performance history

### Test Use Cases

#### TC-PERF-001: Create Performance Record
- **Test**: Add new performance record with all fields
- **Expected**: Record created successfully
- **Validation**: Record appears in performance list

#### TC-PERF-002: Track Testing Phase
- **Test**: Create record marked as Testing phase
- **Expected**: Phase correctly labeled
- **Validation**: Testing phase visible in record

#### TC-PERF-003: Track Scaling Phase
- **Test**: Create record marked as Scaling phase
- **Expected**: Phase correctly labeled
- **Validation**: Scaling phase visible in record

#### TC-PERF-004: Record ROAS
- **Test**: Enter ROAS value (e.g., 3.5)
- **Expected**: ROAS saved
- **Validation**: ROAS displayed in record and analytics

#### TC-PERF-005: Attach Performance Files
- **Test**: Upload Excel report to performance record
- **Expected**: File uploaded to S3
- **Validation**: File accessible via temporary URL

#### TC-PERF-006: Edit Performance Record
- **Test**: Update ad spend and ROAS values
- **Expected**: Changes saved
- **Validation**: Updated values displayed

#### TC-PERF-007: Delete Performance Record
- **Test**: Remove performance record
- **Expected**: Record deleted, files removed
- **Validation**: Record not in list, S3 files deleted

#### TC-PERF-008: View Average ROAS
- **Test**: View analytics for company with multiple records
- **Expected**: Average ROAS calculated
- **Validation**: Average matches manual calculation

#### TC-PERF-009: View Top Performers
- **Test**: Check top performers dashboard widget
- **Expected**: Companies ranked by highest ROAS
- **Validation**: Ranking correct, highest ROAS on top

#### TC-PERF-010: Filter by Date Range
- **Test**: Filter performance records by date
- **Expected**: Only records in range displayed
- **Validation**: All displayed records match date criteria

---

## 6. Event Management

### Features

#### Event Operations
- Create events (name, date, type, location)
- Assign multiple companies to events
- View events with filtering and sorting
- Edit event details
- Delete events

#### Attendance Tracking
- Record attendance per company per event
- Attendance status: present, absent, clearing, late
- View attendance by company
- Sort and filter by attendance status

### Test Use Cases

#### TC-EVENT-001: Create Event
- **Test**: Create new event with date and location
- **Expected**: Event created
- **Validation**: Event appears in event list

#### TC-EVENT-002: Assign Companies to Event
- **Test**: Select multiple companies for event
- **Expected**: Companies assigned to event
- **Validation**: Companies see event in their dashboard

#### TC-EVENT-003: Edit Event Details
- **Test**: Update event name and date
- **Expected**: Changes saved
- **Validation**: Updated info displayed

#### TC-EVENT-004: Delete Event
- **Test**: Remove event
- **Expected**: Event deleted, attendance records removed
- **Validation**: Event not in list

#### TC-EVENT-005: Mark Attendance Present
- **Test**: Mark company as present for event
- **Expected**: Attendance recorded as present
- **Validation**: Status shown in attendance list

#### TC-EVENT-006: Mark Attendance Absent
- **Test**: Mark company as absent
- **Expected**: Attendance recorded as absent
- **Validation**: Status shown as absent

#### TC-EVENT-007: Mark Attendance Late
- **Test**: Mark company as late
- **Expected**: Attendance recorded as late
- **Validation**: Status shown as late

#### TC-EVENT-008: View Company Attendance History
- **Test**: View all events for specific company
- **Expected**: List of events with attendance status
- **Validation**: All events and statuses correct

#### TC-EVENT-009: Filter Events by Type
- **Test**: Filter events by event type
- **Expected**: Only matching events displayed
- **Validation**: All results match filter criteria

#### TC-EVENT-010: Search Events
- **Test**: Search events by name
- **Expected**: Matching events displayed
- **Validation**: Search results accurate

---

## 7. Analytics & Reporting Dashboard

### Features

#### Dashboard Statistics
- Total companies count
- Active companies count
- New companies (time-ranged)
- Pending notarization count
- Total users count
- Onboarding completion rate
- Coach-specific company count

#### Growth Metrics
- Period comparison (current vs previous)
- Growth percentage calculation
- Time range selection (week, month, quarter, year)
- Growth trend indicators

#### Data Visualizations
- Time series charts (company creation trends)
- Status distribution charts
- Level distribution charts
- Sales activity breakdown
- Top performers ranking

#### Role-Based Dashboard
- Admin: system-wide metrics
- Coach: assigned companies only

### Test Use Cases

#### TC-DASH-001: View Admin Dashboard
- **Test**: Login as admin, view dashboard
- **Expected**: All metrics displayed
- **Validation**: Counts match database totals

#### TC-DASH-002: View Coach Dashboard
- **Test**: Login as coach, view dashboard
- **Expected**: Only assigned companies shown
- **Validation**: Company count matches assignments

#### TC-DASH-003: View Total Companies
- **Test**: Check total companies widget
- **Expected**: Count of all companies displayed
- **Validation**: Count matches company table

#### TC-DASH-004: View Active Companies
- **Test**: Check active companies widget
- **Expected**: Count of active-status companies
- **Validation**: Count matches filtered query

#### TC-DASH-005: View New Companies (Week)
- **Test**: Select week view, check new companies
- **Expected**: Companies created this week counted
- **Validation**: Count matches date filter

#### TC-DASH-006: Compare Growth
- **Test**: View growth percentage for month
- **Expected**: Comparison to previous month shown
- **Validation**: Percentage calculation correct

#### TC-DASH-007: View Time Series Chart
- **Test**: Select month view, view creation trend chart
- **Expected**: Daily company creation displayed
- **Validation**: Chart data matches daily counts

#### TC-DASH-008: View Status Distribution
- **Test**: Check status pie chart
- **Expected**: Breakdown by status displayed
- **Validation**: Percentages sum to 100%

#### TC-DASH-009: View Top Performers
- **Test**: Check top performers widget
- **Expected**: Companies with highest ROAS listed
- **Validation**: Ranking matches performance data

#### TC-DASH-010: Filter Dashboard by Date Range
- **Test**: Change time range to quarter
- **Expected**: All metrics update for quarter
- **Validation**: Data reflects selected period

---

## 8. User Settings & Profile

### Features

#### Profile Management
- Edit name and email
- Email verification on change
- Account deletion

#### Password Management
- Change password with current password verification
- Password strength validation
- Rate limiting (6 attempts per minute)

#### Security
- Two-Factor Authentication setup
- 2FA confirmation and verification

#### Appearance
- Theme preference selection

### Test Use Cases

#### TC-PROFILE-001: Update Profile Name
- **Test**: Change user name in profile
- **Expected**: Name updated
- **Validation**: New name displayed throughout app

#### TC-PROFILE-002: Update Email
- **Test**: Change email address
- **Expected**: Email updated, verification sent
- **Validation**: New email requires verification

#### TC-PROFILE-003: Change Password
- **Test**: Update password with current password
- **Expected**: Password changed
- **Validation**: Can login with new password

#### TC-PROFILE-004: Change Password Invalid Current
- **Test**: Attempt password change with wrong current password
- **Expected**: Error displayed
- **Validation**: Password not changed

#### TC-PROFILE-005: Enable 2FA
- **Test**: Enable two-factor authentication
- **Expected**: QR code shown, confirmation required
- **Validation**: 2FA active after confirmation

#### TC-PROFILE-006: Disable 2FA
- **Test**: Disable two-factor authentication
- **Expected**: 2FA removed from account
- **Validation**: Login no longer requires 2FA code

#### TC-PROFILE-007: Delete Account
- **Test**: Request account deletion
- **Expected**: Confirmation prompt, account deleted
- **Validation**: Cannot login, data removed

#### TC-PROFILE-008: Change Theme
- **Test**: Select dark theme
- **Expected**: Theme applied
- **Validation**: UI reflects theme choice

---

## 9. Data Management & Media Handling

### Features

#### File Storage
- Company logos (Spatie Media Library)
- Owner profile pictures (Media Library)
- Performance attachments (S3)
- Partnership documents (S3)

#### Media Features
- Temporary signed URLs (10-minute expiry)
- Cascade deletion with records
- File type validation (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)

### Test Use Cases

#### TC-MEDIA-001: Upload Company Logo
- **Test**: Upload PNG logo for company
- **Expected**: Logo stored in media library
- **Validation**: Logo displayed in company profile

#### TC-MEDIA-002: Replace Company Logo
- **Test**: Upload new logo to replace existing
- **Expected**: Old logo deleted, new logo stored
- **Validation**: New logo displayed

#### TC-MEDIA-003: Upload Owner Photo
- **Test**: Upload JPG photo for owner
- **Expected**: Photo stored in media library
- **Validation**: Photo displayed in owner profile

#### TC-MEDIA-004: Upload Performance Attachment
- **Test**: Upload Excel file to performance record
- **Expected**: File stored in S3
- **Validation**: File accessible via temporary URL

#### TC-MEDIA-005: Access S3 File
- **Test**: Click link to view performance attachment
- **Expected**: Temporary signed URL generated
- **Validation**: File downloads/displays correctly

#### TC-MEDIA-006: URL Expiry
- **Test**: Access temporary URL after 10 minutes
- **Expected**: URL expired, access denied
- **Validation**: Error message shown

#### TC-MEDIA-007: Delete Company with Media
- **Test**: Delete company that has logo
- **Expected**: Company deleted, logo removed
- **Validation**: Media file cleaned from storage

#### TC-MEDIA-008: Invalid File Type
- **Test**: Attempt to upload .exe file
- **Expected**: Validation error
- **Validation**: File not uploaded, error shown

---

## 10. Data Querying & Filtering

### Features

#### Advanced Filtering
- Partial text search
- Multi-field search (name, email, etc.)
- Field-specific filters

#### Sorting
- Multi-field sorting
- Custom sort implementations
- Frontend two-way binding

#### Pagination
- Configurable page size (default 20)
- Cursor-based navigation
- Query string persistence

### Test Use Cases

#### TC-QUERY-001: Search Companies by Name
- **Test**: Enter partial company name in search
- **Expected**: Matching companies displayed
- **Validation**: Results include partial matches

#### TC-QUERY-002: Search Multiple Fields
- **Test**: Search with email address
- **Expected**: Company with matching email shown
- **Validation**: Search works across name and email

#### TC-QUERY-003: Sort by Name
- **Test**: Click name column header to sort
- **Expected**: Companies sorted alphabetically
- **Validation**: Order correct (A-Z or Z-A)

#### TC-QUERY-004: Sort by Multiple Columns
- **Test**: Sort by status, then by name
- **Expected**: Primary sort by status, secondary by name
- **Validation**: Multi-level sort correct

#### TC-QUERY-005: Paginate Results
- **Test**: Navigate to page 2 of companies
- **Expected**: Next 20 companies displayed
- **Validation**: Pagination controls work correctly

#### TC-QUERY-006: Change Page Size
- **Test**: Change results per page to 50
- **Expected**: 50 companies shown per page
- **Validation**: Pagination adjusts accordingly

#### TC-QUERY-007: Persist Filter State
- **Test**: Apply filters, navigate away, return
- **Expected**: Filters still applied
- **Validation**: Query string maintains state

#### TC-QUERY-008: Clear Filters
- **Test**: Clear all search and filter criteria
- **Expected**: All results shown
- **Validation**: Full dataset displayed

#### TC-QUERY-009: Filter with No Results
- **Test**: Search for non-existent company
- **Expected**: "No results" message shown
- **Validation**: Empty state displayed properly

#### TC-QUERY-010: Debounced Search
- **Test**: Type quickly in search field
- **Expected**: Search executes after 500ms pause
- **Validation**: No search spam, single request after typing stops

---

## Testing Priority Matrix

### Critical (P0) - Must Test Before Release
- User authentication (login, logout, password reset)
- Company creation and basic CRUD
- User role permissions (admin vs coach access)
- File uploads (logos, documents)
- Dashboard metrics accuracy

### High (P1) - Should Test Before Release
- Onboarding checklist functionality
- Performance record tracking
- Event management and attendance
- Search and filtering
- Owner management

### Medium (P2) - Test After Core Features
- 2FA setup and verification
- Advanced filtering and sorting
- Data visualizations and charts
- Theme preferences
- Email notifications

### Low (P3) - Test if Time Permits
- Edge cases in pagination
- S3 URL expiry behavior
- Cascade deletion verification
- Growth metric calculations
- Social media link validations

---

## Test Environment Requirements

### User Roles Needed
- Admin user account
- Coach user account (with assigned companies)
- Company owner account

### Test Data Requirements
- At least 20 companies with varied statuses
- At least 5 users with different roles
- Multiple company owners per company
- Performance records spanning different dates
- Completed and incomplete onboarding checklists
- Past and upcoming events with attendance data

### File Samples for Upload Testing
- Company logos (JPG, PNG)
- Owner photos (JPG, PNG)
- Performance reports (PDF, DOCX, XLSX)
- Partnership documents (PDF)
- Invalid file types (.exe, .zip) for negative testing

### Browser/Device Coverage
- Chrome (desktop)
- Firefox (desktop)
- Safari (desktop)
- Mobile browsers (iOS Safari, Android Chrome)
- Tablet devices

---

## Known Technical Constraints

1. **File Upload Limits**: Configured in server settings
2. **S3 URL Expiry**: 10-minute timeout for temporary URLs
3. **Rate Limiting**: 6 attempts per minute on password updates
4. **Search Debounce**: 500ms delay on search input
5. **Pagination Default**: 20 items per page
6. **Media Library**: Uses Spatie package for logo/photo management
7. **S3 Storage**: Direct storage for documents and attachments

---

## Feature Dependencies

### Companies depend on:
- Users (for coach assignment)
- Onboarding checklist templates
- Sponsor companies (optional)

### Performance records depend on:
- Companies must exist
- S3 configuration for file storage

### Events depend on:
- Companies for attendance tracking

### Dashboard depends on:
- All entity data (companies, users, performance)
- User role for filtering

---

## Regression Testing Checklist

When making changes, verify these core flows still work:

- [ ] User can login and logout
- [ ] Admin can create a new company
- [ ] Company appears in list with correct data
- [ ] Coach only sees assigned companies
- [ ] Files upload successfully
- [ ] Dashboard metrics display correctly
- [ ] Search returns accurate results
- [ ] Onboarding progress calculates correctly
- [ ] Performance records save with attachments
- [ ] Events track attendance properly

---

## Notes for QA Team

- Use database seeding to create consistent test data
- Clear cache between test runs
- Monitor S3 storage usage during file upload tests
- Test with realistic data volumes (100+ companies)
- Verify email delivery in staging environment
- Check mobile responsiveness on actual devices
- Test with slow network conditions
- Validate accessibility features (keyboard navigation, screen readers)

---

**End of Feature Documentation**
