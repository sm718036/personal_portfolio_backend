# Portfolio CMS API

Production-oriented Express/TypeScript API backed by PostgreSQL and Prisma. It provides public portfolio content plus authenticated CMS operations for profile content, projects, categories, skills, experience, certifications, education, social links, images, and CV files.

## Local setup with hosted PostgreSQL

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to the connection string supplied by your PostgreSQL provider.
3. Set unique values for `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Run:

```powershell
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

`db:seed` initializes content and creates or updates the configured admin account. It is not required during every startup.

For Neon, use the direct connection string for migration commands. A pooled URL is suitable for normal API traffic. Preserve provider parameters such as `sslmode=require` and `channel_binding=require`.

## Commands

```powershell
npm run dev          # development server with watch mode
npm run build        # compile TypeScript
npm start            # run compiled production API
npm run lint         # strict TypeScript verification
npm test             # validation tests
npm run db:deploy    # apply committed migrations
npm run db:seed      # initialize content/admin
npm run format       # format source and Prisma schema
npm run validate     # run the complete pre-push quality gate
```

## Local quality gates and CI

`npm install` configures Husky automatically:

- Before each commit, lint-staged formats staged TypeScript and configuration files. Prisma schema changes run through `prisma format`.
- Before each push, `npm run validate` checks formatting, strict TypeScript, tests, and the production build. Git cancels the push if a check fails.

GitHub Actions repeats these checks for pull requests and pushes to `main`, generates Prisma Client from a non-secret dummy build URL, audits production dependencies, and stores the compiled backend as a 14-day workflow artifact. CI never connects to the production database.

Health endpoints:

- `GET /api/health` checks the Node process.
- `GET /api/health/ready` checks database connectivity.

## Production checklist

- Set `NODE_ENV=production` so session cookies require HTTPS.
- Use a high-entropy `JWT_SECRET` of at least 32 characters.
- Set `FRONTEND_URL` to the exact deployed frontend origin. Add preview origins to `ALLOWED_ORIGINS` only when needed.
- Set `PUBLIC_API_URL` to the public HTTPS API address.
- Set `TRUST_PROXY=true` only when deployed behind a trusted proxy such as Render or Railway.
- Run `npm run db:deploy` during release, before starting the new API version.
- Never commit `.env` or database credentials.
- Serve the API over HTTPS and restrict platform environment-variable access.
- Configure automated PostgreSQL backups with the database provider.

Uploads are stored on disk. On a long-running VM, set `UPLOAD_DIR` to a backed-up persistent volume. Ephemeral/serverless deployments require an object-storage adapter such as S3 or Cloudinary before relying on uploaded files in production.

For the most reliable cookie behavior, deploy the frontend and API on the same site, for example `www.example.com` and `api.example.com`. Cross-site cookies may be blocked by browser privacy settings even when CORS is configured correctly.
