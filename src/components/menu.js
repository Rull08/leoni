'use client'
import { AnimatePresence, motion } from 'framer-motion';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Image from "next/image";
import Leoni from '@/../public/leoni-logo.png'
import Modal_entradas from '@/components/modal_entrada';
import Modal_salidas from '@/components/modal_salida'


const navigation = [];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
  const [isOpenEntradas, setIsOpenEntradas] = useState(false);
  const [isOpenSalidas, setIsOpenSalidas] = useState(false);

  const handleModalOpen = (modalType) => {
    if (modalType === 'entradas') setIsOpenEntradas(true);
    if (modalType === 'salidas') setIsOpenSalidas(true);
  };
  
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Abrir Menú</span>
                <Bars3Icon className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Image 
                    src={Leoni} 
                    alt="Your Company"
                    width={100} 
                    height={70} 
                    loading="eager" 
                  />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleModalOpen(item.modal)}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>
              
            </div>
            <Modal_entradas isOpen={isOpenEntradas} setIsOpen={setIsOpenEntradas} />
            <Modal_salidas isOpen={isOpenSalidas} setIsOpen={setIsOpenSalidas} />
          </div>
        </div>
          <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                onClick={() => handleModalOpen(item.modal)}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default Navbar;
