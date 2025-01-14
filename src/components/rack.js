'use client'

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';

const initialLists = {
  list1: { id: 'list1', title: 'Lista 1', items: Array.from({ length: 5 }, (_, k) => ({ id: `item-${k}`, content: `Item ${k}` })) },
  list2: { id: 'list2', title: 'Lista 2', items: Array.from({ length: 3 }, (_, k) => ({ id: `item-${k + 5}`, content: `Item ${k + 5}` })) },
};

const Board = () => {
  const [lists, setLists] = useState(initialLists);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response =  await fetch('/get_materials');
            const data = await response.data;
            const formattedLists = formatData(data);
            setLists(formattedLists);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
  }, []);

  const formatData = (data) => {
    const fromatted = {};
    data.forEach((rack) => {
        fromatted[rack.id] = {
            id: rack.id,
            tittle: rack.title,
            items: rack.items.map((item) => ({id:item.id, content: item.content}))
        }
    });
    return fromatted;
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
      <div className="flex space-x-4">
        {Object.values(lists).map((list) => (
            <Droppable key={list.id} droppableId={list.id} isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
                {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="w-64 p-4 bg-gray-100 rounded-md">
                    <Disclosure>
                        {({ open }) => (
                            <div>
                            <DisclosureButton className="w-full text-left font-medium">
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
                                            className="p-2 mb-2 bg-white rounded shadow"
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

