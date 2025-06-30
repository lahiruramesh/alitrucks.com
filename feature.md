# Feature Roadmap: AliTrucks Rental Platform

This document outlines the core features for the AliTrucks electric truck rental platform, broken down by user stories for different roles: **Admin**, **Seller** (vehicle owner), and **Public/Renter**.

---

## 0. Authentication & Role-Based Authorization (RBAC) System

### 0.1. User Authentication
*   **As a User, I can create an account and sign in securely** so that I can access role-specific features of the platform.
    *   **Acceptance Criteria:**
        *   Users can sign up with email and password
        *   Users can sign in with existing credentials
        *   Users can sign out securely
        *   Password validation (minimum 6 characters)
        *   Email verification (optional but recommended)
        *   Secure session management
    *   **Development Tasks:**
        *   `feature/auth-system`: Implement Supabase Auth integration ✅
        *   `feature/auth-forms`: Create login and registration forms ✅
        *   `feature/auth-validation`: Add form validation and error handling ✅
        *   `feature/auth-session`: Implement session management and persistence ✅

### 0.1.1. Logout Feature
*   **As a User, I can sign out of my account securely** so that my session is properly terminated and my account remains secure.
    *   **Acceptance Criteria:**
        *   All user roles (Admin, Seller, Buyer) have access to a logout button
        *   Logout button is prominently displayed in the sidebar navigation
        *   Clicking logout immediately terminates the user session
        *   After logout, users are redirected to the login page
        *   Logout process handles errors gracefully with appropriate feedback
        *   Session is completely cleared from the browser
    *   **Development Tasks:**
        *   `feature/logout-hook`: Create useLogout hook for secure logout functionality ✅
        *   `feature/logout-ui`: Add logout buttons to all role-based layouts (Admin, Seller, Buyer) ✅
        *   `feature/logout-integration`: Wire logout buttons to auth.signOut() function ✅
        *   `feature/logout-redirect`: Implement post-logout redirect to login page ✅
        *   `feature/logout-error-handling`: Add error handling and user feedback ✅

### 0.2. Role-Based Access Control
*   **As a Platform Administrator, I can assign roles to users** so that access to features is properly controlled.
    *   **User Roles:**
        *   **Admin**: Full platform access, user management, system configuration
        *   **Seller**: Vehicle management, booking confirmation, earnings tracking
        *   **Buyer/Renter**: Vehicle browsing, booking creation, trip management
    *   **Acceptance Criteria:**
        *   User profiles include role assignment
        *   Role-based route protection (admin, seller, buyer areas)
        *   Navigation shows role-appropriate options
        *   API endpoints respect role permissions
    *   **Development Tasks:**
        *   `db-schema`: Add user_profiles table with role enumeration
        *   `feature/rbac-middleware`: Implement route protection components
        *   `feature/rbac-navigation`: Update navigation based on user role
        *   `feature/rbac-api`: Add role-based API access control

### 0.3. User Profile Management
*   **As a User, I can manage my profile information** so that my account details are accurate and up-to-date.
    *   **Acceptance Criteria:**
        *   Users can view and edit their profile (name, email, phone, avatar)
        *   Users can change their password
        *   Users can see their account role and status
        *   Profile information is used throughout the platform
    *   **Development Tasks:**
        *   `feature/user-profile`: Create profile management interface
        *   `feature/avatar-upload`: Implement avatar image upload
        *   `feature/password-change`: Add password change functionality
        *   `api/user-profile`: Create profile update API endpoints

### 0.4. Admin User Management
*   **As an Admin, I can manage all user accounts** so that I can maintain platform security and user access.
    *   **Acceptance Criteria:**
        *   Admins can view all user accounts
        *   Admins can change user roles
        *   Admins can activate/deactivate accounts
        *   Admins can view user activity logs
        *   Admins can reset user passwords (if needed)
    *   **Development Tasks:**
        *   `feature/admin-user-management`: Create user management interface
        *   `feature/admin-role-assignment`: Implement role change functionality
        *   `feature/admin-user-status`: Add account activation/deactivation
        *   `api/admin-users`: Create admin user management APIs

