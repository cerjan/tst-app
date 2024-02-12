import {useContext, useState} from "react";
import {AuthContext} from "@/context/auth-context.tsx";
import {Navigate} from "@tanstack/react-router";
import {useForm} from "@mantine/form";
import {session} from "@/api/session.ts";
import {Button, Dialog, Group, Notification, PasswordInput, Stack, Text, TextInput} from "@mantine/core";
import {useMutation} from "@tanstack/react-query";

export const component = function Login() {
  const {user, setUser} = useContext(AuthContext)
  const [error, setError] = useState('')

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    }
  })

  const login = useMutation({
    mutationFn: session.post,
    onSuccess: (data) => setUser(data),
    onError: error => {
      const e = error as any
      setError(e.response.data.exception[0].message ?? '')
    }
  })

  if (user) return (
    <Navigate to={'/tasks'}/>
  )

  return (
    <>
      <Dialog opened={login.isError} p={0}>
        <Notification title={'Chyba při přihlášení'} color={'red'} withCloseButton={false} c={'dimmed'}>
          <Text size={'xs'}>{error}</Text>
        </Notification>
      </Dialog>
      <form onSubmit={form.onSubmit(data => login.mutate(data))}>
        <Stack maw={280}>
          <TextInput label={'Uživatelské jméno:'} required {...form.getInputProps('username')}/>
          <PasswordInput label={'Heslo:'} required {...form.getInputProps('password')}/>
          <Group justify={'start'}>
            <Button type={'submit'} loading={login.isPending}>OK</Button>
          </Group>
        </Stack>
      </form>
    </>
  )
}