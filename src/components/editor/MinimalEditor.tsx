'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'

interface MinimalEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

const MinimalEditor = ({ 
  content = '', 
  onChange, 
  placeholder = '내용을 입력하세요...'
}: MinimalEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 min-h-[300px]',
      },
    },
  })

  if (!isMounted || !editor) {
    return (
      <div className="border rounded-lg bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="text-gray-500">간단한 에디터 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* 최소한의 툴바 */}
      <div className="border-b p-2 flex gap-2 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          <Italic className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          H1
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* 에디터 */}
      <EditorContent editor={editor} />
      
      {/* 상태 */}
      <div className="border-t px-4 py-2 bg-gray-50 text-sm text-gray-600">
        글자 수: {editor.getText().length}
      </div>
    </div>
  )
}

export default MinimalEditor