---

## 1. Core Vehicle & Platform Management (Admin)

### 1.1. Vehicle Attribute Management
*   **As an Admin, I can create, read, update, and delete (CRUD) vehicle attributes** so that we can maintain a standardized and clean vehicle database.
    *   **Acceptance Criteria:**
        *   Admin dashboard has sections for managing:
            *   Vehicle Types (e.g., Box Truck, Pickup, Semi-Trailer)
            *   Vehicle Categories (e.g., Light Duty, Heavy Duty)
            *   Brands & Models (e.g., Tesla Semi, Ford F-150 Lightning)
            *   Fuel Types (e.g., Electric, Hybrid - though we focus on electric)
            *   Rental Purposes (e.g., Moving, Delivery, Long Haul)
    *   **Development Tasks:**
        *   `db-schema`: Design and implement tables for `vehicle_types`, `vehicle_categories`, `brands`, `models`, etc.
        *   `feature/admin-dashboard`: Build a dedicated admin section.
        *   `feature/admin-crud-attributes`: Implement UI forms and API endpoints for managing these attributes.

### 1.2. Vehicle Submission Review
*   **As an Admin, I can review, approve, or reject new vehicle submissions from sellers** to ensure all listings meet our quality and safety standards.
    *   **Acceptance Criteria:**
        *   Admin dashboard has a queue for "Pending Approval" vehicles.
        *   I can view all details submitted by the seller.
        *   I can approve a vehicle, which makes it publicly visible.
        *   I can reject a vehicle, which notifies the seller with a reason.
    *   **Development Tasks:**
        *   `db-schema`: Add a `status` field to the `vehicles` table (e.g., `pending`, `approved`, `rejected`).
        *   `feature/admin-approval-queue`: Build the UI for the admin to see and manage the queue.
        *   `feature/admin-approval-workflow`: Implement the backend logic for approving/rejecting and notifying sellers.

---

## 2. Vehicle Publishing & Management (Seller)

### 2.1. Seller Profile & Onboarding
*   **As a Seller, I can create a profile and onboard my business** so that I can start listing vehicles.
    *   **Development Tasks:**
        *   `feature/auth-seller`: Implement seller registration and login (Supabase Auth).
        *   `feature/seller-profile`: Create a profile page where sellers can manage their information.

### 2.2. Vehicle Publishing Workflow
*   **As a Seller, I can publish my vehicles for listing on the platform** by providing all necessary details.
    *   **Acceptance Criteria:**
        *   A multi-step form guides me through the submission process.
        *   I must select from the predefined attributes (type, category, brand, model).
        *   I must provide key details: year, mileage, location, and a detailed description.
        *   The vehicle is sent for admin approval before it goes live.
    *   **Development Tasks:**
        *   `feature/seller-dashboard`: Create a dashboard for sellers to view and manage their vehicles.
        *   `feature/seller-publish-form`: Build the multi-step vehicle submission form.
        *   `api/vehicle-submission`: Create API endpoints to handle form submission.

### 2.3. Availability & Pricing Management
*   **As a Seller, I can set the availability and pricing for each of my vehicles** to have full control over my rentals.
    *   **Acceptance Criteria:**
        *   I can block out dates on a calendar when the vehicle is unavailable.
        *   I can set different pricing tiers (e.g., per hour, per day, per week).
    *   **Development Tasks:**
        *   `db-schema`: Design tables for `vehicle_availability` and `vehicle_pricing`.
        *   `feature/seller-availability-ui`: Implement a calendar interface for managing dates.
        *   `feature/seller-pricing-ui`: Implement a UI for setting pricing rules.

### 2.4. Image Management
*   **As a Seller, I can upload high-quality images of my vehicle** to attract potential renters.
    *   **Acceptance Criteria:**
        *   I can upload multiple images.
        *   I can reorder and delete images.
        *   The first image is the primary cover image.
    *   **Development Tasks:**
        *   `infra/storage`: Set up Supabase Storage for image uploads.
        *   `feature/seller-image-upload`: Implement the image upload and management component.

---

