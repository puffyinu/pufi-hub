import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  completeTask,
  resetTasks,
  TASK_EVENT,
  type Task,
} from "@/app/services/task";

export function useTask() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    function syncTasks() {
      setTasks(getTasks());
    }

    syncTasks();
    window.addEventListener(TASK_EVENT, syncTasks);

    return () => {
      window.removeEventListener(TASK_EVENT, syncTasks);
    };
  }, []);

  return {
    tasks,
    addTask,
    completeTask,
    resetTasks,
  };
}
