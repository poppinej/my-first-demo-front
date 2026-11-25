import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HomeView from './HomeView.vue'
import { fetchHealth } from '../api/health'

vi.mock('../api/health', () => ({ fetchHealth: vi.fn() }))

const mockedFetchHealth = vi.mocked(fetchHealth)

describe('HomeView', () => {
  beforeEach(() => {
    mockedFetchHealth.mockReset()
  })

  it('展示后端返回的健康状态', async () => {
    mockedFetchHealth.mockResolvedValue({ status: 'UP', app: 'learn-app', version: '0.0.1' })

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.text()).toContain('UP')
    expect(wrapper.text()).toContain('learn-app')
    expect(wrapper.text()).toContain('0.0.1')
  })

  it('后端不可达时展示可读提示，重试成功后恢复', async () => {
    mockedFetchHealth.mockRejectedValueOnce(new Error('Network Error'))

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.text()).toContain('后端不可达')
    expect(wrapper.text()).toContain('Network Error')

    mockedFetchHealth.mockResolvedValueOnce({ status: 'UP', app: 'learn-app', version: '0.0.1' })
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('UP')
    expect(wrapper.text()).not.toContain('后端不可达')
  })
})
