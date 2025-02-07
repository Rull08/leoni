'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { AiOutlineFilter, AiOutlineDelete } from 'react-icons/ai';

import { format } from 'date-fns';
import api from '@/utils/api';
import Modal_delete from '@/components/modal_delete';
import ExportButton from '@/components/exportButton';
import Modal_massiveDelete from '@/components/modal_massiveDelete';
import Pagination from '@/components/pagination'


const AdminProductionGrid = () => {
    const [materials, setMaterials] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id_material');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenMassiveDelete, setIsOpenMassiveDelete] = useState(false);
    
    const [deleteSelection, setDeleteSelection] = useState('')

    const [error, setError] = useState(null);

    useEffect(() => {
      console.log(`Solicitando materiales con sortField: ${sortField} y sortOrder: ${sortOrder}`);
        const getMaterials = async() => {
            try{
                const timestamp = new Date().getTime(); 
                const token = localStorage.getItem('token'); 
                const response = await api.get(`/materials?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}&_=${timestamp}`,
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

    const updateData = async () => {
        try {
            const timestamp = new Date().getTime(); 
            const token = localStorage.getItem('token'); 
            const response = await api.get(`/materials?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}&_=${timestamp}`,
                {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                }
            );
          setMaterials(response.data.materials);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      const handleUpdate = async () => {
        setTimeout(async () => {
          await updateData();
        }, 1000);
      };

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

  const handleOpenModal = (modalType, param) => {
    handleCloseModal();
    if (modalType === 'eliminar') {
      setIsOpenDelete(true) 
      setDeleteSelection(param)
    }  
    if (modalType === 'masivo') setIsOpenMassiveDelete(true);
  };

  const handleCloseModal = async () => {
    setIsOpenDelete(false);
    setIsOpenMassiveDelete(false);
} 

    return (
        <>
        <div className='p-4 w-full'>
            <div className='flex w-full space-x-4 justify-between'>
                <button 
                className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex justify-start'
                onClick={() => handleOpenModal('masivo', '')}
                > 
                    Eliminar Número de Parte
                </button>
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
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('id_material')}
                                            >
                                                <span>ID</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('num_parte')}
                                            >
                                                <span>Número de Parte</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('num_serie')}
                                            >
                                                <span>Número de Serie</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>

                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('cant_metros')}
                                            >
                                                <span>Cantidad en Metros</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                            
                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('usuario')}
                                            >
                                                <span>Operador</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>

                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('ubicacion')}
                                            >
                                                <span>Ubicación</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>

                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('rack')}
                                            >
                                                <span>Rack</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>

                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('fecha_produccion')}
                                            >
                                                <span>Fecha de Produccion</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>

                                        </th>
                                        <th className='px-4 py-2'>
                                             <button
                                                className='w-full flex items-center justify-between focus:outline-none'
                                                onClick={() => handleSortByField('fecha_entrada')}
                                            >
                                                <span>Fecha de Entrada</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                        </th>
                                        <th className='px-4 py-2'></th>
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
                                                    {material.ubicacion}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {material.rack}
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
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center'>
                                                    <button onClick={() => handleOpenModal('eliminar', material.num_serie)}> 
                                                        <AiOutlineDelete className='size-4 text-red-600' />
                                                    </button>
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
            {isOpenDelete && (
              <Modal_delete 
              isOpen={isOpenDelete} 
              setIsOpen={handleCloseModal}
              deleteSelection={deleteSelection}
              handleUpdate={handleUpdate}  
              />
            )}
            {isOpenMassiveDelete && (
              <Modal_massiveDelete 
              isOpen={isOpenMassiveDelete} 
              setIsOpen={handleCloseModal}
              handleUpdate={handleUpdate}  
              />
            )}
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

export default AdminProductionGrid;