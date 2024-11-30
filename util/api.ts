const createUrl = (path) => {
    return window.location.origin + path;
}

export const updateEntry = async (id: string, content: string) => {
    const res = await fetch(`/api/journal/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return res.json()
}

const generateJournalId = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `JE-${day}-${month}-${year}-${random}`
}

export const createNewEntry = async () => {
    const id = await generateJournalId()
    const res = await fetch(new Request(createUrl('/api/journal'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
    }))

    if (res.ok) {
        const data = await res.json()
        return data.data
    }
}

export const deleteEntry = async (id: string) => {
    const res = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
    })
    return res.json()
}