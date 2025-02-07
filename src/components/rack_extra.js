'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

import Modal_entradas from '@/components/modal_entrada';
import Modal_salida from '@/components/modal_salida';
import Modal_delete from '@/components/modal_delete';
import Modal_older from '@/components/modal_older';
import api from '@/utils/api';
import { jwtDecode } from 'jwt-decode';


const Rack_extra = ({ rack_name }) => {
    const [materials, setMaterials] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id_material');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState('ALL');
    const [totalPages, setTotalPages] = useState(0);

    
    const [isOpenEntradas, setIsOpenEntradas] = useState(false);
    const [isOpenSalida, setIsOpenSalida] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenAntiguo, setIsOpenAntiguo] = useState(false);
    
    const [ubicacion, setUbicacion] = useState('');
    const [operator, setOperator] = useState('');
    const [searchResult, setSearchResult] = useState('')
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
                console.log(response.data.materials)
                const filteredMaterials = response.data.materials.filter(material => material.rack && material.rack.includes(rack_name.toUpperCase()));
                setMaterials(filteredMaterials);
            } catch (error) {
                setError('Error obteniendo materiales');
                console.error(error);
            }
        };
        
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        setOperator(decoded.sub);
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
          const filteredMaterials = response.data.materials.filter(material => material.rack && material.rack.includes(rack_name.toUpperCase()));
          setMaterials(filteredMaterials);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      const handleUpdate = async () => {
        setTimeout(async () => {
          await updateData();
        }, 1000);
      };
    
      const handleSearch = () => {
        const getSearch = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await api.post('/exact_search', {
              search: searchText
            }, {
              headers: {
                  Authorization: `Bearer ${token}`, 
              },
            });
            setSearchResult(response.data);
    
          } catch (error) {
            setError('Error en la busqueda');
            console.error(error);
        }
        };
        getSearch();
      }; 
    
      const handleSearchOlder = ( rack ) => {
        const getSearch = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await api.post('/search_older', {
              search: String(rack)
            }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
            });
            setSearchResult(response.data);
    
          } catch (error) {
            setError('Error en la busqueda');
            console.error(error);
        }
        };
        getSearch();
      };

    const handleOpenModal = (modalType, param) => {
        handleCloseModal();
        setUbicacion(param);
        if (modalType === 'entradas') setIsOpenEntradas(true);
        if (modalType === 'salidas') setIsOpenSalida(true);
        if (modalType === 'antiguo') {
          handleSearchOlder(param);
          setIsOpenAntiguo(true);
        }
    
        if (modalType === 'eliminar') {
          setIsOpenDelete(true) 
          setDeleteSelection(param)
        }  
      };
    
      const handleCloseModal = async () => {
        setIsOpenEntradas(false);
        setIsOpenSalida(false);
        setIsOpenDelete(false);
        setIsOpenAntiguo(false);
    } 

    return (
        <>
            <div className='p-4'>
                <div className='flex m-4 justify-between'>
                    <button 
                    className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
                    onClick={() => handleOpenModal('entradas', [rack_name])}
                    > 
                        Ingresar Materiar
                    </button>
                    <button 
                    className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
                    onClick={() => handleOpenModal('salidas', '')}
                    > 
                        Retirar Material
                    </button>
                    <button 
                    className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
                    onClick={() => handleOpenModal('antiguo', [rack_name])}
                    > 
                        Consultar disponible para salida
                    </button>
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
      {isOpenEntradas && (
        <Modal_entradas 
        isOpen={isOpenEntradas} 
        setIsOpen={handleCloseModal}
        ubication={ubicacion}
        operator={operator} 
        handleUpdate={handleUpdate}   
        />
      )}
      {isOpenSalida && (
        <Modal_salida 
        isOpen={isOpenSalida} 
        setIsOpen={handleCloseModal}
        handleUpdate={handleUpdate}  
        />
      )}
      {isOpenDelete && (
        <Modal_delete 
        isOpen={isOpenDelete} 
        setIsOpen={handleCloseModal}
        deleteSelection={deleteSelection}
        handleUpdate={handleUpdate}  
        />
      )}
      {isOpenAntiguo && (
        <Modal_older 
          isOpen={isOpenAntiguo} 
          searchResult={searchResult} 
          setIsOpen={handleCloseModal}
        />
      )}
        </>
    );
};

export default Rack_extra;