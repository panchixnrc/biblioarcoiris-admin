import { Context } from "./context.js";
import { useState, useEffect } from "react";

const BibliotecaProvider = ({ children }) => {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [primeraBusqueda, setPrimeraBusqueda] = useState(false);
  const [totalArchivosDB, setTotalArchivosDB] = useState(0);

  useEffect(() => {
    traerTotalArchivos();
  }, []);

  const traerTotalArchivos = async () => {
    fetch("https://arcoiris-api.vercel.app/archivos?total=true")
      .then((res) => res.json())
      .then((data) => setTotalArchivosDB(data.total));
  };

  const handleBusqueda = (busqueda, categorias) => {
    let url = `https://arcoiris-api.vercel.app/buscar?name=${busqueda}`;
    if (busqueda === "") {
      /* url = `http://localhost:3000/buscar?name=`; */
      setArchivos([]);
      setPrimeraBusqueda(true);
      return;
    }

    console.log(url);

    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        mostrarResultadosBusqueda(data);
      })
      .catch((err) => console.log(err));
  };
  const handleDownload = (file) => {
    fetch(`https://arcoiris-api.vercel.app/descargar/${file}`)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = file;
        a.click();
      });
  };

  const mostrarResultadosBusqueda = (resultados) => {
    setPrimeraBusqueda(false);

    setArchivos(resultados);
  };

  const traerArchivos = async () => {
    setPrimeraBusqueda(false);
    setCargando(true);
    const response = await fetch("https://arcoiris-api.vercel.app/archivos");
    const json = await response.json();

    setArchivos(json);
  };

  const borrarArchivo = async (id) => {
    const response = await fetch(
      `https://arcoiris-api.vercel.app/borrar?id=${id}`,
      {
        method: "DELETE",
      }
    );

    traerArchivos();

    const json = await response.json();
    return json;
  };

  return (
    <Context.Provider
      value={{
        archivos,
        borrarArchivo,
        mostrarResultadosBusqueda,
        setArchivos,
        setPrimeraBusqueda,
        primeraBusqueda,
        totalArchivosDB,
        handleBusqueda,
        handleDownload,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BibliotecaProvider;
