import {Navigate, Outlet} from "@tanstack/react-router";
import {useContext} from "react";
import {AuthContext} from "@/context/auth-context.tsx";

export const component = function Auth() {
  const {user} = useContext(AuthContext)

  if (!user) return (
    <Navigate to={'/login'}/>
  )

  return (
    <Outlet/>
  )
}