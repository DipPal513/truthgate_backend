# TruthGate Backend API Documentation

## Introduction
Welcome to the TruthGate backend API documentation! This document provides detailed information about the available API endpoints for managing user-related operations.

## Authentication

### Login
- **Route:** `POST /login`
- **Description:** Authenticates a user with the provided credentials.
- **Middleware:** None

### Logout
- **Route:** `POST /logout`
- **Description:** Logs out the currently authenticated user.
- **Middleware:** None

### Register
- **Route:** `POST /register`
- **Description:** Registers a new user with the provided credentials.
- **Middleware:** None

## Profile Management

### Update Password
- **Route:** `PUT /update/password`
- **Description:** Updates the password of the currently authenticated user.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Update Profile
- **Route:** `PUT /update/profile`
- **Description:** Updates the profile information of the currently authenticated user.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Follow/Unfollow User
- **Route:** `GET /follow/:id`
- **Description:** Allows the currently authenticated user to follow or unfollow another user.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Delete My Profile
- **Route:** `DELETE /delete/me`
- **Description:** Deletes the profile of the currently authenticated user.
- **Middleware:** Requires authentication (`isAuthenticate`).

### View My Profile
- **Route:** `GET /me`
- **Description:** Retrieves the profile information of the currently authenticated user.
- **Middleware:** Requires authentication (`isAuthenticate`).

### View All Users
- **Route:** `GET /users`
- **Description:** Retrieves the profiles of all registered users.
- **Middleware:** Requires authentication (`isAuthenticate`).

### View Single User
- **Route:** `GET /user/:id`
- **Description:** Retrieves the profile information of a single user by their ID.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Update User Bio
- **Route:** `PUT /user/bio`
- **Description:** Updates the bio information of the currently authenticated user.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Search Users
- **Route:** `GET /users/search`
- **Description:** Searches for users based on the provided query string.
- **Middleware:** Requires authentication (`isAuthenticate`).

### For Post


### Authentication Middleware
- **Middleware:** `isAuthenticate`
- **Description:** Ensures that the user is authenticated before accessing the specified routes.

## Post Management

### Upload Post
- **Route:** `POST /post/upload`
- **Description:** Creates a new post with an optional image and caption.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Get Posts of Following Users
- **Route:** `GET /posts`
- **Description:** Retrieves posts from users that the currently authenticated user is following.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Update Post Caption
- **Route:** `PUT /post/:id`
- **Description:** Updates the caption of a post identified by its ID.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Get Post by ID and Like/Dislike
- **Route:** `GET /post/:id`
- **Description:** Retrieves a specific post by its ID and allows the currently authenticated user to like or dislike it.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Add Comment to Post
- **Route:** `PUT /post/comment/:id`
- **Description:** Adds a comment to a post identified by its ID.
- **Middleware:** Requires authentication (`isAuthenticate`).

### Delete Post
- **Route:** `DELETE /deletepost/:id`
- **Description:** Deletes a post identified by its ID.
- **Middleware:** Requires authentication (`isAuthenticate`).


## Conclusion
This concludes the API documentation for the TruthGate backend. These routes provide the necessary functionality for user authentication, profile management, and interactions between users. If you have any questions or need further assistance, please refer to the respective controller functions or contact the backend developers.
