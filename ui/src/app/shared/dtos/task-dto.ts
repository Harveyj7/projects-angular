// Task interface with the specified attributes
export interface TaskDto {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Index signature to allow dynamic property access
}

