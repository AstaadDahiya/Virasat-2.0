# Virasat

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Virasat is a full-featured e-commerce platform designed to empower artisans by connecting them directly with a global customer base. It provides a comprehensive business management and logistics solution, integrating a suite of AI-powered tools to handle the complexities of e-commerce, allowing artisans to focus entirely on their craft.

## Table of Contents

- [Core Problem & Solution](#core-problem--solution)
- [Key Features](#key-features)
  - [For Artisans: AI-Powered Toolkit](#for-artisans-ai-powered-toolkit)
  - [For Customers: Seamless Shopping](#for-customers-seamless-shopping)
- [The Artisan Dashboard](#the-artisan-dashboard)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Core Problem & Solution

Individual artisans often lack the time, technical expertise, and resources to build a professional online presence, manage marketing, optimize pricing, and handle complex international logistics.

Virasat solves this by providing an end-to-end platform that automates and simplifies these critical business functions through specialized AI tools. This lowers the barrier to entry for global e-commerce and enables artisans to build a sustainable business from their craft.

## Key Features

### For Artisans: AI-Powered Toolkit

The platform is equipped with a suite of AI tools designed to automate complex tasks and drive business growth.

* **🤖 AI Storyteller:** Transforms an artisan's recorded voice note about a product's inspiration and creation process into a compelling, professionally written product description.
* **🖼️ Visual Enhancer:** Generates professional, realistic lifestyle mockup photos from a single, simple product image, eliminating the need for expensive photoshoots.
* **📢 Smart Marketing Suite:** Instantly generates tailored marketing content for Instagram, Facebook, Twitter, and TikTok, as well as copy for email newsletters and digital ads.
* **💰 AI Pricing Optimizer:** Analyzes material costs, labor hours, and real-time market data to suggest optimal, competitive pricing strategies that maximize profitability.
* **📈 Trend Harmonizer:** Provides actionable insights into current market trends, offering suggestions on how to adapt products while preserving their unique, authentic style.
* **🌐 AI Logistics Hub:** Acts as an expert shipping advisor. It provides guidance on packaging fragile items, automatically generates customs documentation (including HS codes), and recommends the most cost-effective shipping carriers based on real-time rate comparisons.

### For Customers: Seamless Shopping

* **🛒 Modern Storefront:** A clean, intuitive interface with robust product search, filtering, and categorization.
* **💳 Secure Checkout:** A fully functional shopping cart and a secure, multi-step checkout process.
* **👤 Artisan Profiles:** Detailed profiles that showcase the story, process, and person behind the products.
* **💬 Direct Messaging:** An integrated messaging system for customers to connect with artisans for questions or custom orders.

## The Artisan Dashboard

A centralized command center for artisans to manage every aspect of their business.

* **📦 Product Management:** A simple interface to add, edit, track inventory, and manage product listings.
* **🚚 Shipment Tracking:** A dedicated section to view all booked shipments, monitor their real-time status, and access shipping labels and documentation.
* **📊 Analytics Dashboard:** A clear, insightful overview of business performance, tracking total revenue, sales volume, and top-performing products and categories.

## Technology Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js, Python (for AI microservices)
* **Database:** PostgreSQL, Redis (for caching/queues)
* **AI/ML:** TensorFlow, PyTorch, Gemini API, Scikit-learn
* **Infrastructure:** Docker, Kubernetes
* **Cloud Provider:** AWS (S3, EC2, RDS) / GCP

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* Node.js (v18.x or later)
* npm / yarn / pnpm
* Docker

### Installation

1.  Clone the repository:
    ```sh
    git clone [https://github.com/your-username/virasat.git](https://github.com/your-username/virasat.git)
    ```
2.  Navigate to the project directory:
    ```sh
    cd virasat
    ```
3.  Install NPM packages for the server and client:
    ```sh
    # In root directory
    npm install
    # Navigate to client directory
    cd client && npm install
    ```
4.  Set up your environment variables. Create a `.env` file in the root directory and populate it based on `.env.example`.
    ```sh
    cp .env.example .env
    ```

## Usage

Start the development servers:

```sh
npm run dev

