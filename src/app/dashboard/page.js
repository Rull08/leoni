'use client';
import Navbar from '@/components/menu';
import Board from '@/components/board';
import '@/app/globals.css';

export default function Home() {
  return (
    <div className="h-screen w-full bg-neutral-50 text-neutral-900">
      <Navbar />
      <main>
        <div className='container mx-auto px-96'>
          <Board />
        </div>
      </main>
    </div>
  );
}