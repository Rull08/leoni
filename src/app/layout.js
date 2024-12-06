import '@/../static/css/input.css'
import Navbar from '@/components/menu'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='h-full bg-white'>
        <body className='h-full'>
        <Navbar />
          {children}
        </body>
    </html>
  )
}