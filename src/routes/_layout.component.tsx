import {Outlet} from "@tanstack/react-router";
import {useContext} from "react";
import {AuthContext} from "@/context/auth-context.tsx";
import {
  AppShell,
  Avatar,
  Group, Loader,
  Stack,
  Text, Tooltip,
  UnstyledButton
} from "@mantine/core";
import {session} from "@/api/session.ts";
import {useMutation} from "@tanstack/react-query";
import {IconPower} from "@tabler/icons-react";

export const component = function Layout() {
  const {user, setUser} = useContext(AuthContext)

  const mutation = useMutation({
    mutationFn: session.delete,
    onSuccess: () => setUser(undefined)
  })

  return (
    <AppShell
      header={{height: 60}}

      padding={'md'}
    >
      <AppShell.Header>
        <Group h={'100%'} px={'md'} justify={'space-between'}>
          <Group>
            <Text size={'xl'}>FE Testovací aplikace</Text>
          </Group>
          <Group>
            {user && (
              <Group>
                <Avatar src={user?.picture}/>
                <Stack gap={0}>
                  <Text lh={'xs'}>{user?.full_name}</Text>
                  <Text c={'dimmed'} size={'xs'} lh={'xs'}>{user?.email}</Text>
                </Stack>
                <UnstyledButton onClick={() => mutation.mutate()} lh={'.6rem'}>
                  <Tooltip label={'Odhlásit se'}>
                    {mutation.isPending
                      ? <Loader size={'1.4rem'} color={'gray'}/>
                      : <IconPower size={'1.6rem'}/>
                    }
                  </Tooltip>
                </UnstyledButton>
              </Group>
            )}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  )
}