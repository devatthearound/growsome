'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function Hero() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const floatImages = document.querySelectorAll('.float-img')
      const mouseX = e.clientX
      const mouseY = e.clientY
      
      floatImages.forEach((image) => {
        const speed = image.getAttribute('data-speed')
        const x = (window.innerWidth - mouseX * Number(speed)) / 100
        const y = (window.innerHeight - mouseY * Number(speed)) / 100
        
        ;(image as HTMLElement).style.transform = `translateX(${x}px) translateY(${y}px)`
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="floating-images">
          <Image 
            src="/images/ai-agent1.png"
            alt=""
            width={200}
            height={200}
            className="float-img"
            data-speed="2"
          />
          <Image 
            src="/images/ai-agent2.png"
            alt=""
            width={180}
            height={180}
            className="float-img"
            data-speed="-2"
          />
          <Image 
            src="/images/ai-agent3.png"
            alt=""
            width={150}
            height={150}
            className="float-img"
            data-speed="1"
          />
        </div>
        <h1 className="hero-title">
          <span className="line">AI로</span>
          <span className="line">똑똑하게,</span>
          <span className="line accent-line">창의적으로</span>
        </h1>
        <p className="hero-subtitle">우리는 문제를 해결합니다</p>
        <div className="ai-agents">
          <div className="agent-profiles">
            <div className="agent-profile">
              <div className="agent-avatar">
                <div className="status-dot"></div>
              </div>
              <span>AI Agent 001</span>
            </div>
            <div className="agent-profile">
              <div className="agent-avatar">
                <div className="status-dot"></div>
              </div>
              <span>AI Agent 002</span>
            </div>
          </div>
          <p className="agent-status">AI 직원들이 24/7 대기중입니다</p>
        </div>
      </div>
    </section>
  )
} 