## 3. Vehicle Discovery & Booking (Public/Renter)

### 3.1. Search & Discovery
*   **As a Public User, I can search for available trucks** based on location, dates, and vehicle type.
    *   **Acceptance Criteria:**
        *   The home page features a prominent search bar (location, check-in, check-out).
        *   Search results are displayed in a clean, card-based layout.
        *   I can filter results by vehicle type, price range, and other attributes.
    *   **Development Tasks:**
        *   `feature/search-bar`: Ensure the search bar is fully functional.
        *   `feature/search-results-page`: Build the page to display and filter results.
        *   `api/search`: Implement the backend search and filtering logic.

### 3.2. Vehicle Details & Booking
*   **As a Renter, I can view detailed information about a vehicle and book it** for a specific period.
    *   **Acceptance Criteria:**
        *   The vehicle detail page shows all information: images, description, specs, reviews, and availability calendar.
        *   The booking card shows a price breakdown and allows me to select dates.
        *   I must be logged in to complete a booking.
    *   **Development Tasks:**
        *   `feature/auth-renter`: Implement renter registration and login.
        *   `feature/vehicle-detail-page`: Build the complete vehicle detail page.
        *   `feature/booking-flow`: Implement the booking process, including payment integration (Stripe).
        *   `db-schema`: Create a `bookings` table.

### 3.3. User Reviews
*   **As a Renter, I can leave a review for a vehicle after my rental is complete** to share my experience with others.
    *   **Development Tasks:**
        *   `db-schema`: Create a `reviews` table.
        *   `feature/reviews-section`: Display reviews on the vehicle detail page.
        *   `feature/submit-review`: Allow renters to submit reviews from their dashboard after a booking is completed.

---

## 4. Communication & Support System

### 4.1. Admin Support Chat
*   **As a Seller or Buyer, I can communicate directly with administrators** for support, questions, and issue resolution.
    *   **Acceptance Criteria:**
        *   Dedicated chat interface accessible from seller and buyer dashboards
        *   Real-time messaging capabilities between users and admins
        *   Message history and conversation threading
        *   File and image attachment support for documentation
        *   Admin notification system for new messages
        *   Message status indicators (sent, delivered, read)
        *   Professional chat UI with typing indicators
    *   **Development Tasks:**
        *   `db-schema`: Create tables for `conversations`, `messages`, and `message_attachments`
        *   `feature/chat-interface`: Build real-time chat component with WebSocket/real-time updates
        *   `feature/admin-chat-management`: Create admin interface for managing user conversations
        *   `feature/file-upload-chat`: Implement file and image upload within chat
        *   `feature/chat-notifications`: Add real-time notifications for new messages
        *   `api/chat-endpoints`: Create API endpoints for message CRUD operations

### 4.2. Seller-Admin Communication
*   **As a Seller, I can get help with vehicle approval, policy questions, and account issues** through direct admin chat.
    *   **Acceptance Criteria:**
        *   Quick access to admin chat from seller dashboard
        *   Pre-defined conversation topics (Vehicle Approval, Account Issues, Policy Questions)
        *   Admin can view seller's vehicle listings context during chat
        *   Priority support for urgent vehicle approval issues
    *   **Development Tasks:**
        *   `feature/seller-admin-chat`: Integrate chat specifically in seller dashboard
        *   `feature/conversation-context`: Display relevant seller context to admins
        *   `feature/priority-messaging`: Implement message priority levels

### 4.3. Buyer-Admin Communication
*   **As a Buyer, I can get assistance with bookings, payment issues, and platform usage** through direct admin chat.
    *   **Acceptance Criteria:**
        *   Easy access to admin chat from buyer dashboard
        *   Pre-defined conversation topics (Booking Help, Payment Issues, Technical Support)
        *   Admin can view buyer's booking history context during chat
        *   Emergency support for active rental issues
    *   **Development Tasks:**
        *   `feature/buyer-admin-chat`: Integrate chat specifically in buyer dashboard
        *   `feature/booking-context`: Display relevant booking context to admins
        *   `feature/emergency-support`: Implement urgent support flagging