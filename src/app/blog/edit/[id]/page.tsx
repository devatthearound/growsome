'use client'

import { useParams } from 'next/navigation'
import BlogWriter from '@/components/blog/blog-writer'

export default function EditPage() {
  const params = useParams()
  const contentId = parseInt(params.id as string)

  return <BlogWriter contentId={contentId} mode="edit" />
}
