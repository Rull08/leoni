'use client'
import RootLayout from "./layout";

import Image from "next/image";
//import Link from 'next/link';
import Leoni from '@/../public/leoni-logo.png'

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/utils/api';
//import socket  from "@/utils/socket";

export default function Example() {
  const [user_Name, setUserName] = useState('');
  const [user_Password, setUserPassword] = useState('');
  const [autenticacion, setAutenticacion] = useState('false');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter()

    const handleLogin = async (e) => {
      e.preventDefault();
      console.log('user_name:', user_Name);
      console.log('user_password:', user_Password);
      console.log('autenticacion:', autenticacion); 
   
      try {
        const response = await api.post('/login', 
          {
            user_name: user_Name, 
            user_password: user_Password,
            autenticacion: false,
          }
        );
        router.push('/dashboard');
        alert('Login exitoso:', response.data);
      } catch (error) {
        setErrorMessage('Ocurrió un error al iniciar sesión. Intenta de nuevo.');
      }
    };

  return (
    <RootLayout>
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
    </RootLayout>
  )
}
