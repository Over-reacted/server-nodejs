import { Pool } from 'pg';

const pool = new Pool({
    max: 10,
    connectionString: 'postgres://postgres:asdf1234@localhost:5432/postgres',
});

async function query(statement: string, values: Array<string | number>) {
    const client = await pool.connect();
    const result = await client.query(statement, values);
    client.release();
    return result;
}

function getClient() {
    return pool.connect();
}

export default {
    query,
    getClient,
    close: pool.end,
};
