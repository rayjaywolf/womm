import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import HistoryChart from '../components/HistoryChart'

// Mock Recharts components
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: ({ children }) => <div>{children}</div>,
    Line: () => <div>Line</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    Tooltip: () => <div>Tooltip</div>,
    CartesianGrid: () => <div>CartesianGrid</div>,
}))

const mockData = [
    {
        mood: 'Happy',
        color: '#FFD700',
        sentimentScore: 8,
        updatedAt: new Date().toISOString(),
    },
]

describe('HistoryChart', () => {
    test('renders chart with correct average', () => {
        render(<HistoryChart data={mockData} avg={8} />)
        expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument()
        expect(screen.getByText('Average: 8.0/10')).toBeInTheDocument()
    })

    test('renders chart with negative average', () => {
        render(<HistoryChart data={mockData} avg={-2} />)
        expect(screen.getByText('Average: -2.0/10')).toBeInTheDocument()
    })
}) 