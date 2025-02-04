'use client'

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { AiOutlineDown, AiOutlineUp, AiOutlineDelete } from 'react-icons/ai';

import Modal_entradas from '@/components/modal_entrada';
import Modal_salidas from '@/components/modal_salida';
import Modal_search from '@/components/modal_search';
import Modal_delete from '@/components/modal_delete';
import api from '@/utils/api';
import { jwtDecode } from 'jwt-decode';

const Board = ({ rack_name }) => {
  const [lists, setLists] = useState([]);

  const [isOpenEntradas, setIsOpenEntradas] = useState(false);
  const [isOpenSalidas, setIsOpenSalidas] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [ubicacion, setUbicacion] = useState('');
  const [operator, setOperator] = useState('');
  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState('')
  const [deleteSelection, setDeleteSelection] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const timestamp = new Date().getTime(); 
        const response = await api.get(`/ubications?rack_name=${rack_name}&_=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;

        let formattedLists = formatData(data);

        if (rack_name === "Cables Especiales") {
          formattedLists.reverse(); 
        }

        setLists([...formattedLists]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    

      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      setOperator(decoded.sub);
  }, [rack_name]);

  const updateData = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const timestamp = new Date().getTime(); 
      const response = await api.get(`/ubications?rack_name=${rack_name}&_=${timestamp}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      let formattedLists = formatData(data);

      if (rack_name === "Cables Especiales") {
        formattedLists.reverse(); 
      }

      setLists(formattedLists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteMaterial = async (material) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete('/delete_material', {
        serial_num: material.num_serie
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        console.log('Material eliminado correctamente');
        await updateData(); // Actualiza la vista
      }
    } catch (error) {
      console.error('Error eliminando el material', error);
    }
  };

  const handleUpdate = async () => {
    setTimeout(async () => {
      await updateData();
    }, 1000);
  };

  const handleSearch = () => {
    const getSearch = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.post('/exact_search', {
          search: searchText
        }, {
          headers: {
              Authorization: `Bearer ${token}`,  // Agregar el token en los encabezados
          },
        });
        setSearchResult(response.data);

      } catch (error) {
        setError('Error en la busqueda');
        console.error(error);
    }
    };
    getSearch();
  };

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
          content: item.num_serie
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

  const handleOpenModal = (modalType, param) => {
    setUbicacion(param);
    if (modalType === 'entradas') setIsOpenEntradas(true);
    if (modalType === 'salidas') setIsOpenSalidas(true);
    if (modalType === 'eliminar') {
      setIsOpenDelete(true) 
      setDeleteSelection(param)
    }  
    if (modalType === 'busqueda') {
      handleSearch(param)
      setIsOpenSearch(true);
    }
  };

  const handleCloseModal = async () => {
    setIsOpenSearch(false); 
} 

  const handleSortBySearch = () =>{

  };

  const handleDelete = () => {
    alert("Materil Borrado")
  };

  const gridConfigs = {
    "Cables_Especiales": "grid-cols-10 grid-rows-6",
    "Scrap": "grid-cols-4 grid-rows-5",
    "Cables_Dacar_4": "grid-cols-6 grid-rows-5",
    "Braidings": "grid-cols-10 grid-rows-6"
  };

  return (
    <>
      <div className='flex m-4 justify-evenly'>
        <button 
        className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
        onClick={() => handleOpenModal('entradas', '')}
        > 
            Ingresar Materiar
        </button>
        <button 
        className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
        onClick={handleSortBySearch}
        > 
            Retirar Material
        </button>
        <div className='flex w-1/3'>
        <input
          id="consulata"
          name="consulta"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Buscar"
        />
        <button 
        className='bg-blue-800 hover:bg-blue-900 text-white font-bold items-center py-2 px-4 rounded inline-flex'
        onClick={() => handleOpenModal('busqueda', searchText)}
        > 
            Buscar
        </button>
      </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`grid ${gridConfigs[rack_name]} gap-4 w-full`}>
          {lists.map((list, index) => {
            
            if (rack_name === "Braidings" && (index === 8 || index === 9)) {
              return <div key={`empty-${index}`} className="w-full h-16 bg-transparent "></div>;
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
                          <DisclosureButton className="size-full flex items-center justify-evenly font-medium text-2xl">
                            {list.title} {open ? <AiOutlineUp /> : <AiOutlineDown />} 
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
                                        className="flex p-2 mb-2 bg-white rounded shadow text-xs justify-between"
                                      >
                                        {item.content} <button onClick={() => handleOpenModal('eliminar', item.content)}> <AiOutlineDelete className='size-4 text-red-600' /></button>
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
            );
          })}
        </div>
      </DragDropContext>
      {isOpenEntradas && (
        <Modal_entradas 
        isOpen={isOpenEntradas} 
        setIsOpen={setIsOpenEntradas} 
        ubication={ubicacion}
        operator={operator} 
        handleUpdate={handleUpdate}   
        />
      )}
      {isOpenSalidas && (
        <Modal_salidas isOpen={isOpenSalidas} 
        setIsOpen={setIsOpenSalidas} 
        />
      )}
      {isOpenSearch && (
        <Modal_search 
          isOpen={isOpenSearch} 
          searchResult={searchResult} 
          setIsOpen={setIsOpenSearch}
          handleCloseModal={handleCloseModal}
        />
      )}
      {isOpenDelete && (
        <Modal_delete 
        handleCloseModal={() => setIsOpenDelete(false)}
        handleDeleteMaterial={handleDeleteMaterial}
        deleteSelection={deleteSelection}
        />
      )}
    </>
  );
};

export default Board;
