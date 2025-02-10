'use client'
import React from 'react';
import { useEffect, useState } from 'react';

import api from '@/utils/api';
import Pagination from '@/components/pagination'
import { jwtDecode } from 'jwt-decode';


const Registro = () => {
    const [record, setRecord] = useState([]);
    const [sortOrder, setSortOrder] = useState('ASC');
    const [sortField, setSortField] = useState('id_registro');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [error, setError] = useState(null);

    useEffect(() => {
        const getRecord = async() => {
            try{
                const timestamp = new Date().getTime(); 
                const token = localStorage.getItem('token'); 
                const response = await api.get(`/record?page=${currentPage}&limit=${limit}&sort_field=${sortField}&sort_order=${sortOrder}&_=${timestamp}`,
                    {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setRecord(response.data.record);
                setTotalPages(response.data.total_pages)
            } catch (error) {
                setError('Error obteniendo materiales');
                console.error(error);
            }
        };
        getRecord();
    }, [currentPage, limit, sortField, sortOrder]);

    return (
        <>
            <div className='w-full'>
                <div className='p-2 '>
                    <div className='overflow-x-auto'>
                        {error && <p>{error}</p>}
                        {!error && record.length > 0 && (
                            <table className='min-w-full table-auto'>
                                <thead className='bg-blue-800'>
                                    <tr className='text-white'>
                                        <th className='px-4 py-2'>ID</th>
                                        <th className='px-4 py-2'>Usuario</th>
                                        <th className='px-4 py-2'>Rol</th>
                                        <th className='px-4 py-2'>Operacion</th>
                                        <th className='px-4 py-2'>Fecha</th>
                                        <th className='px-4 py-2'>Hora</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {record.map((record) => (
                                        <tr key={record.id_registro} className='border-r-stone-900 odd:bg-slate-300 even:bg-gray-300 text-black'>
                                            <td className='px-4 pt-2'>
                                                <div className='flex items-center jsutify-center h-full'>
                                                    {record.id_registro}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='px-4 py-2 flex justify-center h-full'>
                                                    {record.usuario}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {record.rol}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {record.operacion}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {record.fecha}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                    {record.hora}
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );
};

export default Registro;