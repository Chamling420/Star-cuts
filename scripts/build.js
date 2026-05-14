// Build script: Switches to PostgreSQL schema when building for Vercel (production)
const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  console.log('🚀 Vercel detected — switching to PostgreSQL schema...');
  const postgresSchema = fs.readFileSync(
    path.join(__dirname, '..', 'prisma', 'schema.postgres.prisma'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(__dirname, '..', 'prisma', 'schema.prisma'),
    postgresSchema
  );
  console.log('✅ PostgreSQL schema activated for Vercel deployment');
} else {
  console.log('💻 Local build — keeping SQLite schema');
}
