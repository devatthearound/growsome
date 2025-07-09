'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { createLowlight } from 'lowlight';
import { useCallback, useState } from 'react';

// 코드 하이라이팅을 위한 언어들
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';

// lowlight 인스턴스 생성
const lowlight = createLowlight();

// 언어 등록
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', html);
lowlight.register('python', python);
lowlight.register('json', json);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// 툴바 버튼 컴포넌트
const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title 
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      flex items-center justify-center w-8 h-8 rounded transition-all duration-200
      ${isActive 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
      border border-gray-200 hover:border-gray-300
    `}
  >
    {children}
  </button>
);

// 헤딩 선택 드롭다운
const HeadingDropdown = ({ editor }: { editor: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const headingOptions = [
    { level: 0, label: 'Paragraph', command: () => editor.chain().focus().setParagraph().run() },
    { level: 1, label: 'Heading 1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { level: 2, label: 'Heading 2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { level: 3, label: 'Heading 3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { level: 4, label: 'Heading 4', command: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
    { level: 5, label: 'Heading 5', command: () => editor.chain().focus().toggleHeading({ level: 5 }).run() },
    { level: 6, label: 'Heading 6', command: () => editor.chain().focus().toggleHeading({ level: 6 }).run() },
  ];

  const currentHeading = headingOptions.find(option => 
    option.level === 0 ? !editor.isActive('heading') : editor.isActive('heading', { level: option.level })
  ) || headingOptions[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium">{currentHeading.label}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {headingOptions.map((option) => (
            <button
              key={option.level}
              onClick={() => {
                option.command();
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg
                ${currentHeading.level === option.level ? 'bg-gray-100' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Add 버튼 드롭다운
const AddDropdown = ({ editor }: { editor: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addOptions = [
    {
      label: '이미지',
      icon: '🖼️',
      command: () => {
        const url = window.prompt('이미지 URL을 입력하세요:');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    },
    {
      label: '테이블',
      icon: '📊',
      command: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
    {
      label: '구분선',
      icon: '―',
      command: () => editor.chain().focus().setHorizontalRule().run()
    },
    {
      label: '코드 블록',
      icon: '{ }',
      command: () => editor.chain().focus().toggleCodeBlock().run()
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 h-8 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium">Add</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {addOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.command();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 메인 툴바
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('링크 URL을 입력하세요:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 flex-wrap">
      {/* 실행 취소/다시 실행 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="실행 취소"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="다시 실행"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* 헤딩 선택 */}
      <HeadingDropdown editor={editor} />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* 텍스트 포맷팅 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="굵게"
      >
        <strong className="font-bold">B</strong>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="기울임"
      >
        <em className="italic">I</em>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="밑줄"
      >
        <u className="underline">U</u>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="취소선"
      >
        <s className="line-through">S</s>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="인라인 코드"
      >
        <span className="font-mono">&lt;&gt;</span>
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* 목록 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="불릿 목록"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="번호 목록"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7M9 5l7 7-7 7" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        title="체크 목록"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* 정렬 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="왼쪽 정렬"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h9M4 10h9M4 14h5M4 18h5" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="가운데 정렬"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h10M9 10h6M7 14h10M9 18h6" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="오른쪽 정렬"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 6h9M13 10h7M11 14h9M13 18h7" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* 링크 */}
      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        title="링크"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Add 드롭다운 */}
      <AddDropdown editor={editor} />
    </div>
  );
};

// 링크 버블 메뉴
const LinkBubbleMenu = ({ editor }: { editor: any }) => {
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setIsEditing(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsEditing(false);
  };

  const linkAttributes = editor.getAttributes('link');
  const currentUrl = linkAttributes?.href || '';

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => {
        return editor?.isActive?.('link') || false;
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-2"
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
              if (e.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            placeholder="URL을 입력하세요"
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            autoFocus
          />
          <button
            onClick={setLink}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 max-w-xs truncate"
          >
            {currentUrl}
          </a>
          <button
            onClick={() => {
              setUrl(currentUrl);
              setIsEditing(true);
            }}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="링크 편집"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={removeLink}
            className="p-1 text-red-500 hover:text-red-700"
            title="링크 제거"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </BubbleMenu>
  );
};

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto',
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
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none mx-auto focus:outline-none px-6 py-4',
      },
    },
  });

  // 에디터가 로드되지 않았을 때 로딩 표시
  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="animate-pulse flex space-x-2">
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="min-h-[400px] p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <Toolbar editor={editor} />
      <LinkBubbleMenu editor={editor} />
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
      
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          line-height: 1.6;
        }

        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
          color: #111827;
        }

        .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 1.5rem 0 0.75rem 0;
          color: #111827;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.25rem 0 0.5rem 0;
          color: #111827;
        }

        .ProseMirror h4 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
          color: #111827;
        }

        .ProseMirror h5 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0.75rem 0 0.25rem 0;
          color: #111827;
        }

        .ProseMirror h6 {
          font-size: 1rem;
          font-weight: bold;
          margin: 0.5rem 0 0.25rem 0;
          color: #111827;
        }

        .ProseMirror p {
          margin: 0.75rem 0;
          color: #374151;
        }

        .ProseMirror ul, .ProseMirror ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
        }

        .ProseMirror code {
          background: #f3f4f6;
          color: #ef4444;
          padding: 0.125rem 0.25rem;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .ProseMirror pre {
          margin: 1rem 0;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
        }

        .ProseMirror td, .ProseMirror th {
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          text-align: left;
        }

        .ProseMirror th {
          background: #f9fafb;
          font-weight: bold;
        }

        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
        }

        .ProseMirror ul[data-type="taskList"] li input[type="checkbox"] {
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }

        .ProseMirror mark {
          background: #fef08a;
          padding: 0.125rem 0.25rem;
          border-radius: 4px;
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder || '내용을 입력하세요...'}";
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror:focus-within {
          outline: none;
        }
      `}</style>
    </div>
  );
}
