import type { Metadata } from 'next'
// import localFont from 'next/font/local'
// import '@fortawesome/fontawesome-free/css/all.min.css'
import './globals.css'

// const pretendard = localFont({ 
//   src: [
//     {
//       path: './fonts/Pretendard-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Pretendard-Medium.woff2', 
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Pretendard-Bold.woff2',
//       weight: '700', 
//       style: 'normal',
//     }
//   ],
//   variable: '--font-pretendard'
// })

export const metadata: Metadata = {
  title: 'AI 에이전시 - Growsome',
  description: 'AI로 똑똑하게, 창의적으로 문제를 해결하는 에이전시',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body 
    //   className={pretendard.variable}
      >
        {children}
      </body>
    </html>
  )
} 