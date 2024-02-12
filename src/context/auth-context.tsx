import React, {createContext, useEffect, useState} from "react";
import {session} from "@/api/session.ts";
import {Center, Loader} from "@mantine/core";
import {useMutation} from "@tanstack/react-query";

export interface LoggedUser {
  unique_name: string
  full_name: string
  picture: string
  email: string
}

export const AuthContext = createContext<{
  user?: LoggedUser
  setUser: (user?: LoggedUser) => void
}>({
  setUser: () => {}
})

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<LoggedUser>()

  const mutation = useMutation({
    mutationFn: session.get,
    onSuccess: data => setUser(data)
  })

  useEffect(() => {
    mutation.mutate()
  }, []);

  if (mutation.isPending) return (
    <Center h={'100vh'}>
      <Loader/>
    </Center>
  )

  return (
    <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>
  )
}