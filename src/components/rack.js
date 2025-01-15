'use client'

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';

import api from '@/utils/api'

const formatData = (data) => {
  const grid = Array.from({ length: 10 }, () => Array(6).fill(null));

  data.forEach((item) => {
      const row = Math.floor(item.ubicacion / 10); // Fila (0-5)
      const col = item.ubicacion % 10; // Columna (0-9)

      if (grid[row] && grid[row][col] === null) {
          grid[row][col] = {
            id: item.id_material,
            content: item.num_parte,
            materials: [''] // Lista de materiales en la ubicación
          };
          // Agregar material a la ubicación si ya existe
          if (grid[row] && grid[row][col]) {
              grid[row][col].materials.push(item.num_parte);
          }
      }
  });

  return grid;
};


const Board = () => {
  
  const [lists, setLists] = useState([]);
  const [expanded, setExpanded] = useState({}); 
    
  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await api.get('/ubications')
          const data = await response.data;
          const formattedLists = formatData(data);
          setLists(formattedLists);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceRow = Math.floor(source.droppableId / 10);
    const sourceCol = source.droppableId % 10;
    const destRow = Math.floor(destination.droppableId / 10);
    const destCol = destination.droppableId % 10;

    const [movedItem] = lists[sourceRow][sourceCol].splice(source.index, 1);
    lists[destRow][destCol].splice(destination.index, 0, movedItem);

    setLists([...lists]);
  };



  const toggleExpand = (rowIndex, colIndex) => {
    const key = `${rowIndex}-${colIndex}`;
    setExpanded((prev) => ({
        ...prev,
        [key]: !prev[key], // Cambiar el estado de expansión de la ubicación
    }));
  };

  if (lists.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-10 gap-4">
            {lists.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="">
                    {row.map((item, colIndex) => (
                        <Droppable
                            key={`droppable-${rowIndex}-${colIndex}`} // Asegúrate de que la clave sea única
                            droppableId={`${rowIndex * 10 + colIndex}`}
                            isDropDisabled = {false}
                            isCombineEnabled = {true}
                            ignoreContainerClipping = {true}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="w-16 h-16 p-2 bg-gray-200 border-2 border-gray-300 rounded-md"
                                >
                                    <Disclosure>
                                        {({ open }) => (
                                            <div>
                                                <DisclosureButton
                                                    className="w-full text-left font-medium"
                                                    onClick={() => toggleExpand(rowIndex, colIndex)}
                                                >
                                                    Ubicación {rowIndex * 10 + colIndex}
                                                    {open ? '-' : '+'}
                                                </DisclosureButton>
                                                {expanded[`${rowIndex}-${colIndex}`] && (
                                                    <DisclosurePanel as="div" className="mt-2">
                                                        {item.materials.length === 0 ? (
                                                            <div>No hay materiales</div>
                                                        ) : (
                                                            item.materials.map((material, index) => (
                                                                <div key={index} className="p-2 mb-2 bg-white rounded shadow">
                                                                    {material}
                                                                </div>
                                                            ))
                                                        )}
                                                    </DisclosurePanel>
                                                )}
                                            </div>
                                        )}
                                    </Disclosure>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            ))}
        </div>
    </DragDropContext>
  );
};

export default Board;

