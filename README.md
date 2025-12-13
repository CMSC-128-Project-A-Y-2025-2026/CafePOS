<h1 align="center">CAFÉPOS</h1>

<p align="center">
  <em>Transforming Coffee Sales with Seamless Innovation</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-today-brightgreen" />
  <img src="https://img.shields.io/badge/typescript-97.8%25-blue" />
  <img src="https://img.shields.io/badge/languages-3-blue" />
</p>

<h3 align="center">Built with the tools and technologies:</h3>

<p align="center">
  <img src="https://img.shields.io/badge/JSON-black?logo=json&logoColor=white" />
  <img src="https://img.shields.io/badge/Markdown-black?logo=markdown" />
  <img src="https://img.shields.io/badge/npm-red?logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/Autoprefixer-red?logo=autoprefixer&logoColor=white" />
  <img src="https://img.shields.io/badge/Prettier-f7b93e?logo=prettier&logoColor=black" />
  <img src="https://img.shields.io/badge/JavaScript-black?logo=javascript" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=github-actions&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" />
</p>

# 📑 Table of Contents

- [📑 Table of Contents](#-table-of-contents)
- [📓 Description](#-description)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Using Git](#️-using-git)
- [🌳 Git Workflow](#-git-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Workflow](#workflow)
  - [Rebasing](#rebasing)
- [📝 Coding Standards](#-coding-standards)
  - [Tech Stack and Tools](#tech-stack-and-tools)
  - [Code Formatting](#code-formatting)
  - [Folder and File Naming](#folder-and-file-naming)
  - [Commit Message Guidelines](#commit-message-guidelines)

# 📓 Description

**This project is in compliance with our CMSC Intro to Software Engineering course.**

This project aims to develop a custom-built Point-of-Sale (POS) system for our client, Pres Kopee, located on Sto. Cristo Street, Daliao Toril, Davao City. The system is designed to streamline sales transactions and inventory management, enabling more efficient operations by replacing traditional manual, pen-and-paper tracking methods. By automating these processes, the POS system allows the client to focus more on core business activities and customer service.

# 🚀 Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can choose which page to open by adding the page's folder. Example: [http://localhost:3000/menu](http://localhost:3000/menu)

You can start editing the page by modifying the corresponding `page.tsx` file or its components. Changes will auto-update the page as you work.

# 🛠️ Using Git

Set up Git:

```
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

Clone Repository:

```
git clone https://github.com/CMSC-128-Project/CafePOS.git
cd CafePOS
code .
```

# 🌳 Git Workflow

We follow **Trunk-Based Development** for constant updates and rapid integration.

## Branching Strategy

- Main Branch: `main` (Live Branch/Production Ready)
- Short Feature Branches:
  - Branch off `main`
  - Prefix `feat/` `fix/` `chore/` for Branch Naming Conventions
    - `feat`: For new features
    - `fix`: For bug fixes
    - `chore`: For maintenance tasks, refactoring, or dependency updates
    - `docs`: For documentation changes
  - Example: `feat/add-inventory-page`, `chore/update-dependencies`

## Workflow

1. Pull the latest `main`:
   ```
   git checkout main
   git pull
   ```
2. Create a branch. You can also do this in Github Issues to immediately link your branch to the issue:
   ```
   git checkout -b feature/example-branch
   ```
3. Commit and Push:
   ```
   git status
   git add . (or specific file you want to stage changes)
   git commit -m "feat: example commit message"
   git push
   ```
4. Open a **Pull Request** to `main`.

## Rebasing

When your **Pull Request** is behind `main`.

1. Checkout to `main` and pull the latest version:
   ```
   git checkout main
   git pull
   ```
2. Go back to your `feature-branch`:
   ```
   git checkout branch-name
   ```
3. Rebase `main` then fix conflict issues if there are any:
   ```
   git rebase main
   ```
4. Add, Commit, and Push:
   ```
   git add .
   git commit -m "feat: example commit message"
   git push
   ```

# 📝 Coding Standards

## Tech Stack and Tools

- Next.js
- React
- TailwindCSS
- Typescript
- Shadcn
- Supabase
- Vercel
- ESLint
- Prettier
- Github Actions

## Code Formatting

We have a **Github Action** that automatically runs:

```
npm run lint
npm run format
```

when a new Pull Request is made or updated. This follows `ESLint` and `Prettier` for consistent style.

## Folder and File Naming

- Use `camelCase` for file and folder naming
- Place client components in `src/components`
- Pages inside `src/app/pageName`

## Commit Message Guidelines

We follow `Conventional Commits`:

```
feat: add new feature
fix: resolve issue
chore: update dependencies
```
