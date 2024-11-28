// components/Navbar.js
import { AnimatePresence, motion } from 'framer-motion';
import { Disclosure, DisclosureButton } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Image from "next/image";
import Leoni from '@/../public/leoni-logo.png'


const navigation = [
  { name: 'Ubicaciones', href: '#', current: true },
  { name: 'Entradas', href: '#', current: false, modal:'entradas' },
  { name: 'Salidas', href: '#', current: false, modal: 'salidas' },
];

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
                <span className="sr-only">Open main menu</span>
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
                      aria-current={item.current ? 'page' : undefined}
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
            <ModalEntradas isOpen={isOpenEntradas} setIsOpen={setIsOpenEntradas} />
            <ModalSalidas isOpen={isOpenSalidas} setIsOpen={setIsOpenSalidas} />
          </div>
        </div>
      </Disclosure>
    </>
  );
};

const ModalEntradas = ({ isOpen, setIsOpen }) => {
  if(!isOpen) return null;
  return (
      <AnimatePresence>
          {isOpen && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="bg-white backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
              >
                  <motion.div
                      initial={{ opacity: 0, rotate: "12.5deg" }}
                      animate={{ opacity: 1, rotate: "0deg" }}
                      exit={{ opacity: 0, rotatae: "0deg" }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gradient-to-r from-black to-black text-white font-medium px-4 py-2 rounded hover: opacity-90 transition-opacity"
                  >
                      <div className="relative Z-10">
                          <form action= "#" method="POST" className="sp">
                              <div className="bg-white w-32 h-10 mb-2 rounded-full text-3xl text-blue grid place-items-center mx-auto">
                                  <h3 className="text-3xl font-bold text-center text-blue-700 place-content-center mb-2" > Entrada </h3>
                              </div>
                              <div className="grid grid-rows-9 grid-flow-col gap-2">
                                  <div className="place-content-center">
                                      <label className="block text-lg font-sans font-bold leading-6 text-white">
                                          Clasificación
                                      </label>
                                  </div>  
                                  
                                  <div className="place-content-center">
                                      <label className="block text-lg font-sans font-bold leading-6 text-white">
                                          Número de Parte
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Número de Serie
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Cantidad en Kilos
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Cantidad en Partes
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Operador
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Ubicación
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Tipo
                                      </label>
                                  </div>
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Fecha de Producción
                                      </label>
                                  </div>
                                  <div className="mt-2">
                                      <input
                                        id="calsificacion"
                                        name="clasificacion"
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:tesxt-sm sm:leading-6"
                                      />
                                  </div>
                                  
                                  <div className="mt-2">
                                    <input
                                      id="parte"
                                      name="numero_parte"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="serie"
                                      name="numero_serie"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="kilos"
                                      name="cantidad_kilos"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="metros"
                                      name="cantiadad_metros"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="operador"
                                      name="operador"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="ubicacion"
                                      name="ubicacion"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="tipo"
                                      name="tipo"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <input
                                      id="produccion"
                                      name="fecha_produccion"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                              </div>
                              <div className="flex gap-2 space-y-6">
                                  <button
                                      type="button"
                                      onClick={() => setIsOpen(false)}
                                      className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                  >
                                      No Simon
                                  </button>
                                  <button
                                      type="submit"
                                      onClick={() => setIsOpen(false)}
                                      className="bg-white hover:opacity-90 transition-opacity text-sky-300 font-semibold w-full py-2 rounded"
                                  >
                                      Simon
                                  </button>
                              </div>
                          </form>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
  );
};


const ModalSalidas = ({ isOpen, setIsOpen }) => {
  if(!isOpen) return null;
  return (
      <AnimatePresence>
          {isOpen && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="bg-white backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
              >
                  <motion.div
                      initial={{ opacity: 0, rotate: "12.5deg" }}
                      animate={{ opacity: 1, rotate: "0deg" }}
                      exit={{ opacity: 0, rotatae: "0deg" }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gradient-to-r from-black to-black text-white font-medium px-4 py-2 rounded hover: opacity-90 transition-opacity"
                  >
                      <div className="relative Z-10">
                          <form action= "#" method="POST" className="sp">
                              <div className="bg-white w-32 h-10 mb-2 rounded-full text-3xl text-blue grid place-items-center mx-auto">
                                  <h3 className="text-3xl font-bold text-center text-blue-700 place-content-center mb-2" > Entrada </h3>
                              </div>
                              <div className="grid grid-rows-4 grid-flow-col gap-2">
                                <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Ubicación
                                      </label>
                                  </div>

                                  <div className="place-content-center">
                                      <label className="block text-lg font-sans font-bold leading-6 text-white">
                                          Número de Parte
                                      </label>
                                  </div>

                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Tipo de Salida
                                      </label>
                                  </div>   
                                  
                                  <div className="place-content-center">
                                      <label className="block tesxt-lg font-sans font-bold leading-6 text-white">
                                          Número de Serie
                                      </label>
                                  </div>                                
                                  

                                  <div className="mt-2">
                                    <input
                                      id="ubicacion"
                                      name="ubicacion"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>

                                  <div className="mt-2">
                                    <input
                                      id="parte"
                                      name="numero_parte"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>

                                  <div className="mt-2">
                                    <input
                                      id="serie"
                                      name="numero_serie"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>

                                  <div className="mt-2">
                                    <input
                                      id="salida"
                                      name="tipo_salida"
                                      type="text"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                              </div>
                              <div className="flex gap-2 space-y-6">
                                  <button
                                      type="button"
                                      onClick={() => setIsOpen(false)}
                                      className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                  >
                                      No Simon
                                  </button>
                                  <button
                                      type="submit"
                                      onClick={() => setIsOpen(false)}
                                      className="bg-white hover:opacity-90 transition-opacity text-sky-300 font-semibold w-full py-2 rounded"
                                  >
                                      Simon
                                  </button>
                              </div>
                          </form>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
  );
};

export default Navbar;
