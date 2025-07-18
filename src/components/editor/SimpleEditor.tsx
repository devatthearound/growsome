'use client';

import { useState, useEffect } from 'react';

interface SimpleEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SimpleEditor({ content, onChange, placeholder }: SimpleEditorProps) {
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* 간단한 툴바 */}
        <div className="bg-gray-50 border-b border-gray-300 p-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📝 간단한 에디터 (Markdown 지원)</span>
          </div>
        </div>
        
        {/* 에디터 영역 */}
        <textarea
          value={editorContent}
          onChange={handleChange}
          placeholder={placeholder || '내용을 입력하세요...'}
          className="w-full h-96 p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed"
          style={{ minHeight: '400px' }}
        />
      </div>
      
      {/* 도움말 */}
      <div className="mt-2 text-xs text-gray-500">
        <p>Markdown 문법을 사용할 수 있습니다:</p>
        <div className="flex space-x-4 mt-1">
          <span># 제목</span>
          <span>**굵게**</span>
          <span>*기울임*</span>
          <span>`코드`</span>
          <span>[링크](url)</span>
        </div>
      </div>
    </div>
  );
}
