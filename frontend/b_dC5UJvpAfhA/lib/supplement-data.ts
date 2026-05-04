// frontend/b_dC5UvpAfhA/lib/supplement-data.ts

export interface SupplementScheduleItem {
  product: string
  dose_min: number | null
  dose_max: number | null
  recommended_time: 'morning' | 'afternoon' | 'evening' | 'bedtime' | 'anytime'
  notes?: string | null
}

export async function fetchSchedule(
  supplements: string[]
): Promise<SupplementScheduleItem[]> {
  const res = await fetch('http://127.0.0.1:5000/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ supplements }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch supplement schedule')
  }

  return res.json()
}


export async function fetchSupplementNames(): Promise<string[]> {
  const res = await fetch('http://127.0.0.1:5000/supplements')

  if (!res.ok) {
    throw new Error('Failed to fetch supplement names')
  }

  return res.json()
}
