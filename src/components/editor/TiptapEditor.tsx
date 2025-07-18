'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback, useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 p-4 rounded border text-sm font-mono',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded border',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content,
    immediatelyRender: false, // SSR 문제 해결
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // content prop이 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('링크 URL을 입력하세요:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full h-96 flex items-center justify-center border border-gray-300 rounded-lg">
        <div className="text-gray-500">에디터를 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      {/* 툴바 */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* 텍스트 포맷 */}
          <div className="flex items-center space-x-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded text-sm font-semibold ${
                editor.isActive('bold') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="굵게 (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded text-sm italic ${
                editor.isActive('italic') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="기울임 (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded text-sm font-mono ${
                editor.isActive('code') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="인라인 코드"
            >
              &lt;/&gt;
            </button>
          </div>

          {/* 제목 */}
          <div className="flex items-center space-x-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded text-sm font-bold ${
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="제목 1"
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded text-sm font-bold ${
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="제목 2"
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded text-sm font-bold ${
                editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="제목 3"
            >
              H3
            </button>
          </div>

          {/* 리스트 */}
          <div className="flex items-center space-x-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded text-sm ${
                editor.isActive('bulletList') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="불릿 리스트"
            >
              • 목록
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded text-sm ${
                editor.isActive('orderedList') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="숫자 리스트"
            >
              1. 목록
            </button>
          </div>

          {/* 기타 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={setLink}
              className={`p-2 rounded text-sm ${
                editor.isActive('link') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="링크"
            >
              🔗
            </button>
            <button
              onClick={addImage}
              className="p-2 rounded text-sm hover:bg-gray-200"
              title="이미지 추가"
            >
              🖼️
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded text-sm ${
                editor.isActive('codeBlock') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="코드 블록"
            >
              { }
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded text-sm ${
                editor.isActive('blockquote') ? 'bg-blue-200 text-blue-800' : 'hover:bg-gray-200'
              }`}
              title="인용문"
            >
              ""
            </button>
          </div>

          {/* 실행취소/다시실행 */}
          <div className="flex items-center space-x-1 border-l pl-2">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="실행취소 (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="다시실행 (Ctrl+Y)"
            >
              ↷
            </button>
          </div>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 focus:outline-none"
          placeholder={placeholder}
        />
      </div>

      {/* 상태바 */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>
            단어 수: {editor.storage.characterCount?.words() || 0} | 
            글자 수: {editor.storage.characterCount?.characters() || 0}
          </span>
          <span>
            Tip: 텍스트를 선택하고 툴바 버튼을 클릭하거나 단축키를 사용하세요
          </span>
        </div>
      </div>
    </div>
  );
}
