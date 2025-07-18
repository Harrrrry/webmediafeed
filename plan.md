# Development Plan - ShaadiCircle Web Media Feed

## Phase 1: Frontend Setup & Infrastructure
- [x] Create React project with TypeScript  
  - Use Vite for faster setup and lightweight dev server
- [x] Set up Redux Toolkit (RTK) with slices  
  - Create `postSlice` with initial state for posts, status, error
- [x] Configure routing if needed  
  - Use React Router DOM v6 (optional if multiple views planned)
- [x] Add styled-components for scoped and reusable styling

## Phase 2: Backend Setup (NestJS) & Database
- [ ] Initialize NestJS backend project  
  - Use Nest CLI to scaffold project structure
- [ ] Install and configure Mongoose for MongoDB integration
- [ ] Set up environment variables for MongoDB connection (local or Atlas)
- [ ] Design MongoDB schemas/models for:
  - User
  - Post
  - Comment
  - (Optional) AI features (captions, tags, sentiment)
- [ ] Implement Mongoose schemas in NestJS modules

## Phase 3: API Design & Implementation (NestJS)
- [ ] Create RESTful API endpoints for core features:
  - **User APIs**
    - POST `/users/register` — Register new user
    - POST `/users/login` — User login (token-based auth)
    - GET `/users/:id` — Get user profile
  - **Post APIs**
    - GET `/posts` — List posts (with pagination, infinite scroll)
    - GET `/posts/:id` — Get single post
    - POST `/posts` — Create new post (with media URL, caption, etc.)
    - PATCH `/posts/:id` — Edit post (caption, etc.)
    - DELETE `/posts/:id` — Delete post
    - POST `/posts/:id/like` — Like/unlike post
  - **Comment APIs**
    - GET `/posts/:id/comments` — List comments for a post
    - POST `/posts/:id/comments` — Add comment to post
    - DELETE `/comments/:id` — Delete comment
  - **Media Upload**
    - POST `/media/upload` — Handle media upload (integrate with Cloudinary/Firebase)
  - **AI Feature APIs (Optional)**
    - POST `/ai/caption` — Generate caption for media
    - POST `/ai/face-detect` — Detect faces in media
    - POST `/ai/sentiment` — Analyze sentiment of comment
- [ ] Implement authentication middleware (JWT or similar)
- [ ] Add validation and error handling for all endpoints

## Phase 4: Frontend Data Integration
- [ ] Connect frontend to real backend APIs (NestJS)
- [ ] Create Redux async thunks for fetching/creating posts, comments, likes, etc.
- [ ] Dispatch thunks on load and user actions, store data in RTK state
- [ ] Handle authentication (login/signup, token storage)

## Phase 5: Post Feed UI
- [ ] Create PostCard component (image/video)  
  - Accept props for image/video URL, caption, likes, etc.
- [ ] Create Feed container component  
  - Render list of PostCards using mapped data
- [ ] Add infinite scroll pagination logic (using nextCursor param)
- [ ] Add like/unlike interaction (integrated with backend)

## Phase 6: Media Upload
- [ ] Create media upload UI  
  - Allow selecting image/video file from device
- [ ] Handle image/video preview  
  - Show selected file in preview area before upload
- [ ] Integrate with backend media upload API (Cloudinary/Firebase)
- [ ] Save post metadata (caption, media type, URL) via backend

## Phase 7: AI Feature Integration (Optional)
- [ ] Add AI-generated caption (optional UI toggle)  
  - Integrate with backend AI API
- [ ] Add face detection tagging preview (optional)  
  - Use backend or JS library for face detection

## Phase 8: Reusability & WebView
- [ ] Make Feed a reusable component (props-driven)  
  - Feed should accept `data`, `onLike`, `onScroll` handlers
- [ ] Ensure mobile-first responsiveness  
  - Test on mobile breakpoints, touch interactions
- [ ] Test in WebView context on mobile  
  - Load web app in WebView shell and verify functionality

## Phase 9: Extras & Polish
- [ ] Add animations (like button pop, scroll fade-in)  
  - Use Framer Motion or CSS transitions
- [ ] Add error/loading states  
  - Show skeleton or spinner for loading, friendly error messages
- [ ] Optimize for performance (lazy load, code split)  
  - Lazy load images/videos and split bundle
- [ ] Add accessibility (a11y) checks and improvements
- [ ] Add basic analytics/monitoring (optional)

## Phase 10: Future Phase Planning
- [ ] Comment system enhancements  
  - Allow guest comments with auth check
- [ ] Auth system enhancements  
  - Add social login, password reset, etc.
- [ ] Admin panel  
  - Dashboard to manage posts, moderate content
- [ ] Feature flags for AI features  
  - Toggle AI-based captions, tags via feature flag config
- [ ] Documentation and API reference
- [ ] CI/CD and deployment setup (Vercel, Netlify, or custom)

