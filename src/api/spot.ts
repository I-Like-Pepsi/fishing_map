import { mockDelay } from './mock'

interface Spot {
  id: string
  name: string
  address: string
  type: string
  rating: number
  distance: number
}

export const spotApi = {
  // 获取钓点列表
  async getList(params: { page: number; size: number }): Promise<Spot[]> {
    await mockDelay(300)
    return []
  },

  // 获取附近钓点
  async getNearby(params: { lng: number; lat: number; radius: number }): Promise<Spot[]> {
    await mockDelay(500)
    return [
      {
        id: '1',
        name: 'XX水库',
        address: '北京市XX区XX水库',
        type: '水库',
        rating: 4.5,
        distance: 2.5
      },
      {
        id: '2',
        name: 'XX河段',
        address: '北京市XX区XX河',
        type: '江河',
        rating: 4.2,
        distance: 5.8
      },
      {
        id: '3',
        name: 'XX公园湖',
        address: '北京市XX区XX公园',
        type: '湖泊',
        rating: 3.8,
        distance: 8.2
      }
    ]
  },

  // 获取钓点详情
  async getDetail(id: string): Promise<Spot> {
    await mockDelay(300)
    return {
      id,
      name: 'XX水库',
      address: '北京市XX区XX水库',
      type: '水库',
      rating: 4.5,
      distance: 0
    }
  },

  // 搜索钓点
  async search(keyword: string): Promise<Spot[]> {
    await mockDelay(400)
    return []
  }
}
