# LUMINA - Test Cases Documentation

**Project**: E-Commerce Coaching Platform
**Version**: 1.0
**Last Updated**: 2026-01-16

---

## Table of Contents

- [Test Case Template](#test-case-template)
- [Authentication & User Management](#authentication--user-management)
- [Company Management](#company-management)
- [Company Owners Management](#company-owners-management)
- [Onboarding Checklist System](#onboarding-checklist-system)
- [Performance Tracking](#performance-tracking)
- [Event Management](#event-management)
- [Dashboard Analytics](#dashboard-analytics)
- [User Settings & Profile](#user-settings--profile)
- [Search Filter & Sort](#search-filter--sort)
- [Test Data Requirements](#test-data-requirements)

---

## Test Case Template

```
Test Case ID: TC-XXX-001
Test Name: [Descriptive name]
Category: [Feature Category]
Priority: [P0/P1/P2/P3]
Prerequisites: [What must be set up before testing]
Test Data: [Specific data needed]

Steps:
1. [Detailed step with exact actions]
   Expected: [What should happen]

2. [Next step]
   Expected: [What should happen]

Actual Result: [Leave blank for testers to fill]
Status: [Pass/Fail/Blocked]
Notes: [Any additional observations]
```

---

## Authentication & User Management

### TC-AUTH-001: User Registration (New User Signup)

**Category**: Authentication
**Priority**: P0 - Critical
**Prerequisites**:
- Application is running and accessible
- Database is empty or no user exists with test email
- Email service is configured

**Test Data**:
- Name: `John Doe`
- Email: `johndoe@example.com`
- Password: `SecurePass123!`
- Password Confirmation: `SecurePass123!`

**Steps**:

1. Navigate to the application homepage
   - **URL**: `http://[base-url]/`
   - **Expected**: Welcome page loads with Register link visible

2. Click on "Register" or "Sign Up" link
   - **Expected**: Registration form page loads
   - **Expected**: Form contains fields: Name, Email, Password, Password Confirmation
   - **Expected**: Terms and conditions checkbox present

3. Enter Name: `John Doe`
   - **Expected**: Field accepts text input, no errors

4. Enter Email: `johndoe@example.com`
   - **Expected**: Field accepts valid email format
   - **Expected**: No validation error shown

5. Enter Password: `SecurePass123!`
   - **Expected**: Password field masks input (shows dots/asterisks)
   - **Expected**: Password strength indicator appears (if implemented)

6. Enter Password Confirmation: `SecurePass123!`
   - **Expected**: Field masks input
   - **Expected**: No mismatch error shown

7. Check "I agree to terms and conditions" checkbox
   - **Expected**: Checkbox becomes checked

8. Click "Register" or "Create Account" button
   - **Expected**: Form submits
   - **Expected**: Loading indicator appears briefly
   - **Expected**: Redirect to email verification notice page
   - **Expected**: Success message: "Registration successful! Please verify your email."

9. Check email inbox for verification email
   - **Expected**: Email received within 2 minutes
   - **Expected**: Email contains verification link
   - **Expected**: Email from: noreply@lumina.com (or configured sender)
   - **Expected**: Subject line mentions email verification

10. Click verification link in email
    - **Expected**: Redirect to application
    - **Expected**: Email verified confirmation message
    - **Expected**: Redirect to login page or dashboard

11. Verify user can now login
    - **Expected**: Login with registered credentials succeeds

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- New user record created in database
- User email is verified
- User can authenticate with created credentials

**Notes**:
- Test variations with invalid data (see TC-AUTH-002)
- Verify email uniqueness constraint (see TC-AUTH-003)

---

### TC-AUTH-002: User Registration with Invalid Data

**Category**: Authentication
**Priority**: P0 - Critical
**Prerequisites**: Application is running

**Test Data**:
- Invalid Email: `notanemail`
- Weak Password: `123`
- Mismatched Password: `Pass123!` vs `Pass456!`

**Steps**:

1. Navigate to registration page
   - **URL**: `http://[base-url]/register`

2. **Subtest A: Invalid Email Format**
   - Enter Name: `Test User`
   - Enter Email: `notanemail` (invalid format)
   - Enter Password: `SecurePass123!`
   - Enter Password Confirmation: `SecurePass123!`
   - Click "Register"
   - **Expected**: Validation error displayed
   - **Expected**: Error message: "Please enter a valid email address"
   - **Expected**: Form does not submit
   - **Expected**: Email field highlighted in red

3. **Subtest B: Password Too Short**
   - Enter Name: `Test User`
   - Enter Email: `testuser@example.com`
   - Enter Password: `123` (too short)
   - Enter Password Confirmation: `123`
   - Click "Register"
   - **Expected**: Validation error displayed
   - **Expected**: Error message: "Password must be at least 8 characters"
   - **Expected**: Form does not submit
   - **Expected**: Password field highlighted in red

4. **Subtest C: Password Mismatch**
   - Enter Name: `Test User`
   - Enter Email: `testuser@example.com`
   - Enter Password: `SecurePass123!`
   - Enter Password Confirmation: `DifferentPass456!`
   - Click "Register"
   - **Expected**: Validation error displayed
   - **Expected**: Error message: "Passwords do not match"
   - **Expected**: Form does not submit
   - **Expected**: Password confirmation field highlighted

5. **Subtest D: Empty Required Fields**
   - Leave Name field empty
   - Leave Email field empty
   - Leave Password field empty
   - Click "Register"
   - **Expected**: Multiple validation errors displayed
   - **Expected**: All empty required fields highlighted
   - **Expected**: Error messages appear above or next to each field

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Notes**:
- Verify client-side and server-side validation both work
- Check that error messages are user-friendly

---

### TC-AUTH-003: User Login with Valid Credentials

**Category**: Authentication
**Priority**: P0 - Critical
**Prerequisites**:
- User account exists and is verified
- Test user credentials: `admin@lumina.com` / `password123`

**Test Data**:
- Email: `admin@lumina.com`
- Password: `password123`

**Steps**:

1. Navigate to login page
   - **URL**: `http://[base-url]/login`
   - **Expected**: Login form loads
   - **Expected**: Email and Password fields visible
   - **Expected**: "Remember Me" checkbox visible
   - **Expected**: "Forgot Password?" link visible

2. Enter Email: `admin@lumina.com`
   - **Expected**: Field accepts input
   - **Expected**: No validation errors

3. Enter Password: `password123`
   - **Expected**: Password masked
   - **Expected**: No validation errors

4. (Optional) Check "Remember Me" checkbox
   - **Expected**: Checkbox becomes checked

5. Click "Login" or "Sign In" button
   - **Expected**: Form submits
   - **Expected**: Loading indicator appears
   - **Expected**: No error messages displayed

6. Verify successful login
   - **Expected**: Redirect to `/companies` page (based on routes)
   - **Expected**: URL changes to: `http://[base-url]/companies`
   - **Expected**: User name or avatar visible in header/navigation
   - **Expected**: Logout option available in user menu

7. Check session persistence
   - **Expected**: Refresh page - user remains logged in
   - **Expected**: Session data maintained

8. Verify authentication middleware
   - **Expected**: User can access protected routes
   - **Expected**: Try accessing `/dashboard` - should succeed

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- User session is active
- User can access protected routes
- Session cookie set in browser

**Notes**:
- If "Remember Me" is checked, verify persistent session across browser restarts

---

### TC-AUTH-004: User Login with Invalid Credentials

**Category**: Authentication
**Priority**: P0 - Critical
**Prerequisites**: Application is running

**Test Data**:
- Valid Email: `admin@lumina.com`
- Wrong Password: `wrongpassword`

**Steps**:

1. Navigate to login page
   - **URL**: `http://[base-url]/login`

2. **Subtest A: Wrong Password**
   - Enter Email: `admin@lumina.com`
   - Enter Password: `wrongpassword`
   - Click "Login"
   - **Expected**: Error message displayed
   - **Expected**: Message: "These credentials do not match our records" or similar
   - **Expected**: User remains on login page
   - **Expected**: Email field retains value
   - **Expected**: Password field is cleared

3. **Subtest B: Non-existent Email**
   - Enter Email: `nonexistent@example.com`
   - Enter Password: `password123`
   - Click "Login"
   - **Expected**: Error message displayed
   - **Expected**: Same generic message (security best practice)
   - **Expected**: No indication whether email exists or not

4. **Subtest C: Empty Fields**
   - Leave both fields empty
   - Click "Login"
   - **Expected**: Validation errors displayed
   - **Expected**: "Email is required" message
   - **Expected**: "Password is required" message

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Notes**:
- Verify rate limiting after multiple failed attempts
- Generic error messages prevent username enumeration

---

### TC-AUTH-005: Password Reset Flow

**Category**: Authentication
**Priority**: P1 - High
**Prerequisites**:
- User account exists: `testuser@example.com`
- Email service configured

**Test Data**:
- Email: `testuser@example.com`
- New Password: `NewSecurePass123!`

**Steps**:

1. Navigate to login page
   - **URL**: `http://[base-url]/login`

2. Click "Forgot Password?" link
   - **Expected**: Redirect to password reset request page
   - **Expected**: URL: `/forgot-password`
   - **Expected**: Email input field displayed

3. Enter Email: `testuser@example.com`
   - **Expected**: Field accepts input

4. Click "Send Password Reset Link" button
   - **Expected**: Success message: "Password reset link sent to your email"
   - **Expected**: Form submitted successfully
   - **Expected**: Stay on same page or redirect to confirmation

5. Check email inbox
   - **Expected**: Email received within 2 minutes
   - **Expected**: Subject: "Reset Password Notification"
   - **Expected**: Email contains reset link
   - **Expected**: Link format: `http://[base-url]/reset-password?token=...`

6. Click reset link in email
   - **Expected**: Redirect to password reset form
   - **Expected**: Email field pre-filled
   - **Expected**: New password fields visible
   - **Expected**: Token embedded in URL or form

7. Enter New Password: `NewSecurePass123!`
   - **Expected**: Password field accepts input

8. Enter Password Confirmation: `NewSecurePass123!`
   - **Expected**: Confirmation field accepts input

9. Click "Reset Password" button
   - **Expected**: Success message: "Password has been reset successfully"
   - **Expected**: Redirect to login page

10. Login with new password
    - Email: `testuser@example.com`
    - Password: `NewSecurePass123!`
    - **Expected**: Login successful
    - **Expected**: Redirect to dashboard/companies page

11. Verify old password no longer works
    - Logout
    - Try logging in with old password
    - **Expected**: Login fails with error message

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Password updated in database
- Old password invalidated
- Reset token consumed/expired

**Notes**:
- Test token expiration (tokens should expire after configured time, e.g., 60 minutes)
- Verify token can only be used once

---

### TC-AUTH-006: Two-Factor Authentication Setup

**Category**: Authentication
**Priority**: P1 - High
**Prerequisites**:
- User logged in as `admin@lumina.com`
- 2FA not yet enabled for this account
- Authenticator app available (Google Authenticator, Authy, etc.)

**Steps**:

1. Login as admin user
   - **URL**: `http://[base-url]/login`
   - Use credentials: `admin@lumina.com` / `password123`

2. Navigate to user settings/profile
   - Click on user avatar/menu in header
   - Click "Settings" or "Profile"
   - **Expected**: Settings page loads
   - **Expected**: URL: `/user/profile` or `/settings`

3. Find Two-Factor Authentication section
   - **Expected**: Section visible with "Enable 2FA" button
   - **Expected**: Status shows "Disabled" or "Not Enabled"

4. Click "Enable Two-Factor Authentication" button
   - **Expected**: Modal or page section expands
   - **Expected**: QR code displayed
   - **Expected**: Text-based secret key displayed (for manual entry)
   - **Expected**: Instructions for scanning QR code

5. Open authenticator app on mobile device
   - Use Google Authenticator, Authy, or similar app
   - **Expected**: App is ready to add new account

6. Scan QR code with authenticator app
   - **Expected**: App adds account: "LUMINA (admin@lumina.com)"
   - **Expected**: 6-digit code begins generating

7. Enter 6-digit code from authenticator app
   - Input field for confirmation code should be visible
   - Enter current 6-digit code
   - **Expected**: Field accepts 6 digits

8. Click "Confirm" or "Enable" button
   - **Expected**: Success message: "Two-factor authentication enabled"
   - **Expected**: 2FA status changes to "Enabled"
   - **Expected**: Recovery codes displayed (save these)

9. Logout and attempt to login again
   - Navigate to `/logout`
   - Return to login page
   - Enter email and password
   - **Expected**: Additional step: "Enter 2FA Code"
   - **Expected**: 6-digit code input field displayed

10. Enter 6-digit code from authenticator app
    - Get current code from app
    - Enter the code
    - Click "Verify"
    - **Expected**: Login successful
    - **Expected**: Redirect to companies page

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- 2FA enabled for user account
- Login requires both password and 2FA code
- Recovery codes generated and can be used

**Notes**:
- Test with invalid 2FA code to verify rejection
- Test recovery code functionality if implemented

---

### TC-USER-001: Create User as Admin

**Category**: User Management
**Priority**: P1 - High
**Prerequisites**:
- Logged in as admin user
- Access to user management page

**Test Data**:
- Name: `Coach Mike Johnson`
- Email: `coach.mike@lumina.com`
- Role: `coach`

**Steps**:

1. Login as admin user
   - Use admin credentials

2. Navigate to Users page
   - **URL**: `http://[base-url]/users`
   - **Expected**: Users list page loads
   - **Expected**: Table with existing users displayed
   - **Expected**: "Create User" or "Add User" button visible

3. Click "Create User" button
   - **Expected**: Create user form/modal opens
   - **Expected**: Form fields visible:
     - Name (required)
     - Email (required)
     - Role dropdown (required)
     - Password (optional or auto-generated)

4. Fill in user details:
   - Name: `Coach Mike Johnson`
   - Email: `coach.mike@lumina.com`
   - Role: Select `coach` from dropdown
   - **Expected**: All fields accept input
   - **Expected**: No validation errors

5. Click "Create" or "Save" button
   - **Expected**: Loading indicator appears
   - **Expected**: Success message: "User created successfully"
   - **Expected**: Form closes
   - **Expected**: New user appears in users list

6. Verify new user in list
   - **Expected**: User row visible with:
     - Name: `Coach Mike Johnson`
     - Email: `coach.mike@lumina.com`
     - Role: `Coach`
   - **Expected**: User has actions: Edit, Delete

7. Verify auto-generated credentials (if applicable)
   - **Expected**: Temporary password displayed or emailed to user
   - **Expected**: User can login with provided credentials

8. Test new user login
   - Logout as admin
   - Login as `coach.mike@lumina.com` with provided password
   - **Expected**: Login successful
   - **Expected**: User sees coach dashboard
   - **Expected**: Limited permissions based on coach role

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- New user record created in database
- User can authenticate
- User has correct role permissions

**Notes**:
- Verify email uniqueness constraint (cannot create duplicate email)
- Test creating users with different roles (admin, owner, coach)

---

### TC-USER-002: Search and Filter Users

**Category**: User Management
**Priority**: P2 - Medium
**Prerequisites**:
- Logged in as admin
- Multiple users exist in database (at least 10)

**Test Data**:
- Search term: `mike`
- Filter by role: `coach`

**Steps**:

1. Navigate to Users page
   - **URL**: `http://[base-url]/users`
   - **Expected**: Users list page loads with all users

2. Locate search bar
   - **Expected**: Search input field visible at top of page
   - **Expected**: Placeholder text: "Search by name or email"

3. **Subtest A: Search by Name**
   - Type `mike` in search bar
   - Wait 500ms (debounce delay)
   - **Expected**: Results filter automatically
   - **Expected**: Only users with "mike" in name displayed
   - **Expected**: Search is case-insensitive
   - **Expected**: URL updates with query parameter: `?search=mike`

4. Clear search
   - Clear search input or click X button
   - **Expected**: All users displayed again

5. **Subtest B: Search by Email**
   - Type `@lumina.com` in search bar
   - **Expected**: All users with @lumina.com email displayed
   - **Expected**: Partial email match works

6. **Subtest C: Search with No Results**
   - Type `zzznonexistent` in search bar
   - **Expected**: "No users found" message displayed
   - **Expected**: Empty state shown
   - **Expected**: No user rows visible

7. Clear search again

8. **Subtest D: Filter by Role**
   - Locate role filter dropdown (if available)
   - Select `coach` from role filter
   - **Expected**: Only users with coach role displayed
   - **Expected**: URL updates with filter parameter

9. **Subtest E: Combine Search and Filter**
   - Keep role filter as `coach`
   - Enter `mike` in search bar
   - **Expected**: Only coaches with "mike" in name/email shown
   - **Expected**: Both filters apply simultaneously

10. Reset all filters
    - Clear search
    - Reset role filter to "All"
    - **Expected**: Full user list displayed

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Notes**:
- Verify search debounce works (doesn't search on every keystroke)
- Check pagination works with filtered results

---

## Company Management

### TC-COMP-001: Create New Company (Admin)

**Category**: Company Management
**Priority**: P0 - Critical
**Prerequisites**:
- Logged in as admin user
- Coach users exist in system for assignment

**Test Data**:
```
Company Name: Tech Innovators Inc
Email: info@techinnovators.com
Phone: +1-555-0123
Address: 123 Innovation Drive, Tech City, TC 12345
Status: active
Level: empowerment
Sales Activity: generating
Coach: Select existing coach
Logo: company-logo.png (500x500, 200KB)
```

**Steps**:

1. Navigate to Companies page
   - **URL**: `http://[base-url]/companies`
   - **Expected**: Companies list loads
   - **Expected**: "Create Company" button visible

2. Click "Create Company" button
   - **Expected**: Redirect to create company form
   - **Expected**: URL: `/companies/create`
   - **Expected**: Form loads with all required fields

3. Fill in Company Information:

   **Step 3a**: Enter Company Name
   - Input: `Tech Innovators Inc`
   - **Expected**: Field accepts text

   **Step 3b**: Enter Email
   - Input: `info@techinnovators.com`
   - **Expected**: Field accepts valid email

   **Step 3c**: Enter Phone
   - Input: `+1-555-0123`
   - **Expected**: Field accepts phone format

   **Step 3d**: Enter Address
   - Input: `123 Innovation Drive, Tech City, TC 12345`
   - **Expected**: Field accepts text

   **Step 3e**: Select Status
   - Dropdown: Select `Active`
   - **Expected**: Status selected

   **Step 3f**: Select Level
   - Dropdown: Select `Empowerment`
   - **Expected**: Level selected

   **Step 3g**: Select Sales Activity
   - Dropdown: Select `Generating`
   - **Expected**: Activity level selected

   **Step 3h**: Select Coach
   - Dropdown: Select coach from list
   - **Expected**: Coach assigned

4. Upload Company Logo
   - Click "Choose File" or drag-drop logo
   - Select `company-logo.png`
   - **Expected**: File name displayed
   - **Expected**: Preview image shown
   - **Expected**: File size validation passes (< 5MB)

5. Add Company Owners (at least one required)

   **Step 5a**: Click "Add Owner" button
   - **Expected**: Owner form section appears

   **Step 5b**: Fill owner details:
   - Name: `Jane Smith`
   - Email: `jane.smith@techinnovators.com`
   - Phone: `+1-555-0124`
   - Address: `456 Owner Street`
   - **Expected**: All fields accept input

   **Step 5c**: Upload owner photo (optional)
   - Select `owner-photo.jpg`
   - **Expected**: Photo preview shown

6. Review all entered data
   - Scroll through form
   - Verify all fields filled correctly

7. Click "Create Company" or "Save" button
   - **Expected**: Loading indicator appears
   - **Expected**: Form validation passes
   - **Expected**: Success message: "Company created successfully"
   - **Expected**: Redirect to companies list or company details page

8. Verify company appears in list
   - Navigate to `/companies` if not there
   - **Expected**: New company row visible
   - **Expected**: Company name: `Tech Innovators Inc`
   - **Expected**: Status badge shows "Active"
   - **Expected**: Coach name displayed
   - **Expected**: Logo thumbnail visible

9. Click on company name to view details
   - **Expected**: Redirect to company details page
   - **Expected**: URL: `/companies/{id}/details`
   - **Expected**: All entered information displayed correctly
   - **Expected**: Owner information visible
   - **Expected**: Onboarding progress at 0%

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Company record created in database
- Company owner created and linked
- Logo uploaded to media library
- Onboarding checklist initialized
- Company visible to assigned coach

**Notes**:
- Test with multiple owners
- Verify required field validation

---

### TC-COMP-002: External Company Onboarding Application

**Category**: Company Management
**Priority**: P0 - Critical
**Prerequisites**:
- Application publicly accessible
- No authentication required for onboarding form

**Test Data**:
```
Company Name: E-Shop Masters
Email: contact@eshopmasters.com
Phone: +1-555-9999
Address: 789 Commerce Ave, Business City, BC 67890
Logo: eshop-logo.png
Proof of Payment: payment-receipt.jpg

Owner 1:
Name: Robert Chen
Email: robert@eshopmasters.com
Phone: +1-555-9991
Address: 321 Main Street
Facebook: https://facebook.com/robertchen
Birthdate: 1985-05-15
Profile Picture: robert-photo.jpg
Signature/ID: robert-id.pdf
```

**Steps**:

1. Navigate to public onboarding page
   - **URL**: `http://[base-url]/companies/onboarding`
   - **Expected**: Onboarding form loads
   - **Expected**: No login required
   - **Expected**: "Partnership Application" or similar heading visible

2. Fill Company Information Section:

   **Step 2a**: Enter Company Name
   - Input: `E-Shop Masters`
   - **Expected**: Field required, accepts text

   **Step 2b**: Enter Company Email
   - Input: `contact@eshopmasters.com`
   - **Expected**: Email validation passes

   **Step 2c**: Enter Company Phone
   - Input: `+1-555-9999`
   - **Expected**: Field accepts phone number

   **Step 2d**: Enter Company Address
   - Input: `789 Commerce Ave, Business City, BC 67890`
   - **Expected**: Textarea accepts full address

3. Upload Company Logo
   - Click "Upload Logo" button
   - Select: `eshop-logo.png` (500KB, PNG)
   - **Expected**: File uploads
   - **Expected**: Preview shown
   - **Expected**: Validation: image, max 5MB, jpeg/png/jpg/gif/webp

4. Upload Proof of Payment
   - Click "Upload Proof of Payment"
   - Select: `payment-receipt.jpg` (1MB)
   - **Expected**: File uploads
   - **Expected**: Preview shown
   - **Expected**: Validation: image, max 5MB

5. Add Owner Information (minimum 1 required):

   **Step 5a**: Owner 1 - Basic Info
   - Name: `Robert Chen`
   - Email: `robert@eshopmasters.com`
   - Phone: `+1-555-9991`
   - Address: `321 Main Street`
   - **Expected**: All fields required and accept input

   **Step 5b**: Owner 1 - Social Media
   - Facebook: `https://facebook.com/robertchen`
   - **Expected**: URL validation passes
   - **Expected**: Must be facebook.com domain

   **Step 5c**: Owner 1 - Birthdate
   - Birthdate: `1985-05-15` (use date picker)
   - **Expected**: Date picker opens
   - **Expected**: Date cannot be in future
   - **Expected**: Date must be after 1900-01-01

   **Step 5d**: Owner 1 - Profile Picture
   - Upload: `robert-photo.jpg` (2MB)
   - **Expected**: Image preview shown
   - **Expected**: Validation: image, max 5MB

   **Step 5e**: Owner 1 - ID with Signature
   - Upload: `robert-id.pdf` (5MB)
   - **Expected**: File uploads successfully
   - **Expected**: Validation: jpeg/png/jpg/pdf, max 10MB
   - **Expected**: File name displayed

6. Add Additional Owner (Optional - click "Add Another Owner")
   - **Expected**: New owner form section appears
   - **Expected**: Can add multiple owners
   - **Expected**: Can remove added owner sections

7. Review all information
   - Scroll through entire form
   - **Expected**: All sections completed
   - **Expected**: All required files uploaded
   - **Expected**: Required field indicators (*) clear

8. Submit application
   - Click "Submit Application" button
   - **Expected**: Confirmation dialog appears (optional)
   - **Expected**: "Are you sure?" message

9. Confirm submission
   - Click "Yes, Submit" or "Confirm"
   - **Expected**: Loading indicator appears
   - **Expected**: Form disabled during submission
   - **Expected**: File uploads progress

10. Verify success
    - **Expected**: Success message displayed
    - **Expected**: Message: "Application submitted successfully! We'll review and contact you soon."
    - **Expected**: Confirmation number or reference ID displayed
    - **Expected**: Form clears or redirect to thank you page

11. Verify admin can see application
    - Login as admin
    - Navigate to `/companies/unverified`
    - **Expected**: New application listed
    - **Expected**: Company name: `E-Shop Masters`
    - **Expected**: Status: "Pending" or "Unverified"
    - **Expected**: "Review" or "Verify" button available

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Company application saved in database
- Status: unverified/pending
- All files uploaded to S3
- Admin notified of new application
- Company awaiting admin review

**Validation Tests** (separate sub-tests):
- Submit without required fields - should show errors
- Upload invalid file types - should reject
- Upload oversized files (>5MB logo) - should reject
- Invalid Facebook URL - should show error
- Future birthdate - should reject
- Email format validation - invalid emails rejected

**Notes**:
- This is a public-facing form - security is critical
- File upload limits enforced (5MB images, 10MB PDFs)
- Multiple owners supported
- Form should have good UX with clear error messages

---

### TC-COMP-003: Edit Company Information

**Category**: Company Management
**Priority**: P1 - High
**Prerequisites**:
- Logged in as admin
- Company exists: "Tech Innovators Inc" (ID: 1)

**Test Data**:
- Updated Name: `Tech Innovators International`
- Updated Email: `global@techinnovators.com`
- Updated Status: `inactive`

**Steps**:

1. Navigate to Companies list
   - **URL**: `http://[base-url]/companies`

2. Find company "Tech Innovators Inc"
   - Use search if needed
   - **Expected**: Company row visible

3. Click "Edit" button or click on company name
   - **Expected**: Redirect to edit page
   - **Expected**: URL: `/companies/1/edit`
   - **Expected**: Edit form loads with current data pre-filled

4. Verify pre-filled data
   - **Expected**: Company Name field shows: `Tech Innovators Inc`
   - **Expected**: Email shows: `info@techinnovators.com`
   - **Expected**: All other fields show current values

5. Update Company Name
   - Clear current name
   - Enter: `Tech Innovators International`
   - **Expected**: Field updates

6. Update Email
   - Clear current email
   - Enter: `global@techinnovators.com`
   - **Expected**: Email validation passes

7. Update Status
   - Change dropdown from `Active` to `Inactive`
   - **Expected**: New status selected

8. Click "Update" or "Save Changes" button
   - **Expected**: Loading indicator
   - **Expected**: Success message: "Company updated successfully"
   - **Expected**: Redirect to company details or companies list

9. Verify changes saved
   - Navigate to company details page
   - **Expected**: Name shows: `Tech Innovators International`
   - **Expected**: Email shows: `global@techinnovators.com`
   - **Expected**: Status badge shows: `Inactive`

10. Check company in list
    - Navigate to `/companies`
    - Find updated company
    - **Expected**: Updated name visible in list
    - **Expected**: Status badge shows `Inactive`

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Company information updated in database
- Changes reflected in all views
- Timestamps updated (updated_at)

**Notes**:
- Test updating logo (replace existing)
- Test validation on edit (invalid email, etc.)

---

### TC-COMP-004: Assign Coach to Company

**Category**: Company Management
**Priority**: P1 - High
**Prerequisites**:
- Logged in as admin
- Company exists without coach assigned
- Coach user exists: "Coach Mike Johnson"

**Steps**:

1. Navigate to company details
   - **URL**: `http://[base-url]/companies/1/details`
   - **Expected**: Company details page loads

2. Check current coach assignment
   - **Expected**: Coach field shows "Not Assigned" or empty

3. Click "Edit" to enter edit mode
   - Navigate to edit page: `/companies/1/edit`

4. Locate Coach assignment dropdown
   - **Expected**: Dropdown labeled "Coach" or "Assign Coach"
   - **Expected**: List of all coach users visible

5. Select coach from dropdown
   - Select: `Coach Mike Johnson`
   - **Expected**: Coach selected
   - **Expected**: Coach name appears in dropdown

6. Save changes
   - Click "Update" or "Save"
   - **Expected**: Success message displayed
   - **Expected**: Changes saved

7. Verify coach assignment
   - View company details page
   - **Expected**: Coach name visible: `Coach Mike Johnson`
   - **Expected**: Coach's email or link to profile shown

8. Verify coach can see company
   - Logout as admin
   - Login as Coach Mike: `coach.mike@lumina.com`
   - Navigate to dashboard or companies page
   - **Expected**: Coach sees "Tech Innovators" in their companies list
   - **Expected**: Coach can access company details
   - **Expected**: Dashboard shows company count including this one

9. Verify coach permissions
   - As coach, attempt to edit company
   - **Expected**: Coach has appropriate edit permissions
   - OR **Expected**: Coach can view but not edit (based on role permissions)

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Coach assigned to company
- Coach can see company in dashboard
- Relationship recorded in database

**Notes**:
- Test reassigning to different coach
- Test removing coach assignment (set to null)

---

### TC-COMP-005: Search and Filter Companies

**Category**: Company Management
**Priority**: P1 - High
**Prerequisites**:
- Multiple companies exist (at least 20)
- Companies with various statuses, levels, and activities

**Test Data**:
- Search term: `tech`
- Filter: Status = `active`
- Sort: By Name (A-Z)

**Steps**:

1. Navigate to Companies page
   - **URL**: `http://[base-url]/companies`
   - **Expected**: Full list of companies displayed (20 per page)

2. **Subtest A: Search by Company Name**
   - Locate search bar at top of page
   - Type: `tech`
   - Wait 500ms for debounce
   - **Expected**: Results filter automatically
   - **Expected**: Only companies with "tech" in name shown
   - **Expected**: Case-insensitive search
   - **Expected**: URL updates: `?search=tech`
   - **Expected**: Partial matches work

3. Note number of results
   - **Expected**: Result count displayed (e.g., "Showing 3 companies")

4. Clear search
   - Clear search input
   - **Expected**: All companies reappear

5. **Subtest B: Search by Email**
   - Type in search: `@gmail.com`
   - **Expected**: Companies with Gmail emails displayed
   - **Expected**: Search works across name and email fields

6. Clear search again

7. **Subtest C: Filter by Status**
   - Locate Status filter dropdown
   - Select: `Active`
   - **Expected**: Only active companies shown
   - **Expected**: All results have green "Active" badge
   - **Expected**: URL updates: `?filter[status]=active`

8. **Subtest D: Filter by Level**
   - Locate Level filter dropdown (if separate)
   - Select: `Empowerment`
   - **Expected**: Only companies at empowerment level shown
   - **Expected**: Active status filter still applied

9. **Subtest E: Combine Search and Filters**
   - Keep filters: Status=Active, Level=Empowerment
   - Enter search: `tech`
   - **Expected**: Results match ALL criteria
   - **Expected**: Active, Empowerment-level companies with "tech" in name

10. **Subtest F: Sort Results**
    - Click "Name" column header
    - **Expected**: Companies sort alphabetically A-Z
    - **Expected**: Sort indicator (arrow) appears
    - Click "Name" again
    - **Expected**: Sort reverses to Z-A
    - **Expected**: Arrow direction changes

11. **Subtest G: Sort by Other Columns**
    - Click "Status" column
    - **Expected**: Sort by status
    - Click "Level" column
    - **Expected**: Sort by level

12. **Subtest H: Pagination with Filters**
    - If more than 20 results, check pagination
    - Click "Next Page" or page 2
    - **Expected**: Next 20 filtered results shown
    - **Expected**: Filters remain applied
    - **Expected**: URL includes page: `?search=tech&page=2`

13. **Subtest I: Clear All Filters**
    - Click "Clear Filters" button or manually clear
    - **Expected**: All filters removed
    - **Expected**: Full company list displayed
    - **Expected**: URL returns to: `/companies`

14. **Subtest J: No Results**
    - Search for: `zzznonexistent`
    - **Expected**: "No companies found" message
    - **Expected**: Empty state illustration or message
    - **Expected**: Suggestion to clear filters

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Notes**:
- Verify filter/search state persists on page reload
- Test with different combinations
- Verify performance with large dataset

---

### TC-COMP-006: Delete Company

**Category**: Company Management
**Priority**: P1 - High
**Prerequisites**:
- Logged in as admin
- Test company exists that can be deleted
- Company has associated data (owners, onboarding records)

**Test Data**:
- Company to delete: "Test Company for Deletion" (ID: 99)

**Steps**:

1. Navigate to Companies list
   - **URL**: `http://[base-url]/companies`

2. Find test company
   - Search or scroll to: "Test Company for Deletion"
   - **Expected**: Company row visible

3. Locate Delete button
   - **Expected**: Delete button/icon in actions column
   - **Expected**: Usually red trash icon or "Delete" text

4. Click Delete button
   - **Expected**: Confirmation dialog appears
   - **Expected**: Dialog message: "Are you sure you want to delete this company?"
   - **Expected**: Warning about permanent action
   - **Expected**: List of associated data that will be deleted:
     - Owners
     - Onboarding records
     - Performance records
     - Attendance records

5. Click "Cancel" first (test cancellation)
   - **Expected**: Dialog closes
   - **Expected**: Company not deleted
   - **Expected**: Company still in list

6. Click Delete button again
   - Confirmation dialog appears again

7. Click "Delete" or "Confirm" in dialog
   - **Expected**: Loading indicator
   - **Expected**: Dialog closes
   - **Expected**: Success message: "Company deleted successfully"

8. Verify company removed from list
   - **Expected**: Company no longer visible in list
   - **Expected**: Row disappears
   - **Expected**: Company count decreases by 1

9. Attempt to access deleted company details
   - Navigate to: `/companies/99/details`
   - **Expected**: 404 Not Found error
   - OR **Expected**: "Company not found" message
   - OR **Expected**: Redirect to companies list with error

10. Verify associated data deleted (database check or admin verification)
    - Owners deleted or orphaned
    - Onboarding records removed
    - Performance records removed
    - Files deleted from S3/media library

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Company record deleted from database
- Associated owners deleted/unlinked
- Related records cleaned up
- Files removed from storage
- Cannot be recovered (unless soft delete)

**Notes**:
- Verify cascade deletion works correctly
- Check if soft delete is implemented (deleted_at timestamp)
- Test deletion with companies that have performance records, events, etc.
- Verify coach no longer sees company after deletion

---

## Company Owners Management

### TC-OWNER-001: Add Owner to Existing Company

**Category**: Company Owners
**Priority**: P1 - High
**Prerequisites**:
- Company exists: "Tech Innovators Inc" (ID: 1)
- Logged in as admin or authorized user

**Test Data**:
```
Owner Name: Sarah Williams
Email: sarah.williams@techinnovators.com
Phone: +1-555-2222
Address: 789 Executive Lane, Tech City
Facebook: https://facebook.com/sarahwilliams
Birthdate: 1990-08-22
Profile Picture: sarah-photo.jpg
```

**Steps**:

1. Navigate to company details page
   - **URL**: `http://[base-url]/companies/1/details`
   - **Expected**: Company details page loads
   - **Expected**: Current owners section visible

2. Locate Owners section
   - **Expected**: "Owners" section shows existing owners
   - **Expected**: "Add Owner" button visible

3. Click "Add Owner" button
   - **Expected**: Add owner form appears (modal or inline)
   - **Expected**: Form fields visible:
     - Name (required)
     - Email (required)
     - Phone (required)
     - Address (optional)
     - Facebook (optional)
     - Birthdate (optional)
     - Profile Picture (optional)

4. Fill in owner information:

   **Step 4a**: Enter Name
   - Input: `Sarah Williams`
   - **Expected**: Field accepts text

   **Step 4b**: Enter Email
   - Input: `sarah.williams@techinnovators.com`
   - **Expected**: Email validation passes
   - **Expected**: Check for uniqueness

   **Step 4c**: Enter Phone
   - Input: `+1-555-2222`
   - **Expected**: Phone format accepted

   **Step 4d**: Enter Address
   - Input: `789 Executive Lane, Tech City`
   - **Expected**: Text area accepts full address

   **Step 4e**: Enter Facebook URL
   - Input: `https://facebook.com/sarahwilliams`
   - **Expected**: URL validation passes
   - **Expected**: Must be Facebook domain

   **Step 4f**: Select Birthdate
   - Open date picker
   - Select: `1990-08-22`
   - **Expected**: Date selected
   - **Expected**: Cannot select future date

   **Step 4g**: Upload Profile Picture
   - Click "Upload Photo"
   - Select: `sarah-photo.jpg` (1.5MB)
   - **Expected**: Image preview shown
   - **Expected**: Validation: max 5MB, image format

5. Review entered information
   - **Expected**: All fields populated correctly
   - **Expected**: No validation errors

6. Click "Add Owner" or "Save" button
   - **Expected**: Loading indicator
   - **Expected**: Form validation passes
   - **Expected**: Success message: "Owner added successfully"
   - **Expected**: Form closes

7. Verify owner appears in owners list
   - **Expected**: New owner card/row visible
   - **Expected**: Name: `Sarah Williams`
   - **Expected**: Email: `sarah.williams@techinnovators.com`
   - **Expected**: Phone: `+1-555-2222`
   - **Expected**: Profile picture displayed
   - **Expected**: Edit and Delete buttons available

8. Verify auto-generated credentials
   - **Expected**: Owner has login credentials created
   - **Expected**: Temporary password generated
   - **Expected**: Email sent to owner with login info (optional)

9. Test owner login
   - Logout as admin
   - Login as: `sarah.williams@techinnovators.com`
   - Use provided/auto-generated password
   - **Expected**: Login successful
   - **Expected**: Owner sees their company dashboard
   - **Expected**: Owner role permissions active

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Owner record created and linked to company
- User account created for owner
- Profile picture uploaded to media library
- Owner can authenticate

**Notes**:
- Test adding multiple owners to same company
- Verify email uniqueness across system
- Test with optional fields empty

---

### TC-OWNER-002: Edit Owner Information

**Category**: Company Owners
**Priority**: P2 - Medium
**Prerequisites**:
- Owner exists: Sarah Williams (ID: 5)
- Logged in as admin

**Test Data**:
- Updated Phone: `+1-555-3333`
- Updated Facebook: `https://facebook.com/sarah.williams.new`

**Steps**:

1. Navigate to company details
   - Go to company with owner: `/companies/1/details`

2. Locate owner "Sarah Williams"
   - **Expected**: Owner visible in owners section

3. Click "Edit" button for this owner
   - **Expected**: Edit form appears
   - **Expected**: Form pre-filled with current data

4. Verify pre-filled data
   - **Expected**: Name: `Sarah Williams`
   - **Expected**: Email: `sarah.williams@techinnovators.com`
   - **Expected**: Phone: `+1-555-2222`
   - **Expected**: All fields show current values

5. Update Phone Number
   - Clear phone field
   - Enter: `+1-555-3333`
   - **Expected**: New phone number accepted

6. Update Facebook URL
   - Clear Facebook field
   - Enter: `https://facebook.com/sarah.williams.new`
   - **Expected**: URL validation passes

7. (Optional) Update Profile Picture
   - Upload new photo: `sarah-new-photo.jpg`
   - **Expected**: New photo preview shown
   - **Expected**: Old photo will be replaced

8. Click "Update" or "Save Changes"
   - **Expected**: Loading indicator
   - **Expected**: Success message: "Owner updated successfully"
   - **Expected**: Form closes

9. Verify changes saved
   - **Expected**: Phone displays: `+1-555-3333`
   - **Expected**: Facebook link updated
   - **Expected**: New profile picture shown (if uploaded)

10. Verify in database/details view
    - Refresh page
    - **Expected**: Changes persist
    - **Expected**: Updated information displayed

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Owner information updated
- Old profile picture deleted (if replaced)
- Changes reflected in all views

---

### TC-OWNER-003: Delete Owner from Company

**Category**: Company Owners
**Priority**: P2 - Medium
**Prerequisites**:
- Company has multiple owners (minimum 2)
- Owner to delete: Sarah Williams

**Steps**:

1. Navigate to company details with owner
   - **URL**: `/companies/1/details`

2. Count current owners
   - Note: Initial count (e.g., 2 owners)

3. Locate owner to delete
   - Find "Sarah Williams" in owners section

4. Click "Delete" button for this owner
   - **Expected**: Confirmation dialog appears
   - **Expected**: Message: "Are you sure you want to remove this owner?"

5. Click "Cancel" to test cancellation
   - **Expected**: Dialog closes
   - **Expected**: Owner not deleted

6. Click "Delete" again
   - Confirmation dialog appears

7. Click "Confirm" or "Yes, Delete"
   - **Expected**: Loading indicator
   - **Expected**: Success message: "Owner removed successfully"

8. Verify owner removed
   - **Expected**: Owner no longer in owners list
   - **Expected**: Owner count decreased by 1
   - **Expected**: Remaining owners still visible

9. Verify owner user account status
   - Owner's login credentials deactivated
   - OR Owner can no longer access this company
   - (Depends on implementation)

10. Attempt to access owner's profile directly (if applicable)
    - **Expected**: Owner not found or access denied

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Owner unlinked from company
- Owner record deleted or soft-deleted
- Profile picture removed from media library
- User account deactivated or deleted

**Notes**:
- Test: Cannot delete last owner (should show error if company requires at least one owner)
- Verify cascade deletion behavior

---

## Onboarding Checklist System

### TC-ONBOARD-001: View Company Onboarding Checklist

**Category**: Onboarding
**Priority**: P1 - High
**Prerequisites**:
- Company exists with initialized onboarding checklist
- Logged in as admin or coach

**Steps**:

1. Navigate to company details
   - **URL**: `/companies/1/details`

2. Locate "Onboarding" tab or section
   - **Expected**: Tab labeled "Onboarding" visible
   - **Expected**: Progress indicator showing percentage (e.g., "25% Complete")

3. Click "Onboarding" tab
   - **Expected**: Redirect to onboarding page
   - **Expected**: URL: `/companies/1/onboarding`

4. Verify onboarding checklist loads
   - **Expected**: Page title: "Onboarding Checklist"
   - **Expected**: Company name displayed
   - **Expected**: Progress bar showing completion percentage
   - **Expected**: List of checklist items visible

5. Verify checklist item structure
   - **Expected**: Each item shows:
     - Checkbox (checked or unchecked)
     - Item title/name
     - Description (optional)
     - Status: Complete/Incomplete
     - Last updated date
     - "Add Remark" or "View Remarks" button
     - "Attach File" button (if applicable)

6. Check progress calculation
   - Count completed items
   - Count total items
   - Calculate expected percentage: (completed / total) × 100
   - **Expected**: Progress bar matches calculation
   - **Expected**: Progress text shows correct percentage

7. Verify checklist categories (if organized)
   - **Expected**: Items grouped by category:
     - Company Setup
     - Documentation
     - Training
     - System Access
     - etc.

8. Scroll through entire checklist
   - **Expected**: All items visible
   - **Expected**: No loading errors
   - **Expected**: Smooth scrolling

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Notes**:
- Note how many total items in checklist
- Document any missing or broken items

---

### TC-ONBOARD-002: Mark Checklist Item as Complete

**Category**: Onboarding
**Priority**: P0 - Critical
**Prerequisites**:
- On company onboarding page
- Incomplete checklist item exists

**Test Data**:
- Item: "Company Logo Uploaded"
- Initial Status: Incomplete (unchecked)

**Steps**:

1. On onboarding checklist page
   - **URL**: `/companies/1/onboarding`
   - Note current progress (e.g., 20%)

2. Locate incomplete checklist item
   - Find item: "Company Logo Uploaded"
   - **Expected**: Checkbox is unchecked
   - **Expected**: Status shows "Incomplete" or similar

3. Click checkbox to mark complete
   - Click on checkbox
   - **Expected**: Checkbox becomes checked immediately
   - **Expected**: Visual feedback (checkmark appears)

4. Verify AJAX update
   - **Expected**: No page reload
   - **Expected**: Success toast/notification (optional)
   - **Expected**: Item status changes to "Complete"
   - **Expected**: Timestamp updates ("Completed on: Jan 16, 2026")

5. Check progress bar update
   - **Expected**: Progress percentage increases
   - **Expected**: Progress bar fills more
   - Calculate: If was 20% and this is 1 of 10 items, should now be 30%

6. Refresh page to verify persistence
   - Press F5 or refresh browser
   - **Expected**: Item remains checked
   - **Expected**: Progress still increased
   - **Expected**: Changes saved to database

7. Verify visual indicators
   - **Expected**: Completed item may be:
     - Grayed out
     - Crossed out
     - Moved to bottom
     - Or remains in place with check

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Checklist item marked complete in database
- Progress percentage updated
- Completion timestamp recorded

---

### TC-ONBOARD-003: Mark Checklist Item as Incomplete

**Category**: Onboarding
**Priority**: P1 - High
**Prerequisites**:
- Completed checklist item exists
- On company onboarding page

**Steps**:

1. On onboarding page with completed items
   - Note current progress (e.g., 50%)

2. Find completed item
   - Locate checked checkbox
   - Item status: "Complete"

3. Click checkbox to uncheck
   - Click on checked checkbox
   - **Expected**: Checkbox becomes unchecked
   - **Expected**: Visual feedback

4. Verify update
   - **Expected**: Status changes to "Incomplete"
   - **Expected**: Progress percentage decreases
   - **Expected**: Progress bar adjusts
   - **Expected**: No page reload

5. Refresh and verify
   - Reload page
   - **Expected**: Item remains unchecked
   - **Expected**: Changes persisted

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-ONBOARD-004: Add Remark to Checklist Item

**Category**: Onboarding
**Priority**: P2 - Medium
**Prerequisites**:
- On onboarding checklist page
- Checklist item exists

**Test Data**:
- Item: "Company Logo Uploaded"
- Remark: "Logo uploaded on Jan 15, needs approval from owner"

**Steps**:

1. On onboarding page
   - **URL**: `/companies/1/onboarding`

2. Locate checklist item
   - Find: "Company Logo Uploaded"

3. Click "Add Remark" or "Comment" button
   - **Expected**: Remark form appears
   - **Expected**: Text area visible
   - **Expected**: Character count (if limit exists)

4. Enter remark text
   - Type: `Logo uploaded on Jan 15, needs approval from owner`
   - **Expected**: Text appears in textarea
   - **Expected**: Character count updates

5. Click "Save" or "Add Remark" button
   - **Expected**: Loading indicator
   - **Expected**: Success message: "Remark added successfully"
   - **Expected**: Form closes

6. Verify remark displayed
   - **Expected**: Remark appears under checklist item
   - **Expected**: Shows:
     - Remark text
     - Author name
     - Timestamp
     - Edit/Delete buttons (if allowed)

7. Add another remark to same item
   - Click "Add Remark" again
   - Enter: `Owner approved logo on Jan 16`
   - Save
   - **Expected**: Second remark appears
   - **Expected**: Multiple remarks visible in chronological order

8. Refresh and verify
   - Reload page
   - **Expected**: All remarks still visible
   - **Expected**: Remarks persisted

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Remark saved in database
- Remark linked to checklist item
- Timestamp and author recorded

---

### TC-ONBOARD-005: Attach File to Checklist Item

**Category**: Onboarding
**Priority**: P2 - Medium
**Prerequisites**:
- On onboarding checklist page
- File upload feature implemented

**Test Data**:
- File: `company-registration.pdf` (2MB)

**Steps**:

1. Locate checklist item
   - Item: "Upload Company Registration Document"

2. Click "Attach File" or "Upload" button
   - **Expected**: File picker opens
   - **Expected**: Or drag-drop area appears

3. Select file
   - Choose: `company-registration.pdf`
   - **Expected**: File name displayed
   - **Expected**: File size shown: 2MB
   - **Expected**: Upload progress bar (if large file)

4. Click "Upload" or file auto-uploads
   - **Expected**: Upload completes
   - **Expected**: Success message: "File attached successfully"

5. Verify file attached
   - **Expected**: File link appears with item
   - **Expected**: File name: `company-registration.pdf`
   - **Expected**: Download icon/button available
   - **Expected**: File size displayed

6. Click file link to download
   - Click on file name or download button
   - **Expected**: File downloads to computer
   - **Expected**: File opens correctly (PDF viewer)

7. Attach another file (if multiple allowed)
   - Upload: `additional-document.docx`
   - **Expected**: Second file attached
   - **Expected**: Both files visible

8. Delete attached file (if feature exists)
   - Click delete/remove icon on file
   - Confirm deletion
   - **Expected**: File removed from list
   - **Expected**: File deleted from storage

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- File uploaded to S3 or storage
- File linked to checklist item
- File accessible for download

**Notes**:
- Test file size limits
- Test invalid file types
- Verify S3 temporary URL generation (10-minute expiry)

---

## Performance Tracking

### TC-PERF-001: Create Performance Record (Testing Phase)

**Category**: Performance Tracking
**Priority**: P1 - High
**Prerequisites**:
- Company exists: "Tech Innovators Inc"
- Logged in as admin or coach

**Test Data**:
```
Phase: Testing
Start Date: 2026-01-01
End Date: 2026-01-15
Items Tested: 5
Average Ad Spend: $500.00
ROAS: 3.5
RTS: 65%
Highlights: "Strong performance on Product A, exceeded expectations"
Challenges: "Budget constraints on Product B testing"
Action Plan: "Increase ad spend on Product A, adjust targeting for Product B"
Attachment: performance-report-jan.xlsx
```

**Steps**:

1. Navigate to company performance records
   - Go to: `/companies/1/performance-records`
   - **Expected**: Performance records list page loads
   - **Expected**: "Create Performance Record" button visible

2. Click "Create Performance Record" button
   - **Expected**: Redirect to create form
   - **Expected**: URL: `/companies/1/performance-records/create`

3. Fill in performance record form:

   **Step 3a**: Select Phase
   - Radio button or dropdown: Select `Testing`
   - **Expected**: Testing phase selected

   **Step 3b**: Select Start Date
   - Date picker opens
   - Select: `2026-01-01`
   - **Expected**: Date set

   **Step 3c**: Select End Date
   - Date picker opens
   - Select: `2026-01-15`
   - **Expected**: Date set
   - **Expected**: End date must be after start date

   **Step 3d**: Enter Items Tested
   - Input: `5`
   - **Expected**: Number field accepts integer

   **Step 3e**: Enter Average Ad Spend
   - Input: `500.00`
   - **Expected**: Currency format accepted
   - **Expected**: Two decimal places

   **Step 3f**: Enter ROAS
   - Input: `3.5`
   - **Expected**: Decimal number accepted
   - **Expected**: ROAS = Return on Ad Spend ratio

   **Step 3g**: Enter RTS Percentage
   - Input: `65`
   - **Expected**: Number field accepts percentage
   - **Expected**: RTS = Return to Sales

   **Step 3h**: Enter Highlights
   - Textarea input: `Strong performance on Product A, exceeded expectations`
   - **Expected**: Text area accepts multi-line text

   **Step 3i**: Enter Challenges
   - Textarea input: `Budget constraints on Product B testing`
   - **Expected**: Text area accepts input

   **Step 3j**: Enter Action Plan
   - Textarea input: `Increase ad spend on Product A, adjust targeting for Product B`
   - **Expected**: Text area accepts input

4. Upload attachment
   - Click "Attach File" or "Upload"
   - Select: `performance-report-jan.xlsx` (5MB)
   - **Expected**: File uploads
   - **Expected**: Progress bar shown
   - **Expected**: File name displayed
   - **Expected**: Validation: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG allowed

5. Review all entered data
   - Scroll through form
   - Verify all fields completed

6. Click "Create" or "Save" button
   - **Expected**: Form validation passes
   - **Expected**: Loading indicator
   - **Expected**: Success message: "Performance record created successfully"
   - **Expected**: Redirect to performance records list

7. Verify record in list
   - **Expected**: New record appears at top
   - **Expected**: Shows:
     - Phase: Testing
     - Date range: Jan 1 - Jan 15, 2026
     - ROAS: 3.5
     - Items: 5
     - Download attachment icon

8. Click on record to view details
   - **Expected**: Record details page loads
   - **Expected**: All entered information displayed
   - **Expected**: Attachment downloadable

9. Download attachment
   - Click attachment link
   - **Expected**: File downloads
   - **Expected**: Excel file opens correctly

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Performance record created in database
- Attachment uploaded to S3
- Record visible in list
- Statistics updated (average ROAS, etc.)

---

### TC-PERF-002: Create Performance Record (Scaling Phase)

**Category**: Performance Tracking
**Priority**: P1 - High

**Test Data**:
```
Phase: Scaling
Start Date: 2026-01-16
End Date: 2026-01-31
Items Tested: 10
Average Ad Spend: $2000.00
ROAS: 4.2
RTS: 75%
```

**Steps**:
_[Similar to TC-PERF-001 but select Scaling phase]_

1. Navigate to create performance record page
2. Select Phase: `Scaling`
3. Fill in all required fields with test data above
4. **Expected**: Scaling phase allows higher item counts
5. **Expected**: Form accepts all data
6. Save and verify record created
7. **Expected**: Record labeled as "Scaling" phase

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PERF-003: Edit Performance Record

**Category**: Performance Tracking
**Priority**: P2 - Medium
**Prerequisites**:
- Performance record exists (from TC-PERF-001)

**Test Data**:
- Updated ROAS: `4.0` (was 3.5)
- Updated Highlights: "Exceptional results on Product A"

**Steps**:

1. Navigate to performance records list
   - **URL**: `/companies/1/performance-records`

2. Locate record to edit
   - Find Jan 1-15 Testing record

3. Click "Edit" button
   - **Expected**: Redirect to edit form
   - **Expected**: URL: `/companies/1/performance-records/{id}/edit`

4. Verify pre-filled data
   - **Expected**: All fields show current values
   - **Expected**: ROAS shows: 3.5
   - **Expected**: Highlights show previous text

5. Update ROAS
   - Change from `3.5` to `4.0`
   - **Expected**: Field updates

6. Update Highlights
   - Replace text with: `Exceptional results on Product A`
   - **Expected**: Textarea updates

7. Click "Update" or "Save Changes"
   - **Expected**: Success message
   - **Expected**: Redirect to details or list

8. Verify changes saved
   - View record details
   - **Expected**: ROAS shows: 4.0
   - **Expected**: Highlights updated

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PERF-004: Delete Performance Record

**Category**: Performance Tracking
**Priority**: P2 - Medium
**Prerequisites**:
- Performance record exists
- Logged in as admin

**Steps**:

1. Navigate to performance records list
   - **URL**: `/companies/1/performance-records`

2. Locate record to delete

3. Click "Delete" button
   - **Expected**: Confirmation dialog appears
   - **Expected**: Warning about permanent deletion
   - **Expected**: Note about attached files being deleted

4. Click "Cancel"
   - **Expected**: Dialog closes
   - **Expected**: Record not deleted

5. Click "Delete" again

6. Click "Confirm" or "Yes, Delete"
   - **Expected**: Success message
   - **Expected**: Record removed from list

7. Verify deletion
   - **Expected**: Record no longer in list
   - **Expected**: Attachment deleted from S3
   - **Expected**: Statistics recalculated (average ROAS updated)

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PERF-005: View Performance Analytics

**Category**: Performance Tracking
**Priority**: P2 - Medium
**Prerequisites**:
- Multiple performance records exist for company
- Records with various ROAS values

**Steps**:

1. Navigate to company details or dashboard
   - **URL**: `/companies/1/details` or `/dashboard`

2. Locate performance analytics section
   - **Expected**: Section showing:
     - Average ROAS
     - Maximum ROAS
     - Number of performance records
     - Chart or graph (if implemented)

3. Verify Average ROAS calculation
   - Note all ROAS values from records
   - Calculate manually: sum of all ROAS / count
   - **Expected**: Displayed average matches calculation

4. Verify Maximum ROAS
   - Note highest ROAS from all records
   - **Expected**: Maximum ROAS matches highest value

5. View Top Performers (if on dashboard)
   - Navigate to `/dashboard`
   - Locate "Top Performers" widget
   - **Expected**: Companies ranked by ROAS
   - **Expected**: Highest ROAS company on top

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

## Event Management

### TC-EVENT-001: Create Event

**Category**: Event Management
**Priority**: P1 - High
**Prerequisites**:
- Logged in as admin
- Companies exist to assign to event

**Test Data**:
```
Event Name: Q1 2026 Business Workshop
Event Type: Workshop
Date: 2026-02-15
Location: Innovation Hub, 123 Main St, Tech City
Companies: Select 3-5 companies
```

**Steps**:

1. Navigate to Events page
   - **URL**: `http://[base-url]/events`
   - **Expected**: Events list page loads
   - **Expected**: "Create Event" button visible

2. Click "Create Event" button
   - **Expected**: Create event form appears (modal or new page)
   - **Expected**: Form fields visible

3. Fill in event information:

   **Step 3a**: Enter Event Name
   - Input: `Q1 2026 Business Workshop`
   - **Expected**: Field accepts text

   **Step 3b**: Select Event Type
   - Dropdown: Select `Workshop`
   - **Expected**: Options: Workshop, Training, Conference, Networking, etc.

   **Step 3c**: Select Event Date
   - Date picker: Select `2026-02-15`
   - **Expected**: Future date accepted
   - **Expected**: Date format displayed correctly

   **Step 3d**: Enter Location
   - Input: `Innovation Hub, 123 Main St, Tech City`
   - **Expected**: Text field accepts full address

4. Assign companies to event
   - **Expected**: Company selection interface visible
   - **Expected**: Multi-select dropdown or checkbox list
   - Select: 3-5 companies from list
   - **Expected**: Selected companies highlighted
   - **Expected**: Company count updates

5. Review entered information
   - **Expected**: All fields populated
   - **Expected**: Company list shows selected companies

6. Click "Create Event" or "Save" button
   - **Expected**: Form validation passes
   - **Expected**: Loading indicator
   - **Expected**: Success message: "Event created successfully"
   - **Expected**: Form closes or redirect to events list

7. Verify event in list
   - **Expected**: New event appears in events list
   - **Expected**: Event row shows:
     - Name: Q1 2026 Business Workshop
     - Type: Workshop
     - Date: Feb 15, 2026
     - Location: Innovation Hub...
     - Company count: 3-5 companies

8. Click on event to view details
   - **Expected**: Event details page loads
   - **Expected**: URL: `/events/{id}`
   - **Expected**: Full event information displayed
   - **Expected**: List of assigned companies visible
   - **Expected**: Attendance section visible (if applicable)

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Post-conditions**:
- Event record created
- Companies assigned to event
- Event visible in list
- Attendance records initialized

---

### TC-EVENT-002: Edit Event

**Category**: Event Management
**Priority**: P2 - Medium
**Prerequisites**:
- Event exists (from TC-EVENT-001)
- Logged in as admin

**Test Data**:
- Updated Date: `2026-02-20`
- Updated Location: `New Conference Center`

**Steps**:

1. Navigate to Events page
   - **URL**: `/events`

2. Find event "Q1 2026 Business Workshop"

3. Click "Edit" button
   - **Expected**: Edit form loads with current data

4. Verify pre-filled data
   - **Expected**: Event name: Q1 2026 Business Workshop
   - **Expected**: Date: Feb 15, 2026
   - **Expected**: Location: Innovation Hub...

5. Update Event Date
   - Change to: `2026-02-20`
   - **Expected**: Date updates

6. Update Location
   - Change to: `New Conference Center`
   - **Expected**: Location updates

7. Add/Remove companies (optional)
   - Add 2 more companies
   - Remove 1 company
   - **Expected**: Company selections update

8. Click "Update" or "Save Changes"
   - **Expected**: Success message
   - **Expected**: Changes saved

9. Verify updates
   - View event details
   - **Expected**: Date: Feb 20, 2026
   - **Expected**: Location: New Conference Center
   - **Expected**: Company list updated

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-EVENT-003: Delete Event

**Category**: Event Management
**Priority**: P2 - Medium
**Prerequisites**:
- Event exists that can be deleted

**Steps**:

1. Navigate to Events page

2. Locate event to delete

3. Click "Delete" button
   - **Expected**: Confirmation dialog
   - **Expected**: Warning about deleting attendance records

4. Confirm deletion
   - **Expected**: Event deleted
   - **Expected**: Success message
   - **Expected**: Removed from list

5. Verify deletion
   - **Expected**: Event no longer accessible
   - **Expected**: Attendance records deleted

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-EVENT-004: Mark Company Attendance - Present

**Category**: Event Management
**Priority**: P1 - High
**Prerequisites**:
- Event exists with companies assigned
- Event date has passed (or attendance can be marked early)

**Test Data**:
- Event: Q1 2026 Business Workshop
- Company: Tech Innovators Inc
- Attendance Status: Present

**Steps**:

1. Navigate to event details
   - **URL**: `/events/{id}`

2. Locate attendance section
   - **Expected**: List of assigned companies
   - **Expected**: Attendance status column
   - **Expected**: Status options: Present, Absent, Late, Clearing

3. Find company "Tech Innovators Inc"
   - **Expected**: Company listed
   - **Expected**: Current status: Not marked or blank

4. Click on attendance status dropdown/selector
   - **Expected**: Status options appear

5. Select "Present"
   - **Expected**: Status changes to "Present"
   - **Expected**: Visual indicator (green badge, checkmark)
   - **Expected**: Success feedback

6. Verify status saved
   - Refresh page
   - **Expected**: Status remains "Present"
   - **Expected**: Changes persisted

7. View company's attendance history
   - Navigate to: `/companies/1/attendance`
   - **Expected**: Event listed with "Present" status

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-EVENT-005: Mark Company Attendance - Absent

**Category**: Event Management
**Priority**: P1 - High

**Steps**:

1. From event details page
2. Find another company
3. Set attendance status to "Absent"
   - **Expected**: Red badge or indicator
   - **Expected**: Status saved

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-EVENT-006: View Company Attendance History

**Category**: Event Management
**Priority**: P2 - Medium
**Prerequisites**:
- Company has attended multiple events

**Steps**:

1. Navigate to company details
   - **URL**: `/companies/1/details`

2. Locate "Attendance" tab
   - **Expected**: Tab or link to attendance

3. Click "Attendance" tab
   - **Expected**: Redirect to attendance page
   - **Expected**: URL: `/companies/1/attendance`

4. Verify attendance list
   - **Expected**: Table with columns:
     - Event Name
     - Event Date
     - Event Type
     - Event Location
     - Attendance Status
   - **Expected**: All events company assigned to listed
   - **Expected**: Status color-coded (green=present, red=absent, etc.)

5. Verify attendance statistics (if implemented)
   - **Expected**: Total events: count
   - **Expected**: Present: count
   - **Expected**: Absent: count
   - **Expected**: Attendance rate: percentage

6. Filter/Sort attendance (if available)
   - Sort by date
   - Filter by status
   - **Expected**: Filters work correctly

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

## Dashboard Analytics

### TC-DASH-001: View Admin Dashboard

**Category**: Dashboard
**Priority**: P1 - High
**Prerequisites**:
- Logged in as admin
- Multiple companies and users exist

**Steps**:

1. Login as admin

2. Navigate to dashboard
   - **URL**: `/dashboard`
   - **Expected**: Dashboard page loads
   - **Expected**: Multiple widgets/cards visible

3. Verify statistics widgets:

   **Widget 1: Total Companies**
   - **Expected**: Card labeled "Total Companies"
   - **Expected**: Number displayed (e.g., 45)
   - **Expected**: Count matches actual company count

   **Widget 2: Active Companies**
   - **Expected**: Card labeled "Active Companies"
   - **Expected**: Number displayed (e.g., 38)
   - **Expected**: Only counts companies with "active" status

   **Widget 3: New Companies**
   - **Expected**: Card labeled "New Companies" or "New This Period"
   - **Expected**: Number displayed (e.g., 5)
   - **Expected**: Time period indicated (week/month)
   - **Expected**: Growth indicator (arrow up/down, percentage)

   **Widget 4: Pending Notarization**
   - **Expected**: Number of companies awaiting notarization
   - **Expected**: Count accurate

   **Widget 5: Total Users**
   - **Expected**: User count displayed
   - **Expected**: Matches user table count

   **Widget 6: Onboarding Rate**
   - **Expected**: Percentage displayed (e.g., 65%)
   - **Expected**: Calculation: average onboarding completion

4. Verify charts/visualizations:

   **Chart 1: Company Creation Trend**
   - **Expected**: Line or area chart visible
   - **Expected**: X-axis: Time (days/months)
   - **Expected**: Y-axis: Number of companies
   - **Expected**: Data points for selected period

   **Chart 2: Status Distribution**
   - **Expected**: Pie or bar chart
   - **Expected**: Shows breakdown: Active, Inactive, Terminated
   - **Expected**: Percentages add up to 100%

   **Chart 3: Level Distribution**
   - **Expected**: Chart showing company tiers
   - **Expected**: Educate, Empowerment, Enterprise, Exponential

   **Chart 4: Top Performers**
   - **Expected**: List or table of top companies
   - **Expected**: Ranked by ROAS
   - **Expected**: Shows company name and ROAS value

5. Verify time range selector
   - **Expected**: Dropdown or tabs: Week, Month, Quarter, Year
   - **Expected**: Default selection visible

6. Change time range to "Month"
   - Select "Month" from dropdown
   - **Expected**: All widgets update
   - **Expected**: "New Companies" shows month data
   - **Expected**: Charts adjust to monthly view

7. Change to "Week"
   - **Expected**: Data updates to week view
   - **Expected**: Chart shows daily data points

8. Verify growth indicators
   - **Expected**: Each metric shows comparison to previous period
   - **Expected**: Green up arrow for growth
   - **Expected**: Red down arrow for decline
   - **Expected**: Percentage change displayed

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

**Notes**:
- Verify real-time or near-real-time updates
- Check dashboard responsiveness on mobile

---

### TC-DASH-002: View Coach Dashboard

**Category**: Dashboard
**Priority**: P1 - High
**Prerequisites**:
- Logged in as coach
- Coach has companies assigned

**Steps**:

1. Login as coach
   - Use: `coach.mike@lumina.com`

2. Navigate to dashboard
   - **URL**: `/dashboard`

3. Verify coach-specific view
   - **Expected**: Dashboard shows only assigned companies data
   - **Expected**: "My Companies" count (not all companies)
   - **Expected**: Statistics filtered to coach's companies only

4. Verify limited access
   - **Expected**: No system-wide statistics
   - **Expected**: No total users count (if restricted)
   - **Expected**: Only relevant metrics visible

5. Verify company list
   - **Expected**: Quick list of assigned companies
   - **Expected**: Can click to view company details

6. Check navigation restrictions
   - Try accessing all companies list
   - **Expected**: Only sees assigned companies
   - **Expected**: Or access denied to company management features

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-DASH-003: Dashboard Data Accuracy

**Category**: Dashboard
**Priority**: P0 - Critical
**Prerequisites**:
- Known data in database

**Steps**:

1. Manually count companies in database
   - Note: Total companies = X
   - Active companies = Y
   - New companies (this month) = Z

2. View dashboard
   - **Expected**: Total Companies widget shows X
   - **Expected**: Active Companies widget shows Y
   - **Expected**: New Companies widget shows Z

3. Verify calculations match
   - **Expected**: All counts accurate
   - **Expected**: Percentages calculated correctly

4. Create new company

5. Refresh dashboard
   - **Expected**: Total Companies increases by 1
   - **Expected**: New Companies increases by 1
   - **Expected**: Dashboard reflects change

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

## User Settings & Profile

### TC-PROFILE-001: Update Profile Information

**Category**: User Settings
**Priority**: P2 - Medium
**Prerequisites**:
- Logged in as any user

**Test Data**:
- Current Name: John Doe
- New Name: John Michael Doe
- New Email: john.m.doe@example.com

**Steps**:

1. Navigate to user settings
   - Click user avatar/menu
   - Click "Settings" or "Profile"
   - **Expected**: Settings page loads

2. Locate profile information section
   - **Expected**: "Profile" or "Account Information" section
   - **Expected**: Current name and email displayed

3. Click "Edit Profile" or directly edit fields
   - **Expected**: Fields become editable

4. Update Name
   - Change from "John Doe" to "John Michael Doe"
   - **Expected**: Field accepts change

5. Update Email
   - Change to: `john.m.doe@example.com`
   - **Expected**: Email validation passes

6. Click "Save" or "Update Profile"
   - **Expected**: Success message
   - **Expected**: Changes saved

7. Verify email verification requirement
   - **Expected**: If email changed, verification email sent
   - **Expected**: Message: "Please verify your new email address"

8. Check email and verify
   - Open verification email
   - Click verification link
   - **Expected**: Email verified
   - **Expected**: Can use new email to login

9. Verify name change reflected
   - **Expected**: Name updates in header/navigation
   - **Expected**: Name displays: "John Michael Doe"

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PROFILE-002: Change Password

**Category**: User Settings
**Priority**: P1 - High
**Prerequisites**:
- Logged in as user
- Known current password: `OldPassword123!`

**Test Data**:
- Current Password: `OldPassword123!`
- New Password: `NewSecurePassword456!`
- Confirm Password: `NewSecurePassword456!`

**Steps**:

1. Navigate to user settings
   - Click user avatar
   - Click "Settings"

2. Locate password section
   - **Expected**: "Change Password" or "Security" section

3. Click "Change Password" button
   - **Expected**: Password change form appears

4. Fill in password fields:

   **Step 4a**: Enter Current Password
   - Input: `OldPassword123!`
   - **Expected**: Field masked

   **Step 4b**: Enter New Password
   - Input: `NewSecurePassword456!`
   - **Expected**: Field masked
   - **Expected**: Password strength indicator appears

   **Step 4c**: Confirm New Password
   - Input: `NewSecurePassword456!`
   - **Expected**: Field masked

5. Click "Update Password" or "Save"
   - **Expected**: Validation passes
   - **Expected**: Success message: "Password updated successfully"

6. Logout
   - Click logout button
   - **Expected**: Redirect to login page

7. Try logging in with old password
   - Email: current email
   - Password: `OldPassword123!`
   - **Expected**: Login fails
   - **Expected**: Error: "Invalid credentials"

8. Login with new password
   - Email: current email
   - Password: `NewSecurePassword456!`
   - **Expected**: Login successful
   - **Expected**: Redirect to dashboard

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PROFILE-003: Change Password with Invalid Current Password

**Category**: User Settings
**Priority**: P1 - High

**Steps**:

1. Navigate to password change form

2. Enter incorrect current password
   - Current: `WrongPassword`
   - New: `NewSecurePassword456!`
   - Confirm: `NewSecurePassword456!`

3. Click "Update Password"
   - **Expected**: Error message
   - **Expected**: "Current password is incorrect"
   - **Expected**: Password not changed

4. Verify old password still works
   - Logout and login with original password
   - **Expected**: Login successful

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PROFILE-004: Change Password - Mismatched Confirmation

**Category**: User Settings
**Priority**: P2 - Medium

**Steps**:

1. Navigate to password change form

2. Fill in with mismatched passwords
   - Current: `OldPassword123!`
   - New: `NewSecurePassword456!`
   - Confirm: `DifferentPassword789!`

3. Click "Update Password"
   - **Expected**: Validation error
   - **Expected**: "Passwords do not match"
   - **Expected**: Form not submitted

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-PROFILE-005: Delete Account

**Category**: User Settings
**Priority**: P2 - Medium
**Prerequisites**:
- Test user account (not critical account)

**Steps**:

1. Navigate to user settings

2. Locate account deletion section
   - **Expected**: "Delete Account" or "Danger Zone" section
   - **Expected**: Warning message about permanent deletion

3. Click "Delete My Account" button
   - **Expected**: Confirmation dialog appears
   - **Expected**: Strong warning message
   - **Expected**: "Are you sure?" prompt

4. Click "Cancel" first
   - **Expected**: Dialog closes
   - **Expected**: Account not deleted

5. Click "Delete My Account" again

6. Confirm deletion (may require password)
   - Enter password if required
   - Click "Yes, Delete My Account"
   - **Expected**: Account deletion process starts

7. Verify account deleted
   - **Expected**: Logout automatically
   - **Expected**: Redirect to homepage or goodbye page

8. Try logging in with deleted account
   - **Expected**: Login fails
   - **Expected**: Error: "Invalid credentials" or "Account not found"

9. Verify data cleaned up (admin check)
   - User record deleted or soft-deleted
   - Associated data handled appropriately

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

## Search, Filter & Sort

### TC-FILTER-001: Combine Multiple Filters

**Category**: Filtering
**Priority**: P2 - Medium
**Prerequisites**:
- On companies page with many companies

**Steps**:

1. Navigate to Companies page

2. Apply multiple filters simultaneously:
   - Status: Active
   - Level: Empowerment
   - Sales Activity: Generating

3. Verify results match ALL criteria
   - **Expected**: Only companies matching all 3 filters shown

4. Add search term: `tech`
   - **Expected**: Results further filtered by name

5. Verify URL parameters
   - **Expected**: URL contains all filter parameters
   - Example: `?filter[status]=active&filter[level]=empowerment&search=tech`

6. Share or bookmark URL

7. Open URL in new tab
   - **Expected**: Filters pre-applied
   - **Expected**: Same filtered results shown

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-FILTER-002: Pagination with Filters Active

**Category**: Filtering
**Priority**: P2 - Medium

**Steps**:

1. Apply filters that return 30+ results

2. Verify pagination
   - **Expected**: Page 1 shows first 20 results
   - **Expected**: "Next" button enabled

3. Click "Next Page"
   - **Expected**: Filters remain active
   - **Expected**: Next 20 filtered results shown
   - **Expected**: URL updates: `?filter[status]=active&page=2`

4. Click "Previous"
   - **Expected**: Return to page 1
   - **Expected**: Filters still active

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

### TC-FILTER-003: Sort with Filters Active

**Category**: Filtering & Sorting
**Priority**: P2 - Medium

**Steps**:

1. Apply status filter: Active

2. Sort by Name (A-Z)
   - **Expected**: Active companies sorted alphabetically

3. Verify sort persists
   - Navigate to page 2
   - **Expected**: Results still sorted
   - **Expected**: Filter still active

4. Change sort to Name (Z-A)
   - **Expected**: Reverse alphabetical order
   - **Expected**: Filter remains

**Actual Result**: _[To be filled by tester]_

**Status**: _[Pass/Fail/Blocked]_

---

## Test Data Requirements

### Required User Accounts

```
1. Admin User
   Email: admin@lumina.com
   Password: password123
   Role: admin

2. Coach User
   Email: coach.mike@lumina.com
   Password: password123
   Role: coach

3. Company Owner
   Email: owner@company.com
   Password: password123
   Role: owner

4. Test User (for deletion tests)
   Email: testuser@example.com
   Password: Test123!
   Role: any
```

### Required Companies

```
Minimum: 20 companies
- 15 Active
- 3 Inactive
- 2 Terminated

Levels:
- 5 Educate
- 7 Empowerment
- 5 Enterprise
- 3 Exponential

With coaches assigned:
- 10 assigned to Coach Mike
- 10 unassigned or assigned to others

With performance records:
- 5 companies with multiple records
- 10 companies with 1-2 records
- 5 companies with no records
```

### Required Test Files

```
1. company-logo.png (500x500, 200KB, PNG)
2. owner-photo.jpg (800x800, 1.5MB, JPEG)
3. robert-id.pdf (5MB, PDF)
4. payment-receipt.jpg (1MB, JPEG)
5. performance-report-jan.xlsx (3MB, Excel)
6. invalid-file.exe (for negative testing)
7. oversized-file.jpg (10MB, for size limit testing)
```

### Required Events

```
1. Past Event (attended)
   Name: December 2025 Workshop
   Date: 2025-12-15
   Companies: 10 assigned with attendance marked

2. Upcoming Event
   Name: February 2026 Conference
   Date: 2026-02-20
   Companies: 15 assigned, no attendance yet

3. Today's Event
   Date: Current date
   Companies: 5 assigned
```

### Database Seed Data

For consistent testing, seed database with:
- 50 companies with varied data
- 20 users (5 admin, 10 coach, 5 owner)
- 100+ performance records spread across companies
- 20 events (10 past, 10 future)
- Attendance records for all past events
- Onboarding checklists initialized for all companies

---

## Test Execution Guidelines

### Before Starting Testing

1. **Environment Setup**
   - Verify test environment accessible
   - Database seeded with test data
   - Test user accounts created
   - Test files prepared and accessible

2. **Browser Setup**
   - Clear cache and cookies
   - Disable browser extensions (unless testing with them)
   - Set screen resolution to 1920x1080 for desktop tests
   - Have mobile device ready for mobile tests

3. **Documentation Ready**
   - This test case document
   - Spreadsheet or tracking tool for results
   - Screenshot/screen recording tool available

### During Testing

1. **Record Results**
   - Fill in "Actual Result" for each test case
   - Mark Status as Pass/Fail/Blocked
   - Take screenshots of failures
   - Note any deviations from expected behavior

2. **Report Bugs**
   - Document steps to reproduce
   - Include screenshots
   - Note browser and environment details
   - Assign priority

3. **Test Variations**
   - Test on multiple browsers (Chrome, Firefox, Safari)
   - Test on different screen sizes
   - Test with slow network (throttle connection)

### After Testing

1. **Summary Report**
   - Total test cases executed
   - Pass rate percentage
   - Critical bugs found
   - Blockers identified

2. **Retesting**
   - After bugs fixed, retest failed cases
   - Verify fixes don't break other features
   - Run regression tests

---

## Bug Report Template

```
Bug ID: BUG-001
Test Case: TC-COMP-001
Title: [Brief description]
Severity: Critical / High / Medium / Low
Priority: P0 / P1 / P2 / P3

Steps to Reproduce:
1. [Step]
2. [Step]
3. [Step]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach screenshots]

Environment:
Browser: Chrome 120
OS: macOS 14
Resolution: 1920x1080
User Role: Admin

Additional Notes:
[Any other relevant information]
```

---

**End of Test Cases Documentation**

**Version**: 1.0
**Total Test Cases**: 50+
**Estimated Testing Time**: 40-60 hours (full regression)
**Last Updated**: 2026-01-16