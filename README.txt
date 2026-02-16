This is a personal project developed to demonstrate Angular architecture integrated with microservices-based and Python-based AI API service design.
 
Project 1: AI Agent - Angular, Spring Boot, Microservice, Python API AI Application
Designed and implemented an AI Agent system using Spring Boot microservices integrated with a Python-based AI API service.
The platform processes large PDF documents.
Performs GMP regulatory compliance analysis using Ollama/OpenAI models.
Generates automated batch records, compliance results and audit reports through RESTful communication.
Created regulatory compliance audit dashboard.
 
Project 2: Angular Microservices Application
The application communicates with five independent microservices:
User Service – Manages user accounts and authentication.
Product Service – Handles product information and catalog.
Manufacturer Service – Maintains manufacturer details.
Order Quantity Service – Manages orders and quantities.
AI Agent Service – Maintains AI agent details..
 
Technologies:
Java / Spring MVC, Spring Boot, Junit, Mokito unit tests, SonarQube, Jacoco, Actuator, Grafana, jMeter, VisualVM
AWS EC2, ECR, ECS, EKS, Load balancer, Lambda.
MySQL, MongoDB, Redis Caching
Apache Kafka not deployed due to budget concern. Need to pay more money for EC2 instance. Project was implement and moved into github repository as enterprise-products.git.
Implemented CI/CD pipe lines using Maven, Jenkins, Docker, HelmCharts, ArgoCd, K8S (Installed minikube).
Use the Eclipse and VS Code IDE. Integrated GitHub Copilot.
Implemented JWT token for authentication and authorization. JWT token to communicate between the microservices. Like MVC to microservice and microservice to microservice.
Implemented server-side pagination for the manufacturer and product search feature. Integrated query parameters (page, size, sort) with microservice REST API calls.
 
User Roles:
The system supports three main roles:
Admin – Full access to manage users, products, manufacturers and orders.
User – Can browse products, manufacturers and place orders.
View – Read-only access for viewing data.