## Topics

Registration
Login
Password hashing
JWT authentication
Access tokens
Refresh tokens
Protected routes
Authentication middleware
Authorization / roles
RBAC
Logout
Token expiration
Password reset concepts

### We're building a Project Management API.

Users:

- Admin
- Manager
- Employee

#### Projects:

Project
├── name
├── description
├── owner
└── status

#### Eventually users will:

Register
↓
Login
↓
Get Access Token
↓
Access protected APIs
↓
Authorization
↓
RBAC
↓
Permissions

#### But today we start with:

Register
↓
Validate input
↓
Hash password
↓
Store user
