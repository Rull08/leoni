'use client'
import React from 'react'
import { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineDownload, AiOutlineSortAscending, AiOutlineDown } from 'react-icons/ai';
import api from '@/utils/api';

const ProductionGrid = () => {
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);

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

    const downloadCSV = () => {
        alert('Downloading CSV...');
    };

    const handleSortByName = () => {
        console.log('Sorting by name...');
    };

    return (

        
        <div className='p-4'> 
            <div className='flex Justify-between items-center mb-4'>
                <div className='flex space-x-4'>
                    <h1 className='text-2xl font-bold'>Inventario</h1>
                </div>
                <div className='flex space-x-4'>
                    <button onClick={downloadCSV} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDownload className='mr-12' /> Export to CSV
                    </button>
                    <button onClick={handleSortByName} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineSortAscending className='mr-2' /> Sort by Name
                    </button>
                    
                    <button onClick={handleSortByName} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Sort by Name
                    </button>
                </div>
                <div className=''>
                    <button className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex' > 
                        Agregar
                    </button>
                </div>
            </div>
            <div className='overflow-x-auto'>
                {error && <p>{error}</p>}
                {!error && materials.length > 0 && (
                    <table className='min-w-full table-auto'>
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
                                <td className='px-4 py-2 flex justify-start items-center space-x-2'>
                                    <div className='flex items-center gap-4 h-full'>
                                        <button className='text-blue-500 hover:text-blue-700'><AiOutlineEdit /></button>
                                        <button className='text-red-500 hover:text-red-700'><AiOutlineDelete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
            <div className="flex items-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="px-5 mx-auto w-full lg:container">
        <div className="max-w-screen-lg mx-auto">
            <div className="min-w-full my-10 overflow-x-auto border rounded-md shadow-sm">
                <table className="min-w-full bg-white rounded whitespace-nowrap">
                    <thead className="border-b bg-gray-50">
                        <tr className="">
                            <th className="px-3 py-3 text-center ">
                                <div className="flex place-content-center">
                                    <input type="checkbox" name="select_all" id="select_all" className="w-4 h-4 rounded opacity-50" />
                                </div>
                            </th>
                            <th className="px-3 py-3 text-xs font-normal text-left text-gray-500 uppercase align-middle">Order ID</th>
                            <th className="px-3 py-3 text-xs font-normal text-left text-gray-500 uppercase align-middle">Date</th>
                            <th className="px-3 py-3 text-xs font-normal text-left text-gray-500 uppercase align-middle">Customer</th>
                            <th className="px-3 py-3 text-xs font-normal text-left text-gray-500 uppercase align-middle">Status</th>
                            <th className="px-3 py-3 text-xs font-normal text-right text-gray-500 uppercase align-middle">Amount</th>
                            <th className="px-3 py-3 text-xs font-normal text-left text-gray-500 uppercase align-middle"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="w-20 px-3 py-4 text-center">
                                <input type="checkbox" name="select" className="w-4 h-4 rounded opacity-50" />
                            </td>
                            <td className="px-3 py-4 text-gray-600 ">#102-325-2565</td>
                            <td className="px-3 py-4 text-gray-500 ">May 07, 2021</td>
                            <td className="px-3 py-4">
                                <div className="flex items-center w-max">
                                    <img width="50" height="50" className="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1506085452766-c330853bea50?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=faces&amp;fit=crop&amp;h=200&amp;w=200&amp;s=3e378252a934e660f231666b51bd269a" alt="avatar" />
                                    <div className="ml-4">
                                        <div>Chase Maxwell</div>
                                        <div className="text-sm text-gray-400">chase@anothercompany.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4">
                                <span className="px-4 py-1 text-sm text-green-500 rounded-full bg-green-50">completed</span>
                            </td>
                            <td className="px-3 py-4 text-right text-gray-500 ">$125.00</td>
                            <td className="w-20 px-3 py-2 text-center text-gray-500 ">
                                <div className="flex place-content-center">
                                    <a href="#!">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-20 px-3 py-4 text-center">
                                <input type="checkbox" name="select" className="w-4 h-4 rounded opacity-50" />
                            </td>
                            <td className="px-3 py-4 text-gray-600">#102-325-2565</td>
                            <td className="px-3 py-4 text-gray-600">Oct 30, 2021</td>
                            <td className="px-3 py-4">
                                <div className="flex items-center w-max">
                                    <img width="50" height="50" className="w-10 h-10 rounded-full" src="https://uifaces.co/our-content/donated/N5PLzyan.jpg" alt="avatar" />
                                    <div className="ml-4">
                                        <div>Cristofer Dorwart</div>
                                        <div className="text-sm text-gray-400">chris@ourcompany.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4">
                                <span className="px-4 py-1 text-sm text-green-500 rounded-full bg-green-50">completed</span>
                            </td>
                            <td className="px-3 py-4 text-right text-gray-600">$260.00</td>
                            <td className="w-20 px-3 py-2 text-center text-gray-500">
                                <div className="flex place-content-center">
                                    <a href="#!">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-20 px-3 py-4 text-center">
                                <input type="checkbox" name="select" className="w-4 h-4 rounded opacity-50" />
                            </td>
                            <td className="px-3 py-4 text-gray-600">#102-325-2565</td>
                            <td className="px-3 py-4 text-gray-600">Sep 16, 2021</td>
                            <td className="px-3 py-4">
                                <div className="flex items-center w-max">
                                    <img width="50" height="50" className="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1509868918748-a554ad25f858?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=faces&amp;fit=crop&amp;h=200&amp;w=200&amp;s=3159ec467959b2aada4b75d565c270aa" alt="avatar" />
                                    <div className="ml-4">
                                        <div>Zahraa Duncan</div>
                                        <div className="text-sm text-gray-400">zahraa@ourcompany.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4">
                                <span className="px-4 py-1 text-sm text-yellow-500 rounded-full bg-yellow-50">in-progress</span>
                            </td>
                            <td className="px-3 py-4 text-right text-gray-600">$75.00</td>
                            <td className="w-20 px-3 py-2 text-center text-gray-500">
                                <div className="flex place-content-center">
                                    <a href="#!">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-20 px-3 py-4 text-center">
                                <input type="checkbox" name="select" className="w-4 h-4 rounded opacity-50" />
                            </td>
                            <td className="px-3 py-4 text-gray-600">#102-325-2565</td>
                            <td className="px-3 py-4 text-gray-600">Aug 14, 2021</td>
                            <td className="px-3 py-4">
                                <div className="flex items-center w-max">
                                    <img width="50" height="50" className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/men/10.jpg" alt="avatar" />
                                    <div className="ml-4">
                                        <div>Viktor Xiong</div>
                                        <div className="text-sm text-gray-400">vicktor@supercompany.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4">
                                <span className="px-4 py-1 text-sm text-green-500 rounded-full bg-green-50">completed</span>
                            </td>
                            <td className="px-3 py-4 text-right text-gray-600">$326.00</td>
                            <td className="w-20 px-3 py-2 text-center text-gray-500">
                                <div className="flex place-content-center ">
                                    <a href="#!">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-20 px-3 py-4 text-center">
                                <input type="checkbox" name="select" className="w-4 h-4 rounded opacity-50" />
                            </td>
                            <td className="px-3 py-4 text-gray-600">#102-325-2565</td>
                            <td className="px-3 py-4 text-gray-600">May 10, 2021</td>
                            <td className="px-3 py-4">
                                <div className="flex items-center w-max">
                                    <img width="50" height="50" className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/men/18.jpg" alt="avatar" />
                                    <div className="ml-4">
                                        <div>Cristiano Summers</div>
                                        <div className="text-sm text-gray-400">me@ourbestcompany.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4">
                                <span className="px-4 py-1 text-sm text-red-500 rounded-full bg-red-50">cancelled</span>
                            </td>
                            <td className="px-3 py-4 text-right text-gray-600">$250.00</td>
                            <td className="w-20 px-3 py-2 text-center text-gray-500">
                                <div className="flex place-content-center">
                                    <a href="#!">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-20 px-3 py-4 text-center">
                                <input type="checkbox" name="select" className="w-4 h-4 rounded opacity-50" />
                            </td>
                            <td className="px-3 py-4 text-gray-600">#102-325-2565</td>
                            <td className="px-3 py-4 text-gray-600">Jun 28, 2021</td>
                            <td className="px-3 py-4">
                                <div className="flex items-center w-max">
                                    <img width="50" height="50" className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/women/17.jpg" alt="avatar" />
                                    <div className="ml-4">
                                        <div>Kerrie Webster</div>
                                        <div className="text-sm text-gray-400">kerrie@ourcompany.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4">
                                <span className="px-4 py-1 text-sm text-green-500 rounded-full bg-green-50">completed</span>
                            </td>
                            <td className="px-3 py-4 text-right text-gray-600">$175.00</td>
                            <td className="w-20 px-3 py-2 text-center text-gray-500">
                                <div className="flex place-content-center">
                                    <a href="#!">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
        </div>
        
    );
}

export default ProductionGrid;