'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from "react-icons/fi";
import Modal_entradas from '@/components/modal_entrada';
import api from '@/utils/api'

const Board = () => {
  const [board, setBoard] = useState(
    Array.from({ length: 4 }, () => Array.from({ length: 16 }, () => null))
  );

  const [ubications, setUbications] = useState([]);
  const [error, setError] = useState(null);
  
  const [draggingBlock, setDraggingBlock] = useState(null);

  const [isOpenEntradas, setIsOpenEntradas] = useState(false);
  const [isOpenSalidas, setIsOpenSalidas] = useState(false);

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

  const addBlock = (row, col, value) => {
    if (board[row][col] === null) {
      const newBoard = [...board];
      newBoard[row][col] = value;
      setBoard(newBoard);
    }
  };

  const removeBlock = (row, col) => {
    const newBoard = [...board];
    newBoard[row][col] = null;
    setBoard(newBoard);
  };

  const openModal = () => {
    setIsOpenEntradas(true);
  };

  const closeModal = () => {
    setIsOpenEntradas(false);
  };

  useEffect(() => {
    const setUbications = async() => {
        try {
          const response = await api.get('/ubications')
          setUbications(response.data)
        } catch (error) {
          setError('Error obteniendo ubicaciones');
          console.error(error)
        }
    };
    setUbications();
  }, []);

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
                  className="text-blue-700"
                  onClick={openModal}
                >
                  <FiPlus />
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
        onClose={addBlock}
        />
      )}
    </>
  );
};

export default Board;
