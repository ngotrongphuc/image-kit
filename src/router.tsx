import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import { HomePage } from './pages/HomePage'
import { ToolPage } from './pages/ToolPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tool/:toolId', element: <ToolPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
