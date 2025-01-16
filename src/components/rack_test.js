'use client'

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';

import api from '@/utils/api'

const Board = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // Función para obtener datos de la API
    const fetchData = async () => {
      try {
        const response = await api.post('/ubications', {rack_name: 'Cables Especiales'})
        const data = response.data;
        const espacios = data.count.map(item => item.id_ubicacion);
        const maxEspacios = Math.max(...espacios);
        console.log(maxEspacios);
        const formattedLists = formatData(data);
        setLists(formattedLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatData = (data) => {
    const formatted = [];
    const ubicaciones = data.count.reduce((acc, item) => {
        acc[item.id_ubicacion] = item.nombre_ubicacion;
        return acc;
    }, {});
    
    const maxEspacios = Math.max(...Object.keys(ubicaciones).map(Number)) + 1;

    for (let i = 0; i < maxEspacios; i++) {
        const nombreUbicacion = ubicaciones[i] || `Ubicación ${i}`;
        formatted[i] = {
            id: i.toString(),
            title: nombreUbicacion,
            items: []
        };
    }

    data.materials.forEach((item) => {
        const location = item.ubicacion;
        if (formatted[location]) {
            formatted[location].items.push({
                id: item.id_material.toString(),
                content: item.num_parte
            });
        }
    });

    return formatted;
};

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = lists[source.droppableId];
    const destList = lists[destination.droppableId];
    const [movedItem] = sourceList.items.splice(source.index, 1);
    destList.items.splice(destination.index, 0, movedItem);

    setLists({
      ...lists,
      [sourceList.id]: sourceList,
      [destList.id]: destList,
    });
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-10 grid-rows-6 gap-4 size-full">
        {Object.values(lists).map((list) => (
          <Droppable key={`droppable-${list.id}`} 
          droppableId={list.id}
          isDropDisabled = {false}
          isCombineEnabled = {true}
          ignoreContainerClipping = {true}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="relative w-auto p-2 bg-gray-100 rounded-md">
                <Disclosure>
                  {({ open }) => (
                    <div className="relative">
                      <DisclosureButton className="w-full justify-center font-medium text-xs">
                        {list.title} {open ? '-' : '+'}
                      </DisclosureButton>
                      <DisclosurePanel
                        as="div"
                        className={`size-max absolute top-8 left-0 right-0 bg-gray-50 rounded shadow-lg transition-all duration-300 overflow-hidden z-10`}
                        style={{
                          height: open ? `${list.items.length * 50}px` : '0px',
                        }}
                      >
                        <div className="p-2">
                          {list.items && list.items.map((item, index) => (
                            item && item.id ? (
                            <Draggable key={`draggable-${item.id}`} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 mb-2 bg-white rounded shadow text-xs"
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                            ) : null
                          ))}
                          {provided.placeholder}
                        </div>
                      </DisclosurePanel>
                    </div>
                  )}
                </Disclosure>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
