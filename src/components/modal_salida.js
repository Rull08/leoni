'use client'
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import RootLayout from "@/app/layout";
import { Root } from "postcss";

const Modal_salidas = ({ isOpen, setIsOpen }) => {
    if(!isOpen) return null;
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-transparent backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ opacity: 0, rotate: "12.5deg" }}
                        animate={{ opacity: 1, rotate: "0deg" }}
                        exit={{ opacity: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-800 text-white font-medium px-4 py-2 rounded hover: opacity-90 transition-opacity"
                    >
                        <div className="relative flex flex-col bg-blue-700">
                            <form action= "#" method="POST" className="sp">
                                <div className="realtive m-2.5 items-center flex justify-center text-white h-12 rounded-md bg-slate-800">
                                    <h3 className="text-lg" > Salida </h3>
                                </div>
                                <div className="flex flex-col gap-1 p-2"> 
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Ubicación
                                        </label>
                                        <input
                                            id="ubicacion"
                                            name="ubicacion"
                                            type="text"
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Número de Parte"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Número de Parte
                                        </label>
                                      <input
                                        id="serie"
                                        name="numero_serie"
                                        type="text"
                                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Número de Serie"
                                        />
                                    </div> 
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Número de Serie
                                        </label>
                                      <input
                                        id="serie"
                                        name="numero_serie"
                                        type="text"
                                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Cantidad en Kilos"
                                        />
                                    </div> 
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Tipo de Salida
                                        </label>
                                        <input
                                        id="salida"
                                        name="tipo_salida"
                                        type="text"
                                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Cantidad en Metros"
                                        />
                                    </div> 
                                </div>
                                <div className="grid grid-cols-2 items-center m-2">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="bg-white hover:opacity-95 hover:bg-black/10 transition-colors text-black font-semibold w-full rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            onClick={() => setIsOpen(false)}
                                            className="bg-black hover:bg-black/50 transition-opacity text-white font-semibold w-full rounded"
                                        >
                                            Aceptar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
  };
  
export default Modal_salidas;