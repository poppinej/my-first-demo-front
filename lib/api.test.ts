import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, BACKEND_URL, getHealth } from './api'

interface StubbedResponse {
  ok: boolean
  status: number
  json: () => Promise<unknown>
}

function stubJsonResponse(body: unknown, status = 200): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async (): Promise<StubbedResponse> => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('getHealth', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('成功时解包统一响应体并返回 data', async () => {
    const fetchMock = stubJsonResponse({
      code: 0,
      message: 'ok',
      data: { status: 'UP', app: 'learn-app', version: '0.0.1' },
    })

    await expect(getHealth()).resolves.toEqual({
      status: 'UP',
      app: 'learn-app',
      version: '0.0.1',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      `${BACKEND_URL}/api/health`,
      expect.objectContaining({ cache: 'no-store' }),
    )
  })

  it('业务错误码抛出带 code 的 ApiError', async () => {
    stubJsonResponse({ code: 40400, message: '待办不存在', data: null })

    await expect(getHealth()).rejects.toMatchObject({
      name: 'ApiError',
      message: '待办不存在',
      code: 40400,
    })
  })

  it('网络不可达时给出可读错误', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('fetch failed')
      }),
    )

    await expect(getHealth()).rejects.toMatchObject({
      message: '无法连接到后端服务',
    })
  })

  it('HTTP 错误带统一响应体时使用后端 message 与 code', async () => {
    stubJsonResponse({ code: 50000, message: '服务器错误', data: null }, 500)

    await expect(getHealth()).rejects.toMatchObject({
      name: 'ApiError',
      message: '服务器错误',
      code: 50000,
    })
  })

  it('HTTP 错误且响应不是 JSON 时报告状态码', async () => {
    const fetchMock = vi.fn(async (): Promise<StubbedResponse> => ({
      ok: false,
      status: 502,
      json: async () => {
        throw new SyntaxError('Unexpected token <')
      },
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getHealth()).rejects.toBeInstanceOf(ApiError)
    await expect(getHealth()).rejects.toMatchObject({ message: '请求失败（HTTP 502）' })
  })

  it('成功响应不是 JSON 时报告响应格式错误', async () => {
    const fetchMock = vi.fn(async (): Promise<StubbedResponse> => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token <')
      },
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getHealth()).rejects.toMatchObject({ message: '响应格式不正确' })
  })
})
