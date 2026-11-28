'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** 渲染期未预期异常的兜底边界；业务错误态由页面自身在服务端处理。 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-8">
      <h2 className="text-xl font-semibold">页面渲染出错</h2>
      <p className="text-sm text-gray-600">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="self-start rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        重试
      </button>
    </main>
  )
}
