'use client'

import { updateEntry } from '@/util/api'
import { useState } from 'react'
import { Autosave, useAutosave } from 'react-autosave'

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content)
  const [isLoading, setIsLoading] = useState(false)
  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true)
      const updated = await updateEntry(entry.id, _value)
      setIsLoading(false)
    },
  })

  return (
    <div className="w-full h-full">
      {isLoading && <div>...loading</div>}
      <textarea
        value={value}
        className="w-full h-full p-8 text-xl outline-none"
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
    </div>
  )
}

export default Editor
