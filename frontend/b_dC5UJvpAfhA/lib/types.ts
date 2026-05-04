export type MealTiming = 'before_breakfast' | 'with_breakfast' | 'after_breakfast' | 
                         'before_lunch' | 'with_lunch' | 'after_lunch' |
                         'before_dinner' | 'with_dinner' | 'after_dinner' |
                         'bedtime' | 'anytime'

export interface Supplement {
  id: string
  name: string
  dosage: string
  unit: string
  timing: MealTiming
  frequency: 'daily' | 'weekly' | 'as_needed'
  notes?: string
  createdAt: Date
}

export interface ScheduleItem {
  timing: MealTiming
  supplements: Supplement[]
}

export interface User {
  id: string
  email: string
  name: string
}

export const TIMING_LABELS: Record<MealTiming, string> = {
  before_breakfast: 'Before Breakfast',
  with_breakfast: 'With Breakfast',
  after_breakfast: 'After Breakfast',
  before_lunch: 'Before Lunch',
  with_lunch: 'With Lunch',
  after_lunch: 'After Lunch',
  before_dinner: 'Before Dinner',
  with_dinner: 'With Dinner',
  after_dinner: 'After Dinner',
  bedtime: 'Before Bed',
  anytime: 'Any Time',
}

export const TIMING_ORDER: MealTiming[] = [
  'before_breakfast',
  'with_breakfast',
  'after_breakfast',
  'before_lunch',
  'with_lunch',
  'after_lunch',
  'before_dinner',
  'with_dinner',
  'after_dinner',
  'bedtime',
  'anytime',
]
