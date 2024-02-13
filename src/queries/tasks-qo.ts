import {queryOptions} from "@tanstack/react-query";
import {tasks} from "@/api/tasks.ts";

export const TasksQo = () => queryOptions({
  queryKey: ['tasks'],
  queryFn: tasks.get,
  staleTime: 60_000
})