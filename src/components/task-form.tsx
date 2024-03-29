import {
  ActionIcon, Anchor,
  Box,
  Button, Checkbox, Grid,
  Group,
  JsonInput,
  NumberInput,
  Select,
  Stack, Switch,
  Text,
  TextInput
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {HttpMethods, HttpMethodsWithContent, Task, WeekDays} from "@/api/tasks.ts";
import {IconCirclePlus, IconTrash} from "@tabler/icons-react";
import {TimeInput} from "@mantine/dates";
import {z} from "zod";

export const TaskForm = ({onSubmit, item}: { onSubmit: any, item?: Task }) => {

  const form = useForm({
    initialValues: {
      name: item?.name ?? '',
      httpMethod: item?.httpMethod ?? '',
      interval: item?.interval ?? 60,
      url: item?.url ?? '',
      description: item?.description ?? '',
      startAt: item?.startAt ?? '00:00:00',
      endAt: item?.endAt ?? '',
      content: item?.content ?? '',
      headers: Object.entries(item?.headers ?? {}).map(([key, value]) => ({ key, value })),
      daysOfWeek: (item?.daysOfWeek ?? []).reduce((days, day) => {
        days[day - 1] = true

        return days
      }, Array(7).fill(false)),
      isValid: item?.isValid ?? true,
    },
    transformValues: values => ({
      ...values,
      daysOfWeek: values.daysOfWeek
        .map((isChecked, index) => isChecked && (index + 1))
        .filter(day => !!day),
      headers: values.headers.reduce<Record<string, string>>((headers, header) => {
        headers[header.key] = header.value

        return headers
      }, {}),
      endAt: values.endAt || null
    }),
    validate: {
      url: value => z.string().url().safeParse(value).success ? null : 'Zadejte správnou URL adresu.',
      content: value => {
        try {
          JSON.parse(value || '{}')
          return null
        } catch (e) {
          return 'Zadejte validní JSON data.'
        }
      }
    }
  })

  return (
    <form onSubmit={form.onSubmit(data => onSubmit(data))}>
      <Stack>
        <TextInput
          label="Název:"
          required
          disabled={!!item}
          {...form.getInputProps('name')}
        />
        <Grid>
          <Grid.Col span={3}>
            <Select
              label="Metoda:"
              required
              data={HttpMethods}
              {...form.getInputProps('httpMethod')}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <TextInput
              label="URL:"
              required {...form.getInputProps('url')}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={3}>
            <NumberInput
              label="Interval:"
              rightSection="s"
              {...form.getInputProps('interval')}
            />
          </Grid.Col>
          <Grid.Col span={'auto'}>
            <TimeInput
              withSeconds
              required
              label="Od:"
              {...form.getInputProps('startAt')}
            />
          </Grid.Col>
          <Grid.Col span={'auto'}>
            <TimeInput
              withSeconds
              label="Do:"
              {...form.getInputProps('endAt')}
            />
          </Grid.Col>
        </Grid>

        <Box>
          <Text size="sm" mb="xs">Dny v týdnu:</Text>
            <Group grow>
              {WeekDays.map((d, i) =>
                <Checkbox
                  key={i + 1}
                  value={(i+1).toString()}
                  label={d}
                  {...form.getInputProps(`daysOfWeek.${i}`, {type: 'checkbox'})}
                />
              )}
            </Group>
        </Box>
        <TextInput
          label="Popis:"
          {...form.getInputProps('description')}
        />
        <JsonInput
          description="Body request (json)"
          disabled={HttpMethodsWithContent.indexOf(form.values.httpMethod) === -1}
          label="Obsah:"
          {...form.getInputProps('content')}
          autosize
          minRows={4}
        />
        <Box>
          <Group gap="xs" mb="xs">
            <Text size="sm">Hlavičky:</Text>
            <Anchor
              onClick={() => form.insertListItem('headers', {key: '', value: ''})}
              mt={-3}
            >
              <IconCirclePlus size="1.2rem"/>
            </Anchor>
          </Group>
          {form.values.headers?.map((_header, index) =>
            <Group key={index} mb="xs">
              <TextInput
                className="flex-grow"
                size="xs"
                placeholder="Key"
                {...form.getInputProps(`headers.${index}.key`)}
              />
              <TextInput
                className="flex-grow"
                size="xs"
                placeholder="Value"
                {...form.getInputProps(`headers.${index}.value`)}
              />
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => form.removeListItem('headers', index)}
              >
                <IconTrash size="1rem"/>
              </ActionIcon>
            </Group>
          )}
        </Box>
        <Group justify={'space-between'}>
          <Switch
            label="Aktivní"
            {...form.getInputProps('isValid')}
            checked={form.values.isValid}
          />
          <Button type="submit">Uložit</Button>
        </Group>
        <Group justify={'end'}>
          <Anchor type="reset" onClick={() => form.reset()} size="xs" c="dimmed">Obnovit formulář</Anchor>
        </Group>
      </Stack>
    </form>
  )
}