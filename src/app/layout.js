'use client'
import '@/../static/css/input.css'
import Navbar from '@/components/menu'

import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" className='h-full'>
        <body className='h-full  bg-white text-blue-700'>
          {pathname !== '/login' && <Navbar /> }
          <main>{children}</main>  
        </body>
    </html>
  )
}