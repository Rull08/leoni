'use client'
import React from 'react'
import { AiOutlineEdit, AiOutlineDelete, AiOutlineDownload, AiOutlineSortAscending, AiOutlineDown } from 'react-icons/ai';

const customersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', joinDate: '2021-01-10', country: 'USA' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '098-765-4321', joinDate: '2021-08-15', country: 'Canada' },
    { id: 3, name: 'Adam Smith', email: 'adam@example.com', phone: '159-753-4562', joinDate: '2020-02-20', country: 'UK' },
    { id: 4, name: 'Harry White', email: 'harry@example.com', phone: '321-654-9870', joinDate: '2019-11-09', country: 'Australia' },
    { id: 5, name: 'Samantha Brown', email: 'samantha@example.com', phone: '456-123-7890', joinDate: '2021-05-22', country: 'New Zealand' },
    { id: 6, name: 'Michael Clarke', email: 'michael@example.com', phone: '789-321-4560', joinDate: '2020-07-30', country: 'India' },
    { id: 7, name: 'Bruno Fernandes', email: 'bruno@example.com', phone: '951-753-8426', joinDate: '2022-01-15', country: 'Portugal' },
    { id: 8, name: 'Lucy Grey', email: 'lucy@example.com', phone: '852-963-7410', joinDate: '2021-09-05', country: 'USA' },
    { id: 9, name: 'Natalie Mars', email: 'natalie@example.com', phone: '654-987-3210', joinDate: '2022-04-14', country: 'Canada' },
    { id: 10, name: 'Ethan Hunt', email: 'ethan@example.com', phone: '321-456-7890', joinDate: '2020-12-24', country: 'USA' },
    { id: 11, name: 'Olivia Rodes', email: 'olivia@example.com', phone: '147-258-3690', joinDate: '2021-03-18', country: 'Spain' },
    { id: 12, name: 'Alex Mercado', email: 'alex@example.com', phone: '963-852-1470', joinDate: '2021-06-11', country: 'Mexico' }
  ];

const AdminGrid = () => {
    const downloadCSV = () => {
        alert('Downloading CSV...');
    };

    const handleSortByName = () => {
        console.log('Sorting by name...');
    };

    return (
        <div className='p-4'> 
            <div calssName='flex Justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Customers</h1>
                <div className='flex space-x-4'>
                    <button onClick={downloadCSV} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDownload className='mr-12' /> Export to CSV
                    </button>
                    <button onClick={handleSortByName} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineSortAscending className='mr-2' /> Sort by Name
                    </button>
                </div>
            </div>
            <div className='overflow-x-auto'>
                <table className='min-w-full table-auto'>
                    <thead className='='bg-gray-200>
                        <tr>
                            <th className='px-4 py-2'>Name</th>
                            <th className='px-4 py-2'>Email</th>
                            <th className='px-4 py-2'>Phone Number</th>
                            <th className='px-4 py-2'>Join Date</th>
                            <th className='px-4 py-2'>Country</th>
                            <th className='px-4 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customersData.map((customer) => (
                            <tr key={customer.id} className='border-b odd:bg-white even:bg-gray-100'>
                                <td className='px-4 py-2 flex justify-center'>{customer.name}</td>
                                <td className='px-4 pt-2'>
                                    <div className='flex items-center jsutify-center h-full'>
                                        {customer.email}
                                    </div>
                                </td>
                                <td className='px-4 py-2 flex justify-center'>{customer.phone}</td>
                                <td className='px-4 py-2'>
                                    <div className='px-4 py-2 flex justify-center h-full'>
                                        {customer.joinDate}
                                    </div>
                                </td>
                                <td className='px-4 py-2'>
                                    <div className='flex items-center justify-center h-full'>
                                        {customer.country}
                                    </div>
                                </td>
                                <td className='px-4 py-2 flex justify-start items-center space-x-2'>
                                    <div className='flex items-center gap-4 h-full'>
                                        <buttton className='text-blue-500 hover:text-blue-700'><AiOutlineEdit /></buttton>
                                        <buttton className='text-red-500 hover:text-red-700'><AiOutlineDelete /></buttton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminGrid;