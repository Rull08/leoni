'use client';
import { useState } from 'react'
import socket from '../utils/socket'

const Entrada_producto = () => {
    const [clasificacion, setClasificacion] = useState('');
    const [num_parte, setNum_parte] = useState('');
    const [num_serie, setNum_serie] = useState('');
    const [cant_kilos, setCant_kilos] = useState('');
    const [cant_metros, setCant_metros] = useState('');
    const [operador, setOperador] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [tipo, setTipo] = useState('');
    const [fecha_produccion, setFecha_produccion] = useState('');

    const handleSubmit = async (e) => {
        e.preventfault();

        const response = await fetch('/api/add-product', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clasificacion, num_parte, num_serie, cant_kilos, cant_metros, operador, ubicacion, tipo, fecha_produccion }),
        });

        if (response.ok) {
            
        } else {
            
        }
    };

    return (
        <div>
            <h2>Agregar Producto</h2>
            <form onSubmit={handleSubmit}>
                <label>clasificacion:</label>
                <input
                    type="text"
                    value={clasificacion}
                    onChange={(e) => setClasificacion(e.target.value)}
                />

                <label>Numero de parte:</label>
                <input
                    type="number"
                    value={num_parte}
                    onChange={(e) => setNum_parte(e.target.value)}
                />

                <label>Numero de serie:</label>
                <input
                    type="number"
                    value={num_serie}
                    onChange={(e) => setNum_serie(e.target.value)}
                />

                <label>Cantidad en Kilos:</label>
                <input
                    type="number"
                    value={cant_kilos}
                    onChange={(e) => setCant_kilos(e.target.value)}
                />

                <label>Cantidad en metros:</label>
                <input
                    type="number"
                    value={cant_metros}
                    onChange={(e) => setCant_metros(e.target.value)}
                />

                <label>Operador:</label>
                <input
                    type="number"
                    value={operador}
                    onChange={(e) => setOperador(e.target.value)}
                />

                <label>Ubicacion:</label>
                <input
                    type="number"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                />

                <label>Tipo:</label>
                <input
                    type="number"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                />

                <label>Fecha de Produccion:</label>
                <input
                    type="date"
                    value={fecha_produccion}
                    onChange={(e) => setFecha_produccion(e.target.value)}
                />

                <button type="submit">Agregar Entrada</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Entrada_producto;