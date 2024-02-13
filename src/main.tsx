import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Router, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "./routeTree.gen.ts";
import {createTheme, MantineProvider} from "@mantine/core";
import {AxiosError} from "axios";
import {Notifications, notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: error => {
        notifications.show({
          color: 'red',
          title: (error as any).response.data.message.en,
          message: (error as any).response.data.description.en
        })
      }
    }
  }
})
const router = new Router({
  routeTree,
  context: {
    queryClient
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
    defaultError: AxiosError
  }
}

const theme = createTheme({
  fontFamily: '"Roboto Condensed", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ModalsProvider labels={{confirm: 'Ano', cancel: 'Ne'}}>
        <Notifications zIndex={100000}/>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
)
