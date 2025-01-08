'use client'
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import api from '@/utils/api'

const Modal_entradas = ({ isOpen, setIsOpen, closeModal, onClose, row, col }) => {
    const [part_Num, setPartNum] = useState('');
    const [serial_Num, setSerialNum] = useState('');
    const [weight_Quantity, setWeightQuantity] = useState('');
    const [long_Quantity, setLongQuantity] = useState('');
    const [Operator, setOperator] = useState('');
    const [Clasification, setClasification] = useState('');
    const [Types, setTypes] = useState('');
    const [Ubication, setUbication] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const columnMap = { 0: "A", 1: "B", 2: "C", 3: "D" };
    
    const handelEntry = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/entry', {
                types: String(Types),
                part_num: String(part_Num.toUpperCase()),
                serial_num: String(serial_Num),
                weight_quantity: String(weight_Quantity),
                long_quantity: String(long_Quantity),
                operator: String(Operator),
                ubication: String(Ubication),
                clasification: String(Clasification),
                respuesta: String("Geimy")
            },
        );
        if (response.status === 200)
        {
            if (onClose) await onClose();
            closeModal = setIsOpen(false);
        }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setErrorMessage('Ocurrio un error al ingresar el material.');
        }
    };

    const getUbicationName = (row, col) => {
        if (typeof row === "number" || typeof col === "number") {
            const columnName = columnMap[col]; 
            if (!columnName) return "Ubicación inválida"; 
            return `${columnName}${row + 1}`; 
        } else
            return "Ubicación";
    };
    
    useEffect(() => {
        const value = getUbicationName(row, col);
        setUbication(value)
    }, [row, col]);

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
                            <form onSubmit={handelEntry} action= "#" method="POST" className="sp">
                                <div className="realtive m-2.5 items-center flex justify-center text-white h-12 rounded-md bg-slate-800">
                                    <h3 className="text-lg" > Entrada </h3>
                                </div>
                                <div className="flex flex-col gap-1 p-2"> 
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Número de Parte
                                        </label>
                                        <input
                                          id="parte"
                                          name="numero_parte"
                                          type="text"
                                          value={part_Num}
                                          onChange={(e) => setPartNum(e.target.value)}
                                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Número de Parte"
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
                                        value={serial_Num}
                                        onChange={(e) => setSerialNum(e.target.value)}
                                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Número de Serie"
                                        />
                                    </div> 
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Cantidad en Kilos
                                        </label>
                                      <input
                                        id="kilos"
                                        name="cantidad_kilos"
                                        type="text"
                                        value={weight_Quantity}
                                        onChange={(e) => setWeightQuantity(e.target.value)}
                                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Cantidad en Kilos"
                                        />
                                    </div> 
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Cantidad en Metros
                                        </label>
                                        <input
                                          id="metros"
                                          name="cantidad_metros"
                                          type="text"
                                          value={long_Quantity}
                                          onChange={(e) => setLongQuantity(e.target.value)}
                                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Cantidad en Metros"
                                        />
                                    </div> 
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="flex flex-col gap-1 p-2">
                                        <div className="w-full max-w-sm min-w-[200px]">
                                            <label className="block mb-2 text-sm text-white">
                                                Operador
                                            </label>
                                            <input
                                              id="operador"
                                              name="operador"
                                              type="text"
                                              value={Operator}
                                              onChange={(e) => setOperator(e.target.value)}
                                              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Operador"
                                            />
                                        </div> 
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
                                            value={Ubication}
                                            onChange={(e) => setUbication(e.target.value)}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder={getUbicationName(row, col)}
                                            />
                                        </div> 
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="flex flex-col gap-1 p-2">
                                        <div className="w-full max-w-sm min-w-[200px]">
                                            <label className="block mb-2 text-sm text-white">
                                                Clasificación
                                            </label>
                                        <input
                                              id="clasificacion"
                                              name="clasificacion"
                                              type="text"
                                              value={Clasification}
                                              onChange={(e) => setClasification(e.target.value)}
                                              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Clasificacion"
                                            />
                                        </div> 
                                    </div>
                                    <div className="flex flex-col gap-1 p-2">
                                        <div className="w-full max-w-sm min-w-[200px]">
                                            <label className="block mb-2 text-sm text-white">
                                                Tipo
                                            </label>
                                            <input
                                              id="tipo"
                                              name="tipo"
                                              type="text"
                                              value={Types}
                                              onChange={(e) => setTypes(e.target.value)}
                                              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Tipo"
                                            />
                                        </div> 
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 items-center m-2">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="bg-white hover:opacity-90 hover:bg-black/10 transition-colors text-black font-semibold w-full rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            onClick={closeModal}
                                            className="bg-black hover:bg-black/60 transition-opacity text-white font-semibold w-full rounded"
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
  
export default Modal_entradas;