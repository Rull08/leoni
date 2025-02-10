'use client'
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";

import api from '@/utils/api'

const Modal_addUser = ({ isOpen, setIsOpen, handleUpdate }) => {
    const [UserName, setUserName] = useState('');
    const [UserPassword, setUserPassword] = useState('');
    const [UserRol, setUserRol] = useState('');
    
    const [errorMessage, setErrorMessage] = useState('');


    const roles = ['admin', 'produccion', 'operador'];


    const userRef = useRef();
    const passwordRef = useRef();
    const rolRef = useRef();

    if(!isOpen) return null;
    
    const handelEntry = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            const response = await api.post('/add_user', {
                user_name: String(UserName),
                user_password: String(UserPassword),
                user_rol: String(UserRol),
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
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserRol((prev) => ({ ...prev, [name]: value }));
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
                                    <h3 className="text-lg" > Añadir Usuario </h3>
                                </div>
                                <div className="flex flex-col gap-1 p-2"> 
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Nombre de Usuario
                                        </label>
                                        <input
                                          id="usuario"
                                          name="usuario"
                                          type="text"
                                          value={UserName}
                                          onChange={(e) => setUserName(e.target.value)}
                                          ref={userRef}
                                          onKeyDown={(e) => handleKeyDown(e, passwordRef)} 
                                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                          placeholder="Usuario"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="w-full max-w-sm min-w-[200px]">
                                        <label className="block mb-2 text-sm text-white">
                                            Contraseña
                                        </label>
                                      <input
                                        id="contraseña"
                                        name="contraseña"
                                        type="text"
                                        value={UserPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                        ref={passwordRef}
                                        onKeyDown={(e) => handleKeyDown(e, rolRef)} 
                                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        placeholder="Contraseña"
                                        />
                                    </div> 
                                </div>
                                <div className="flex flex-col gap-1 p-2">
                                <label className="block mb-2 text-sm text-white">Rol</label>
                                <select
                                  id="rol"
                                  name="rol"
                                  value={UserRol}
                                  onChange={(e) => setUserRol(e.target.value)}
                                  ref={rolRef}
                                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400"
                                >
                                  <option value="">Seleccione un rol</option>
                                  {roles.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                                </div>
                                {errorMessage && (
                                  <div className="px-2 py-1 text-red-600">{errorMessage}</div>
                                )}
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
  
export default Modal_addUser;