'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Pill, 
  Calendar, 
  Download, 
  Clock, 
  Heart, 
  Sparkles, 
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SupplementsProvider, useSupplements } from '@/lib/supplements-context'
import { SupplementForm } from '@/components/supplement-form'
import { generateSchedulePDF } from '@/lib/generate-pdf'
import { TIMING_LABELS, TIMING_ORDER, type Supplement, type MealTiming } from '@/lib/types'

function Header() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">Supplement Scheduler</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('scheduler')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Scheduler
            </button>
          </nav>
          <Button 
            onClick={() => scrollToSection('scheduler')}
            className="gap-2"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  const scrollToScheduler = () => {
    document.getElementById('scheduler')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Golden supplement capsules on pink background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="w-4 h-4" />
            Designed for personalised health and PCOS support
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl leading-tight text-balance">
            Take Back Control of <em className="italic">Your</em> Health
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl text-pretty">
            Many individuals struggle to maintain consistent supplement routines, often forgetting doses or taking supplements incorrectly. 
            Our Supplement Scheduler eliminates this problem by organising your supplements into a structured schedule.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Personalised supplement plans</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Easy to use interface</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Designed for PCOS support</span>
            </div>
          </div>

          <Button size="lg" onClick={scrollToScheduler} className="gap-2 text-base mt-4">
            Start Scheduling Now
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Why Use Supplement Scheduler?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Our platform helps you build better habits through reliable, user-friendly technology designed with a focus on health and well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard
            icon={Clock}
            title="Improves Consistency"
            description="Ensures supplements are taken on time, every time. No more forgotten doses or confusion about timing."
          />
          <BenefitCard
            icon={Heart}
            title="Enhances Health Outcomes"
            description="Structured routines lead to better absorption and effectiveness, particularly for managing conditions like PCOS."
          />
          <BenefitCard
            icon={Sparkles}
            title="Reduces Stress"
            description="Automates daily planning so you can feel more in control of your health and confident in your supplement intake."
          />
        </div>
      </div>
    </section>
  )
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Clock
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-background border border-border">
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/15">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple, intuitive tools to manage your supplement routine effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Calendar}
            title="Meal-Based Scheduling"
            description="Organise supplements by meal times - before, with, or after breakfast, lunch, and dinner"
          />
          <FeatureCard
            icon={Clock}
            title="Optimal Timing"
            description="Get guidance on the best times to take each supplement for maximum absorption"
          />
          <FeatureCard
            icon={Download}
            title="PDF Export"
            description="Download your personalised schedule as a beautiful PDF to print or share"
          />
          <FeatureCard
            icon={Pill}
            title="Easy Management"
            description="Add, edit, and organise your supplements with an intuitive interface"
          />
          <FeatureCard
            icon={Heart}
            title="PCOS Support"
            description="Designed with specific consideration for PCOS management and wellness"
          />
          <FeatureCard
            icon={Info}
            title="Wellness Tips"
            description="Get helpful tips on supplement interactions and best practices"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Calendar
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

type GroupKey = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime'

function SchedulerSection() {
  return (
    <section id="scheduler" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Your Supplement Scheduler
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Add your supplements below and generate your personalised schedule
          </p>
        </div>

        <SupplementsProvider>
          <SchedulerContent />
        </SupplementsProvider>
      </div>
    </section>
  )
}

function SchedulerContent() {
  const { schedule, removeSupplement, isLoading } = useSupplements()
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expandedGroups, setExpandedGroups] =
    useState<Record<GroupKey, boolean>>({
      morning: true,
      afternoon: true,
      evening: true,
      night: true,
      anytime: true,
    })

  const filteredSupplements = schedule.filter(
    item =>
      typeof item.product === 'string' &&
      item.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedByTime = {
    morning: filteredSupplements.filter(s => s.recommended_time === 'morning'),
    afternoon: filteredSupplements.filter(s => s.recommended_time === 'afternoon'),
    evening: filteredSupplements.filter(s => s.recommended_time === 'evening'),
    night: filteredSupplements.filter(s => s.recommended_time === 'bedtime'),
    anytime: filteredSupplements.filter(s => s.recommended_time === 'anytime'),
  }

  const toggleGroup = (group: GroupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const handleDownloadPDF = () => {
    generateSchedulePDF(schedule as unknown as Supplement[])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-2xl bg-background border">
        <Input
          placeholder="Search supplements..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={schedule.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplement
          </Button>
        </div>
      </div>

      {/* Groups */}
      {Object.entries(groupedByTime).map(([group, items]) => (
        <div key={group} className="rounded-xl border bg-background">
          <button
            onClick={() => toggleGroup(group as GroupKey)}
            className="w-full flex justify-between p-4"
          >
            <span className="capitalize">
              {group} ({items.length})
            </span>
            {expandedGroups[group as GroupKey] ? <ChevronUp /> : <ChevronDown />}
          </button>

          {expandedGroups[group as GroupKey] && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {items.map(item => (
                <SupplementCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeSupplement(item.product)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {showForm && (
        <SupplementForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

type ScheduleItem = {
  id: string
  product: string
  dose_min: number | null
  dose_max: number | null
  recommended_time: string
}

function SupplementCard({
  item,
  onRemove,
}: {
  item: ScheduleItem
  onRemove: () => void
}) {
  return (
    <div className="p-4 border rounded-xl bg-card">
      <h4 className="font-medium">{item.product}</h4>
      <p>
        Dosage: {item.dose_min ?? '–'}–{item.dose_max ?? '–'}
      </p>
      <p>Time: {item.recommended_time}</p>

      <button
        className="mt-2 text-sm text-destructive"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  )
}

function getTimeGroup(timing: MealTiming): string {
  if (timing.includes('breakfast')) return 'morning'
  if (timing.includes('lunch')) return 'afternoon'
  if (timing.includes('dinner')) return 'evening'
  if (timing === 'bedtime') return 'night'
  return 'anytime'
}

function DisclaimerSection() {
  return (
    <section className="py-8 px-4 bg-muted/50 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            <span className="font-semibold">Medical Disclaimer</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-3xl text-pretty">
            The information provided by Supplement Scheduler is for general informational and educational purposes only. 
            It is not intended as, and should not be considered, professional medical advice, diagnosis, or treatment. 
            Always consult with a qualified healthcare professional before starting any new supplement regimen, 
            especially if you have existing health conditions, are pregnant, nursing, or taking medications. 
            Individual results may vary, and what works for one person may not be suitable for another.
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Supplement Scheduler</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Manage your supplements for personalised health, wellness, consistency, and PCOS support
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <SchedulerSection />
      </main>
      <DisclaimerSection />
      <Footer />
    </div>
  )
} 
