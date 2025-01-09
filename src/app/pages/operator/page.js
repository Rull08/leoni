'use client'
import Board from '@/components/board';
import '@/app/globals.css';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import { jwtDecode } from 'jwt-decode';
  
import Modal_endSession from '@/components/modal_endSession';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return true; 
  }
};


export default function Operator() {

  const router = useRouter();

  const [isOpenEndSession, setIsOpenEndSession] = useState(false);
  
  const navigation = [
    { name: 'Ubicaciones', href: '#', current: true },
    { name: 'Entradas', href: '#', current: false, modal:'entradas' },
    { name: 'Salidas', href: '#', current: false, modal: 'salidas' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('token');
            router.push('/login');
        }

        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (isTokenExpired(token)) {
                setIsOpenEndSession(true);  
                localStorage.removeItem('token');
            }
        }, 10000);
        return() => clearInterval(interval);

    }, [router]);

  const handleCloseModal = async () => {
    setIsOpenEndSession(false);  
    router.push('/login');
  }

  return (
    <>
        {isOpenEndSession && (<Modal_endSession handleCloseModal={handleCloseModal} />)}
        <Board />
    </>
  );
}