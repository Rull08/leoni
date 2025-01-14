'use client'
import ProductionGrid from "@/components/datagrid";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import { jwtDecode } from 'jwt-decode';

import Board from '@/components/kanban'
  
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



export default function Production () {

    const router = useRouter();

    const [isOpenEndSession, setIsOpenEndSession] = useState(false);


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
};