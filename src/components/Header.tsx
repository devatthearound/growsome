'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden'
  }

  return (
    <header>
      <nav>
        <div className="logo">Growsome</div>
        <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link href="#about">About</Link></li>
            <li><Link href="#services">Services</Link></li>
            <li><Link href="#works">Projects</Link></li>
            <li><Link href="#store">Store</Link></li>
            <li><Link href="#blog">Blog</Link></li>
            <li><Link href="#courses">Class</Link></li>
          </ul>
          <button 
            className="subscribe-btn" 
            onClick={() => document.dispatchEvent(new Event('openSubscribe'))}
          >
            <i className="far fa-envelope" />
            구독하기
          </button>
        </div>
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className="fas fa-bars" />
        </button>
      </nav>
    </header>
  )
} 