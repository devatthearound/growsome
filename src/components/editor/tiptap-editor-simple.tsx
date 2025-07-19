'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useState, useCallback, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckSquare,
  Table as TableIcon
} from 'lucide-react'

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  editable?: boolean
  placeholder?: string
  className?: string
  onFileUpload?: (file: File) => Promise<string>
  onOpenGraphFetch?: (url: string) => Promise<any>
}

const TiptapEditor = ({ 
  content = '', 
  onChange, 
  editable = true, 
  placeholder = '내용을 입력하세요...',
  className = '',
  onFileUpload,
  onOpenGraphFetch
}: TiptapEditorProps) => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const editor = useEditor({
    immediatelyRender: false, // SSR 문제 해결
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  const addImage = useCallback(async () => {
    if (!editor) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (onFileUpload) {
        try {
          const url = await onFileUpload(file)
          editor.chain().focus().setImage({ src: url }).run()
        } catch (error) {
          console.error('Image upload failed:', error)
          alert('이미지 업로드에 실패했습니다.')
        }
      } else {
        const url = URL.createObjectURL(file)
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
    
    input.click()
  }, [editor, onFileUpload])

  const addLink = useCallback(() => {
    if (!editor) return

    const url = window.prompt('링크 URL을 입력하세요:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!isClient || !editor) {
    return (
      <div className={`border rounded-lg bg-gray-50 min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-gray-500">에디터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* 간소화된 툴바 */}
      <div className="border-b p-3 flex flex-wrap gap-1 bg-gray-50">
        {/* 텍스트 포맷팅 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* 목록 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
        >
          <CheckSquare className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* 테이블 */}
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded hover:bg-gray-200"
        >
          <TableIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* 미디어 */}
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* 실행 취소/다시 실행 */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <Undo className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* 에디터 콘텐츠 */}
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] prose max-w-none p-4"
      />
    </div>
  )
}

export default TiptapEditor
