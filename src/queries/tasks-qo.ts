import {queryOptions} from "@tanstack/react-query";
import {tasks} from "@/api/tasks.ts";

export const TasksQo = () => queryOptions({
  queryKey: ['tasks'],
  queryFn: tasks.get,
  retry: false,
  staleTime: 60_000
})