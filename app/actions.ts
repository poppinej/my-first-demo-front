'use server'

import { revalidatePath } from 'next/cache'

/** 重新检查后端状态：让首页的服务端渲染重新执行。 */
export async function retryHealth(): Promise<void> {
  revalidatePath('/')
}
