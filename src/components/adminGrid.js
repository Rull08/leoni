'use client'

import { React, useEffect, useState } from 'react';
import { AiOutlineSortAscending, AiOutlineDown, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineEdit,  AiOutlineFilter } from 'react-icons/ai';

import { format } from 'date-fns';
import api from '@/utils/api';

import Modal_addUser from '@/components/modal_addUser'
import Pagination from '@/components/pagination'

const AdminGrid = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [isOpenUsuario, setIsOpenUsuario] = useState(false)

    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async() => {
            try{
                const timestamp = new Date().getTime(); 
                const token = localStorage.getItem('token'); 
                const response = await api.get(`/users?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}&_=${timestamp}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setUsers(response.data.users);
                setTotalPages(response.data.total_pages);
            } catch (error){
                setError('Error obteniendo usuarios');
                console.error(error)
            }
        };
        getUsers();
    }, [currentPage, limit, sortField, sortOrder]);

    const updateData = async () => {
        try{
            const timestamp = new Date().getTime(); 
            const token = localStorage.getItem('token'); 
            const response = await api.get(`/users?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}&_=${timestamp}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setUsers(response.data.users);
            setTotalPages(response.data.total_pages);
        } catch (error){
            setError('Error obteniendo usuarios');
            console.error(error)
        }
      };
    
      const handleUpdate = async () => {
        setTimeout(async () => {
          await updateData();
        }, 1000);
      };

    const handleSortByField = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      };

      const handleOpenModal = (modalType) => {
        handleCloseModal();
        if (modalType === 'usuario') setIsOpenUsuario(true);
      };
    
      const handleCloseModal = async () => {
        setIsOpenUsuario(false);
    } 
    

    return (
        <>
        <div className='p-4'>
            <div className='flex w-full space-x-4 justify-between'>
                <button 
                className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex justify-start'
                onClick={() => handleOpenModal('usuario')}
                > 
                    Añadir usuario
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
                    onClick={handleSortByField}
                    > 
                        Buscar
                    </button>
                </div>
                </div>
            </div>
            <div className='w-fit mx-auto'>
                <div className='p-2'>
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
                                            Contraseña
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
                                                    <span>********</span>
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
            {isOpenUsuario && (
              <Modal_addUser 
              isOpen={isOpenUsuario} 
              setIsOpen={handleCloseModal}
              handleUpdate={handleUpdate}  
              />
            )}
            <div className='p-4 space-x-4'> 
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