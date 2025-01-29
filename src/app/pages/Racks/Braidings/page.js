import Board from "@/components/rack_test";

const rack_name = 'Braidings'

export default function Braidings(){
    const navigation = [
        { name: 'Inventario', href: '/inventario'},
        { name: 'Usuarios', href: '/usuarios', modal: null },
      ];

    return(
          <Board rack_name={rack_name}  />
    );
}