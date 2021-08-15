CREATE TABLE public.users ("id" serial NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, CONSTRAINT "users_pk" PRIMARY KEY ("id")) WITH (OIDS=FALSE);


CREATE TABLE public.sessions ("id" serial NOT NULL, "userId" integer NOT NULL, "token" TEXT NOT NULL UNIQUE, CONSTRAINT "sessions_pk" PRIMARY KEY ("id")) WITH (OIDS=FALSE);


CREATE TABLE public.transactions ("id" serial NOT NULL, "userId" integer NOT NULL, "amount" integer NOT NULL, "description" TEXT, "type" integer NOT NULL, "date" DATE NOT NULL DEFAULT NOW (), CONSTRAINT "transactions_pk" PRIMARY KEY ("id")) WITH (OIDS=FALSE);


ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");




