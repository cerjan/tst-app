import {useSuspenseQuery} from "@tanstack/react-query";
import {ActionIcon, ActionIconGroup, Button, Group, Loader, Table} from "@mantine/core";
import {IconEdit, IconPlayerPlay, IconPlus, IconTrash} from "@tabler/icons-react";
import {TextPair} from "@components/text-pair.tsx";
import {Link, Outlet} from "@tanstack/react-router";
import {TasksQo} from "@/queries/tasks-qo.ts";
import {WeekDays} from "@/api/tasks.ts";

export const component = function Home() {
  const {data, isLoading} = useSuspenseQuery(TasksQo())

  if (isLoading) return (
    <Loader/>
  )

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
                    <ActionIcon title={'Spustit'} variant={'light'}>
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