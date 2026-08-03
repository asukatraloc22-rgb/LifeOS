export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: number;
  desc: string;
  project: string;
  status: TaskStatus;
}
