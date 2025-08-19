import React, { ComponentType, useEffect, useRef } from 'react';
import { useEnhancedGA4 } from '../../hooks/useEnhancedGA4';

interface TrackingProps {
  trackingName?: string;
  trackingCategory?: string;
  trackingData?: Record<string, any>;
}

// 클릭 이벤트 자동 추적 HOC
export function withClickTracking<P extends object>(
  WrappedComponent: ComponentType<P>,
  defaultTrackingName?: string
) {
  return function TrackedComponent(props: P & TrackingProps) {
    const { trackClick } = useEnhancedGA4();
    const { trackingName, trackingCategory, trackingData, ...otherProps } = props;

    const handleClick = (event: React.MouseEvent) => {
      const elementName = trackingName || defaultTrackingName || 'unknown_element';
      const category = trackingCategory || 'ui_interaction';
      
      trackClick(elementName, 'button', undefined, {
        element_text: (event.target as HTMLElement).textContent,
        ...trackingData
      });

      // 원래 onClick 이벤트가 있다면 실행
      if ('onClick' in otherProps && typeof otherProps.onClick === 'function') {
        (otherProps.onClick as (event: React.MouseEvent) => void)(event);
      }
    };

    return (
      <WrappedComponent 
        {...(otherProps as P)} 
        onClick={handleClick}
      />
    );
  };
}

// 폼 추적 HOC
export function withFormTracking<P extends object>(
  WrappedComponent: ComponentType<P>,
  formName: string
) {
  return function TrackedForm(props: P) {
    const { trackFormStart, trackFormSubmit, trackFormError } = useEnhancedGA4();
    const formStartTracked = useRef(false);

    const handleFocus = () => {
      if (!formStartTracked.current) {
        trackFormStart(formName);
        formStartTracked.current = true;
      }
    };

    const handleSubmit = (event: React.FormEvent) => {
      trackFormSubmit(formName);
      
      // 원래 onSubmit 이벤트가 있다면 실행
      if ('onSubmit' in props && typeof props.onSubmit === 'function') {
        (props.onSubmit as (event: React.FormEvent) => void)(event);
      }
    };

    const handleError = (fieldName: string, errorMessage: string) => {
      trackFormError(formName, fieldName, errorMessage);
    };

    return (
      <div onFocus={handleFocus}>
        <WrappedComponent 
          {...props} 
          onSubmit={handleSubmit}
          onError={handleError}
        />
      </div>
    );
  };
}

// 뷰포트 진입 시 추적 HOC
export function withVisibilityTracking<P extends object>(
  WrappedComponent: ComponentType<P>,
  trackingName: string
) {
  return function VisibilityTrackedComponent(props: P) {
    const { trackCustomEvent } = useEnhancedGA4();
    const ref = useRef<HTMLDivElement>(null);
    const hasTracked = useRef(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTracked.current) {
              trackCustomEvent('element_viewed', {
                element_name: trackingName,
                intersection_ratio: entry.intersectionRatio,
                viewport_height: window.innerHeight,
                element_position: entry.boundingClientRect.top
              });
              hasTracked.current = true;
            }
          });
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, [trackCustomEvent, trackingName]);

    return (
      <div ref={ref}>
        <WrappedComponent {...props} />
      </div>
    );
  };
}
