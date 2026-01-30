import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Address } from '../types'

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  addAddress: (address: Address) => void
  removeAddress: (addressId: string) => void
  setDefaultAddress: (addressId: string) => void
  getDefaultAddress: () => Address | null
}

const defaultUser: User = {
  id: '1',
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  phone: '+7 700 123 4567',
  addresses: [],
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      addAddress: (address) => {
        const user = get().user || defaultUser
        set({
          user: {
            ...user,
            addresses: [...user.addresses, address],
          },
        })
      },
      removeAddress: (addressId) => {
        const user = get().user
        if (!user) return
        set({
          user: {
            ...user,
            addresses: user.addresses.filter(addr => addr.id !== addressId),
          },
        })
      },
      setDefaultAddress: (addressId) => {
        const user = get().user
        if (!user) return
        set({
          user: {
            ...user,
            addresses: user.addresses.map(addr => ({
              ...addr,
              isDefault: addr.id === addressId,
            })),
          },
        })
      },
      getDefaultAddress: () => {
        const user = get().user
        if (!user) return null
        return user.addresses.find(addr => addr.isDefault) || user.addresses[0] || null
      },
    }),
    {
      name: 'quickcart-user',
    }
  )
)
