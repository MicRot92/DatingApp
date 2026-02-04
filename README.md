DatingApp is a full-stack web application built with **Angular** on the frontend and **ASP.NET Core with Entity Framework** on the backend. The application is deployed to **Azure** and available at:
👉 **https://datingapp.azurewebsites.net/**

The frontend was implemented using **Angular, Tailwind CSS, and daisyUI**, with a strong focus on reusable components to avoid code duplication and maintain clean architecture. I used **Reactive Forms**, **route guards**, and **HTTP interceptors** to handle authentication, authorization, and request handling.

The backend follows clean architecture principles and uses the **Repository pattern** for data access. Authentication and authorization are implemented using **JWT tokens**. User photos are stored and managed via **Cloudinary** integration.

The application uses **MS SQL Server** running in a **Docker** container during development. CI/CD pipelines were implemented using **GitHub Actions**, enabling automated build and deployment to **Azure App Service**. The project was developed using **Visual Studio Code** and focuses on best practices such as separation of concerns, maintainability, and scalability.
