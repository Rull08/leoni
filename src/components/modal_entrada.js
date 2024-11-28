import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import RootLayout from "@/app/layout";
import { Root } from "postcss";

const modal_entrada = ({ isOpen, setIsOpen }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5}}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-white backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
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

export default modal_entrada;