/**
 * 에디터 관련 API 서비스
 * 백엔드 개발자와 연동할 API 엔드포인트들
 */

// 업로드 응답 타입 정의
export interface UploadResponse {
  url: string
  fileName?: string
  fileSize?: number
  fileType?: string
}

export interface LinkPreviewResponse {
  title: string
  description: string
  image: string
  siteName?: string
  url: string
}

// S3 Presigned URL 응답 타입
export interface PresignedUrlResponse {
  presignedUrl: string
  publicUrl: string
  fileName: string
}

/**
 * 이미지 업로드 API
 * 백엔드에서 구현해야 할 엔드포인트: POST /api/upload/image
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // 방법 1: 직접 업로드 (백엔드에서 처리)
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Image upload failed')
    }
    
    const data: UploadResponse = await response.json()
    return data.url
    
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}

/**
 * Presigned URL을 이용한 이미지 업로드
 * 백엔드에서 구현해야 할 엔드포인트: POST /api/upload/presigned-url
 */
export async function uploadImageWithPresignedUrl(file: File): Promise<string> {
  try {
    // 1. Presigned URL 요청
    const presignedResponse = await fetch('/api/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadType: 'image'
      }),
    })
    
    if (!presignedResponse.ok) {
      throw new Error('Failed to get presigned URL')
    }
    
    const { presignedUrl, publicUrl }: PresignedUrlResponse = await presignedResponse.json()
    
    // 2. S3에 직접 업로드
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to S3')
    }
    
    return publicUrl
    
  } catch (error) {
    console.error('Presigned URL upload error:', error)
    throw error
  }
}

/**
 * 일반 파일 업로드 API
 * 백엔드에서 구현해야 할 엔드포인트: POST /api/upload/file
 */
export async function uploadFile(file: File): Promise<{ url: string; name: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload/file', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('File upload failed')
    }
    
    const data: UploadResponse = await response.json()
    return {
      url: data.url,
      name: data.fileName || file.name
    }
    
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

/**
 * 링크 미리보기 데이터 가져오기
 * 백엔드에서 구현해야 할 엔드포인트: POST /api/link-preview
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreviewResponse> {
  try {
    const response = await fetch('/api/link-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch link preview')
    }
    
    const data: LinkPreviewResponse = await response.json()
    return data
    
  } catch (error) {
    console.error('Link preview error:', error)
    throw error
  }
}

/**
 * 개발 중 테스트용 Mock 함수들
 * 실제 배포 시에는 제거하고 위의 실제 API 함수들을 사용
 */

// Mock 이미지 업로드 (개발용)
export async function mockUploadImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 로컬 이미지 URL 생성 (실제로는 S3 URL이 됨)
      const mockUrl = URL.createObjectURL(file)
      resolve(mockUrl)
    }, 1000) // 1초 지연으로 업로드 시뮬레이션
  })
}

// Mock 파일 업로드 (개발용)
export async function mockUploadFile(file: File): Promise<{ url: string; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: `https://example-bucket.s3.amazonaws.com/files/${file.name}`,
        name: file.name
      })
    }, 1500)
  })
}

// Mock 링크 미리보기 (개발용)
export async function mockFetchLinkPreview(url: string): Promise<LinkPreviewResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'Sample Article Title',
        description: 'This is a sample description for the link preview. It shows how the preview will look.',
        image: 'https://via.placeholder.com/300x200',
        siteName: 'Example Site',
        url
      })
    }, 800)
  })
}

// 환경에 따른 함수 선택
const isDevelopment = process.env.NODE_ENV === 'development'

export const editorApi = {
  uploadImage: isDevelopment ? mockUploadImage : uploadImage,
  uploadFile: isDevelopment ? mockUploadFile : uploadFile,
  fetchLinkPreview: isDevelopment ? mockFetchLinkPreview : fetchLinkPreview,
}
