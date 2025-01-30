'use client'

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';

import Modal_entradas from '@/components/modal_entrada';
import Modal_salidas from '@/components/modal_salida';
import api from '@/utils/api';

const Board = ({ rack_name }) => {
  const [lists, setLists] = useState([]);
  const [isOpenEntradas, setIsOpenEntradas] = useState(false);
  const [isOpenSalidas, setIsOpenSalidas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/ubications?rack_name=${rack_name}`);
        const data = response.data;

        let formattedLists = formatData(data);

        if (rack_name === "Cables Especiales") {
          formattedLists.reverse();  // 🔄 Se invierte la lista completa
        }

        setLists(formattedLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [rack_name]);

  const formatData = (data) => {
    let formatted = [];
    const ubicaciones = data.count.reduce((acc, item) => {
      acc[item.id_ubicacion] = item.nombre_ubicacion;
      return acc;
    }, {});

    const minUbicacion = Math.min(...data.count.map(item => item.id_ubicacion));
    const maxUbicacion = Math.max(...data.count.map(item => item.id_ubicacion));

    for (let i = minUbicacion; i <= maxUbicacion; i++) {
      const nombreUbicacion = ubicaciones[i] || `Ubicación ${i}`;
      formatted.push({
        id: i.toString(),
        title: nombreUbicacion,
        items: []
      });
    }

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = lists.findIndex(list => list.id === result.source.droppableId);
    const destinationIndex = lists.findIndex(list => list.id === result.destination.droppableId);

    const sourceList = lists[sourceIndex];
    const destinationList = lists[destinationIndex];

    const movedItem = sourceList.items.splice(result.source.index, 1)[0];
    destinationList.items.splice(result.destination.index, 0, movedItem);

    setLists([...lists]);
  };

  const gridConfigs = {
    "Cables Especiales": "grid-cols-10 grid-rows-6",
    "Scrap": "grid-cols-4 grid-rows-5",
    "Cables Dacar 4": "grid-cols-6 grid-rows-5",
    "Braidings": "grid-cols-10 grid-rows-6"
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`grid ${gridConfigs[rack_name]} gap-4 w-full`}>
          {lists.map((list, index) => {
            // 🟢 Insertar huecos en "Rack 7" en la posición 9 y 10
            if (rack_name === "Braidings" && (index === 8 || index === 9)) {
              return <div key={`empty-${index}`} className="w-full h-16 bg-transparent"></div>;
            }

            return (
              <Droppable key={`droppable-${list.id}`} 
              droppableId={list.id}
              isDropDisabled = {false}
              isCombineEnabled = {true}
              ignoreContainerClipping = {true}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="relative w-full p-2 bg-gray-100 rounded-md"
                  >
                    <Disclosure>
                      {({ open }) => (
                        <div className="relative">
                          <DisclosureButton className="w-full h-full justify-center font-medium text-3xl">
                            {list.title} {open ? '-' : '+'} {list.id} {index}
                          </DisclosureButton>
                          <DisclosurePanel
                            as="div"
                            className="size-max absolute top-8 left-0 right-44 bg-gray-50 rounded shadow-lg transition-all duration-300 overflow-hidden z-10"
                            style={{
                              height: open ? `${(list.items.length <= 2 ? list.items.length + 1 : list.items.length) * 50}px` : '0px',
                            }}
                          >
                            <div className="p-2">
                              {list.items.map((item, index) => (
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
                                onClick={() => setIsOpenEntradas(true)}
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
            );
          })}
        </div>
      </DragDropContext>

      {isOpenEntradas && (
        <Modal_entradas isOpen={isOpenEntradas} setIsOpen={setIsOpenEntradas} />
      )}
      {isOpenSalidas && (
        <Modal_salidas isOpen={isOpenSalidas} setIsOpen={setIsOpenSalidas} />
      )}
    </>
  );
};

export default Board;
