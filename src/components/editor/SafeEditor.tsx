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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import YouTube from '@tiptap/extension-youtube'

// Fix for lowlight v3+ import
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

// Create lowlight instance
const lowlight = createLowlight()

// Register languages
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('json', json)
lowlight.register('bash', bash)

import { useState, useCallback, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckSquare,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Palette,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Video,
  Youtube
} from 'lucide-react'

interface SafeEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  onFileUpload?: (file: File) => Promise<string>
}

const SafeEditor = ({ 
  content = '', 
  onChange, 
  placeholder = '내용을 입력하세요...',
  className = '',
  onFileUpload
}: SafeEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ]

  const highlightColors = [
    '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#90EE90', '#FFB6C1', '#DDA0DD'
  ]
  
  // 컴포넌트가 완전히 마운트된 후에만 에디터 렌더링
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    immediatelyRender: false, // SSR 문제 해결
    extensions: [
      StarterKit.configure({
        // 기본 확장만 사용하여 안정성 확보
        heading: {
          levels: [1, 2, 3],
        },
        // 기본 codeBlock을 비활성화하여 CodeBlockLowlight와 충돌 방지
        codeBlock: false,
      }),
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
      // 새로 추가된 확장들
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Color.configure({ types: [TextStyle.name, 'listItem'] }),
      TextStyle.configure(),
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      YouTube.configure({
        width: 640,
        height: 480,
      }),
    ],
    content,
    editable: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
        'data-placeholder': placeholder,
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

  const addYouTube = useCallback(() => {
    if (!editor) return

    const url = window.prompt('YouTube URL을 입력하세요:')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }, [editor])

  // 마운트되지 않았거나 에디터가 없으면 로딩 표시
  if (!isMounted || !editor) {
    return (
      <div className={`border rounded-lg bg-gray-50 min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-gray-500">에디터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* 툴바 */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50">
        {/* 텍스트 포맷팅 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="밑줄"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
          title="인라인 코드"
        >
          <Code className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('superscript') ? 'bg-gray-200' : ''}`}
          title="상첨자"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('subscript') ? 'bg-gray-200' : ''}`}
          title="하첨자"
        >
          <SubscriptIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 코드 블록 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          title="코드 블록"
        >
          <Code className="h-4 w-4" />
        </button>

        {/* 색상 선택기 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="텍스트 색상"
          >
            <Palette className="h-4 w-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 z-50 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-7 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run()
                    setShowColorPicker(false)
                  }}
                />
              ))}
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-300 bg-white hover:scale-110 transition-transform"
                onClick={() => {
                  editor.chain().focus().unsetColor().run()
                  setShowColorPicker(false)
                }}
                title="색상 제거"
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        {/* 하이라이트 선택기 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="하이라이트"
          >
            <Highlighter className="h-4 w-4" />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 z-50 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run()
                    setShowHighlightPicker(false)
                  }}
                />
              ))}
              <button
                type="button"
                className="w-6 h-6 rounded border border-gray-300 bg-white hover:scale-110 transition-transform"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run()
                  setShowHighlightPicker(false)
                }}
                title="하이라이트 제거"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* 제목 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="제목 1"
        >
          H1
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="제목 2"
        >
          H2
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
          title="제목 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 목록 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="순서 없는 목록"
        >
          <List className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="순서 있는 목록"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
          title="할 일 목록"
        >
          <CheckSquare className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 인용구 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="인용구"
        >
          <Quote className="h-4 w-4" />
        </button>

        {/* 테이블 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="테이블 삽입"
        >
          <TableIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 미디어 */}
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="이미지 추가"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="링크 추가"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={addYouTube}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="YouTube 비디오 추가"
        >
          <Youtube className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 실행 취소/다시 실행 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="실행 취소"
        >
          <Undo className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="다시 실행"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* 에디터 콘텐츠 */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="min-h-[400px] prose max-w-none p-4 focus:outline-none"
        />
        
        {/* Placeholder */}
        {editor.isEmpty && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
      
      {/* 상태바 */}
      <div className="border-t px-4 py-2 bg-gray-50 text-sm text-gray-600 flex justify-between">
        <div>
          글자 수: {editor.storage.characterCount?.characters() || content.replace(/<[^>]*>/g, '').length || 0}
        </div>
        <div className="flex gap-4 text-xs">
          {editor.isActive('table') && (
            <span className="text-blue-600">테이블 편집 모드</span>
          )}
          {editor.isActive('codeBlock') && (
            <span className="text-green-600">코드 블록 모드</span>
          )}
          {editor.getAttributes('youtube').src && (
            <span className="text-red-600">YouTube 비디오</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SafeEditor