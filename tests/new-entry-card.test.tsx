import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import NewEntryCard from '@/components/NewEntryCard'

const mockPush = vi.fn()
const mockCreateNewEntry = vi.fn(() => Promise.resolve({ id: '123' }))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

vi.mock('@/util/api', () => ({
    createNewEntry: () => mockCreateNewEntry(),
}))

// Mock the entire sonner module
vi.mock('sonner', () => ({
    toast: vi.fn(),
}))

describe('NewEntryCard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('clicking card creates new entry', async () => {
        render(<NewEntryCard />)

        fireEvent.click(screen.getByText('New Entry'))

        await waitFor(() => {
            expect(mockCreateNewEntry).toHaveBeenCalled()
            expect(mockPush).toHaveBeenCalledWith('/journal/123')
        })
    })
}) 