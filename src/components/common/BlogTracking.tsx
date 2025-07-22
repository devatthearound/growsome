'use client'

import { useEffect, useRef, useCallback } from 'react';
import { useEnhancedGA4 } from '../../hooks/useEnhancedGA4';

interface BlogTrackingProps {
  blogId: string;
  blogTitle: string;
  blogCategory?: string;
  author?: string;
  publishDate?: string;
  readingTime?: number; // 예상 읽기 시간 (분)
}

export function BlogTracking({ 
  blogId, 
  blogTitle, 
  blogCategory, 
  author, 
  publishDate, 
  readingTime 
}: BlogTrackingProps) {
  const { trackContentInteraction, trackCustomEvent } = useEnhancedGA4();
  
  const startTime = useRef<number>(Date.now());
  const scrollMilestones = useRef<Set<number>>(new Set());
  const hasTrackedView = useRef<boolean>(false);

  // 블로그 조회 추적
  useEffect(() => {
    if (!hasTrackedView.current) {
      trackContentInteraction('blog', 'view', blogId, blogTitle);
      
      trackCustomEvent('blog_view_detail', {
        blog_id: blogId,
        blog_title: blogTitle,
        blog_category: blogCategory || 'uncategorized',
        author: author || 'unknown',
        publish_date: publishDate,
        estimated_reading_time: readingTime
      });
      
      hasTrackedView.current = true;
    }
  }, [blogId, blogTitle, blogCategory, author, publishDate, readingTime, trackContentInteraction, trackCustomEvent]);

  // 읽기 진행도 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // 25%, 50%, 75%, 100% 지점에서 추적
      [25, 50, 75, 100].forEach(milestone => {
        if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          
          trackCustomEvent('blog_reading_progress', {
            blog_id: blogId,
            blog_title: blogTitle,
            progress_percentage: milestone,
            time_spent: Math.round((Date.now() - startTime.current) / 1000)
          });

          // 완전히 읽은 경우
          if (milestone === 100) {
            const totalTimeSpent = Math.round((Date.now() - startTime.current) / 1000);
            trackCustomEvent('blog_read_complete', {
              blog_id: blogId,
              blog_title: blogTitle,
              total_reading_time: totalTimeSpent,
              estimated_vs_actual: readingTime ? totalTimeSpent / (readingTime * 60) : null
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blogId, blogTitle, readingTime, trackCustomEvent]);

  // 페이지 이탈 시 읽기 시간 추적
  useEffect(() => {
    const handleBeforeUnload = () => {
      const totalTimeSpent = Math.round((Date.now() - startTime.current) / 1000);
      
      if (totalTimeSpent > 10) { // 10초 이상 머문 경우만
        const maxScrollReached = Math.max(...Array.from(scrollMilestones.current), 0);
        
        trackCustomEvent('blog_reading_session_end', {
          blog_id: blogId,
          blog_title: blogTitle,
          session_duration: totalTimeSpent,
          max_scroll_reached: maxScrollReached,
          reading_completion: maxScrollReached >= 75 ? 'completed' : 'partial'
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [blogId, blogTitle, trackCustomEvent]);

  return null;
}

// 블로그 상호작용 추적을 위한 유틸리티 함수들
export const useBlogInteractions = (blogId: string, blogTitle: string) => {
  const { trackContentInteraction, trackCustomEvent } = useEnhancedGA4();

  const trackBlogShare = useCallback((platform: string) => {
    trackContentInteraction('blog', 'share', blogId, blogTitle);
    trackCustomEvent('blog_share', {
      blog_id: blogId,
      blog_title: blogTitle,
      share_platform: platform
    });
  }, [blogId, blogTitle, trackContentInteraction, trackCustomEvent]);

  const trackBlogLike = useCallback(() => {
    trackContentInteraction('blog', 'like', blogId, blogTitle);
    trackCustomEvent('blog_like', {
      blog_id: blogId,
      blog_title: blogTitle
    });
  }, [blogId, blogTitle, trackContentInteraction, trackCustomEvent]);

  const trackBlogComment = useCallback((commentLength?: number) => {
    trackContentInteraction('blog', 'comment', blogId, blogTitle);
    trackCustomEvent('blog_comment', {
      blog_id: blogId,
      blog_title: blogTitle,
      comment_length: commentLength
    });
  }, [blogId, blogTitle, trackContentInteraction, trackCustomEvent]);

  const trackRelatedBlogClick = useCallback((relatedBlogId: string, relatedBlogTitle: string) => {
    trackCustomEvent('blog_related_click', {
      source_blog_id: blogId,
      source_blog_title: blogTitle,
      target_blog_id: relatedBlogId,
      target_blog_title: relatedBlogTitle
    });
  }, [blogId, blogTitle, trackCustomEvent]);

  const trackBlogSearch = useCallback((searchTerm: string) => {
    trackCustomEvent('blog_search', {
      search_term: searchTerm,
      source_blog_id: blogId,
      source_blog_title: blogTitle
    });
  }, [blogId, blogTitle, trackCustomEvent]);

  return {
    trackBlogShare,
    trackBlogLike,
    trackBlogComment,
    trackRelatedBlogClick,
    trackBlogSearch
  };
};
