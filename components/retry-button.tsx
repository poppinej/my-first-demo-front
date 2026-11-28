'use client'

import { useTransition } from 'react'

interface RetryButtonProps {
  action: () => Promise<void>
}

/** 重新检查按钮：调用 Server Action 触发服务端重新渲染。 */
export function RetryButton({ action }: RetryButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await action()
        })
      }}
      className="self-start rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {isPending ? '检查中…' : '重新检查'}
    </button>
  )
}
