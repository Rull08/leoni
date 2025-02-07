'use client'
import '@/app/globals.css';
import AdminGrid from '@/components/adminGrid';
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

export default function Admin(){

    const router = useRouter();

    const [isOpenEndSession, setIsOpenEndSession] = useState(false);

    useEffect(() => {
        
        const token = localStorage.getItem('token');
        if (!token || typeof token !== 'string' || token.trim() === '') {
          localStorage.removeItem('token');
          router.push('/login');
          return; 
        }

        
        const interval = setInterval(() => {
          try {
            const token = localStorage.getItem('token');

            if (token && typeof token === 'string' && token.trim() !== '') {
              if (isTokenExpired(token)) {
                setIsOpenEndSession(true);  
                localStorage.removeItem('token');
              }
            } else {
            
              localStorage.removeItem('token');
            }
          } catch (err) {

            console.error('Error al verificar el token:', err);
            localStorage.removeItem('token');
          }
        }, 10000);

  return () => clearInterval(interval);
    }, [router]);

    const handleCloseModal = async () => {
        setIsOpenEndSession(false);  
        router.push('/login');
    } 
  
    return (
        <>
            {isOpenEndSession && (<Modal_endSession handleCloseModal={handleCloseModal} />)}
            <AdminGrid />
        </>
    );
}