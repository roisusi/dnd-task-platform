import axios from 'axios'
import { errorTranslations } from './error-translations'

export interface ApiProblem {
  title: string
  message: string
}

/** Shared Axios client used by every frontend API service. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const translateErrorItem = (item: unknown): string => {
  if (typeof item === 'string') {
    return item
  }

  if (isRecord(item)) {
    const code = typeof item.code === 'string' ? item.code : undefined
    const fallback =
      typeof item.message === 'string'
        ? item.message
        : 'The requested action could not be completed.'

    return code ? (errorTranslations[code] ?? fallback) : fallback
  }

  return 'The requested action could not be completed.'
}

const problemTitle = (status?: number): string => {
  switch (status) {
    case 400:
      return 'Check the task information'
    case 403:
      return 'Action not allowed'
    case 404:
      return 'Item not found'
    default:
      return status && status >= 500
        ? 'The server could not complete the action'
        : 'Something went wrong'
  }
}

/** Converts Nest or network failures into translated dialog content. */
export const getApiProblem = (error: unknown): ApiProblem => {
  if (!axios.isAxiosError(error)) {
    return {
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
    }
  }

  const responseData: unknown = error.response?.data
  const rawMessage = isRecord(responseData) ? responseData.message : undefined
  const messages = Array.isArray(rawMessage)
    ? rawMessage.map(translateErrorItem)
    : [translateErrorItem(rawMessage)]

  if (error.response === undefined) {
    return {
      title: 'Cannot reach the API',
      message:
        'The task service is unavailable. Make sure the NestJS API is running.',
    }
  }

  return {
    title: problemTitle(error.response.status),
    message: messages.join('\n'),
  }
}
