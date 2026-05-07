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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupplementNames()
      .then(data => setOptions(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = options.filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative z-50 w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Supplement</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            className="pl-9"
            placeholder="Search supplements..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Dropdown results */}
        {query.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-md border bg-background">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading supplements…
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No supplements found.
              </div>
            )}

            {!loading &&
              filtered.map(name => (
                <button
                  key={name}
                  type="button"
                  className="w-full px-3 py-2 text-left text-foreground hover:bg-muted border-b last:border-b-0"
                  onClick={() => {
                    addSupplement(name)
                    onClose()
                  }}
                >
                  {name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}