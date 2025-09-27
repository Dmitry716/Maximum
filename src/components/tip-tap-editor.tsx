'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const TiptapEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Подробное описание...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] max-h-[400px] overflow-y-auto p-2 border border-gray-300 rounded-md focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <EditorContent
      editor={editor}
    />
  )
}
