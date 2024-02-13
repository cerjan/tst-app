import {LoggedUser} from "@/context/auth-context.tsx";
import {client} from "@/api/client.ts";

export interface LoginData {
  username: string
  password: string
}

export const session = {
  get: (): Promise<LoggedUser> => client.get('auth/session').then(r => r.data),
  delete: () => client.post('auth/logout'),
  post: (data: LoginData): Promise<LoggedUser> => client.post('auth/login', data).then(r => r.data),
}

