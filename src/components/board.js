'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Modal_entradas from '@/components/modal_entrada';
import Modal_salidas from '@/components/modal_salida';
import api from '@/utils/api'

const Board = () => {
  const [board, setBoard] = useState(
    Array.from({ length: 16 }, () => Array.from({ length: 4 }, () => null))
  );

  const columnMap = { A: 0, B: 1, C: 2, D: 3 };
  const reverseColumnMap = ['A', 'B', 'C', 'D'];

  const [error, setError] = useState(null);
  
  const [draggingBlock, setDraggingBlock] = useState(null);

  const [isOpenEntradas, setIsOpenEntradas] = useState(false);
  const [isOpenSalidas, setIsOpenSalidas] = useState(false);

  const [rowSelected, setRowSelected] = useState(null);
  const [colSelected, setColSelected] = useState(null);

  const fetchUbications = async () => {
    try {
      const response = await api.get('/ubications')
      const data = response.data;
      console.log(data)
      const newBoard = Array.from({ length: 16}, () =>
        Array.from({ length: 4 }, () => null)
      );
      data.forEach(({ columna, estado, fila, num_parte }) => {
        const colIndex = columnMap[columna.toUpperCase()];
        const adjustedRow = fila - 1;
        if (colIndex >= 0 && colIndex < 4 && adjustedRow >= 0 && adjustedRow < 16) {
          newBoard[adjustedRow][colIndex] = estado ? String(num_parte.toUpperCase()) : null;
        } else {
          console.error(`Fila o columna fuera de rango: columna=${columna}, fila=${fila}`);
        }
      });
      setBoard(newBoard);
    } catch(err) {
        console.error("Error obteniendo ubicaciones:", err)
        setError('Error obteniendo ubicaciones')
    }
  };
    useEffect(() => {
    fetchUbications();
  },  []);

  const handleDelete = async () => {
    console.log(rowSelected, colSelected, "Ubicacion")
    try {
        const response = await api.post('/output', {
        ubication: String(rowSelected, colSelected)
        }
      );
    if (response.status === 200) {
      console.log("Salida de material");
      removeBlock();
    }
    } catch (error) {
        console.error('Error al dar saliada al material:', error);
        setError('Ocurrio un error al dar salida al material.');
    }
};
  
  const handleDragStart = (row, col) => {
    setDraggingBlock({ row, col });
  };

  const handleDrop = (row, col) => {
    if (!draggingBlock) return;

    if (draggingBlock.row === row && draggingBlock.col === col) return;

    const newBoard = [...board];
    const draggedBlockValue = newBoard[draggingBlock.row][draggingBlock.col];
    newBoard[draggingBlock.row][draggingBlock.col] = newBoard[row][col];
    newBoard[row][col] = draggedBlockValue;

    setBoard(newBoard);
    setDraggingBlock(null);
  };

  const addBlock = async (row, col) => {
    try{
      if (board[row][col] === null) {
        const newBoard = [...board];
        newBoard[row][col] = 'Ocupado'; 
        fetchUbications();
      }
    } catch (err){
      console.log("Ocurrio un error: ", err);
    }
  };

  const removeBlock = async (row, col) => {
    if (board[row][col] !== null) {
      console.log(row, col, "Mandados");
      setRowSelected(row);
      setColSelected(col);
      console.log(rowSelected, colSelected, "Recibidos")
      handleDelete();
      const newBoard = [...board];
      newBoard[row][col] = null;
      fetchUbications();
    }
  };

  const handleOpenModal = (modalType, row, col) => {
    setRowSelected(row);
    setColSelected(col);
    if (modalType === 'entradas') setIsOpenEntradas(true)
    if (modalType === 'salidas') setIsOpenSalidas(true);
  };

  const getLocationName = (rowIndex, colIndex) => {
    return `${reverseColumnMap[colIndex]}${rowIndex + 1}`;
  };
  
  return (
    <>
      <div className="grid grid-cols-4 gap-2 p-4">
        {board.map((row, rowIndex) =>
          row.map((block, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`cursor-grab rounded border p-3 active:cursor-grabbing ${
                block
                  ? 'border-neutral-700 bg-neutral-800 text-sm text-neutral-100'
                  : 'bg-gray-300 items-center'
              }`}
              draggable={block !== null}
              onDragStart={() => handleDragStart(rowIndex, colIndex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(rowIndex, colIndex)}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {block}
              {block ? (
                <button
                  className="text-red-700 ml-2"
                  onClick={() => removeBlock(rowIndex, colIndex)}
                >
                  X
                </button>
              ) : (
                <button
                  className="text-blue-500 size-full"
                  onClick={() => handleOpenModal('entradas', rowIndex, colIndex)}
                >
                  <div className='flex '>
                    {getLocationName(rowIndex, colIndex)}
                  </div>
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
      {isOpenEntradas && (
        <Modal_entradas
        isOpen={isOpenEntradas}
        setIsOpen={setIsOpenEntradas}
        onClose={() => addBlock(rowSelected, colSelected)}
        row = {rowSelected}
        col = {colSelected}
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