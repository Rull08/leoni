'use client'
import React from 'react'
import { useEffect, useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineDownload, AiOutlineSortAscending, AiOutlineDown } from 'react-icons/ai';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import api from '@/utils/api';


const ProductionGrid = () => {
    const [materials, setMaterials] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
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

    const handleSortBySearch = () =>  {
      const getSearch = async () => {
          try {
              const response = await api.post('/search', {
                  obj: searchText,
              });
              setMaterials(response.data);
          } catch (error) {
              setError('Error obteniendo materiales');
              console.error(error);
          }
      };
          getSearch();
  };

// Función para exportar los datos a Excel
const exportToExcel = async (data) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Materials');

    // Definir las columnas del Excel
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Numero de Parte', key: 'num_parte', width: 50},
      { header: 'Numero de Serie', key: 'num_serie', width: 10 },
      { header: 'Clasificacion', key: 'clasificacion', width: 10 },
      { header: 'Cantidad en Kilos', key: 'kilos', width: 10 },
      { header: 'Cantidad en Metros', key: 'metros', width: 10 },
      { header: 'Usuario', key: 'usuario', width: 10 },
      { header: 'Ubicacion', key: 'ubicacion', width: 10 },
      { header: 'Tipo', key: 'tipo', width: 50 },
      { header: 'Fecha de Produccion', key: 'fecha_produccion', width: 10 },
      { header: 'Fecha de Entrada', key: 'fecha_entrada', width: 10 },
    ];

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? String(cell.value) : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      // Ajustar el ancho de la columna para que se ajuste al contenido
      column.width = maxLength + 2; // Agregar un poco de margen
    });
   worksheet.getRow(1).eachCell((cell) => {
      cell.font = { color: { argb: 'FFFFFF' }, bold: true }; 
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0000FF' } }; 
      cell.alignment = { horizontal: 'center', vetical:'center', wrapText: true }; 
    });

    data.forEach((item) => {
      const formattedProductionDate = format(new Date(item.fecha_produccion), 'yyyy-MM-dd'); 
      const formatteEntryDate = format(new Date(item.fecha_entrada), 'yyyy-MM-dd'); 

      worksheet.addRow({ 
        id: item.id_material, 
        num_parte: item.num_parte, 
        num_serie: item.num_serie, 
        clasificacion: item.nombre_clasificacion,
        kilos: item.cant_kilos,
        metros: item.cant_metros,
        usuario: item.user,
        ubicacion: item.ubicacion,
        tipo: item.tipo,
        fecha_produccion: formattedProductionDate,
        fecha_entrada: formatteEntryDate
      });
    });

    // Escribir el archivo en formato buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Crear un Blob con el buffer
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Usar FileSaver.js para guardar el archivo
    saveAs(blob, 'Materiales.xlsx');
  } catch (error) {
    console.error('Error al exportar el archivo Excel:', error);
  }
};

// Botón para exportar los datos a Excel
const handleExport = () => {
  if (materials.length > 0) {
    exportToExcel(materials); // Llamar a la función para exportar los datos
  } else {
    alert('No hay datos para exportar');
  }
};

    const handleSortByName = () => {
      const sortedMaterials = [...materials].sort((a, b) => {
          if (sortOrder === 'asc') {
              return a.num_parte.localeCompare(b.num_parte);
          } else {
              return b.num_parte.localeCompare(a.num_parte);
          }
      });
      setMaterials(sortedMaterials);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSortByDate = () => {
        const sortedMaterials = [...materials].sort((a, b) => {
            const dateA = new Date(a.fecha_produccion); // Reemplaza 'fecha' con el nombre de tu propiedad de fecha
            const dateB = new Date(b.fecha_produccion); // Reemplaza 'fecha' con el nombre de tu propiedad de fecha
            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        setMaterials(sortedMaterials);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    
    const handleSortByUbication = () => {
      const sortedMaterials = [...materials].sort((a, b) => {
          if (sortOrder === 'asc') {
              return a.ubicacion.localeCompare(b.ubicacion);
          } else {
              return b.ubicacion.localeCompare(a.ubicacion);
          }
      });
      setMaterials(sortedMaterials);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
                    <button onClick={handleSortByName} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineSortAscending className='mr-2' /> Ordenar por Nombre
                    </button>
                    <button onClick={handleSortByDate} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Ordenar por Fecha
                    </button>
                    <button onClick={handleSortByUbication} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDown className='mr-2' /> Ordenar por Ubicacion
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
                                        <th className='px-4 py-2'>Cantidad en kilos</th>
                                        <th className='px-4 py-2'>Cantidad en metros</th>
                                        <th className='px-4 py-2'>Operador</th>
                                        <th className='px-4 py-2'>Clasificacion</th>
                                        <th className='px-4 py-2'>Tipo</th>
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
                                                  {format(new Date(material.fecha_produccion), 'dd/MM/yyyy')}
                                                </div>
                                            </td>
                                            <td className='px-4 py-2'>
                                                <div className='flex items-center justify-center h-full'>
                                                  {format(new Date(material.fecha_entrada), 'dd/MM/yyyy')}
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
            <div className='p-4'>        
                    <button onClick={handleExport} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
                        <AiOutlineDownload className='mr-12' /> Exportar Excel
                    </button>
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
        </>
    );
}

export default ProductionGrid;