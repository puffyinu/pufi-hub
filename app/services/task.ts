import { load, save, remove } from "@/app/services/storage";
import { addReward } from "@/app/services/reward";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = "pufi-tasks";
export const TASK_EVENT = "pufi-task-changed";
const TASK_REWARD = 5;

const DEFAULT_TASKS: Task[] = [
  {
    id: "daily-checkin",
    title: "Daily Check-In",
    completed: false,
  },
  {
    id: "visit-sponsor",
    title: "Visit Sponsor",
    completed: false,
  },
  {
    id: "claim-reward",
    title: "Claim Reward",
    completed: false,
  },
  {
    id: "invite-friend",
    title: "Invite Friend",
    completed: false,
  },
];

function notifyTaskChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(TASK_EVENT)
    );
  }
}

let tasks: Task[] | null = null;

function ensureTasks(): Task[] {
  if (tasks === null) {
    const storedTasks = load<Task[]>(STORAGE_KEY);

    if (storedTasks && storedTasks.length > 0) {
      tasks = storedTasks;
    } else {
      tasks = DEFAULT_TASKS;
      save(STORAGE_KEY, tasks);
    }
  }

  return tasks;
}

export function getTasks(): Task[] {
  return ensureTasks();
}

export function addTask(task: Task): void {
  const currentTasks = ensureTasks();
  tasks = [...currentTasks, task];
  save(STORAGE_KEY, tasks);
  notifyTaskChanged();
}

export function completeTask(id: string): boolean {
  const currentTasks = ensureTasks();
  const task = currentTasks.find(task => task.id === id);

  if (!task || task.completed) {
    return false;
  }

  tasks = currentTasks.map(task =>
    task.id === id
      ? { ...task, completed: true }
      : task
  );

  save(STORAGE_KEY, tasks);
  addReward(TASK_REWARD);
  notifyTaskChanged();
  return true;
}

export function resetTasks(): void {
  tasks = [];
  remove(STORAGE_KEY);
  notifyTaskChanged();
}
