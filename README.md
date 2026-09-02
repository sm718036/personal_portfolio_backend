# Portfolio CMS API

Express/TypeScript API with PostgreSQL, Prisma, cookie-based admin authentication, CRUD endpoints, and image/PDF uploads.

## Local setup

1. Copy `.env.example` to `.env` and set secure admin/JWT values.
2. Start PostgreSQL: `docker compose up -d`.
3. Install and initialize: `npm install`, `npm run db:generate`, `npm run db:migrate -- --name init`, `npm run db:seed`.
4. Run: `npm run dev` (defaults to `http://localhost:4000`).

Uploaded files use local disk for simple deployment. For horizontally scaled production hosting, replace the upload storage adapter with S3, Cloudinary, or another object store while retaining the returned public URL contract.
