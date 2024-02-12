import {Modal} from "@mantine/core";
import {useNavigate} from "@tanstack/react-router";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {denormalize, ITaskForm, tasks} from "@/api/tasks.ts";
import {TaskForm} from "@components/task-form.tsx";
import {Code, Notification} from "@mantine/core";
import {AxiosError} from "axios";

export const component = function Detail() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: ITaskForm) => tasks.post(denormalize(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']}).then()
      navigate({to: '/tasks'}).then()
    }
  })

  return (
    <Modal size={'lg'} title={`Nová úloha`} opened={true} onClose={() => navigate({to: '/tasks'})}>
      {mutation.isError && (
        <Notification title={mutation.error.message} color="red" mb="lg" fs="xs" withCloseButton={false}>
          <Code block>{JSON.stringify((mutation.error as AxiosError).response?.data ?? '', null, 4)}</Code>
        </Notification>
      )}
      <TaskForm onSubmit={mutation.mutate}/>
    </Modal>
  )
}