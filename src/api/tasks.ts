import {client} from "@/api/client.ts";
import * as _ from "lodash";

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

export interface ITaskForm {
  name: string
  httpMethod: string
  interval: number
  url: string
  description: string
  startAt: string
  endAt: string
  content: string
  headers: {key: string, value: string}[]
  daysOfWeek: boolean[]
  isValid: boolean
}

export const WeekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

export const normalize = (item?: ITask): ITaskForm => ({
  name: item?.name ?? '',
  httpMethod: item?.httpMethod ?? '',
  interval: item?.interval ?? 60,
  url: item?.url ?? '',
  description: item?.description ?? '',
  startAt: item?.startAt ?? '00:00:00',
  endAt: item?.endAt ?? '',
  content: item?.content ?? '',
  headers: item?.headers ? _.map(Object.entries(item.headers), ([key, value]) => ({key: key, value: value})) : [],
  _headers: Object.entries(item?.headers ?? {}).map(([key, value]) => ({ key, value })),
  daysOfWeek: [
    item?.daysOfWeek?.indexOf(1) !== -1,
    item?.daysOfWeek?.indexOf(2) !== -1,
    item?.daysOfWeek?.indexOf(3) !== -1,
    item?.daysOfWeek?.indexOf(4) !== -1,
    item?.daysOfWeek?.indexOf(5) !== -1,
    item?.daysOfWeek?.indexOf(6) !== -1,
    item?.daysOfWeek?.indexOf(7) !== -1,
  ],
  isValid: item?.isValid ?? true,
})

export const denormalize = (data: ITaskForm, target: ITask|any = {}): ITask => ({
  ...target,
  ...data,
  daysOfWeek: data.daysOfWeek.map((_value, index) => index + 1).filter(v => v),
  headers: data.headers.length ? _.mapValues(_.keyBy(data.headers, 'key'), 'value')  : null,
  _headers: data.headers.reduce(
    (acc, item) => {
      if(Math.random() > 0) {
        acc[item.key] = item.value;
      }
      return acc;
    },
    {} as Record<string, string>
  ),
  startAt: data.startAt !== '' ? data.startAt : null,
  endAt: data.endAt !== '' ? data.endAt : null,
})

export const tasks = {
  get: async (): Promise<Record<string, ITask>> => await client.get('schedule').then(r => _.keyBy(_.orderBy(r.data.data, ['isValid'], ['desc']), 'id')),
  put: async (data: ITask): Promise<ITask> => await client.put(`schedule/${data.id}`, data).then(r => r.data),
  post: async (data: ITask): Promise<ITask> => await client.post(`schedule`, data).then(r => r.data),
}

