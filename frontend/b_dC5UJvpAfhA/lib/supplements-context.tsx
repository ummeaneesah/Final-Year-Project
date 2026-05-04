'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { fetchSchedule } from '@/lib/supplement-data'

export interface SupplementScheduleItem {
  id: string
  product: string
  dose_min: number | null
  dose_max: number | null
  recommended_time: 'morning' | 'afternoon' | 'evening' | 'bedtime' | 'anytime'
  notes?: string | null
}

interface SupplementsContextType {
  schedule: SupplementScheduleItem[]
  addSupplement: (name: string) => Promise<void>
  removeSupplement: (name: string) => Promise<void>
  clearAll: () => void
  isLoading: boolean
}

const SupplementsContext = createContext<SupplementsContextType | undefined>(undefined)

export function SupplementsProvider({ children }: { children: React.ReactNode }) {
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [schedule, setSchedule] = useState<SupplementScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Recalculate schedule whenever selection changes
  async function recalcSchedule(names: string[]) {
  setIsLoading(true)
  try {
    const results = await fetchSchedule(names)

    if (!Array.isArray(results)) {
      console.error('Expected schedule array, got:', results)
      setSchedule([])
      return
    }

    const unique = Array.from(
      new Map(results.map(r => [r.product, r])).values()
    )

    setSchedule(
      unique.map(item => ({
        ...item,
        id: crypto.randomUUID(),
      }))
    )
  } catch (err) {
    console.error(err)
    setSchedule([])
  } finally {
    setIsLoading(false)
  }
}

  async function addSupplement(name: string) {
  if (selectedNames.includes(name)) return
  const next = [...selectedNames, name]
  setSelectedNames(next)
  await recalcSchedule(next)
}

async function removeSupplement(name: string) {
  const next = selectedNames.filter(n => n !== name)
  setSelectedNames(next)
  await recalcSchedule(next)
}

  function clearAll() {
    setSelectedNames([])
    setSchedule([])
  }

  return (
    <SupplementsContext.Provider
      value={{
        schedule,
        addSupplement,
        removeSupplement,
        clearAll,
        isLoading,
      }}
    >
      {children}
    </SupplementsContext.Provider>
  )
}

export function useSupplements() {
  const ctx = useContext(SupplementsContext)
  if (!ctx) {
    throw new Error('useSupplements must be used inside SupplementsProvider')
  }
  return ctx
}