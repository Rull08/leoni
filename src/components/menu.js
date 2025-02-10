'use client';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import { menuConfig } from '@/utils/menuConfig';
import Leoni from '@/../public/leoni-logo.png';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isToken, setIsToken] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
          const token = localStorage.getItem('token');
          console.log(token);
          if (!token) {
            console.log(token)
              localStorage.removeItem('token');
              router.push('/login');
          } else {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
              } catch (error) {
                console.error('Error decodificando el token:', error);
                localStorage.removeItem('token');
                router.push('/login');
            }
          }
      }, []);
      
  // Determina el menú según la ruta actual
  let navigation = [];
  if ((pathname.startsWith('/pages/admin')  &&  userRole == 'admin') || (pathname.startsWith('/pages/admin_production') || (pathname.startsWith('/pages/registro'))  &&  userRole == 'admin')) {
    navigation = menuConfig.admin;
  } else if (pathname.startsWith('/pages/Racks')) {
    navigation = menuConfig.montacarguista;
  } else {
    navigation = menuConfig.general;
  }

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Leoni}
              alt="Leoni"
              width={100}
              height={70}
              loading="eager"
            />
          </div>

          {/* Navegación */}
          <div className="hidden sm:flex sm:space-x-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}
                
                  className={`${
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } rounded-md px-3 py-2 text-sm font-medium`}
                >
                  {item.name}
                
              </Link>
            ))}
          </div>

          {/* Icono de notificaciones */}
          <div className="flex items-center">
            <button className="bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Panel responsive */}
      <div className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${
              pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } block rounded-md px-3 py-2 text-base font-medium`}
            >
                {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;