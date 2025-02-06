'use client'
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { parse, format } from 'date-fns';

import api from '@/utils/api'

const Modal_entradas = ({ isOpen, setIsOpen, ubication, operator, handleUpdate }) => {
    const [part_Num, setPartNum] = useState('');
    const [serial_Num, setSerialNum] = useState('');
    const [long_Quantity, setLongQuantity] = useState('');
    const [Operator, setOperator] = useState('');
    const [productionDate, setProductionDate] = useState('');

    const [Ubication, setUbication] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const partNumRef = useRef();
    const serialNumRef = useRef();
    const longQuantityRef = useRef();
    const ubicationRef = useRef();
    const productionDateRef = useRef();

    if(!isOpen) return null;
    
    const handelEntry = async (e) => {
        e.preventDefault();

        const parsedDate = parse(productionDate, 'dd/MM/yyyy', new Date());
        const fechaISO = format(parsedDate, 'yyyy-MM-dd');
        try {
            const token = localStorage.getItem('token'); 
            const response = await api.post('/add_material', {
                part_num: String(part_Num.toUpperCase()),
                serial_num: Number(serial_Num),
                long_quantity: Number(long_Quantity),
                operator: String(Operator),
                ubication: String(Ubication),
                production_date: fechaISO,
                respuesta: String("N/A")
            }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
        );
        if (response.status === 200) {
            setIsOpen(false);
            handleUpdate();
        }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setErrorMessage('Ocurrio un error al ingresar el material.');
        }
    };

    const handleKeyDown = (e, nextFieldRef) => {
        if (e.key === 'Enter') {
            nextFieldRef.current.focus();
        }
    };

    useEffect(() => {
        setUbication(ubication);
        setOperator(operator);
        partNumRef.current.focus();
    }, []);


        const formatearFecha = (valor) => {
          return valor.replace(/\./g, '/');
        };
    
        const formatearCantidad = (valor) => {
          const soloNumeros = valor.replace(/\D/g, '');
          return soloNumeros.substring(0, 4);
        };


        const handleFechaChange = (e) => {
          const valorFormateado = formatearFecha(e.target.value);
          setProductionDate(valorFormateado);
        };
    
        const handleCantidadChange = (e) => {
          const valorFormateado = formatearCantidad(e.target.value);
          setLongQuantity(valorFormateado);
        };


    const extraerDatos = (cadena) => {
        const matchInicio = cadena.match(/-.*-.*M/);
        if (!matchInicio) return { partNum: '', serialNum: '', cantidad: '' };
    
        const inicio = matchInicio.index + matchInicio[0].length;
        cadena = cadena.slice(inicio + 23); // Ajustar la longitud según sea necesario
    
        const numParte = cadena.slice(0, 17); // Primeros 17 caracteres como número de parte
        cadena = cadena.slice(17);
    
        const numSerie = cadena.slice(0, 8); // Primeros 8 caracteres como número de serie
        cadena = cadena.slice(8);
    
        const cantidad = cadena.slice(7); // El resto de la cadena es la cantidad
    
        return { partNum: numParte, serialNum: numSerie, cantidad: cantidad };
    };

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
                        <div className="relative flex flex-col bg-white">
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
                                          maxLength={17} // longitud exacta
                                          ref={partNumRef}
                                          onKeyDown={(e) => handleKeyDown(e, serialNumRef)} 
                                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                          placeholder="Número de Parte"
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
                                        maxLength={8} // longitud exacta
                                        ref={serialNumRef}
                                        onKeyDown={(e) => handleKeyDown(e, longQuantityRef)} 
                                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        placeholder="Número de Serie"
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
                                          onChange={(e) => setLongQuantity(formatearCantidad(e.target.value))}
                                          ref={longQuantityRef}
                                          onKeyDown={(e) => handleKeyDown(e, ubicationRef)} 
                                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                          placeholder="Cantidad en Metros"
                                        />
                                    </div> 
                                </div>
                                <div className="grid grid-cols-2">
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
                                            ref={ubicationRef}
                                            onKeyDown={(e) => handleKeyDown(e, productionDateRef)}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                            placeholder={Ubication}
                                            />
                                        </div> 
                                    </div>
                                    <div className="flex flex-col gap-1 p-2">
                                        <div className="w-full max-w-sm min-w-[200px]">
                                            <label className="block mb-2 text-sm text-white">
                                                Fecha produccion
                                            </label>
                                          <input
                                            id="fecha_produccion"
                                            name="fecha_produccion"
                                            type="text"
                                            value={productionDate}
                                            onChange={(e) => setProductionDate(formatearFecha(e.target.value))}
                                            ref={productionDateRef}
                                            pattern="\d{2}/\d{2}/\d{4}"
                                            placeholder="Fecha Produccion" 
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                            />
                                        </div> 
                                    </div> 
                                    <div className='p-4'>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const cadena = prompt("Escanear o ingresar la cadena de datos");
                                            const { partNum, serialNum, cantidad } = extraerDatos(cadena);
                                        
                                            setPartNum(partNum);
                                            setSerialNum(serialNum);
                                            setLongQuantity(cantidad);
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full rounded"
                                    >
                                        Procesar Datos
                                    </button>
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