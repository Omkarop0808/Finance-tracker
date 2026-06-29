const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  database: 'multiply_finance',
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return client.end();
  })
  .catch(err => console.error('Connection error', err.stack));
