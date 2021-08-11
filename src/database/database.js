import pg from 'pg';

const { Pool } = pg;

const connectionString = `${
    process.env.NODE_ENV === 'test'
        ? process.env.DATABASE_URL_TEST
        : process.env.DATABASE_URL
}`;

const connection = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default connection;
