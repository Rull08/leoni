import Sidebar from "@/components/sidebar";

export default function Production(){
    return(
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold">Welcome to My Page</h1>
            {/* Contenido de la página */}
          </div>
        </div>
    )
}