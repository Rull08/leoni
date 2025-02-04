'use client'

import { React, useEffect, useState } from 'react';
import { AiOutlineSortAscending, AiOutlineDown, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineEdit,  AiOutlineFilter } from 'react-icons/ai';

import { format } from 'date-fns';
import api from '@/utils/api';

import ExportButton from '@/components/exportButton';
import Pagination from '@/components/pagination'

const AdminGrid = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async() => {
            console.log(`Solicitando materiales con sortField: ${sortField} y sortOrder: ${sortOrder}`);
            try{
                const token = localStorage.getItem('token'); 
                const response = await api.get(`/users?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setUsers(response.data.users);
                console.log(users)
                setTotalPages(response.data.total_pages);
            } catch (error){
                setError('Error obteniendo usuarios');
                console.error(error)
            }
        };
        getUsers();
    }, [currentPage, limit, sortField, sortOrder]);

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
                    onClick={handleSortBySerial}
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
                        {!error && users.length > 0 && (
                            <table className='min-w-full table-auto'>
                                <thead className='bg-blue-800'>
                                    <tr className='text-white'>
                                        <th className='px-4 py-2'>
                                            <button
                                                className='w-full flex items-center justify-start focus:outline-none'
                                                onClick={() => handleSort('id')}
                                            >
                                                <span>ID</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                        </th>
                                        <th className='px-4 py-2'>
                                            <button
                                                className='w-full flex items-center justify-start focus:outline-none'
                                                onClick={() => handleSort('id')}
                                            >
                                                <span>Nombre de Usuario</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                        </th>
                                        <th className='px-4 py-2'>
                                            <button
                                                className='w-full flex items-center justify-start focus:outline-none'
                                                onClick={() => handleSort('id')}
                                            >
                                                <span>Rol</span>
                                                <AiOutlineFilter className='ml-2' />
                                            </button>
                                        </th>
                                        <th className='px-4 py-2'></th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {users.map((users) => (
                                        <tr key={users.id} className='border-r-stone-900 odd:bg-slate-300 even:bg-gray-300 text-black'>
                                            <td className='px-4 pt-2'>
                                                <div className='flex items-center jsutify-center h-full'>
                                                    {users.id}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='px-4 py-2 flex justify-center h-full'>
                                                    {users.usuario}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {users.rol}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center'>
                                                    <button className='p-2'>
                                                        <AiOutlineEdit />
                                                    </button>
                                                    <button className='p-2'>
                                                        <AiOutlineUserDelete />
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

export default AdminGrid;