import { load, save, remove } from "@/app/services/storage";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = "pufi-tasks";

let tasks: Task[] =
  load<Task[]>(STORAGE_KEY) ?? [];

export function getTasks(): Task[] {
  return tasks;
}

export function addTask(task: Task): void {
  tasks = [...tasks, task];
  save(STORAGE_KEY, tasks);
}

export function completeTask(id: string): void {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: true }
      : task
  );

  save(STORAGE_KEY, tasks);
}

export function resetTasks(): void {
  tasks = [];
  remove(STORAGE_KEY);
}
