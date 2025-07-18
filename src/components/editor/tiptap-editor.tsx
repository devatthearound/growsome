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
import { createLowlight } from 'lowlight'
import { useState, useCallback, useEffect, useRef } from 'react'
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
  Paperclip,
  Upload,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react'

// lowlight 인스턴스 생성
const lowlight = createLowlight()

// 주요 언어들 등록
async function setupLowlight() {
  try {
    const { common } = await import('lowlight')
    lowlight.register(common)
  } catch (error) {
    console.warn('Failed to load syntax highlighting languages:', error)
  }
}

// 오픈그래프 데이터 타입
interface OpenGraphData {
  title: string
  description: string
  image: string
  url: string
  siteName?: string
}

// 첨부파일 타입
interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  preview?: string
}

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  editable?: boolean
  placeholder?: string
  className?: string
  onFileUpload?: (file: File) => Promise<string> // 파일 업로드 콜백
  onOpenGraphFetch?: (url: string) => Promise<OpenGraphData> // 오픈그래프 데이터 fetching 콜백
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
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isLoadingOG, setIsLoadingOG] = useState(false)
  const [ogData, setOgData] = useState<OpenGraphData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // SSR 방지
  useEffect(() => {
    setIsClient(true)
    setupLowlight()
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 p-4 rounded-lg font-mono text-sm my-4',
        },
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
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
        placeholder,
      },
    },
  })

  // 파일 업로드 처리
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!onFileUpload) return

    for (const file of Array.from(files)) {
      try {
        const url = await onFileUpload(file)
        
        if (file.type.startsWith('image/')) {
          // 이미지인 경우 에디터에 직접 삽입
          editor?.chain().focus().setImage({ src: url }).run()
        } else {
          // 일반 파일인 경우 첨부파일 목록에 추가
          const newFile: AttachedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: url,
          }
          setAttachedFiles(prev => [...prev, newFile])
        }
      } catch (error) {
        console.error('File upload failed:', error)
        alert('파일 업로드에 실패했습니다.')
      }
    }
  }, [editor, onFileUpload])

  // 오픈그래프 데이터 가져오기
  const fetchOpenGraph = useCallback(async (url: string) => {
    if (!onOpenGraphFetch) return

    setIsLoadingOG(true)
    try {
      const data = await onOpenGraphFetch(url)
      setOgData(data)
    } catch (error) {
      console.error('OpenGraph fetch failed:', error)
    } finally {
      setIsLoadingOG(false)
    }
  }, [onOpenGraphFetch])

  // 링크 설정
  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setShowLinkDialog(true)
  }, [editor])

  const handleLinkSubmit = useCallback(async () => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      
      // URL이 http로 시작하면 오픈그래프 데이터 가져오기
      if (linkUrl.startsWith('http') && onOpenGraphFetch) {
        await fetchOpenGraph(linkUrl)
      }
    }

    setShowLinkDialog(false)
    setLinkUrl('')
  }, [editor, linkUrl, fetchOpenGraph, onOpenGraphFetch])

  // 파일 첨부 버튼 클릭
  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // 첨부파일 제거
  const removeAttachedFile = useCallback((fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId))
  }, [])

  // 현재 헤딩 레벨 가져오기
  const getCurrentHeading = () => {
    if (!editor) return '본문'
    
    if (editor.isActive('heading', { level: 1 })) return 'H1'
    if (editor.isActive('heading', { level: 2 })) return 'H2'
    if (editor.isActive('heading', { level: 3 })) return 'H3'
    if (editor.isActive('heading', { level: 4 })) return 'H4'
    if (editor.isActive('heading', { level: 5 })) return 'H5'
    if (editor.isActive('heading', { level: 6 })) return 'H6'
    
    return '본문'
  }

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // SSR 중이거나 에디터가 로드되지 않았으면 로딩 표시
  if (!isClient || !editor) {
    return (
      <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="animate-pulse bg-gray-50 rounded-lg h-96 flex items-center justify-center">
          <span className="text-gray-500">에디터를 로딩 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {editable && (
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 실행취소/다시실행 */}
            <div className="flex items-center">
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="실행 취소"
              >
                <Undo size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="다시 실행"
              >
                <Redo size={18} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 헤딩 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-200 rounded transition-colors min-w-[70px]"
                title="헤딩 스타일"
              >
                <span className="text-sm font-medium">{getCurrentHeading()}</span>
                <ChevronDown size={14} />
              </button>
              
              {showHeadingDropdown && (
                <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {[
                    { label: '본문', action: () => editor.chain().focus().setParagraph().run() },
                    { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
                    { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                    { label: 'H3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
                    { label: 'H4', action: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
                    { label: 'H5', action: () => editor.chain().focus().toggleHeading({ level: 5 }).run() },
                    { label: 'H6', action: () => editor.chain().focus().toggleHeading({ level: 6 }).run() },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action()
                        setShowHeadingDropdown(false)
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 리스트 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive('bulletList') ? 'bg-gray-200' : ''
                }`}
                title="순서 없는 목록"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive('orderedList') ? 'bg-gray-200' : ''
                }`}
                title="순서 있는 목록"
              >
                <ListOrdered size={18} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 인용문 */}
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                editor.isActive('blockquote') ? 'bg-gray-200' : ''
              }`}
              title="인용문"
            >
              <Quote size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 텍스트 스타일 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive('bold') ? 'bg-gray-200' : ''
                }`}
                title="굵게"
              >
                <Bold size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive('italic') ? 'bg-gray-200' : ''
                }`}
                title="기울임"
              >
                <Italic size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive('underline') ? 'bg-gray-200' : ''
                }`}
                title="밑줄"
              >
                <UnderlineIcon size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive('strike') ? 'bg-gray-200' : ''
                }`}
                title="취소선"
              >
                <Strikethrough size={18} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                editor.isActive('code') ? 'bg-gray-200' : ''
              }`}
              title="인라인 코드"
            >
              <Code size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              onClick={setLink}
              className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                editor.isActive('link') ? 'bg-gray-200' : ''
              }`}
              title="링크"
            >
              <LinkIcon size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 정렬 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
                }`}
                title="왼쪽 정렬"
              >
                <AlignLeft size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
                }`}
                title="가운데 정렬"
              >
                <AlignCenter size={18} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 hover:bg-gray-200 rounded transition-colors ${
                  editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
                }`}
                title="오른쪽 정렬"
              >
                <AlignRight size={18} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 첨부 및 미디어 */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleAttachClick}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="파일 첨부"
              >
                <Paperclip size={18} />
              </button>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
          </div>
        </div>
      )}

      {/* 첨부파일 목록 */}
      {attachedFiles.length > 0 && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">첨부파일</h4>
          <div className="space-y-2">
            {attachedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Paperclip size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeAttachedFile(file.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="파일 제거"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 오픈그래프 카드 */}
      {ogData && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex">
              {ogData.image && (
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={ogData.image}
                    alt={ogData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{ogData.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ogData.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ExternalLink size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{ogData.siteName || ogData.url}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOgData(null)}
                    className="ml-2 p-1 hover:bg-gray-100 rounded"
                    title="링크 미리보기 제거"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">링크 추가</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLinkSubmit()
                } else if (e.key === 'Escape') {
                  setShowLinkDialog(false)
                }
              }}
            />
            {isLoadingOG && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                링크 정보를 가져오는 중...
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={isLoadingOG}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      <EditorContent 
        editor={editor} 
        className="min-h-[400px]"
        onDrop={(e) => {
          e.preventDefault()
          const files = e.dataTransfer.files
          if (files.length > 0) {
            handleFileUpload(files)
          }
        }}
        onDragOver={(e) => e.preventDefault()}
      />
    </div>
  )
}

export default TiptapEditor