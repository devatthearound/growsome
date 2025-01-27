import Header from '@/src/components/Header'
import Hero from '@/src/components/Hero'
import Works from '@/src/components/Works'
import Youtube from '@/src/components/Youtube'
import Store from '@/src/components/Store'
import Blog from '@/src/components/Blog'
import Contact from '@/src/components/Contact'
import Footer from '@/src/components/Footer'
import KakaoButton from '@/src/components/KakaoButton'
import SubscribePopup from '@/src/components/SubscribePopup'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Works />
        <Youtube />
        <Store />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <KakaoButton />
      <SubscribePopup />
    </>
  )
} 