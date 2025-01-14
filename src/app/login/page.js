'use client'
import Image from "next/image";
import Leoni from '@/../public/leoni-logo.png'

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/utils/api';

import { jwtDecode } from 'jwt-decode';
//import socket  from "@/utils/socket";

export default function Login() {
  const [user_Name, setUserName] = useState('');
  const [user_Password, setUserPassword] = useState('');
  const [autenticacion, setAutenticacion] = useState('false');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter()

    const handleLogin = async (e) => {
      e.preventDefault();
   
      try {
        const response = await api.post('/login', 
          {
            user_name: user_Name, 
            user_password: user_Password,
            user_rol: 'guest',
            autenticacion: false,
          }
        );

        const { access_token } = response.data;
        localStorage.setItem('token', access_token); 
        
        const token = localStorage.getItem('token');
        if(!token){
          router.push('/login')
          return null;
        }

        const decodedToken = jwtDecode(token);
        console.log(decodedToken.role)
        if(decodedToken.role === 'admin'){
          router.push('/pages/admin');
          return null;
        }  else if (decodedToken.role === 'produccion') {
          router.push('/pages/production');
          return null;
        } else if (decodedToken.role === 'operador'){
          router.push('/pages/Racks');
          return null;
        } else {
          console.log('Usted no tiene acceso jodase')
          return null;
        }

      } catch (error) {
        setErrorMessage('Ocurrió un error al iniciar sesión. Intenta de nuevo.');
      }
    };

  return (
    <div className="h-screen place-content-center">  
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Leoni"
          src={Leoni}
          className="mx-auto h-10 w-auto"
          loading="eager" 
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Inicio de Sesión
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} action="#" method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Nombre de Usuario
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                value={user_Name}
                onChange={(e) => setUserName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Contraseña
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={user_Password}
                onChange={(e) => setUserPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
