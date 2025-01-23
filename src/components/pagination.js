'use client'
import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                    Mostrando página {currentPage} de {totalPages}
                </p>
                <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                        onClick={handlePrev}
                        className="px-2 py-2 border rounded-l-md text-gray-400 hover:bg-gray-50"
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-2 py-2 border rounded-r-md text-gray-400 hover:bg-gray-50"
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Pagination