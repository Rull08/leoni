'use client'
import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
import ProductionGrid from '@/components/datagrid';

const tabs = [
  { name: 'Inventario'},
  { name: 'Usuarios', component: <ProductionGrid /> },
];

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const InventoryTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        {/* Pestañas */}
        <TabList className="flex space-x-1 rounded-xl bg-gray-800 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  selected
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>

        {/* Contenido dinámico según la pestaña */}
        <TabPanels className="mt-4 p-4 bg-white shadow-md rounded-lg">
          {tabs[selectedIndex].component}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default InventoryTabs;
