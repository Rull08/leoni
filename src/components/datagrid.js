'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { AiOutlineSortAscending, AiOutlineDown } from 'react-icons/ai';

import { format } from 'date-fns';
import api from '@/utils/api';

import ExportButton from '@/components/exportButton';
import Pagination from '@/components/pagination'


const ProductionGrid = () => {
    const [materials, setMaterials] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id_material');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [error, setError] = useState(null);

    useEffect(() => {
      console.log(`Solicitando materiales con sortField: ${sortField} y sortOrder: ${sortOrder}`);
        const getMaterials = async() => {
            try{
                const token = localStorage.getItem('token'); 
                const response = await api.get(`/materials?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}`,
                    {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setMaterials(response.data.materials);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                setError('Error obteniendo materiales');
                console.error(error);
            }
        };
        getMaterials();
    }, [currentPage, limit, sortField, sortOrder]);

    const handleSortBySearch = () =>  {
      const getSearch = async () => {
          try {
                const token = localStorage.getItem('token'); // Obtener el token
              const response = await api.post('/search_materials', {
                obj: searchText,
                page: currentPage,
                limit: limit,
                sort_field: sortField,
                sort_order: sortOrder
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Agregar el token en los encabezados
                },
            });
              setMaterials(response.data);
          } catch (error) {
              setError('Error en la busqueda');
              console.error(error);
          }
      };
          getSearch();
    };
   

  const handleSortByField = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

    const handleSortByPart = () => {
      handleSortByField('num_parte');
    };

    const handleSortByDate = () => {
      handleSortByField('fecha_produccion');
    };
    
    const handleSortByUbication = () => {
      handleSortByField('ubicacion');
    };
    
    const handleSortBySerial = () => {
      handleSortByField('num_serie');
    };

    return (
        <>
        <div className='p-4'>
            <div className='flex w-full space-x-4'>
                <div className='flex w-1/3'>
                    <input
                      id="consulata"
                      name="consulta"
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Buscar"
                    />
                    {error && <div>{error}</div>}
                    <button 
                    className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
                    onClick={handleSortBySearch}
                    > 
                        Buscar
                    </button>
                </div>
                <div className='flex w-2/3 space-x-4 place-content-end'>
                    <button onClick={handleSortByPart} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineSortAscending className='mr-2' /> Ordenar por Numero de parte
                    </button>
                    <button onClick={handleSortByDate} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Ordenar por Fecha
                    </button>
                    <button onClick={handleSortByUbication} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Ordenar por Ubicacion
                    </button>
                    <button onClick={handleSortBySerial} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Ordenar por Numero de Serie
                    </button>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                <div className='p-2 '>
                    <div className='overflow-x-auto'>
                        {error && <p>{error}</p>}
                        {!error && materials.length > 0 && (
                            <table className='min-w-full table-auto'>
                                <thead className='bg-blue-800'>
                                    <tr className='text-white'>
                                        <th className='px-4 py-2'>id</th>
                                        <th className='px-4 py-2'>Numero de parte</th>
                                        <th className='px-4 py-2'>Numero de serie</th>
                                        <th className='px-4 py-2'>Cantidad en metros</th>
                                        <th className='px-4 py-2'>Operador</th>
                                        <th className='px-4 py-2'>Ubicación</th>
                                        <th className='px-4 py-2'>Fecha de Produccion</th>
                                        <th className='px-4 py-2'>Fecha de Entrada</th>
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
                                                    {material.num_serie}
                                                </div>
                                            </td>
                                            {/*
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.cant_kilos}
                                                </div>
                                            </td>
                                            */}
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
                                            {/*
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
                                            */}
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
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                {material.fecha_entrada}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            <div className='p-4 space-x-4'> 
                <ExportButton 
                    doe={searchText} 
                    field={sortField} 
                    order={sortOrder} 
                />   
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );
};

export default ProductionGrid;