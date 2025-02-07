'use client'
import React from 'react';

import { AiOutlineDownload } from 'react-icons/ai';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import api from '@/utils/api';

// Función para exportar los datos a Excel
const exportToExcel = async (data) => {
     try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Materials');

        // Definir las columnas del Excel
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Numero de Parte', key: 'num_parte', width: 20},
          { header: 'Numero de Serie', key: 'num_serie', width: 15 },
          { header: 'Cantidad en Metros', key: 'metros', width: 20 },
          { header: 'Usuario', key: 'usuario', width: 10 },
          { header: 'Rack', key: 'rack', width: 20 },
          { header: 'Ubicacion', key: 'ubicacion', width: 10 },
          { header: 'Fecha de Produccion', key: 'fecha_produccion', width: 20 },
          { header: 'Fecha de Entrada', key: 'fecha_entrada', width: 20 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { color: { argb: 'FFFFFF' }, bold: true }; 
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0000FF' } }; 
          cell.alignment = { horizontal: 'center', vetical:'center', wrapText: true }; 
        });

        data.forEach((item) => {
 
          worksheet.addRow({ 
            id: String(item.id_material), 
            num_parte: String(item.num_parte), 
            num_serie: String(item.num_serie),
            metros: String(item.cant_metros),
            usuario: String(item.user),
            ubicacion: String(item.ubicacion),
            rack: String(item.rack),
            fecha_produccion: String(item.fecha_produccion),
            fecha_entrada: String(item.fecha_entrada)
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        // Crear un Blob con el buffer
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'Materiales.xlsx');
  } catch (error) {
    console.error('Error al exportar el archivo Excel:', error);
  }
};

// Botón para exportar los datos a Excel
const ExportButton = ({ field, order, doe }) => {

const handleExportSearch = () => {
    const getMaterials = async() => {
        try{
            const token = localStorage.getItem('token'); 
            const response = await api.get(`/materials?obj=${doe}page=${1}&limit=${'ALL'}&sort_field=${field}&sort_order=${order}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const materials = response.data.materials;
            console.log(materials)
            if (materials && materials.length > 0) {
                exportToExcel(materials);
              } else {
                alert('No hay datos para exportar');
              }
        } catch (error) {
            alert('Error obteniendo materiales ', error);
            console.error(error);
        }
    };
    getMaterials();
};

const handleExportAll = () => {
    const getMaterials = async() => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.post('/search_materials', {
          obj: doe,
          page: 1,
          limit: 'ALL',
          sort_field: field,
          sort_order: order
        }, {
          headers: {
              Authorization: `Bearer ${token}`,  // Agregar el token en los encabezados
          },
        });
        const materials = response.data;
        console.log(materials)
        if (materials && materials.length > 0) {
          exportToExcel(materials);
          } else {
            alert('No hay datos para exportar');
          }
      } catch (error) {
        alert('Error obteniendo materiales ', error);
        console.error(error);
      }
    };
  getMaterials();
};

  return (
    <>
        <button onClick={handleExportSearch} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
            <AiOutlineDownload className='mr-12' /> Exportar Vista Actual
        </button>
        <button onClick={handleExportAll} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'>
            <AiOutlineDownload className='mr-12' /> Exportar Todo
        </button>
    </>
  );
};

export default ExportButton;