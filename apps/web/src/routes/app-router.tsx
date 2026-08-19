import { createBrowserRouter } from 'react-router-dom'
import { AppRoute } from './AppRoute'
import { NewTaskPage } from './pages/NewTaskPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TaskListPage } from './pages/TaskListPage'
import { TaskPage } from './pages/TaskPage'

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
