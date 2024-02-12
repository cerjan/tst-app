import {Code, Modal, Notification} from "@mantine/core";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_layout/_auth/tasks.$id.tsx";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {TasksQo} from "@/queries/tasks-qo.ts";
import {denormalize, ITaskForm, tasks} from "@/api/tasks.ts";
import {TaskForm} from "@components/task-form.tsx";
import {AxiosError} from "axios";

export const component = function Detail() {
  const navigate = useNavigate()
  const {id} = Route.useParams()
  const {data} = useSuspenseQuery(TasksQo())
  const item = data[id]
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: ITaskForm) => tasks.put(denormalize(data, item)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']}).then()
      navigate({to: '/tasks'}).then()
    }
  })

  return (
    <Modal size={'lg'} title={`Úprava úlohy - ${item.name}`} opened={true} onClose={() => navigate({to: '/tasks'})}>
      {mutation.isError && (
        <Notification title={mutation.error.message} color="red" mb="lg" fs="xs" withCloseButton={false}>
          <Code block>{JSON.stringify((mutation.error as AxiosError).response?.data ?? '', null, 4)}</Code>
        </Notification>
      )}
      <TaskForm onSubmit={mutation.mutate} item={item}/>
    </Modal>
  )
}