import { request } from './http'

/** 与后端 `HealthStatus` 保持一致的载荷结构。 */
export interface HealthStatus {
  status: string
  app: string
  version: string
}

/** 通过开发代理访问 `/api/health`，不在业务代码里写后端地址。 */
export function fetchHealth(): Promise<HealthStatus> {
  return request<HealthStatus>({ url: '/api/health', method: 'GET' })
}
