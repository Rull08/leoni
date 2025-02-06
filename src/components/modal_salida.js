'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

import api from '@/utils/api';

export default function Modal_salida({ isOpen, setIsOpen, handleUpdate }) {
  const [deleteSelection, setDeleteSelection] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  
  if(!isOpen) return null;

  const handleDeleteMaterial = async (material) => {
    console.log(material, '---------')
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete('/delete_material', {
        params: { serial_num: Number(material) }, // Los parámetros de la query
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Datos a enviar:', { serial_num: material });

      if (response.status === 200) {
        alert('Material eliminado correctamente');
        setIsOpen(false);
        handleUpdate();
      }
    } catch (error) {
      alert('Error eliminando el material, verifique la fecha del material o el nnúmero de serie');
    }
  };

  const handleDelete = async () => {
    await handleDeleteMaterial(deleteSelection);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:size-10">
                  <InformationCircleIcon aria-hidden="true" className="size-6 text-blue-500" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Retirar Material
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="text-sm text-gray-700">
                        <p className="mt-2">Ingrese el número de serie del material: </p>
                        <input 
                            type="text" 
                            value={deleteSelection} 
                            onChange={(e) => setDeleteSelection(e.target.value)} 
                            placeholder="Número de serie" 
                            className="mt-2 w-full border p-2 rounded"
                        />
                        {errorMessage && (
                        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex justify-end sm:px-6">
              <button
                type="button"
                onClick={setIsOpen}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                Eliminar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
