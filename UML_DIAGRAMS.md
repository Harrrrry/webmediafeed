# WebMediaFeed Application - Comprehensive UML Diagrams

This document contains detailed UML diagrams for different aspects of the WebMediaFeed application architecture.

## Table of Contents
1. [Database Schema Diagram](#database-schema-diagram)
2. [API Endpoints Diagram](#api-endpoints-diagram)
3. [Authentication Flow Diagram](#authentication-flow-diagram)
4. [State Management Flow](#state-management-flow)
5. [File Upload Flow](#file-upload-flow)
6. [Shaadi Management Flow](#shaadi-management-flow)
7. [Post Creation Flow](#post-creation-flow)
8. [Invitation System Flow](#invitation-system-flow)
9. [Component Hierarchy Diagram](#component-hierarchy-diagram)
10. [Service Layer Architecture](#service-layer-architecture)
11. [Use Case Diagram](#use-case-diagram)

---

## Database Schema Diagram

```mermaid
erDiagram
    User {
        ObjectId _id PK
        String username UK
        String email UK
        String passwordHash
        String profilePicUrl
        String phone
        String gender
        Date createdAt
        Date updatedAt
    }

    Shaadi {
        ObjectId _id PK
        String name
        String brideName
        String groomName
        Date date
        String location
        String image
        ObjectId createdBy FK
        Boolean isDeleted
        Date deletedAt
        ObjectId deletedBy FK
        String deleteReason
        Date createdAt
        Date updatedAt
    }

    ShaadiMember {
        ObjectId _id PK
        ObjectId shaadiId FK
        ObjectId userId FK
        String role
        Date joinedAt
        Date createdAt
        Date updatedAt
    }

    Invite {
        ObjectId _id PK
        ObjectId shaadiId FK
        String contact
        String status
        Date sentAt
        Date respondedAt
        Date createdAt
        Date updatedAt
    }

    Post {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId shaadiId FK
        String[] mediaUrls
        String[] mediaTypes
        String caption
        ObjectId[] likes
        String[] tags
        Date createdAt
        Date updatedAt
    }

    Comment {
        ObjectId _id PK
        ObjectId postId FK
        ObjectId userId FK
        String content
        Date createdAt
        Date updatedAt
    }

    User ||--o{ Shaadi : "creates"
    User ||--o{ ShaadiMember : "is member of"
    User ||--o{ Post : "creates"
    User ||--o{ Comment : "creates"
    User ||--o{ Invite : "receives"
    Shaadi ||--o{ ShaadiMember : "has members"
    Shaadi ||--o{ Post : "contains"
    Shaadi ||--o{ Invite : "sends"
    Post ||--o{ Comment : "has"
    Post }o--|| User : "liked by"
```

---

## API Endpoints Diagram

```mermaid
graph TB
    subgraph "Authentication Endpoints"
        A1[POST /auth/login]
        A2[POST /auth/register]
        A3[GET /auth/profile]
        A4[POST /auth/refresh]
    end

    subgraph "User Management"
        U1[GET /users/profile]
        U2[PUT /users/profile]
        U3[POST /users/upload-avatar]
        U4[GET /users/search]
    end

    subgraph "Shaadi Management"
        S1[POST /shaadi/create]
        S2[GET /shaadi/user-shaadis]
        S3[GET /shaadi/:id]
        S4[PUT /shaadi/:id]
        S5[DELETE /shaadi/:id]
        S6[POST /shaadi/:id/join]
        S7[POST /shaadi/:id/leave]
    end

    subgraph "Post Management"
        P1[POST /posts/create]
        P2[GET /posts/shaadi/:shaadiId]
        P3[PUT /posts/:id]
        P4[DELETE /posts/:id]
        P5[POST /posts/:id/like]
        P6[DELETE /posts/:id/like]
    end

    subgraph "Comment Management"
        C1[POST /posts/:id/comments]
        C2[GET /posts/:id/comments]
        C3[PUT /comments/:id]
        C4[DELETE /comments/:id]
    end

    subgraph "Invitation Management"
        I1[POST /invites/send]
        I2[GET /invites/shaadi/:shaadiId]
        I3[PUT /invites/:id/status]
        I4[DELETE /invites/:id]
        I5[POST /invites/:id/resend]
    end

    subgraph "Media Management"
        M1[POST /media/upload]
        M2[GET /media/:filename]
        M3[DELETE /media/:filename]
    end

    subgraph "AI Features"
        AI1[POST /ai/generate-caption]
        AI2[POST /ai/moderate-content]
        AI3[POST /ai/suggest-tags]
    end

    A1 --> A3
    A2 --> A3
    A3 --> U1
    S1 --> S2
    S2 --> S3
    S3 --> P2
    P1 --> P2
    P2 --> C2
    P3 --> C1
    S1 --> I1
    I1 --> I2
    P1 --> M1
    M1 --> AI1
```

---

## Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant J as JWT Service

    Note over U,D: Registration Flow
    U->>F: Enter registration details
    F->>B: POST /auth/register
    B->>D: Check if user exists
    D-->>B: User not found
    B->>B: Hash password
    B->>D: Create new user
    D-->>B: User created
    B->>J: Generate JWT token
    J-->>B: JWT token
    B-->>F: Success + JWT token
    F->>F: Store token in Redux + localStorage
    F-->>U: Show success message

    Note over U,D: Login Flow
    U->>F: Enter credentials
    F->>B: POST /auth/login
    B->>D: Validate credentials
    D-->>B: User data
    B->>J: Generate JWT token
    J-->>B: JWT token
    B-->>F: JWT token + user data
    F->>F: Store in Redux + localStorage
    F->>B: GET /users/profile (with JWT)
    B->>J: Validate JWT
    J-->>B: Valid token
    B->>D: Fetch user profile
    D-->>B: Profile data
    B-->>F: User profile
    F->>F: Update Redux state
    F-->>U: Show authenticated UI

    Note over U,D: Token Refresh Flow
    F->>B: GET /auth/refresh (with refresh token)
    B->>J: Validate refresh token
    J-->>B: Valid refresh token
    B->>J: Generate new JWT token
    J-->>B: New JWT token
    B-->>F: New JWT token
    F->>F: Update stored token
```

---

## State Management Flow

```mermaid
graph TB
    subgraph "Redux Store"
        Store[Redux Store]
        AuthSlice[Auth Slice]
        PostsSlice[Posts Slice]
        ShaadiSlice[Shaadi Slice]
        CommentsSlice[Comments Slice]
    end

    subgraph "Local Storage"
        LS[localStorage]
        ReduxState[reduxState]
        CurrentShaadi[currentShaadi]
        CurrentUserRole[currentUserRole]
    end

    subgraph "Components"
        App[App.tsx]
        HomePage[HomePage]
        CreatePost[CreatePost]
        ShaadiSummary[ShaadiSummaryInvite]
    end

    subgraph "Custom Hooks"
        useReduxPersistence[useReduxPersistence]
        useShaadiMembers[useShaadiMembers]
        useCreatePost[useCreatePost]
    end

    subgraph "API Services"
        API[api.ts]
        AuthAPI[Auth API]
        PostsAPI[Posts API]
        ShaadiAPI[Shaadi API]
    end

    Store --> AuthSlice
    Store --> PostsSlice
    Store --> ShaadiSlice
    Store --> CommentsSlice

    Store <--> LS
    LS --> ReduxState
    LS --> CurrentShaadi
    LS --> CurrentUserRole

    App --> Store
    App --> useReduxPersistence
    App --> useShaadiMembers

    HomePage --> Store
    CreatePost --> Store
    ShaadiSummary --> Store

    useCreatePost --> API
    useShaadiMembers --> ShaadiAPI
    useReduxPersistence --> LS

    API --> AuthAPI
    API --> PostsAPI
    API --> ShaadiAPI

    AuthAPI --> Store
    PostsAPI --> Store
    ShaadiAPI --> Store
```

---

## File Upload Flow

```mermaid
flowchart TD
    A[User selects files] --> B{File validation}
    B -->|Invalid| C[Show error message]
    C --> A
    
    B -->|Valid| D[Show upload progress]
    D --> E[Compress images if needed]
    E --> F[Create FormData]
    F --> G[Send to /media/upload]
    
    G --> H{Upload successful?}
    H -->|No| I[Show upload error]
    I --> A
    
    H -->|Yes| J[Get file URLs]
    J --> K[Update form state]
    K --> L[Enable submit button]
    
    L --> M[User submits form]
    M --> N[Create post with file URLs]
    N --> O{Post created?}
    O -->|No| P[Show creation error]
    P --> M
    
    O -->|Yes| Q[Update Redux state]
    Q --> R[Redirect to feed]
    R --> S[Show success message]
```

---

## Shaadi Management Flow

```mermaid
stateDiagram-v2
    [*] --> NoShaadi: App starts
    NoShaadi --> CreateShaadi: User clicks create
    NoShaadi --> JoinShaadi: User has invite code
    
    CreateShaadi --> ShaadiCreated: Form submitted
    JoinShaadi --> ShaadiJoined: Valid code
    
    ShaadiCreated --> ShaadiActive: Creation successful
    ShaadiJoined --> ShaadiActive: Join successful
    
    ShaadiActive --> ManageInvites: User clicks invite
    ShaadiActive --> ViewPosts: User views feed
    ShaadiActive --> EditShaadi: User edits details
    ShaadiActive --> DeleteShaadi: User deletes
    
    ManageInvites --> SendInvite: User sends invite
    SendInvite --> InviteSent: Invite sent
    InviteSent --> ManageInvites: Continue managing
    
    ViewPosts --> CreatePost: User creates post
    CreatePost --> PostCreated: Post submitted
    PostCreated --> ViewPosts: Return to feed
    
    EditShaadi --> ShaadiUpdated: Changes saved
    ShaadiUpdated --> ShaadiActive: Return to active
    
    DeleteShaadi --> ConfirmDelete: Show confirmation
    ConfirmDelete --> ShaadiDeleted: User confirms
    ShaadiDeleted --> NoShaadi: Return to start
    
    EditShaadi --> ShaadiActive: User cancels
    DeleteShaadi --> ShaadiActive: User cancels
```

---

## Post Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant R as Redux Store
    participant B as Backend
    participant D as Database
    participant S as Storage

    U->>F: Click Create Post
    F->>F: Show CreatePost component
    F->>R: Get current Shaadi data
    
    U->>F: Select media files
    F->>F: Validate file types/size
    F->>F: Show file previews
    
    U->>F: Add caption & tags
    F->>F: Validate form
    
    U->>F: Click Submit
    F->>S: Upload media files
    S-->>F: Return file URLs
    
    F->>B: POST /posts/create
    Note over F,B: Include: userId, shaadiId, mediaUrls, caption, tags
    
    B->>B: Validate request
    B->>D: Create post document
    D-->>B: Post created
    
    B->>D: Update Shaadi post count
    D-->>B: Updated
    
    B-->>F: Post data + ID
    F->>R: Dispatch addPost action
    R->>R: Update posts state
    
    F->>F: Show success message
    F->>F: Redirect to feed
    F->>R: Get updated posts
    F->>B: GET /posts/shaadi/:shaadiId
    B->>D: Fetch posts
    D-->>B: Posts data
    B-->>F: Posts array
    F->>R: Update posts state
    F-->>U: Show updated feed
```

---

## Invitation System Flow

```mermaid
graph TB
    subgraph "Invitation Creation"
        A[User clicks Invite] --> B[Show invite form]
        B --> C[User enters contact info]
        C --> D[Validate contact format]
        D --> E[Send invite via API]
    end

    subgraph "Invitation Processing"
        E --> F[Create invite record]
        F --> G[Generate unique invite code]
        G --> H[Send notification]
        H --> I[Update invite status]
    end

    subgraph "Invitation Response"
        I --> J[Recipient receives invite]
        J --> K[Recipient clicks link]
        K --> L[Validate invite code]
        L --> M[Show join form]
        M --> N[User fills details]
        N --> O[Submit join request]
    end

    subgraph "Member Addition"
        O --> P[Validate join request]
        P --> Q[Create ShaadiMember record]
        Q --> R[Update Shaadi member count]
        R --> S[Send welcome message]
        S --> T[Redirect to Shaadi page]
    end

    subgraph "Invitation Management"
        T --> U[Show invitation status]
        U --> V[Resend invite if needed]
        V --> W[Cancel invite if needed]
        W --> X[View all invites]
    end

    D -->|Invalid| C
    E -->|Failed| B
    L -->|Invalid| K
    O -->|Failed| M
```

---

## Component Hierarchy Diagram

```mermaid
graph TB
    subgraph "App Level"
        App[App.tsx]
        Router[AppRoutes]
        Store[Redux Store]
    end

    subgraph "Layout Components"
        UserMenu[UserMenu]
        BottomNav[BottomNav]
        PageLayout[PageLayout]
    end

    subgraph "Page Components"
        HomePage[HomePage]
        LoginPage[Login]
        CreatePostPage[CreatePost]
        ShaadiCreatePage[ShaadiCreatePage]
        ContactPage[Contact]
        NotFoundPage[NotFoundPage]
    end

    subgraph "Feature Components"
        ShaadiSummary[ShaadiSummaryInvite]
        JoinShaadi[JoinShaadi]
        PostCard[PostCard]
        Comments[Comments]
        CompactCreatePost[CompactCreatePost]
        ContactDirectory[ContactDirectory]
        GuestManagement[GuestManagement]
    end

    subgraph "Common Components"
        UserAvatar[UserAvatar]
        AppHeader[AppHeader]
        Footer[Footer]
    end

    subgraph "Form Components"
        RegularLogin[RegularLogin]
        ShaadiCodeLogin[ShaadiCodeLogin]
        JoinShaadiForm[JoinShaadiForm]
        QuickInviteForm[QuickInviteForm]
    end

    App --> Router
    App --> UserMenu
    App --> BottomNav
    App --> Store

    Router --> HomePage
    Router --> LoginPage
    Router --> CreatePostPage
    Router --> ShaadiCreatePage
    Router --> ContactPage
    Router --> NotFoundPage

    HomePage --> PageLayout
    CreatePostPage --> PageLayout
    ShaadiCreatePage --> PageLayout
    ContactPage --> PageLayout

    PageLayout --> UserAvatar
    PageLayout --> AppHeader
    PageLayout --> Footer

    HomePage --> PostCard
    HomePage --> CompactCreatePost
    HomePage --> ShaadiSummary

    PostCard --> Comments
    PostCard --> UserAvatar

    ShaadiSummary --> QuickInviteForm
    ShaadiSummary --> GuestManagement

    LoginPage --> RegularLogin
    LoginPage --> ShaadiCodeLogin

    JoinShaadi --> JoinShaadiForm
```

---

## Service Layer Architecture

```mermaid
graph TB
    subgraph "Frontend Services"
        APIService[api.ts]
        AuthService[Auth Service]
        PostsService[Posts Service]
        ShaadiService[Shaadi Service]
        MediaService[Media Service]
    end

    subgraph "Backend Services"
        AuthModule[Auth Module]
        UsersModule[Users Module]
        PostsModule[Posts Module]
        ShaadiModule[Shaadi Module]
        MediaModule[Media Module]
        CommentsModule[Comments Module]
        AIModule[AI Module]
    end

    subgraph "Service Layer"
        AuthController[Auth Controller]
        UsersController[Users Controller]
        PostsController[Posts Controller]
        ShaadiController[Shaadi Controller]
        MediaController[Media Controller]
        CommentsController[Comments Controller]
        AIController[AI Controller]
    end

    subgraph "Business Logic"
        AuthServiceLogic[Auth Service Logic]
        UsersServiceLogic[Users Service Logic]
        PostsServiceLogic[Posts Service Logic]
        ShaadiServiceLogic[Shaadi Service Logic]
        MediaServiceLogic[Media Service Logic]
        CommentsServiceLogic[Comments Service Logic]
        AIServiceLogic[AI Service Logic]
    end

    subgraph "Data Access"
        UserSchema[User Schema]
        ShaadiSchema[Shaadi Schema]
        PostSchema[Post Schema]
        CommentSchema[Comment Schema]
        InviteSchema[Invite Schema]
        ShaadiMemberSchema[ShaadiMember Schema]
    end

    subgraph "External Services"
        JWTService[JWT Service]
        FileStorage[File Storage]
        EmailService[Email Service]
        AIService[AI Service]
    end

    APIService --> AuthService
    APIService --> PostsService
    APIService --> ShaadiService
    APIService --> MediaService

    AuthService --> AuthModule
    PostsService --> PostsModule
    ShaadiService --> ShaadiModule
    MediaService --> MediaModule

    AuthModule --> AuthController
    UsersModule --> UsersController
    PostsModule --> PostsController
    ShaadiModule --> ShaadiController
    MediaModule --> MediaController
    CommentsModule --> CommentsController
    AIModule --> AIController

    AuthController --> AuthServiceLogic
    UsersController --> UsersServiceLogic
    PostsController --> PostsServiceLogic
    ShaadiController --> ShaadiServiceLogic
    MediaController --> MediaServiceLogic
    CommentsController --> CommentsServiceLogic
    AIController --> AIServiceLogic

    AuthServiceLogic --> UserSchema
    UsersServiceLogic --> UserSchema
    PostsServiceLogic --> PostSchema
    ShaadiServiceLogic --> ShaadiSchema
    MediaServiceLogic --> FileStorage
    CommentsServiceLogic --> CommentSchema

    AuthServiceLogic --> JWTService
    ShaadiServiceLogic --> EmailService
    AIServiceLogic --> AIService
```

---

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph "Client Layer"
        UI[User Interface]
        State[Redux State]
        Storage[Local Storage]
    end

    subgraph "API Layer"
        HTTP[HTTP Client]
        Interceptors[Request/Response Interceptors]
        ErrorHandler[Error Handler]
    end

    subgraph "Backend Layer"
        Controllers[Controllers]
        Services[Services]
        Guards[Guards & Middleware]
    end

    subgraph "Data Layer"
        Database[(MongoDB)]
        FileSystem[File System]
        Cache[Memory Cache]
    end

    subgraph "External Services"
        JWT[JWT Service]
        Email[Email Service]
        AI[AI Service]
    end

    UI --> State
    State --> Storage
    UI --> HTTP
    HTTP --> Interceptors
    Interceptors --> ErrorHandler
    HTTP --> Controllers
    Controllers --> Services
    Controllers --> Guards
    Services --> Database
    Services --> FileSystem
    Services --> Cache
    Services --> JWT
    Services --> Email
    Services --> AI

    Database --> Services
    FileSystem --> Services
    Cache --> Services
    JWT --> Services
    Email --> Services
    AI --> Services

    Services --> Controllers
    Guards --> Controllers
    Controllers --> HTTP
    ErrorHandler --> HTTP
    Interceptors --> HTTP
    HTTP --> State
    State --> UI
```

---

## Error Handling Flow

```mermaid
flowchart TD
    A[Error Occurs] --> B{Error Type?}
    
    B -->|Network Error| C[Show network error message]
    B -->|Validation Error| D[Show field-specific errors]
    B -->|Authentication Error| E[Redirect to login]
    B -->|Authorization Error| F[Show access denied]
    B -->|Server Error| G[Show server error message]
    B -->|Unknown Error| H[Show generic error message]
    
    C --> I[Retry mechanism]
    D --> J[Highlight invalid fields]
    E --> K[Clear auth state]
    F --> L[Log access attempt]
    G --> M[Log error details]
    H --> N[Log error for debugging]
    
    I --> O{Retry successful?}
    O -->|Yes| P[Continue normal flow]
    O -->|No| Q[Show manual retry option]
    
    J --> R[Wait for user input]
    K --> S[Redirect to login page]
    L --> T[Notify admin if needed]
    M --> U[Show contact support]
    N --> V[Show report issue option]
    
    Q --> W[Allow manual refresh]
    R --> X[Re-validate form]
    S --> Y[Clear local data]
    T --> Z[Log security event]
    U --> AA[Provide error ID]
    V --> BB[Collect error context]
    
    W --> CC[User clicks refresh]
    X --> DD{Form valid now?}
    Y --> EE[Show login form]
    Z --> FF[Update security log]
    AA --> GG[Store error details]
    BB --> HH[Send error report]
    
    CC --> P
    DD -->|Yes| P
    DD -->|No| J
    EE --> II[User re-authenticates]
    FF --> JJ[Continue monitoring]
    GG --> KK[Allow error tracking]
    HH --> LL[Notify development team]
```

---

## Performance Optimization Flow

```mermaid
flowchart TD
    A[Performance Issue Detected] --> B{Issue Type?}
    
    B -->|Slow API Response| C[Implement caching]
    B -->|Large Bundle Size| D[Code splitting]
    B -->|Slow Rendering| E[Component optimization]
    B -->|Memory Leaks| F[Memory management]
    B -->|Slow Database| G[Query optimization]
    
    C --> H[Add Redis cache]
    C --> I[Implement HTTP caching]
    C --> J[Add service worker]
    
    D --> K[Route-based splitting]
    D --> L[Component lazy loading]
    D --> M[Tree shaking]
    
    E --> N[React.memo]
    E --> O[useMemo/useCallback]
    E --> P[Virtual scrolling]
    
    F --> Q[Cleanup effects]
    F --> R[Memory profiling]
    F --> S[Garbage collection]
    
    G --> T[Add database indexes]
    G --> U[Query optimization]
    G --> V[Connection pooling]
    
    H --> W[Monitor cache hit rate]
    I --> X[Set cache headers]
    J --> Y[Offline support]
    
    K --> Z[Monitor bundle size]
    L --> AA[Track loading times]
    M --> BB[Analyze dependencies]
    
    N --> CC[Profile render times]
    O --> DD[Monitor re-renders]
    P --> EE[Test with large lists]
    
    Q --> FF[Memory leak detection]
    R --> GG[Heap analysis]
    S --> HH[Performance monitoring]
    
    T --> II[Query performance metrics]
    U --> JJ[Execution plan analysis]
    V --> KK[Connection monitoring]
    
    W --> LL{Performance improved?}
    X --> LL
    Y --> LL
    Z --> LL
    AA --> LL
    BB --> LL
    CC --> LL
    DD --> LL
    EE --> LL
    FF --> LL
    GG --> LL
    HH --> LL
    II --> LL
    JJ --> LL
    KK --> LL
    
    LL -->|Yes| MM[Document optimization]
    LL -->|No| NN[Investigate further]
    
    MM --> OO[Update performance docs]
    NN --> PP[Debug performance issues]
```

---

## Security Architecture Flow

```mermaid
flowchart TD
    A[Request Received] --> B[Rate Limiting]
    B --> C{Within limits?}
    
    C -->|No| D[Block request]
    C -->|Yes| E[CORS Check]
    
    E --> F{Origin allowed?}
    F -->|No| G[Block request]
    F -->|Yes| H[Input Validation]
    
    H --> I{Input valid?}
    I -->|No| J[Return validation error]
    I -->|Yes| K[Authentication Check]
    
    K --> L{Has valid JWT?}
    L -->|No| M[Return 401 Unauthorized]
    L -->|Yes| N[JWT Validation]
    
    N --> O{JWT valid?}
    O -->|No| P[Return 401 Unauthorized]
    O -->|Yes| Q[Authorization Check]
    
    Q --> R{User has permission?}
    R -->|No| S[Return 403 Forbidden]
    R -->|Yes| T[Process Request]
    
    T --> U[Sanitize Data]
    U --> V[Execute Business Logic]
    V --> W[Log Activity]
    W --> X[Return Response]
    
    D --> Y[Log blocked request]
    G --> Y
    J --> Z[Log validation error]
    M --> AA[Log auth failure]
    P --> AA
    S --> BB[Log access denied]
    
    Y --> CC[Update security metrics]
    Z --> CC
    AA --> CC
    BB --> CC
    W --> CC
    
    CC --> DD[Monitor security events]
    DD --> EE{Anomaly detected?}
    EE -->|Yes| FF[Alert security team]
    EE -->|No| GG[Continue monitoring]
    
    FF --> HH[Investigate incident]
    GG --> II[Regular security review]
```

---

## Testing Strategy Diagram

```mermaid
graph TB
    subgraph "Frontend Testing"
        FT[Frontend Tests]
        UT[Unit Tests]
        IT[Integration Tests]
        E2E[End-to-End Tests]
    end

    subgraph "Backend Testing"
        BT[Backend Tests]
        BUnit[Unit Tests]
        BInt[Integration Tests]
        BE2E[E2E Tests]
    end

    subgraph "Test Tools"
        Vitest[Vitest]
        RTL[React Testing Library]
        Jest[Jest]
        Supertest[Supertest]
        Cypress[Cypress]
    end

    subgraph "Test Coverage"
        Components[Components]
        Hooks[Hooks]
        Services[Services]
        API[API Endpoints]
        Database[Database]
    end

    subgraph "Test Types"
        Unit[Unit Tests]
        Integration[Integration Tests]
        E2E[End-to-End Tests]
        Performance[Performance Tests]
        Security[Security Tests]
    end

    FT --> UT
    FT --> IT
    FT --> E2E

    BT --> BUnit
    BT --> BInt
    BT --> BE2E

    UT --> Vitest
    IT --> RTL
    E2E --> Cypress

    BUnit --> Jest
    BInt --> Supertest
    BE2E --> Jest

    Components --> Unit
    Hooks --> Unit
    Services --> Integration
    API --> Integration
    Database --> Integration

    Unit --> Components
    Unit --> Hooks
    Integration --> Services
    Integration --> API
    Integration --> Database

    E2E --> Performance
    E2E --> Security
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevFrontend[Frontend Dev Server<br/>Port: 5173]
        DevBackend[Backend Dev Server<br/>Port: 5000]
        DevDB[(MongoDB Dev<br/>Port: 27017)]
        DevStorage[Local File Storage]
    end

    subgraph "Production Environment"
        ProdFrontend[Frontend Production<br/>CDN/Static Hosting]
        ProdBackend[Backend Production<br/>Load Balancer]
        ProdDB[(MongoDB Production<br/>Replica Set)]
        ProdStorage[Cloud Storage<br/>AWS S3/Azure Blob]
    end

    subgraph "CI/CD Pipeline"
        Git[Git Repository]
        CI[Continuous Integration]
        CD[Continuous Deployment]
        Testing[Automated Testing]
    end

    subgraph "Monitoring & Logging"
        Monitoring[Application Monitoring]
        Logging[Centralized Logging]
        Metrics[Performance Metrics]
        Alerts[Alert System]
    end

    DevFrontend --> DevBackend
    DevBackend --> DevDB
    DevBackend --> DevStorage

    ProdFrontend --> ProdBackend
    ProdBackend --> ProdDB
    ProdBackend --> ProdStorage

    Git --> CI
    CI --> Testing
    Testing --> CD
    CD --> ProdFrontend
    CD --> ProdBackend

    ProdFrontend --> Monitoring
    ProdBackend --> Monitoring
    Monitoring --> Logging
    Monitoring --> Metrics
    Monitoring --> Alerts

    DevFrontend --> Monitoring
    DevBackend --> Monitoring
```

---

## Database Migration Flow

```mermaid
flowchart TD
    A[Schema Change Required] --> B[Create Migration Script]
    B --> C[Test Migration Locally]
    
    C --> D{Migration Successful?}
    D -->|No| E[Fix Migration Script]
    E --> C
    
    D -->|Yes| F[Create Rollback Script]
    F --> G[Test Rollback Locally]
    
    G --> H{Rollback Successful?}
    H -->|No| I[Fix Rollback Script]
    I --> G
    
    H -->|Yes| J[Deploy to Staging]
    J --> K[Run Migration on Staging]
    
    K --> L{Migration Successful?}
    L -->|No| M[Investigate Issues]
    M --> B
    
    L -->|Yes| N[Test Application on Staging]
    N --> O{All Tests Pass?}
    O -->|No| P[Fix Issues]
    P --> N
    
    O -->|Yes| Q[Deploy to Production]
    Q --> R[Run Migration on Production]
    
    R --> S{Migration Successful?}
    S -->|No| T[Execute Rollback]
    T --> U[Investigate Production Issues]
    U --> B
    
    S -->|Yes| V[Verify Application]
    V --> W{Application Working?}
    W -->|No| X[Execute Rollback]
    X --> U
    
    W -->|Yes| Y[Migration Complete]
    Y --> Z[Monitor Application]
    Z --> AA[Document Changes]
```

---

## API Versioning Strategy

```mermaid
graph TB
    subgraph "API Versions"
        V1[API v1]
        V2[API v2]
        V3[API v3]
    end

    subgraph "Version Management"
        Deprecation[Deprecation Policy]
        Migration[Migration Guide]
        Support[Support Timeline]
    end

    subgraph "Client Compatibility"
        OldClients[Legacy Clients]
        CurrentClients[Current Clients]
        NewClients[New Clients]
    end

    subgraph "Versioning Methods"
        URLVersioning[URL Versioning<br/>/api/v1/]
        HeaderVersioning[Header Versioning<br/>Accept: v1]
        QueryVersioning[Query Versioning<br/>?version=1]
    end

    V1 --> Deprecation
    V2 --> Deprecation
    V3 --> Deprecation

    Deprecation --> Migration
    Migration --> Support

    V1 --> OldClients
    V2 --> CurrentClients
    V3 --> NewClients

    URLVersioning --> V1
    URLVersioning --> V2
    URLVersioning --> V3

    HeaderVersioning --> V1
    HeaderVersioning --> V2
    HeaderVersioning --> V3

    QueryVersioning --> V1
    QueryVersioning --> V2
    QueryVersioning --> V3

    OldClients --> V1
    CurrentClients --> V2
    NewClients --> V3

    Support --> Migration
    Migration --> Deprecation
```

---

## Error Recovery Strategy

```mermaid
flowchart TD
    A[Error Detected] --> B{Error Severity?}
    
    B -->|Critical| C[Immediate Response]
    B -->|High| D[Quick Response]
    B -->|Medium| E[Standard Response]
    B -->|Low| F[Monitor & Log]
    
    C --> G[Alert Team]
    C --> H[Stop Affected Services]
    C --> I[Execute Recovery Plan]
    
    D --> J[Alert Team]
    D --> K[Investigate Root Cause]
    D --> L[Implement Fix]
    
    E --> M[Log Error]
    E --> N[Schedule Investigation]
    E --> O[Plan Fix]
    
    F --> P[Log Error]
    F --> Q[Monitor Trends]
    
    G --> R[Team Responds]
    H --> S[Service Stopped]
    I --> T[Recovery Executed]
    
    J --> U[Team Investigates]
    K --> V[Root Cause Found]
    L --> W[Fix Implemented]
    
    M --> X[Error Logged]
    N --> Y[Investigation Scheduled]
    O --> Z[Fix Planned]
    
    P --> AA[Error Logged]
    Q --> BB[Trends Monitored]
    
    R --> CC{Recovery Successful?}
    S --> DD{Service Stopped?}
    T --> EE{Recovery Complete?}
    
    U --> FF{Investigation Complete?}
    V --> GG{Fix Ready?}
    W --> HH{Fix Successful?}
    
    X --> II[Error Tracked]
    Y --> JJ[Investigation Started]
    Z --> KK[Fix Scheduled]
    
    AA --> LL[Error Tracked]
    BB --> MM[Trends Analyzed]
    
    CC -->|Yes| NN[Resume Normal Operations]
    CC -->|No| OO[Escalate Issue]
    
    DD -->|Yes| PP[Begin Recovery]
    DD -->|No| QQ[Force Stop]
    
    EE -->|Yes| RR[Verify System Health]
    EE -->|No| SS[Execute Backup Plan]
    
    FF -->|Yes| TT[Implement Fix]
    FF -->|No| UU[Continue Investigation]
    
    GG -->|Yes| VV[Deploy Fix]
    GG -->|No| WW[Continue Development]
    
    HH -->|Yes| XX[Monitor Fix]
    HH -->|No| YY[Rollback Changes]
    
    II --> ZZ[Error Resolved]
    JJ --> AAA[Investigation Complete]
    KK --> BBB[Fix Deployed]
    
    LL --> CCC[Error Resolved]
    MM --> DDD[Trends Documented]
```

---

## Use Case Diagram

### PlantUML Version (Renderable Diagram)

```plantuml
@startuml WebMediaFeed_UseCaseDiagram
!theme plain
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor LightGreen
  BorderColor DarkGreen
  ArrowColor DarkBlue
}

title WebMediaFeed Application - Use Case Diagram

' Actors
actor "👤 User\n(Registered User)" as User
actor "👥 Guest\n(Invited Guest)" as Guest  
actor "👑 Creator\n(Shaadi Creator)" as Creator
actor "🔧 System Admin" as Admin

' Secondary Actors
actor "🤖 AI Service" as AI
actor "💾 File Storage" as Storage
actor "📧 Email Service" as Email
actor "🔐 JWT Service" as JWT
actor "🗄️ Database" as DB

' System Boundary
rectangle "WebMediaFeed System" {
  
  ' Authentication & User Management
  package "Authentication & User Management" {
    usecase "Register User" as UC1
    usecase "Login User" as UC2
    usecase "Login with Shaadi Code" as UC3
    usecase "Manage Profile" as UC4
    usecase "Change Password" as UC5
    usecase "Upload Avatar" as UC6
  }
  
  ' Shaadi Event Management
  package "Shaadi Event Management" {
    usecase "Create Shaadi Event" as UC7
    usecase "Join Shaadi Event" as UC8
    usecase "Manage Event Details" as UC9
    usecase "Delete Event" as UC10
    usecase "Switch Shaadi Context" as UC11
    usecase "View Shaadi List" as UC12
  }
  
  ' Content Management
  package "Content Management" {
    usecase "Create Post" as UC13
    usecase "Edit Post" as UC14
    usecase "Delete Post" as UC15
    usecase "Add Comment" as UC16
    usecase "Edit Comment" as UC17
    usecase "Delete Comment" as UC18
    usecase "Like Post" as UC19
    usecase "Unlike Post" as UC20
    usecase "View Feed" as UC21
    usecase "View Post Details" as UC22
  }
  
  ' Media Management
  package "Media Management" {
    usecase "Upload Media" as UC23
    usecase "Delete Media" as UC24
    usecase "View Media" as UC25
    usecase "Compress Images" as UC26
  }
  
  ' Invitation System
  package "Invitation System" {
    usecase "Send Invitation" as UC27
    usecase "Manage Guest List" as UC28
    usecase "Process Invitation Response" as UC29
    usecase "Generate Invite Code" as UC30
    usecase "Resend Invitation" as UC31
    usecase "Cancel Invitation" as UC32
  }
  
  ' Guest Management
  package "Guest Management" {
    usecase "Approve Guest Request" as UC33
    usecase "Block Member" as UC34
    usecase "Unblock Member" as UC35
    usecase "View Member List" as UC36
    usecase "Manage Member Roles" as UC37
  }
  
  ' AI Features
  package "AI Features" {
    usecase "Generate Caption" as UC38
    usecase "Moderate Content" as UC39
    usecase "Suggest Tags" as UC40
  }
  
  ' Social Features
  package "Social Features" {
    usecase "Search Users" as UC41
    usecase "View Contact Directory" as UC42
    usecase "Share Content" as UC43
    usecase "View User Profiles" as UC44
  }
}

' Primary Actor Relationships
User --> UC1
User --> UC2
User --> UC4
User --> UC5
User --> UC6
User --> UC8
User --> UC12
User --> UC13
User --> UC14
User --> UC15
User --> UC16
User --> UC17
User --> UC18
User --> UC19
User --> UC20
User --> UC21
User --> UC22
User --> UC23
User --> UC24
User --> UC25
User --> UC41
User --> UC42
User --> UC43
User --> UC44

Guest --> UC3
Guest --> UC8
Guest --> UC13
Guest --> UC16
Guest --> UC19
Guest --> UC20
Guest --> UC21
Guest --> UC22
Guest --> UC23
Guest --> UC25
Guest --> UC42
Guest --> UC44

Creator --> UC7
Creator --> UC9
Creator --> UC10
Creator --> UC27
Creator --> UC28
Creator --> UC30
Creator --> UC31
Creator --> UC32
Creator --> UC33
Creator --> UC34
Creator --> UC35
Creator --> UC36
Creator --> UC37

Admin --> UC1
Admin --> UC2
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin --> UC13
Admin --> UC14
Admin --> UC15
Admin --> UC16
Admin --> UC17
Admin --> UC18
Admin --> UC19
Admin --> UC20
Admin --> UC21
Admin --> UC22
Admin --> UC23
Admin --> UC24
Admin --> UC25
Admin --> UC26
Admin --> UC27
Admin --> UC28
Admin --> UC29
Admin --> UC30
Admin --> UC31
Admin --> UC32
Admin --> UC33
Admin --> UC34
Admin --> UC35
Admin --> UC36
Admin --> UC37
Admin --> UC38
Admin --> UC39
Admin --> UC40
Admin --> UC41
Admin --> UC42
Admin --> UC43
Admin --> UC44

' Secondary Actor Relationships
JWT --> UC2
JWT --> UC3
JWT --> UC8
JWT --> UC11

Email --> UC27
Email --> UC31

Storage --> UC23
Storage --> UC24
Storage --> UC25
Storage --> UC26

AI --> UC38
AI --> UC39
AI --> UC40

DB --> UC1
DB --> UC2
DB --> UC3
DB --> UC4
DB --> UC5
DB --> UC6
DB --> UC7
DB --> UC8
DB --> UC9
DB --> UC10
DB --> UC11
DB --> UC12
DB --> UC13
DB --> UC14
DB --> UC15
DB --> UC16
DB --> UC17
DB --> UC18
DB --> UC19
DB --> UC20
DB --> UC21
DB --> UC22
DB --> UC23
DB --> UC24
DB --> UC25
DB --> UC26
DB --> UC27
DB --> UC28
DB --> UC29
DB --> UC30
DB --> UC31
DB --> UC32
DB --> UC33
DB --> UC34
DB --> UC35
DB --> UC36
DB --> UC37
DB --> UC38
DB --> UC39
DB --> UC40
DB --> UC41
DB --> UC42
DB --> UC43
DB --> UC44

' Include Relationships
UC1 ..> UC2 : <<include>>
UC7 ..> UC8 : <<include>>
UC13 ..> UC23 : <<include>>
UC16 ..> UC13 : <<include>>
UC19 ..> UC13 : <<include>>
UC20 ..> UC13 : <<include>>
UC21 ..> UC13 : <<include>>
UC22 ..> UC13 : <<include>>
UC27 ..> UC30 : <<include>>
UC31 ..> UC27 : <<include>>
UC32 ..> UC27 : <<include>>
UC33 ..> UC8 : <<include>>
UC34 ..> UC36 : <<include>>
UC35 ..> UC36 : <<include>>
UC37 ..> UC36 : <<include>>

' Extend Relationships
UC38 ..> UC13 : <<extend>>
UC39 ..> UC13 : <<extend>>
UC39 ..> UC16 : <<extend>>
UC40 ..> UC13 : <<extend>>
UC26 ..> UC23 : <<extend>>
UC43 ..> UC13 : <<extend>>
UC43 ..> UC22 : <<extend>>

' Generalization Relationships
Creator --|> User
Admin --|> User
Admin --|> Creator

' Preconditions
UC2 ..> UC4 : "Pre: User exists"
UC3 ..> UC8 : "Pre: Valid invite code"
UC7 ..> UC8 : "Pre: User authenticated"
UC8 ..> UC13 : "Pre: Valid shaadi"
UC13 ..> UC16 : "Pre: User member of shaadi"
UC16 ..> UC19 : "Pre: Post exists"
UC19 ..> UC20 : "Pre: Post not already liked"
UC27 ..> UC30 : "Pre: Creator role"
UC33 ..> UC36 : "Pre: Creator role"
UC34 ..> UC36 : "Pre: Creator role"
UC35 ..> UC36 : "Pre: Creator role"

@enduml
```

### How to Render the Diagram

#### **Option 1: Online PlantUML Editor**
1. Go to [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Copy the PlantUML code above (between @startuml and @enduml)
3. Paste it into the editor
4. The diagram will render automatically

#### **Option 2: VS Code Extension**
1. Install "PlantUML" extension in VS Code
2. Create a new file with `.puml` extension
3. Paste the PlantUML code
4. Right-click and select "Preview Current Diagram"

#### **Option 3: Local PlantUML Installation**
1. Install Java Runtime Environment (JRE)
2. Download PlantUML jar file
3. Run: `java -jar plantuml.jar filename.puml`

#### **Option 4: Mermaid Version (Alternative)**
If you prefer Mermaid, the previous version is still available and can be rendered in:
- GitHub markdown files
- GitLab markdown files
- Mermaid Live Editor
- VS Code with Mermaid extension

### Use Case Descriptions

#### **Primary Actors**
- **User**: Registered users with full account access
- **Guest**: Invited users with limited access via shaadi codes
- **Creator**: Users who create and manage shaadi events
- **Admin**: System administrators with full system access

#### **Secondary Actors**
- **AI Service**: External AI service for content generation and moderation
- **File Storage**: File storage system for media uploads
- **Email Service**: Email service for sending invitations
- **JWT Service**: JWT token service for authentication
- **Database**: MongoDB database for data persistence

#### **Key Use Case Relationships**
- **<<include>>**: Required functionality that must be performed
- **<<extend>>**: Optional functionality that may be performed
- **<<generalize>>**: Inheritance relationship between actors

#### **Use Case Categories**
1. **Authentication & User Management**: User registration, login, profile management
2. **Shaadi Event Management**: Creating, joining, and managing wedding events
3. **Content Management**: Posts, comments, likes, and feed viewing
4. **Media Management**: File uploads, compression, and storage
5. **Invitation System**: Guest invitations and management
6. **Guest Management**: Member approval, blocking, and role management
7. **AI Features**: Content generation and moderation
8. **Social Features**: User search, contact directory, and sharing 