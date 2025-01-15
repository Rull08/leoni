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
        const response = await api.get('/ubications')
        const data = response.data;
        console.log(data)
        const formattedLists = formatData(data);
        setLists(formattedLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatData = (data) => {
    const formatted = {};

    // Crear 60 espacios fijos
    for (let i = 0; i < 60; i++) {
        formatted[i] = {
            id: i.toString(),
            title: `Ubicación ${i}`,
            items: []
        };
    }

    // Agregar los materiales a las ubicaciones correspondientes
    data.forEach((item) => {
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
          <Droppable key={list.id} 
            droppableId={list.id} 
            isDropDisabled = {false}
            isCombineEnabled = {true}
            ignoreContainerClipping = {true}
        >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="w-auto p-2 bg-gray-100 rounded-md">
                <Disclosure>
                  {({ open }) => (
                    <div>
                      <DisclosureButton className="w-full text-left font-medium text-xs">
                        {list.title} {open ? '-' : '+'}
                      </DisclosureButton>
                      <DisclosurePanel as="div" className="mt-2">
                        {list.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        ))}
                        {provided.placeholder}
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
