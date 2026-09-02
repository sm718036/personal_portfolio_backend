# Portfolio CMS API

Express/TypeScript API with PostgreSQL, Prisma, cookie-based admin authentication, CRUD endpoints, and image/PDF uploads.

## Setup with hosted PostgreSQL

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to the connection string supplied by your hosted PostgreSQL provider.
3. Set unique values for `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Install dependencies: `npm install`.
5. Generate the Prisma client: `npm run db:generate`.
6. Apply the committed database migrations: `npm run db:deploy`.
7. Create the initial portfolio content and admin account: `npm run db:seed`.
8. Run the API: `npm run dev` (defaults to `http://localhost:4000`).

The database provider may require an SSL option in `DATABASE_URL`. Keep the provider's connection parameters unchanged. Run `db:seed` only for initial setup unless you intentionally want to update the configured admin password and restore missing seed records.

Uploaded files use local disk for simple deployment. For horizontally scaled production hosting, replace the upload storage adapter with S3, Cloudinary, or another object store while retaining the returned public URL contract.
