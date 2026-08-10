import type { Request, Response } from "express";
import { getTasksQuery, insertTaskQuery, updateTaskQuery, idExists, deleteTaskQuery } from "../task.repository.js";


export async function getTasks(req: Request, res: Response) {
  const result = await getTasksQuery();
  res.status(200).json({ result :result});
  return;
}

export async function getTaskWithID(req: Request, res: Response) {
  const { id } = req.params;
  const isExist = await idExists(parseInt(id as string));

  if (!idExists) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const result = await getTasksQuery(parseInt(id as string));

  if (!result) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.status(200).json({ result :result});
  return;
}

export async function postTask(req: Request, res: Response) {
  const { title, done } = req.body;
  if(!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const result = await insertTaskQuery(title, done);
  res.status(201).json({ result: result });
  return;
}

export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  let { title, done } = req.body;
  const isExist = await idExists(parseInt(id as string));

  if (!isExist) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (title) {
    if(title.trim() === '') {
      res.status(400).json({ error: 'Title must not be empty' });
      return;
    }
  } else {
    title = isExist.title as string;
  }
  if (done === undefined) done = isExist.done as boolean;

  const result = await updateTaskQuery(parseInt(id as string), title, done);
  res.status(200).json({ result: result });
  return;
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  const result = await deleteTaskQuery(parseInt(id as string));
  if (!result) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.status(200).json({ result: result });
  return;
}
