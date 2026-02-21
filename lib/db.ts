import { Pool } from 'pg';

const pool = new Pool({
  user: 'yourUsername', // replace with your database username
  host: 'localhost', // replace with your database host
  database: 'yourDatabase', // replace with your database name
  password: 'yourPassword', // replace with your database password
  port: 5432, // default PostgreSQL port
});

export default pool;
