'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Camera, AlertCircle, CheckCircle, Clock, Download, Upload, ExternalLink } from 'lucide-react';

interface QAIssue {
  id: number;
  issueNumber: string;
  url: string;
  page?: string;
  location: string;
  category: 'error' | 'not_applied' | 'request';
  description: string;
  status: 'open' | 'in_progress' | 'fixed' | 'confirmed';
  priority: 'P1' | 'P2' | 'P3';
  assignee?: string;
  createdBy: string;
  screenshotUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function QAPage() {
  const [issues, setIssues] = useState<QAIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIssue, setNewIssue] = useState({
    url: '',
    page: '',
    location: '',
    category: 'error' as const,
    description: '',
    priority: 'P2' as const,
    assignee: '',
    createdBy: 'wepick'
  });

  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    assignee: 'all'
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 데이터 로드
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/admin/qa/issues');
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    open: 'bg-red-100 text-red-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    fixed: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800'
  };

  const categoryColors = {
    error: 'bg-red-50 text-red-700 border-red-200',
    not_applied: 'bg-orange-50 text-orange-700 border-orange-200',
    request: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const priorityColors = {
    P1: 'bg-red-500 text-white',
    P2: 'bg-yellow-500 text-white',
    P3: 'bg-green-500 text-white'
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filter.status === 'all' || issue.status === filter.status;
    const matchesCategory = filter.category === 'all' || issue.category === filter.category;
    const matchesPriority = filter.priority === 'all' || issue.priority === filter.priority;
    const matchesAssignee = filter.assignee === 'all' || issue.assignee === filter.assignee;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesAssignee;
  });

  const handleAddIssue = async () => {
    try {
      let screenshotUrl = '';
      if (selectedFile) {
        screenshotUrl = await uploadScreenshot(selectedFile);
      }
      
      const response = await fetch('/api/admin/qa/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newIssue,
          screenshotUrl
        })
      });

      if (response.ok) {
        await fetchIssues();
        setNewIssue({
          url: '',
          page: '',
          location: '',
          category: 'error',
          description: '',
          priority: 'P2',
          assignee: '',
          createdBy: 'wepick'
        });
        setSelectedFile(null);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  const handleStatusChange = async (issueId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/qa/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchIssues();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const uploadScreenshot = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('screenshot', file);
    
    const response = await fetch('/api/admin/qa/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.url;
    }
    return '';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'URL', 'Page', 'Location', 'Category', 'Description', 'Status', 'Priority', 'Assignee', 'Created By', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredIssues.map(issue => [
        issue.issueNumber,
        issue.url,
        issue.page || '',
        issue.location,
        issue.category,
        `"${issue.description}"`,
        issue.status,
        issue.priority,
        issue.assignee || '',
        issue.createdBy,
        new Date(issue.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusCounts = () => {
    return {
      total: issues.length,
      open: issues.filter(i => i.status === 'open').length,
      in_progress: issues.filter(i => i.status === 'in_progress').length,
      fixed: issues.filter(i => i.status === 'fixed').length,
      confirmed: issues.filter(i => i.status === 'confirmed').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">QA 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎯 QA 관리 시스템</h1>
              <p className="text-gray-600 mt-1">클라이언트와 함께하는 체계적인 QA 관리</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV 내보내기
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                새 이슈 등록
              </button>
            </div>
          </div>

          {/* Status Dashboard */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
              <div className="text-sm text-gray-600">전체</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.open}</div>
              <div className="text-sm text-red-600">Open</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.in_progress}</div>
              <div className="text-sm text-yellow-600">진행중</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.fixed}</div>
              <div className="text-sm text-blue-600">수정완료</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</div>
              <div className="text-sm text-green-600">확인완료</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="URL, 위치, 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select 
              value={filter.status} 
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 상태</option>
              <option value="open">Open</option>
              <option value="in_progress">진행중</option>
              <option value="fixed">수정완료</option>
              <option value="confirmed">확인완료</option>
            </select>

            <select 
              value={filter.category} 
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 분류</option>
              <option value="error">오류</option>
              <option value="not_applied">미적용</option>
              <option value="request">요청</option>
            </select>

            <select 
              value={filter.priority} 
              onChange={(e) => setFilter({...filter, priority: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 우선순위</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">QA 이슈 목록 ({filteredIssues.length}개)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL/페이지</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">위치</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분류</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">우선순위</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {issue.issueNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{issue.url}</div>
                      {issue.page && <div className="text-xs text-gray-500">{issue.page}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${categoryColors[issue.category]}`}>
                        {issue.category === 'error' ? '오류' : issue.category === 'not_applied' ? '미적용' : '요청'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {issue.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColors[issue.status]} border-0 bg-transparent`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">진행중</option>
                        <option value="fixed">수정완료</option>
                        <option value="confirmed">확인완료</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${priorityColors[issue.priority]}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.assignee || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {issue.screenshotUrl && (
                          <button 
                            onClick={() => window.open(issue.screenshotUrl, '_blank')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => window.open(issue.url, '_blank')}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Issue Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">새 QA 이슈 등록</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input
                    type="text"
                    value={newIssue.url}
                    onChange={(e) => setNewIssue({...newIssue, url: e.target.value})}
                    placeholder="/signup/step2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">페이지명</label>
                  <input
                    type="text"
                    value={newIssue.page}
                    onChange={(e) => setNewIssue({...newIssue, page: e.target.value})}
                    placeholder="회원가입 - 비밀번호 입력"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위치 *</label>
                  <input
                    type="text"
                    value={newIssue.location}
                    onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
                    placeholder="하단 비밀번호 필드"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">분류 *</label>
                  <select
                    value={newIssue.category}
                    onChange={(e) => setNewIssue({...newIssue, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="error">오류</option>
                    <option value="not_applied">미적용</option>
                    <option value="request">요청</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명 *</label>
                  <textarea
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                    placeholder="문제에 대한 상세 설명을 입력하세요"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                    <select
                      value={newIssue.priority}
                      onChange={(e) => setNewIssue({...newIssue, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="P1">P1 (높음)</option>
                      <option value="P2">P2 (보통)</option>
                      <option value="P3">P3 (낮음)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                    <input
                      type="text"
                      value={newIssue.assignee}
                      onChange={(e) => setNewIssue({...newIssue, assignee: e.target.value})}
                      placeholder="dev.jin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">스크린샷</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      파일 선택
                    </label>
                    {selectedFile && (
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddIssue}
                  disabled={!newIssue.url || !newIssue.location || !newIssue.description}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}