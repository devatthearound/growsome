'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';

export default function ExcelToJsonPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* 상단 네비게이션 */}
      <div className="bg-[#514fe4] text-white p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/tools" 
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Tools로 돌아가기</span>
          </Link>
          <div className="text-gray-300">|</div>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Growsome</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-medium">Excel to JSON 변환기</span>
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            운영중
          </span>
        </div>
      </div>
      
      {/* 메인 컨텐츠 - Excel to JSON 도구 임베드 */}
      <div className="flex-1 relative">
        <iframe 
          src="/tools-static/excel-to-json/index.html" 
          className="w-full h-full border-0"
          title="Excel to JSON Converter"
          style={{ height: 'calc(100vh - 64px)' }}
        />
        
        {/* 로딩 오버레이 (선택사항) */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center pointer-events-none opacity-0 transition-opacity">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#514fe4] mx-auto mb-4"></div>
            <p className="text-gray-600">도구를 로딩 중...</p>
          </div>
        </div>
      </div>
      
      {/* 하단 정보 (선택사항) */}
      <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
        <div>
          💡 Excel/CSV 파일을 드래그하여 JSON으로 변환하세요
        </div>
        <div>
          Powered by Growsome
        </div>
      </div>
    </div>
  );
}
