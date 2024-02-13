import {Modal} from "@mantine/core";
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/_layout/_auth/tasks.$id.tsx";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {TasksQo} from "@/queries/tasks-qo.ts";
import {tasks} from "@/api/tasks.ts";
import {TaskForm} from "@components/task-form.tsx";

export const component = function Detail() {
  const navigate = useNavigate()
  const {id} = Route.useParams()
  const {data} = useSuspenseQuery(TasksQo())
  const item = data[id]
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: any) => tasks.put({
      ...item,
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']}).then()
      navigate({to: '/tasks'}).then()
    }
  })

  return (
    <Modal
      size={'lg'}
      title={`Úprava úlohy - ${item.name}`}
      opened
      onClose={() => navigate({to: '/tasks'})}
    >
      <TaskForm onSubmit={mutation.mutate} item={item}/>
    </Modal>
  )
}