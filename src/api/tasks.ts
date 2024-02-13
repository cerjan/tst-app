import {client} from "@/api/client.ts";

export const HttpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT']
export const HttpMethodsWithContent = ['POST', 'PUT', 'PATCH']

export interface ITask {
  content: string
  daysOfWeek: number[]
  description: string
  startAt: string|null
  endAt: string|null
  excludedDays: Date[]
  fullname: string
  guid: string
  headers: Record<string, string>|undefined
  httpMethod: string
  id: string
  interval: number
  isValid: boolean
  login: string
  name: string
  timeZone: string
  type: string
  url: string
}

export const WeekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

export const tasks = {
  get: (): Promise<Record<string, ITask>> => client.get('schedule').then(r => r.data.data.reduce((tasks: Record<string, ITask>, task: ITask) => {
    tasks[task.id] = task

    return tasks
  }, {})),
  put: (data: ITask): Promise<ITask> => client.put(`schedule/${data.id}`, data).then(r => r.data),
  post: (data: ITask): Promise<ITask> => client.post(`schedule`, data).then(r => r.data),
}

