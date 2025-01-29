import Board from "@/components/rack_test";

const rack_name = 'Cables Especiales'

export default function Cables_Especiales(){
    return(
        <>
        <h3> Esto es Piso</h3>
        <Board rack_name={rack_name}  />
        </>
    );
}