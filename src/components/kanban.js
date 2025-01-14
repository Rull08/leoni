'use client'
import React, { useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

const Board = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);
  
    return (
      <div className="flex h-full w-full gap-3 overflow-scroll p-12">
        <Column
          title="Ubicación A"
          column="ubicacion_a"
          headingColor="text-neutral-900"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Ubicación B"
          column="ubicacion_b"
          headingColor="text-neutral-900"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Ubicación C"
          column="ubicacion_c"
          headingColor="text-neutral-900"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Ubicación D"
          column="ubicacion_d"
          headingColor="text-neutral-900"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div>
    );
  };
  
  const Column = ({ title, headingColor, cards, column, setCards }) => {
    const [active, setActive] = useState(false);
  
    const handleDragStart = (e, card) => {
      e.dataTransfer.setData("cardId", card.id);
    };
  
    const handleDragEnd = (e) => {
      const cardId = e.dataTransfer.getData("cardId");
  
      setActive(false);
      clearHighlights();
  
      const indicators = getIndicators();
      const { element } = getNearestIndicator(e, indicators);
  
      const before = element.dataset.before || "-1";
  
      if (before !== cardId) {
        let copy = [...cards];
  
        let cardToTransfer = copy.find((c) => c.id === cardId);
        if (!cardToTransfer) return;
        cardToTransfer = { ...cardToTransfer, column };
  
        copy = copy.filter((c) => c.id !== cardId);
  
        const moveToBack = before === "-1";
  
        if (moveToBack) {
          copy.push(cardToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => el.id === before);
          if (insertAtIndex === undefined) return;
  
          copy.splice(insertAtIndex, 0, cardToTransfer);
        }
  
        setCards(copy);
      }
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      highlightIndicator(e);
  
      setActive(true);
    };
  
    const clearHighlights = (els) => {
      const indicators = els || getIndicators();
  
      indicators.forEach((i) => {
        i.style.opacity = "0";
      });
    };
  
    const highlightIndicator = (e) => {
      const indicators = getIndicators();
  
      clearHighlights(indicators);
  
      const el = getNearestIndicator(e, indicators);
  
      el.element.style.opacity = "1";
    };
  
    const getNearestIndicator = (e, indicators) => {
      const DISTANCE_OFFSET = 50;
  
      const el = indicators.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
  
          const offset = e.clientY - (box.top + DISTANCE_OFFSET);
  
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        {
          offset: Number.NEGATIVE_INFINITY,
          element: indicators[indicators.length - 1],
        }
      );
  
      return el;
    };
  
    const getIndicators = () => {
      return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };
  
    const handleDragLeave = () => {
      clearHighlights();
      setActive(false);
    };
  
    const filteredCards = cards.filter((c) => c.column === column);
  
    return (
      <div className="w-56 shrink-0">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-medium ${headingColor}`}>{title}</h3>
          <span className="rounded text-sm text-neutral-400">
            {filteredCards.length}
          </span>
        </div>
        <div
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`h-full w-full transition-colors ${
            active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
        >
          {filteredCards.map((c) => {
            return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
          })}
          <DropIndicator beforeId={null} column={column} />
          <AddCard column={column} setCards={setCards} />
        </div>
      </div>
    );
  };
  
  const Card = ({ title, id, column, handleDragStart }) => {
    return (
      <>
        <DropIndicator beforeId={id} column={column} />
        <motion.div
          layout
          layoutId={id}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, { title, id, column })}
          className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
        >
          <p className="text-sm text-neutral-100">{title}</p>
        </motion.div>
      </>
    );
  };
  
  const DropIndicator = ({ beforeId, column }) => {
    return (
      <div
        data-before={beforeId || "-1"}
        data-column={column}
        className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
      />
    );
  };
  
  const BurnBarrel = ({ setCards }) => {
    const [active, setActive] = useState(false);
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setActive(true);
    };
  
    const handleDragLeave = () => {
      setActive(false);
    };
  
    const handleDragEnd = (e) => {
      const cardId = e.dataTransfer.getData("cardId");
  
      setCards((pv) => pv.filter((c) => c.id !== cardId));
  
      setActive(false);
    };
  
    return (
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
          active
            ? "border-red-800 bg-red-800/20 text-red-500"
            : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
      >
        {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
      </div>
    );
  };
  
  const AddCard = ({ column, setCards }) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!text.trim().length) return;
  
      const newCard = {
        column,
        title: text.trim(),
        id: Math.random().toString(),
      };
  
      setCards((pv) => [...pv, newCard]);
  
      setAdding(false);
    };
  
    return (
      <>
        {adding ? (
          <motion.form layout onSubmit={handleSubmit}>
            <textarea
              onChange={(e) => setText(e.target.value)}
              autoFocus
              placeholder="Add new task..."
              className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
            />
            <div className="mt-1.5 flex items-center justify-end gap-1.5">
              <button
                onClick={() => setAdding(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
              >
                <span>Add</span>
                <FiPlus />
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            layout
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
          >
            <span>Add card</span>
            <FiPlus />
          </motion.button>
        )}
      </>
    );
  };
  
  const DEFAULT_CARDS = [
    // A
    { title: "Material 1", id: "1", column: "ubicacion_a" },
    { title: "Material 2", id: "2", column: "ubicacion_a" },
    { title: "Material 3", id: "3", column: "ubicacion_a" },
    { title: "Material 4", id: "4", column: "ubicacion_a" },
    { title: "Material 5", id: "5", column: "ubicacion_a" },
    { title: "Material 6", id: "6", column: "ubicacion_a" },
    { title: "Material 7", id: "7", column: "ubicacion_a" },
    { title: "Material 8", id: "8", column: "ubicacion_a" },
    { title: "Material 9", id: "9", column: "ubicacion_a" },
    { title: "Material 10", id: "10", column: "ubicacion_a" },
    { title: "Material 11", id: "11", column: "ubicacion_a" },
    { title: "Material 12", id: "12", column: "ubicacion_a" },
    { title: "Material 13", id: "13", column: "ubicacion_a" },
    { title: "Material 14", id: "14", column: "ubicacion_a" },
    { title: "Material 15", id: "15", column: "ubicacion_a" },
    { title: "Material 16", id: "16", column: "ubicacion_a" },
    // B
    { title: "Material 17", id: "17", column: "ubicacion_b" },
    { title: "Material 18", id: "18", column: "ubicacion_b" },
    { title: "Material 19", id: "19", column: "ubicacion_b" },
    { title: "Material 20", id: "20", column: "ubicacion_b" },
    { title: "Material 21", id: "21", column: "ubicacion_b" },
    { title: "Material 22", id: "22", column: "ubicacion_b" },
    { title: "Material 23", id: "23", column: "ubicacion_b" },
    { title: "Material 24", id: "24", column: "ubicacion_b" },
    { title: "Material 25", id: "25", column: "ubicacion_b" },
    { title: "Material 26", id: "26", column: "ubicacion_b" },
    { title: "Material 27", id: "27", column: "ubicacion_b" },
    { title: "Material 28", id: "28", column: "ubicacion_b" },
    { title: "Material 29", id: "29", column: "ubicacion_b" },
    { title: "Material 30", id: "30", column: "ubicacion_b" },
    { title: "Material 31", id: "31", column: "ubicacion_b" },
    { title: "Material 32", id: "32", column: "ubicacion_b" },
  
    // C
    { title: "Material 33", id: "33", column: "ubicacion_c" },
    { title: "Material 34", id: "34", column: "ubicacion_c" },
    { title: "Material 35", id: "35", column: "ubicacion_c" },
    { title: "Material 36", id: "36", column: "ubicacion_c" },
    { title: "Material 37", id: "37", column: "ubicacion_c" },
    { title: "Material 38", id: "38", column: "ubicacion_c" },
    { title: "Material 39", id: "39", column: "ubicacion_c" },
    { title: "Material 40", id: "40", column: "ubicacion_c" },
    { title: "Material 41", id: "41", column: "ubicacion_c" },
    { title: "Material 42", id: "42", column: "ubicacion_c" },
    { title: "Material 43", id: "43", column: "ubicacion_c" },
    { title: "Material 44", id: "44", column: "ubicacion_c" },
    { title: "Material 45", id: "45", column: "ubicacion_c" },
    { title: "Material 46", id: "46", column: "ubicacion_c" },
    { title: "Material 47", id: "47", column: "ubicacion_c" },
    { title: "Material 48", id: "48", column: "ubicacion_c" },
    // D
    { title: "Material 49", id: "49", column: "ubicacion_d" },
    { title: "Material 50", id: "50", column: "ubicacion_d" },
    { title: "Material 51", id: "51", column: "ubicacion_d" },
    { title: "Material 52", id: "52", column: "ubicacion_d" },
    { title: "Material 53", id: "53", column: "ubicacion_d" },
    { title: "Material 54", id: "54", column: "ubicacion_d" },
    { title: "Material 55", id: "55", column: "ubicacion_d" },
    { title: "Material 56", id: "56", column: "ubicacion_d" },
    { title: "Material 57", id: "57", column: "ubicacion_d" },
    { title: "Material 58", id: "58", column: "ubicacion_d" },
    { title: "Material 59", id: "59", column: "ubicacion_d" },
    { title: "Material 60", id: "60", column: "ubicacion_d" },
    { title: "Material 61", id: "61", column: "ubicacion_d" },
    { title: "Material 62", id: "62", column: "ubicacion_d" },
    { title: "Material 63", id: "63", column: "ubicacion_d" },
    { title: "Material 64", id: "64", column: "ubicacion_d" },
  ];

export default Board;