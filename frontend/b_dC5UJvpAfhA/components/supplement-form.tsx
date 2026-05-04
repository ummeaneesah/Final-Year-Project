'use client'

import { useEffect, useState } from 'react'
import { X, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSupplements } from '@/lib/supplements-context'
import { fetchSupplementNames } from '@/lib/supplement-data'

interface SupplementFormProps {
  onClose: () => void
}

export function SupplementForm({ onClose }: SupplementFormProps) {
  const { addSupplement } = useSupplements()
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    fetchSupplementNames().then(setOptions)
  }, [])

  const filtered = options.filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative z-50 w-full max-w-md rounded-xl bg-background p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Supplement</h2>
          <Button variant="ghost" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            className="pl-9"
            placeholder="Search supplements..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-48 overflow-y-auto border rounded-md">
          {filtered.map(name => (
            <button
              key={name}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-muted"
              onClick={() => {
                addSupplement(name)
                onClose()
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}