import {Navigate} from "@tanstack/react-router";

export const component = function Auth() {
  return (
    <Navigate to={'/tasks'}/>
  )
}