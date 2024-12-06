import Board from '@/components/board';
import '@/app/globals.css';

export default function Operator() {
  const navigation = [
    { name: 'Ubicaciones', href: '#', current: true },
    { name: 'Entradas', href: '#', current: false, modal:'entradas' },
    { name: 'Salidas', href: '#', current: false, modal: 'salidas' },
  ];
  
  return (
    <Board />
  );
}