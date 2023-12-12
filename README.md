# Project with Next.js 14

## Overview

This project is developed for studying server actions in Next.js 14. The application replicates the core features of Trello, providing a simple and interactive task management interface. The project utilizes Tailwind CSS for styling and Shadcn Components for enhancing the user interface.

## Features

Key Features:
- Auth 
- Organizations / Workspaces
- Board creation
- Unsplash API for random beautiful cover images
- Activity log for entire organization
- Board rename and delete
- List creation
- List rename, delete, drag & drop reorder and copy
- Card creation
- Card description, rename, delete, drag & drop reorder and copy
- Card activity log
- Board limit for every organization
- Stripe subscription for each organization to unlock unlimited boards
- Landing page
- MySQL DB
- Prisma ORM
- shadcnUI & TailwindCSS

## Technologies Used

- **Next.js 14:** Utilized for server actions and overall application structure.
- **Tailwind CSS:** A utility-first CSS framework for styling the application.
- **Shadcn:** Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source
- **Stripe:** A plataform for control subscriptions

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone git@github.com:obrunofontana/taskfy.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

DATABASE_URL=

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

STRIPE_API_KEY=

NEXT_PUBLIC_APP_URL=

STRIPE_WEBHOOK_SECRET=
```

### Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |



