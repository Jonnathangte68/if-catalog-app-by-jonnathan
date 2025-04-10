Product Catalog - Fullstack Application
=======================================

This project delivers a complete fullstack application for browsing products from an external catalog. It provides a fast, intuitive interface for users, supported by a reliable backend service architecture. The application runs seamlessly in a containerized environment using Docker.

Purpose and Approach
-----------------------

This exercise demonstrates how a simple feature—browsing products—can be implemented in a way that reflects modern production-level practices. While technical correctness was important, equal focus was placed on clarity, maintainability, and readiness for real-world deployment.

The solution includes:

A React-based frontend for responsive product browsing and search

An ASP.NET Core backend that integrates with a third-party product API and adds caching

Docker-based deployment, ensuring consistency across all operating systems

Observability features like health checks, structured logs, and metrics


Motivation and Approach
-----------------------

The goal of this exercise was to build a production-grade web application for displaying products in a simple and intuitive way, suitable for both business stakeholders and technical audiences.

The solution consists of:

*   A **frontend** that offers a responsive UI and client-side search
    
*   A **backend** that fetches and caches products from https://dummyjson.com/products
    
*   A **Docker-based local development setup** that works consistently on macOS, Linux, and Windows
    

Technologies Used
-----------------

### Frontend (React + Vite)

*   **React** with **TypeScript** for a typed component architecture
    
*   **Vite** for fast builds and HMR
    
*   **TailwindCSS** for utility-first styling
    
*   **Zustand** for simple and performant state management
    
*   **TanStack Query** for fetching and caching
    
*   **Cypress** for E2E testing
    
*   **@testing-library/react** for component tests
    

### Backend (ASP.NET Core 8)

*   **Hexagonal Architecture** (Ports & Adapters)
    
*   **Serilog** for structured logging and diagnostics
    
*   **HttpClientFactory** for external API requests
    
*   **IMemoryCache** to reduce redundant API fetches
    
*   **Swagger** for developer API documentation
    
*   **Prometheus** integration with metrics exposed at /metrics
    
*   **Health Check Endpoint** at /healthz
    
*   **API Versioning** with routes like /api/v1/products
    
*   **XUnit** for unit tests
    

Backend Structure
-----------------

```
ProductCatalog/
├── ProductCatalog.Api/            # REST API layer
├── ProductCatalog.Application/    # Use cases & service interfaces
├── ProductCatalog.Domain/         # Core business logic (entities)
└── ProductCatalog.Infrastructure/ # Implementations (external API, caching)
```

*   Controllers only handle routing
    
*   Application layer defines interfaces (e.g., IProductService)
    
*   Infrastructure provides implementations (e.g., IfProductsHttpClient)
    

Caching Strategy
----------------

*   Uses IMemoryCache to cache the result of the external API for 5 minutes
    
*   Prevents unnecessary repeated fetches from dummyjson.com
    

Environment Support
-------------------

Docker ensures the application can be run on:

*   macOS (including Apple Silicon/M1)
    
*   Windows (PowerShell via start-all.ps1)
    
*   Linux

All containers use platform: linux/amd64 to ensure cross-platform compatibility.


Configuration
-------------------

*   Configuration is separated using appsettings.Development.json and appsettings.Production.json

*   CORS origins are loaded from settings via AllowedOrigins

*   API base URL and caching behavior are loaded via configuration-bound IfProductCatalogClientOptions


Health & Metrics
-------------------

*   `/healthz` provides health checks (e.g. reachability of the product API)

*   `/metrics` exposes Prometheus-compatible system and request-level metrics

*   Custom counter metric product_requests_total is exposed per `/products` call


Running the Project
-------------------

### 1\. Prerequisites

*   Docker & Docker Compose

#### 1.1\. Before running the project, copy the appropriate example file:

```
# For local dev
cp frontend/.env.example frontend/.env

# For Docker builds
cp frontend/.env.production.example frontend/.env.production
```

Please do both for effects of this exercise, If running with any issues!


### 2\. Start All Services

`docker-compose up --build`

*   Frontend available at: http://localhost
    
*   Backend API available at: http://localhost:5213/products

*   Health Check: http://localhost:5213/healthz

*   Metrics: http://localhost:5213/metrics
    

### 3\. Windows Shortcut (PowerShell)

`./start-all.ps1`

Running Tests
-------------

### Frontend

```
# Unit tests

npm run test
```

```
# E2E tests (requires app to be running)

npx cypress open
```

### Backend

```
# From backend folder

dotnet test
```

Production-Level Considerations
-------------

*   You must expose backend port 5213 to the host.
    
*   CORS must be configured to allow http://localhost in Docker production builds.
    
*   Tailwind styles require a valid PostCSS config (postcss.config.cjs when using type: module)

Known Gotchas
-------------

This solution demonstrates:

*   Clean layering and hexagonal design

*   Runtime observability (logs, metrics, health)

*   Caching and resiliency patterns

*   Versioned REST API structure

While HTTPS and authentication were intentionally omitted, the design easily supports those extensions.
    

Additional Notes
----------------

This solution balances clean architecture with modern tooling. All parts of the system are easily testable and extendable. It showcases:

*   Production-minded configuration (CORS, environment vars, caching)
    
*   Modern frontend DX (Vite, Tailwind, Cypress)
    
*   Clean backend layering (Hexagonal)
    

This solution is designed to be easy to maintain, easy to reason about, and platform-agnostic.

If you have any questions or suggestions for improvement, feel free to reach out.