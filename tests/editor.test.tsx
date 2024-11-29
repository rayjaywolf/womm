import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Editor from '@/components/Editor'

const mockPush = vi.fn()
const mockUpdateEntry = vi.fn(() => Promise.resolve({ success: true }))
const mockDeleteEntry = vi.fn(() => Promise.resolve({ success: true }))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: vi.fn(),
    }),
}))

vi.mock('@/util/api', () => ({
    updateEntry: (...args) => mockUpdateEntry(...args),
    deleteEntry: (...args) => mockDeleteEntry(...args),
}))

vi.mock('sonner', () => ({
    toast: {
        promise: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}))

const mockEntry = {
    id: '123',
    content: 'Test content',
    createdAt: new Date().toISOString(),
    analysis: {
        mood: 'Happy',
        subject: 'Testing',
        summary: 'Test summary',
        negative: false,
        color: '#FFD700',
        sentimentScore: 8,
    },
}

describe('Editor', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('renders editor with entry content', () => {
        render(<Editor entry={mockEntry} />)
        expect(screen.getByText('Journal Entry')).toBeInTheDocument()
        expect(screen.getByText('Analysis')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test content')).toBeInTheDocument()
    })

    test('autosave toggle works', () => {
        render(<Editor entry={mockEntry} />)
        const autosaveCheckbox = screen.getByRole('checkbox')
        expect(autosaveCheckbox).toBeChecked()

        fireEvent.click(autosaveCheckbox)
        expect(autosaveCheckbox).not.toBeChecked()
    })

    test('content updates trigger save', async () => {
        render(<Editor entry={mockEntry} />)
        const textarea = screen.getByDisplayValue('Test content')

        fireEvent.change(textarea, { target: { value: 'New content' } })

        await waitFor(() => {
            expect(mockUpdateEntry).toHaveBeenCalledWith('123', 'New content')
        }, { timeout: 2000 })
    })
}) 