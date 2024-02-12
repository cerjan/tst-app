import {LoggedUser} from "@/context/auth-context.tsx";
import {client} from "@/api/client.ts";

export interface LoginData {
  username: string
  password: string
}

export const session = {
  get: async (): Promise<LoggedUser> => await client.get('auth/session').then(r => r.data),
  delete: async () => await client.post('auth/logout'),
  post: (data: LoginData): Promise<LoggedUser> => client.post('auth/login', data).then(r => r.data),
}

