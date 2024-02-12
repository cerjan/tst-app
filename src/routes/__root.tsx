import {Outlet, rootRouteWithContext} from "@tanstack/react-router";
import {QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TanStackRouterDevtools} from "@tanstack/router-devtools";
import {AuthProvider} from "@/context/auth-context.tsx";

export const Route = rootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: function Root() {
    return (
      <>
        <AuthProvider>
          <Outlet/>
        </AuthProvider>
        <ReactQueryDevtools/>
        <TanStackRouterDevtools position="bottom-left"/>
      </>
    )
  }
})