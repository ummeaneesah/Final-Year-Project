import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { TIMING_LABELS, TIMING_ORDER, type Supplement, type MealTiming } from './types'

const MEAL_GROUP_LABELS: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
  anytime: 'Any Time',
}

const TIMING_TO_GROUP: Record<MealTiming, string> = {
  before_breakfast: 'morning',
  with_breakfast: 'morning',
  after_breakfast: 'morning',
  before_lunch: 'afternoon',
  with_lunch: 'afternoon',
  after_lunch: 'afternoon',
  before_dinner: 'evening',
  with_dinner: 'evening',
  after_dinner: 'evening',
  bedtime: 'night',
  anytime: 'anytime',
}

export function generateSchedulePDF(schedule: Supplement[], userName?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Colors - Pink and Gold theme
  const primaryColor: [number, number, number] = [212, 168, 83] // Golden amber
  const pinkColor: [number, number, number] = [245, 209, 216] // Soft pink
  const textColor: [number, number, number] = [60, 45, 50]
  const lightPink: [number, number, number] = [252, 240, 243]

  // Header with pink background
  doc.setFillColor(...pinkColor)
  doc.rect(0, 0, pageWidth, 45, 'F')
  
  // Gold accent line
  doc.setFillColor(...primaryColor)
  doc.rect(0, 45, pageWidth, 3, 'F')
  
  doc.setTextColor(...textColor)
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text('Supplement Scheduler', 20, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Your Personalised Supplement Schedule', 20, 36)

  // User info
  doc.setTextColor(...textColor)
  doc.setFontSize(11)
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  if (userName) {
    doc.text(`Prepared for: ${userName}`, 20, 60)
    doc.text(`Date: ${today}`, 20, 68)
  } else {
    doc.text(`Date: ${today}`, 20, 60)
  }

  // Organize supplements by meal groups
  const groupedSupplements: Record<string, { timing: MealTiming; supplements: Supplement[] }[]> = {}

  schedule.forEach((item) => {
    const timing = item.timing ?? (item as { recommended_time?: MealTiming }).recommended_time ?? 'anytime'
    const groupKey = TIMING_TO_GROUP[timing] || 'anytime'
    
    if (!groupedSupplements[groupKey]) {
      groupedSupplements[groupKey] = []
    }
    
    let group = groupedSupplements[groupKey].find(g => g.timing === timing)
    if (!group) {
      group = { timing, supplements: [] }
      groupedSupplements[groupKey].push(group)
    }
    
    group.supplements.push(item as Supplement)
  })

  let yPosition = userName ? 82 : 74

  // Create schedule table for each group
  Object.entries(groupedSupplements).forEach(([groupKey, timings]) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Group header with gold background
    doc.setFillColor(...primaryColor)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    
    doc.roundedRect(15, yPosition - 5, pageWidth - 30, 12, 2, 2, 'F')
    doc.text(MEAL_GROUP_LABELS[groupKey], 20, yPosition + 3)
    yPosition += 15

    // Prepare table data
    const tableData: string[][] = []
    
    timings.forEach(({ timing, supplements: timingSupplements }) => {
      timingSupplements.forEach((supplement, index) => {
        tableData.push([
          index === 0 ? TIMING_LABELS[timing] : '',
          supplement.name,
          `${supplement.dosage} ${supplement.unit}`,
          supplement.frequency === 'daily' ? 'Daily' : supplement.frequency === 'weekly' ? 'Weekly' : 'As Needed',
          supplement.notes || '-',
        ])
      })
    })

    // Add table
    autoTable(doc, {
      startY: yPosition,
      head: [['When', 'Supplement', 'Dosage', 'Frequency', 'Notes']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: lightPink,
        textColor: textColor,
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        textColor: textColor,
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [255, 252, 253],
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 'auto' },
      },
      margin: { left: 15, right: 15 },
      didDrawPage: (data) => {
        yPosition = data.cursor?.y || yPosition
      },
    })

    // Get the final Y position after table
    yPosition = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || yPosition
    yPosition += 15
  })

  // Tips section
  if (yPosition > 210) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFillColor(...lightPink)
  doc.roundedRect(15, yPosition, pageWidth - 30, 55, 3, 3, 'F')
  
  // Gold accent for tips header
  doc.setFillColor(...primaryColor)
  doc.roundedRect(15, yPosition, pageWidth - 30, 14, 3, 3, 'F')
  doc.rect(15, yPosition + 10, pageWidth - 30, 4, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Tips for Best Results', 20, yPosition + 10)
  
  doc.setTextColor(...textColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  const tips = [
    'Take fat-soluble vitamins (A, D, E, K) with meals containing healthy fats',
    'Iron is best absorbed on an empty stomach, but can be taken with food if needed',
    'Calcium and magnesium compete for absorption - take them at different times',
    'B vitamins are energising - avoid taking them close to bedtime',
  ]
  
  tips.forEach((tip, index) => {
    doc.text(`• ${tip}`, 20, yPosition + 24 + index * 8)
  })

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10
  doc.setFontSize(8)
  doc.setTextColor(150, 130, 135)
  doc.text('Generated by Supplement Scheduler - Take Back Control of Your Health', pageWidth / 2, footerY, {
    align: 'center',
  })

  // Save the PDF
  doc.save(`supplement-schedule-${new Date().toISOString().split('T')[0]}.pdf`)
}
