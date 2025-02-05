'use client'

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import { jwtDecode } from 'jwt-decode';


export default function Production () {

    const router = useRouter();

    const [isOpenEndSession, setIsOpenEndSession] = useState(false);
    const [operador, setOperator] = useState('Guest');
    
    const rack_name = 'Scrap'


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('token');
            router.push('/login');
        }
          
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

        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (isTokenExpired(token)) {
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
            <Board rack_name={rack_name} />   
        </>
    );
};