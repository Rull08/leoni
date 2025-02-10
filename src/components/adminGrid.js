'use client'

import { React, useEffect, useState } from 'react';
import { AiOutlineUserDelete, AiOutlineEdit } from 'react-icons/ai';

import { format } from 'date-fns';
import api from '@/utils/api';

import Modal_addUser from '@/components/modal_addUser'
import Pagination from '@/components/pagination'

const AdminGrid = () => {

    const availableRoles = ['admin', 'produccion', 'operador'];

    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [isOpenUsuario, setIsOpenUsuario] = useState(false)

    const [editingUserId, setEditingUserId] = useState(null);
    const [editingUserData, setEditingUserData] = useState({});

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

      const handleDeleteUser = async (idUser, userName) => {
        try {
          const token = localStorage.getItem('token');
          const response = await api.delete('/delete_user', {
            params: { 
                id_user: Number(idUser),
                user_name: String(userName) 
            },
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
    
          if (response.status === 200) {
            alert('Usuario eliminado correctamente');
            handleUpdate();
          } 
        } catch (error) {
          alert("No se pudo eliminar el usuario")
        }
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

    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setEditingUserData({ ...user });
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUserData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const handleSave = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await api.put('/update_user', editingUserData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setUsers((prevUsers) =>
              prevUsers.map((u) => (u.id === editingUserId ? editingUserData : u))
            );
            setEditingUserId(null);
            setEditingUserData({});
            updateData();
          }
        } catch (error) {
          console.error('Error al actualizar usuario', error);
          setError('Error al actualizar usuario');
        }
      };
    
      const handleCancel = () => {
        setEditingUserId(null);
        setEditingUserData({});
      };   

    const handleSearch = () => {
        const getSearch = async () => {
        try{
            const token = localStorage.getItem('token');
            const response = await api.post('/search_user', {
                    search: searchText
                }, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );
                setUsers(response.data);
            } catch (error){
                setError('Error obteniendo usuarios');
                console.error(error)
            };
        };
        getSearch();
    };

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
                    onClick={handleSearch}
                    > 
                        Buscar
                    </button>
                </div>
                </div>
            </div>
            <div className='w-fit mx-auto'>
                <div className='p-2'>
                    <div className="overflow-x-auto">
                        {error && <p>{error}</p>}
                        {!error && users.length > 0 && (
                          <table className="min-w-full table-auto">
                            <thead className="bg-blue-800">
                              <tr className="text-white">
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Nombre de Usuario</th>
                                <th className="px-4 py-2">Contraseña</th>
                                <th className="px-4 py-2">Rol</th>
                                <th className="px-4 py-2"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {users.map((user) => (
                                <tr key={user.id} className="odd:bg-slate-300 even:bg-gray-300 text-black">
                                  <td className="px-4 py-2">{user.id}</td>
                                  <td className="px-4 py-2">
                                    {editingUserId === user.id ? (
                                      <input
                                        type="text"
                                        name="usuario"
                                        value={editingUserData.usuario || ''}
                                        onChange={handleInputChange}
                                        className="border p-1"
                                      />
                                    ) : (
                                      user.usuario
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingUserId === user.id ? (
                                      <input
                                        type="password"
                                        name="contrasena"
                                        value={editingUserData.contrasena || ''}
                                        onChange={handleInputChange}
                                        className="border p-1"
                                      />
                                    ) : (
                                      "********"
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingUserId === user.id ? (
                                      <select
                                        name="rol"
                                        value={editingUserData.rol || ''}
                                        onChange={handleInputChange}
                                        className="border p-1"
                                      >
                                        <option value="">Seleccione un rol</option>
                                        {availableRoles.map((role) => (
                                          <option key={role} value={role}>
                                            {role}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      user.rol
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingUserId === user.id ? (
                                      <>
                                        <button onClick={handleSave} className="mr-2 text-green-600">
                                          Guardar
                                        </button>
                                        <button onClick={handleCancel} className="text-red-600">
                                          Cancelar
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button onClick={() => handleEditClick(user)} className="mr-2">
                                          <AiOutlineEdit />
                                        </button>
                                        <button onClick={() => handleDeleteUser(user. id, user.usuario)} className="mr-2">
                                          <AiOutlineUserDelete className='text-red-600'/>
                                        </button>
                                      </>
                                    )}
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