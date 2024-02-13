import {Modal} from "@mantine/core";
import {useNavigate} from "@tanstack/react-router";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {tasks} from "@/api/tasks.ts";
import {TaskForm} from "@components/task-form.tsx";

export const component = function Detail() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: any) => tasks.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']}).then()
      navigate({to: '/tasks'}).then()
    }
  })

  return (
    <Modal
      size={'lg'}
      title={`Nová úloha`}
      opened
      onClose={() => navigate({to: '/tasks'})}
    >
      <TaskForm onSubmit={mutation.mutate}/>
    </Modal>
  )
}