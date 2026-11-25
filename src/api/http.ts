import axios, { type AxiosRequestConfig } from 'axios'

/** 后端统一响应体：`code` 为 0 表示成功，4xxxx 客户端错误，5xxxx 服务端错误。 */
export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

/** 前端统一错误：把网络错误、HTTP 错误码与业务错误码归一化成同一种异常。 */
export class ApiError extends Error {
  readonly code?: number

  constructor(message: string, code?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

const client = axios.create({
  timeout: 5000,
})

/**
 * 发起请求并解包统一响应体。
 *
 * 只做三件事：基础路径、响应体解包、错误归一化；不做重试、队列或并发控制。
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await client.request<ApiEnvelope<T>>(config)
    const body = response.data

    if (body.code !== 0) {
      throw new ApiError(body.message || '请求失败', body.code)
    }

    return body.data
  } catch (error) {
    throw normalizeError(error)
  }
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const body = error.response?.data as Partial<ApiEnvelope<unknown>> | undefined

    if (body?.message) {
      return new ApiError(body.message, body.code)
    }

    if (!error.response) {
      return new ApiError('无法连接到后端服务')
    }

    return new ApiError(`请求失败（HTTP ${error.response.status}）`)
  }

  return new ApiError(error instanceof Error ? error.message : '未知错误')
}
