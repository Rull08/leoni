'use client'
import React from 'react'
import { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineDownload, AiOutlineSortAscending, AiOutlineDown } from 'react-icons/ai';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import api from '@/utils/api';

const ProductionGrid = () => {
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState([]);
    const [error, setError] = useState(null);

    const items = [
        { id: 1, title: 'Back End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
        { id: 2, title: 'Front End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
        { id: 3, title: 'User Interface Designer', department: 'Design', type: 'Full-time', location: 'Remote' },
      ]

    useEffect(() => {
        const getMaterials = async() => {
            try{
                const response = await api.get('/materials');
                setMaterials(response.data);
            } catch (error) {
                setError('Error obteniendo materiales');
                console.error(error);
            }
        };
        getMaterials();
    }, []);

    useEffect(() => {
        const getSearch = async() => {
            try{
                const response = await api.get('/search');
                setSearch(response.data);
            } catch (error) {
                setError('Error obteniendo materiales');
                console.error(error);
            }
        };
        getSearch();
    }, []);

    const downloadCSV = () => {
        alert('Downloading CSV...');
    };

    const handleSortByName = () => {
        console.log('Sorting by name...');
    };

    return (
        <>
        <div className='p-4'>
            <div className='flex w-full'>
                <div className='flex w-1/3'>
                    <input
                      id="consulata"
                      name="consulta"
                      type="text"
                      value={undefined}
                      onChange={(e) => setPartNum(e.target.value)}
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Buscar"
                    />
                    <button className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex' > 
                        Buscar
                    </button>
                </div>
                <div className='flex w-2/3 space-x-4 place-content-end'>
                    <button onClick={handleSortByName} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineSortAscending className='mr-2' /> Ordenar por Nombre
                    </button>
                    <button onClick={handleSortByName} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Ordenar por Ubicación
                    </button>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='p-2'>
                    <div className='overflow-x-auto'>
                        {error && <p>{error}</p>}
                        {!error && materials.length > 0 && (
                            <table className='max-w-full table-auto'>
                                <thead className='bg-blue-800'>
                                    <tr className='text-white'>
                                        <th className='px-4 py-2'>id</th>
                                        <th className='px-4 py-2'>Numero de parte</th>
                                        <th className='px-4 py-2'>Numero de serie</th>
                                        <th className='px-4 py-2'>Cantidad en kilos</th>
                                        <th className='px-4 py-2'>Cantidad en metros</th>
                                        <th className='px-4 py-2'>Operador</th>
                                        <th className='px-4 py-2'>Clasificacion</th>
                                        <th className='px-4 py-2'>Tipo</th>
                                        <th className='px-4 py-2'>Ubicación</th>
                                        <th className='px-4 py-2'>Fecha de produccion</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {materials.map((material) => (
                                        <tr key={material.id_material} className='border-r-stone-900 odd:bg-slate-300 even:bg-gray-300 text-black'>
                                            <td className='px-4 pt-2'>
                                                <div className='flex items-center jsutify-center h-full'>
                                                    {material.id_material}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='px-4 py-2 flex justify-center h-full'>
                                                    {material.num_parte}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.numero_serie}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.cant_kilos}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.cant_metros}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.user}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.nombre_clasificacion}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.tipo}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.ubicacion}
                                                </div>
                                            </td>
                                    
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.fecha_produccion}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className='p-4'>        
                        <button onClick={downloadCSV} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                            <AiOutlineDownload className='mr-12' /> Exportar Excel
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </a>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">97</span> results
                      </p>
                    </div>
                    <div>
                      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <a
                          href="#"
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon aria-hidden="true" className="size-5" />
                        </a>
                        {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                        <a
                          href="#"
                          aria-current="page"
                          className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          2
                        </a>
                        <a
                          href="#"
                          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                        >
                          3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                          ...
                        </span>
                        <a
                          href="#"
                          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                        >
                          8
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          9
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          10
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon aria-hidden="true" className="size-5" />
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
            </div>
        </>
    );
}

export default ProductionGrid;