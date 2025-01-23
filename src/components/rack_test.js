'use client'

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';

import Modal_entradas from '@/components/modal_entrada';
import Modal_salidas from '@/components/modal_salida';
import api from '@/utils/api'

const Board = ({ rack_name }) => {
  const [lists, setLists] = useState([]);
  const [isOpenEntradas, setIsOpenEntradas] = useState(false);
  const [isOpenSalidas, setIsOpenSalidas] = useState(false);
  const [ubicationSelected, setUbicationSelected] = useState(null);

  useEffect(() => {
    // Función para obtener datos de la API
    const fetchData = async () => {
      try {
        const response = await api.post('/ubications', {rack_name})
        const data = response.data;
        console.log(rack_name)
        const filteredData = {
          count: data.count.filter(item => item.nombre_rack === rack_name),
          materials: data.materials,
        };
  
        console.log("Filtered Data", filteredData)
        const formattedLists = formatData(filteredData);
        
        console.log(formattedLists)
        setLists(formattedLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const formatData = (data) => {
    const formatted = [];
    console.log("data", data);

    // Crear un objeto de ubicaciones basado en id_ubicacion
    const ubicaciones = data.count.reduce((acc, item) => {
        acc[item.id_ubicacion] = item.nombre_ubicacion;
        return acc;
    }, {});

    // Obtener el rango correcto de id_ubicacion
    const minUbicacion = Math.min(...data.count.map(item => item.id_ubicacion));
    const maxUbicacion = Math.max(...data.count.map(item => item.id_ubicacion));

    // Crear listas desde minUbicacion hasta maxUbicacion
    for (let i = minUbicacion; i <= maxUbicacion; i++) {
        const nombreUbicacion = ubicaciones[i] || `Ubicación ${i}`;
        formatted.push({
            id: i.toString(),
            title: nombreUbicacion,
            items: []
        });
    }

    // Agregar los materiales a sus respectivas ubicaciones
    data.materials.forEach((item) => {
        const location = item.ubicacion;
        const formattedLocation = formatted.find(list => list.id === location.toString());
        if (formattedLocation) {
            formattedLocation.items.push({
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

  const handleAddBlock = (listId) => {
    const newBlock = {
      id: `${Date.now()}`,
      content: `Nuevo Bloque`,
    };

    const updatedLists = { ...lists };
    updatedLists[listId].items.push(newBlock);
    setLists(updatedLists);
  };

  const handleOpenModal = (modalType, ubication) => {
    setUbicationSelected(ubication);
    if (modalType === 'entradas') setIsOpenEntradas(true)
    if (modalType === 'salidas') setIsOpenSalidas(true);
  };

  return (
    <>
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
                      <DisclosureButton className="w-full h-full justify-center font-medium text-3xl">
                        {list.title} {open ? '-' : '+'}
                      </DisclosureButton>
                      <DisclosurePanel
                        as="div"
                        className={`size-max absolute top-8 left-0 right-44 bg-gray-50 rounded shadow-lg transition-all duration-300 overflow-hidden z-10`}
                        style={{
                          height: open ? `${(list.items.length <= 2 ? list.items.length + 1: list.items.length) * 50}px` : '0px',
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
                          <button
                            className="mt-2 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => handleOpenModal('entradas', list.title)}
                          >
                            Añadir Bloque
                          </button>
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
    {isOpenEntradas && (
      <Modal_entradas
      isOpen={isOpenEntradas}
      setIsOpen={setIsOpenEntradas}
      onClose={() => addBlock(ubicationSelected)}
      ubication = {ubicationSelected}
      />
    )}
    {isOpenSalidas && (
      <Modal_salidas
      isOpen={isOpenSalidas}
      setIsOpen={setIsOpenSalidas}
      onClose={removeBlock}
      />
    )}
    </>
  );
};

export default Board;
