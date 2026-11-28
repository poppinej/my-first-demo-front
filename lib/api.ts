/** 后端地址只在此处读取，业务代码不得出现后端地址字面量。 */
export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8081'

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

/** 后端健康检查载荷。 */
export interface HealthStatus {
  status: string
  app: string
  version: string
}

const TIMEOUT_MS = 5000

/**
 * 在服务端请求后端接口并解包统一响应体。
 *
 * 只做三件事：拼接后端地址、解包响应体、错误归一化；不做重试、缓存或并发控制。
 */
export async function request<T>(path: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    throw new ApiError('无法连接到后端服务')
  }

  let body: ApiEnvelope<T>

  try {
    body = (await response.json()) as ApiEnvelope<T>
  } catch {
    if (!response.ok) {
      throw new ApiError(`请求失败（HTTP ${response.status}）`, response.status)
    }

    throw new ApiError('响应格式不正确')
  }

  if (!response.ok || body.code !== 0) {
    throw new ApiError(body.message || '请求失败', body.code)
  }

  return body.data
}

/** 读取后端健康检查状态。 */
export function getHealth(): Promise<HealthStatus> {
  return request<HealthStatus>('/api/health')
}
