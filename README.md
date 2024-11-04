# NCI-WMS

NCI-WMS is a Next.js-based web application for warehouse management.

## Key Technologies

- **Next.js**: React framework for building the frontend and API routes
- **Drizzle ORM**: TypeScript ORM for database operations
- **Lucia**: Authentication library
- **Shadcn UI**: UI component library
- **PM2**: Process manager for Node.js applications

## First-Time Setup

1. Clone the repository
```bash
git clone [text](https://github.com/asrafilll/nci_wms)
cd nci_wms
```
2. Remove Git history and initialize a new repository
```bash
rm -rf .git
git init
```
3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your specific configuration.
4. Install dependencies:
```bash
npm install
```
5. Generate database schema:
```bash
npm run db:generate
```
6. Migrate database schema:
```bash
npm run db:migrate
```

## Running the Application

1. Build the application:
```bash
npm run build
```
2. Start the application using PM2 (process manager):
```bash
npm i -g pm2
pm2 start ecosystem.config.js
```
3. Open the application in your browser:
```bash
open http://localhost:3000
```

## Updating the Application

When updates are made to the codebase:

1. Pull the latest changes:
```bash
git pull
```
2. Install if any updated dependencies:
```bash
npm install
```
3. Generate and migrate if any database schema changes:
```bash
npm run db:generate
npm run db:migrate
```
4. Build the application:
```bash
npm run build
```     
5. Restart the application using PM2 (process manager):
```bash
pm2 restart nci-wms
``` 


## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the application
- `npm run start`: Start production server
- `npm run lint`: Run linter
- `npm run db:generate`: Generate database migrations
- `npm run db:migrate`: Run database migrations

## PM2 Configuration

The project uses PM2 for process management in production. The configuration is as follows:

```javascript
module.exports = {
  apps: [
    {
      name: "nci-wms",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};