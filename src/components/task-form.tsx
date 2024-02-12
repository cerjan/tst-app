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
import {HttpMethods, HttpMethodsWithContent, normalize, ITaskForm, ITask} from "@/api/tasks.ts";
import {IconCirclePlus, IconTrash} from "@tabler/icons-react";
import {TimeInput} from "@mantine/dates";
import {useEffect} from "react";

export const TaskForm = ({onSubmit, item}: { onSubmit: any, item?: ITask }) => {
  const form = useForm<ITaskForm>({
    initialValues: {
      name: '',
      ...item,
      daysOfWeek: item?.daysOfWeek?.reduce(
        (daysOfWeek, day) => {
          daysOfWeek[day - 1] = true;
          return daysOfWeek;
        },
        Array(7).fill(false)
      ),
    },
    /*
    validate: (values) => ({
      url: z.isURL()
    })
     */
  })

  console.log(form.values.daysOfWeek);

  useEffect(() => {
    if(form.initialized)
      form.initialize(item);
  }, [item]);

  return (
    <form onSubmit={form.onSubmit(data => onSubmit(data))}>
      <Stack>
        <TextInput label="Název:" required disabled={!!item} {...form.getInputProps('name')}/>
        <Grid>
          <Grid.Col span={3}><Select label="Metoda:" required
                                     data={HttpMethods} {...form.getInputProps('httpMethod')}/></Grid.Col>
          <Grid.Col span={9}><TextInput label="URL:" required {...form.getInputProps('url')}/></Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={3}><NumberInput label="Interval:"
                                          rightSection="s" {...form.getInputProps('interval')}/></Grid.Col>
          <Grid.Col span={'auto'}>
            <TimeInput
              withSeconds
              required
              label="Od:" {...form.getInputProps('startAt')}
            />
          </Grid.Col>
          <Grid.Col span={'auto'}><TimeInput withSeconds label="Do:" {...form.getInputProps('endAt')}/></Grid.Col>
        </Grid>

        <Box>
          <Text size="sm" mb="xs">Dny v týdnu:</Text>
          <Checkbox.Group>
            <Group grow>
              <Checkbox value={'1'} label="Po" {...form.getInputProps('daysOfWeek.0', {type: 'checkbox'})}/>
              <Checkbox value={'2'} label="Út" {...form.getInputProps('daysOfWeek.1', {type: 'checkbox'})}/>
              <Checkbox value={'3'} label="St" {...form.getInputProps('daysOfWeek.2', {type: 'checkbox'})}/>
              <Checkbox value={'4'} label="Čt" {...form.getInputProps('daysOfWeek.3', {type: 'checkbox'})}/>
              <Checkbox value={'5'} label="Pá" {...form.getInputProps('daysOfWeek.4', {type: 'checkbox'})}/>
              <Checkbox value={'6'} label="So" {...form.getInputProps('daysOfWeek.5', {type: 'checkbox'})}/>
              <Checkbox value={'7'} label="Ne" {...form.getInputProps('daysOfWeek.6', {type: 'checkbox'})}/>
            </Group>
          </Checkbox.Group>

        </Box>
        <TextInput label="Popis:" {...form.getInputProps('description')}/>
        <JsonInput description="Body request (json)"
                   disabled={HttpMethodsWithContent.indexOf(form.values.httpMethod) === -1}
                   label="Obsah:" {...form.getInputProps('content')} autosize minRows={4}/>
        <Box>

          <Group gap="xs" mb="xs">
            <Text size="sm">Hlavičky:</Text>
            <Anchor onClick={() => form.insertListItem('headers', {key: '', value: ''})} mt={-3}><IconCirclePlus size="1.2rem"/></Anchor>
          </Group>


          {form.values.headers?.map((_header, index) => (
            <Group key={index} mb="xs">
              <TextInput className="flex-grow" size="xs"
                         placeholder="Key" {...form.getInputProps(`headers.${index}.key`)}/>
              <TextInput className="flex-grow" size="xs"
                         placeholder="Value" {...form.getInputProps(`headers.${index}.value`)}/>
              <ActionIcon color="red" variant="light" onClick={() => form.removeListItem('headers', index)}>
                <IconTrash size="1rem"/>
              </ActionIcon>
            </Group>
          ))}
        </Box>

        <Group justify={'space-between'}>
          <Switch label="Aktivní" {...form.getInputProps('isValid')} checked={form.values.isValid}/>
          <Button type="submit">Uložit</Button>
        </Group>
      </Stack>
    </form>
  )
}