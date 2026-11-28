import { RetryButton } from '@/components/retry-button'
import { getHealth, type HealthStatus } from '@/lib/api'
import { retryHealth } from './actions'

/** 首页：服务端直接请求后端并渲染状态；后端不可达时渲染可读错误态。 */
export default async function HomePage() {
  let health: HealthStatus | null = null
  let errorMessage = ''

  try {
    health = await getHealth()
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : '无法连接到后端服务'
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">Learn App 脚手架</h1>
        <p className="mt-1 text-sm text-gray-600">Next.js 服务端渲染 · 后端健康检查</p>
      </header>

      {errorMessage ? (
        <section
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <p className="font-medium">后端不可达：{errorMessage}</p>
          <p className="mt-1 text-sm">请确认后端已在 8081 端口启动，然后点击「重新检查」。</p>
        </section>
      ) : (
        health && (
          <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p>
              服务状态：<span className="font-medium text-green-600">{health.status}</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">应用：{health.app}</p>
            <p className="text-sm text-gray-600">版本：{health.version}</p>
          </section>
        )
      )}

      <RetryButton action={retryHealth} />
    </main>
  )
}
