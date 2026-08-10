import dotenv from 'dotenv'
import { Pool } from 'pg'
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


export async function getTasksQuery(id?: number): Promise<Array<{ id: number, title: string, done: boolean } | undefined>> {
  try {
    const result = id ? (await pool.query('SELECT * FROM tasks WHERE id = $1', [id])).rows[0]
      : (await pool.query('SELECT * FROM tasks')).rows
      console.log(result)
    return (result)

  } catch (e) {
    throw e;
  }
}

export async function insertTaskQuery(title: string, done?: boolean) {
  if(!done) done = false;
  const query = await pool.query('INSERT INTO tasks(title,done) VALUES($1, $2) RETURNING *', [title, done]);
  return query.rows[0];
}

export async function updateTaskQuery(id: number, title: string, done: boolean) {
  const query = await pool.query('UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *', [title, done, id]);
  return query.rows[0];
}

export async function deleteTaskQuery(id: number) {
  const query = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
  return query.rows[0];
}

export async function idExists(id: number): Promise<{ id: number, title: string, done: boolean } | undefined> {
  const query = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (!query.rows[0]) {
    return undefined;
  }
  return query?.rows[0];
}
