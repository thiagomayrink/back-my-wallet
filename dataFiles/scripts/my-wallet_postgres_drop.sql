ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_fk0";

ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_fk0";

DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;