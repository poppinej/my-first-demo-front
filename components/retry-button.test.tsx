import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RetryButton } from './retry-button'

describe('RetryButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('渲染「重新检查」按钮', () => {
    render(<RetryButton action={vi.fn(async () => {})} />)

    expect(screen.getByRole('button', { name: '重新检查' })).toBeEnabled()
  })

  it('点击时调用传入的 action', async () => {
    const action = vi.fn(async () => {})
    render(<RetryButton action={action} />)

    fireEvent.click(screen.getByRole('button', { name: '重新检查' }))

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1))
  })

  it('action 未完成时展示 pending 态并禁用按钮', async () => {
    let resolveAction: () => void = () => {}
    const action = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve
        }),
    )
    render(<RetryButton action={action} />)

    fireEvent.click(screen.getByRole('button', { name: '重新检查' }))

    await waitFor(() => expect(screen.getByRole('button', { name: '检查中…' })).toBeDisabled())

    resolveAction()

    await waitFor(() => expect(screen.getByRole('button', { name: '重新检查' })).toBeEnabled())
  })
})
