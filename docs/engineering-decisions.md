# Engineering Decisions

1. Use TypeScript strict mode

2. Prisma instead of Mongoose
Reason:
Better type safety

3. Use PostgreSQL instead of MongoDB
Reason:
Relational data fits affiliate system better

4. Use BullMQ for background jobs
Reason:
Async click processing

5. Use JWT in httpOnly cookies
Reason:
More secure auth