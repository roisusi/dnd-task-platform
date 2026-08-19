import { createBrowserRouter } from 'react-router-dom'
import { NewTaskPage } from '@features/tasks/main/NewTaskPage'
import { TaskListPage } from '@features/tasks/main/TaskListPage'
import { TaskPage } from '@features/tasks/main/TaskPage'
import { NotFoundPage } from '@features/navigation/error/NotFoundPage'
import { AppRoute } from '@infrastructure/AppRoute'

/** Maps task URLs to their feature-owned page components. */
export const appRouter = createBrowserRouter([
  {
    element: <AppRoute />,
    children: [
      { path: '/', element: <TaskListPage /> },
      { path: '/tasks/new', element: <NewTaskPage /> },
      { path: '/tasks/:taskId', element: <TaskPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
