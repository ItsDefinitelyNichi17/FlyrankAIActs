import type { Request, Response } from "express";
import { getTasksQuery } from "../task.repository.js";


export async function getTasks(req: Request, res: Response) {

  const result = await getTasksQuery();
  res.status(200).json({ result :result});
  return;
}

export async function getTaskWithID(req: Request, res: Response) {
  const { id } = req.params;
  const result = await getTasksQuery(parseInt(id as string));

  if (!result) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.status(200).json({ result :result});
  return;
}

export function postTask(req: Request, res: Response) {

}

export function updateTask(req: Request, res: Response) {
}

export function deleteTask(req: Request, res: Response) {
}
