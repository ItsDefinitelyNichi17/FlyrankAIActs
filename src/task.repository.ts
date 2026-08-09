import dotenv from 'dotenv'
import pg, { Pool } from 'pg'
import path from 'path'
import fs from 'fs'
dotenv.config({path : path.join(import.meta.dirname, "..", ".env")})

const pool = new Pool({connectionString : process.env.DATABASE_URL})

try {
  if (!pool) {
    throw new Error("Error on pool instance")
  }
} catch (e) {
  console.log(e)
}

export async function createTable() {
  const schema = fs.readFileSync(path.join(import.meta.dirname, "schema", "task.schema.sql")).toString();
  const table = await pool.query(schema);
  return;
}

export async function seedTasks() {
  const tasks = ["Touch some grass", "Cook some dinner", "Walk a dawg"]

  try {
    const isEmpty = await pool.query('SELECT COUNT(*) FROM tasks;')
    if (isEmpty.rows[0].count > 0) {
      throw new Error("Table already have records, cannot seed")
     }
    const seed = await pool.query(
      'INSERT INTO tasks(title) \
      SELECT UNNEST ($1::varchar[])', [tasks])
  } catch (e) {
    console.log(e)
  }
  return;
}
