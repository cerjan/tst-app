import React, {createContext, useEffect, useState} from "react";
import {session} from "@/api/session.ts";
import {useQuery} from "@tanstack/react-query";

export interface LoggedUser {
  unique_name: string
  full_name: string
  picture: string
  email: string
}

export const AuthContext = createContext<{
  user?: LoggedUser
  setUser: (user?: LoggedUser) => void
  isLoading: boolean
}>({
  setUser: () => {},
  isLoading: true
})

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<LoggedUser>()

    const {data, isLoading} = useQuery({
    queryKey: ['session'],
    queryFn: session.get
  })

  useEffect(() => {
    setUser(data)
  }, [data]);

  return (
    <AuthContext.Provider value={{user, setUser, isLoading}}>{children}</AuthContext.Provider>
  )
}