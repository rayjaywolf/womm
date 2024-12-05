'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Toggle } from './ui/toggle'
import { cn } from '@/lib/utils'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Highlighter,
    Link as LinkIcon,
} from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    autoFocus?: boolean
}

const RichTextEditor = ({ content, onChange, placeholder = 'Write your thoughts here...', autoFocus = false }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing your thoughts...',
                emptyEditorClass: 'is-editor-empty',
                emptyNodeClass: 'is-empty',
                showOnlyWhenEditable: true,
                showOnlyCurrent: true,
            }),
            Highlight,
            Link,
            Underline,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none h-full px-5 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        autofocus: autoFocus,
        onCreate: ({ editor }) => {
            if (content) {
                editor.commands.focus('end')
            }
        },
    })

    if (!editor) return null

    return (
        <div className="relative h-full w-full">
            {editor && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{
                        duration: 100,
                        animation: 'fade',
                    }}
                    className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-md"
                >
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('strike')}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('highlight')}
                        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
                    >
                        <Highlighter className="h-4 w-4" />
                    </Toggle>

                    <div className="mx-1 w-px self-stretch bg-border" />

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                </BubbleMenu>
            )}
            <EditorContent editor={editor} className="h-full" />
        </div>
    )
}

export default RichTextEditor