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

export const createNewEntry = async () => {
    const res = await fetch(new Request(createUrl('/api/journal'), {
        method: 'POST',
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