import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";
import {ActionIcon, ActionIconGroup, Button, Group, Table} from "@mantine/core";
import {IconEdit, IconPlayerPlay, IconPlus, IconTrash} from "@tabler/icons-react";
import {TextPair} from "@components/text-pair.tsx";
import {Link, Outlet} from "@tanstack/react-router";
import {TasksQo} from "@/queries/tasks-qo.ts";
import {tasks, WeekDays} from "@/api/tasks.ts";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

export const component = function Home() {
  const {data} = useSuspenseQuery(TasksQo())
  const queryClient = useQueryClient()

  const mutationsRun = Object.entries(data).reduce((mutations, [id, task]) => {
      mutations[id] = useMutation({
        mutationFn: () => tasks.run(id),
        onSuccess: () => {
          notifications.show({
            title: `Spuštění úlohy dokončeno`,
            message: `${task.name} / ${id}`,
            color: 'green'
          })
        }
      })

      return mutations
    }, {} as Record<string, any>)

  const mutationDelete = useMutation({
    mutationFn: (_id: string) => new Promise(r => r(true)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']}).then()
    }
  })

  const onDelete = (id: string) => modals.openConfirmModal({
    title: 'Opravdu smazat úlohu?',
    onConfirm: () => mutationDelete.mutate(id)
  })

  return (
    <>
      <Group mb="lg" justify="end">
        <Link to={'/tasks/new'}>
          <Button leftSection={<IconPlus size="1rem"/>}>Nová úloha</Button>
        </Link>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Název</Table.Th>
            <Table.Th>Autor</Table.Th>
            <Table.Th>URL</Table.Th>
            <Table.Th>Plán</Table.Th>
            <Table.Th>Hlavičky</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(data).map(([id, item]) =>
            <Table.Tr
              key={id}
              c={item.isValid ? '' : 'dimmed'}
              td={item.isValid ? '' : 'line-through'}
            >
              <Table.Td>
                <TextPair description={item.description}>{item.name}</TextPair>
              </Table.Td>
              <Table.Td>
                <TextPair description={item.login}>{item.fullname}</TextPair>
              </Table.Td>
              <Table.Td>
                <TextPair description={item.httpMethod}>{item.url}</TextPair>
              </Table.Td>
              <Table.Td>
                <TextPair
                  description={item.daysOfWeek.map(d => WeekDays[d - 1]).join(', ')}
                >od {item.startAt} {item.endAt && `do ${item.endAt}`} / {item.interval} s</TextPair>
              </Table.Td>
              <Table.Td>
                <TextPair
                  description="Hlavičky"
                >{Object.entries(item.headers ?? {}).map(([k, _v]) => k).join(', ')}</TextPair>
              </Table.Td>
              <Table.Td>
                <Group gap={'xs'} justify={'end'}>
                  <ActionIconGroup>
                    <ActionIcon
                      title={'Spustit'}
                      variant={'light'}
                      onClick={() => mutationsRun[id].mutate()}
                      loading={mutationsRun[id].isPending}
                    >
                      <IconPlayerPlay size={'1rem'}/>
                    </ActionIcon>
                    <ActionIcon
                      title={'Upravit'}
                      variant={'light'}
                      component={Link}
                      to={'/tasks/$id'}
                      params={{id}}
                    >
                      <IconEdit size={'1rem'}/>
                    </ActionIcon>
                    <ActionIcon
                      title={'Smazat'}
                      variant={'light'}
                      color={'red'}
                      onClick={() => onDelete(id)}
                    >
                      <IconTrash size={'1rem'}/>
                    </ActionIcon>
                  </ActionIconGroup>
                </Group>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Outlet/>
    </>
  )
}