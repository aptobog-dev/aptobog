import { useMemo, useState, useEffect } from "react";
import ApartamentoCard from "./components/ApartamentoCard";
import Sidebar from "./components/Sidebar";
import AddLinkBar from "./components/AddLinkBar";
import Stats from "./components/Stats";

export default function PrototipoGestorInmuebles() {
  const [vista, setVista] = useState("tarjetas");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPortal, setFiltroPortal] = useState("Todos");
  const [filtroPrecio, setFiltroPrecio] = useState("Todos");
  const [textoLinks, setTextoLinks] = useState("");
  const [mensajeCarga, setMensajeCarga] = useState("");
  const [cargandoLinks, setCargandoLinks] = useState(false);

  const detectarPortal = (url) => {
    const lower = url.toLowerCase();
    if (lower.includes("fincaraiz")) return "Finca Raíz";
    if (lower.includes("metrocuadrado")) return "Metrocuadrado";
    if (lower.includes("ciencuadras")) return "Ciencuadras";
    if (lower.includes("olx")) return "OLX";
    return "Otro";
  };

  const limpiarSlug = (texto) => {
    return texto
      .replace(/[-_]+/g, " ")
      .replace(/\b\d{6,}\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const capitalizarTitulo = (texto) => {
    return texto
      .split(" ")
      .filter(Boolean)
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  };

  const inferirTituloDesdeUrl = (url) => {
    try {
      const { pathname } = new URL(url);
      const segmentos = pathname.split("/").filter(Boolean);
      const ultimo = segmentos[segmentos.length - 1] || "";
      const penultimo = segmentos[segmentos.length - 2] || "";
      const base = limpiarSlug(`${penultimo} ${ultimo}`);

      if (!base) return "Inmueble agregado desde link";
      return capitalizarTitulo(base);
    } catch {
      return "Inmueble agregado desde link";
    }
  };

  const inferirZonaDesdeUrl = (url) => {
    try {
      const texto = limpiarSlug(new URL(url).pathname).toLowerCase();

      const zonas = [
        "cedritos",
        "suba",
        "colina",
        "hayuelos",
        "mazuren",
        "mazurén",
        "quinta camacho",
        "chapinero",
        "usaquen",
        "usaquén",
        "bogota",
        "bogotá",
      ];

      const encontradas = zonas.filter((zona) => texto.includes(zona));

      if (!encontradas.length) return "Pendiente de extraer";

      return capitalizarTitulo(encontradas.join(" · "));
    } catch {
      return "Pendiente de extraer";
    }
  };

  const crearInmuebleDesdeLink = (url, indice) => {
    const portal = detectarPortal(url);
    const tituloInferido = inferirTituloDesdeUrl(url);
    const zonaInferida = inferirZonaDesdeUrl(url);

    return {
      id: Date.now() + indice,
      titulo: tituloInferido,
      portal,
      precio: 0,
      precioTexto: "Pendiente de extraer",
      area: "Pendiente de extraer",
      habitaciones: "-",
      zona: zonaInferida,
      estado: "por_consultar",
      fechaVisita: "",
      duplicado: false,
      nota: "Registro agregado desde link. Falta extracción automática real.",
      url,
    };
  };

  const [inmuebles, setInmuebles] = useState(() => {
    const guardado = localStorage.getItem("aptobog_inmuebles");

    return guardado
      ? JSON.parse(guardado)
      : [
          {
            id: 1,
            titulo: "Apartamento en Cedritos",
            portal: "Finca Raíz",
            precio: 420000000,
            precioTexto: "$420.000.000",
            area: "72 m²",
            habitaciones: 3,
            zona: "Bogotá · Cedritos",
            estado: "por_consultar",
            fechaVisita: "",
            duplicado: false,
            nota: "Buen perfil. Llamar mañana en la mañana.",
            url: "https://www.fincaraiz.com.co/apartamento-cedritos",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("aptobog_inmuebles", JSON.stringify(inmuebles));
  }, [inmuebles]);

  const cambiarEstado = (id, nuevoEstado) => {
    setInmuebles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: nuevoEstado } : item
      )
    );
  };

  const actualizarNota = (id, nuevaNota) => {
    setInmuebles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, nota: nuevaNota } : item
      )
    );
  };

  const eliminarDescartados = () => {
    const hayDescartados = inmuebles.some(
      (item) => item.estado === "descartado"
    );

    if (!hayDescartados) {
      alert("No hay apartamentos descartados para eliminar.");
      return;
    }

    const confirmar = window.confirm(
      "¿Deseás eliminar todos los apartamentos descartados?"
    );

    if (!confirmar) return;

    setInmuebles((prev) =>
      prev.filter((item) => item.estado !== "descartado")
    );
  };

  const asignarFechaVisita = (id, fecha, hora) => {
    if (!fecha || !hora) return;

    const fechaHora = `${fecha} ${hora}`;

    setInmuebles((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, estado: "agendado", fechaVisita: fechaHora }
          : item
      )
    );
  };

  const agregarLinks = async () => {
    if (cargandoLinks) return;
    setCargandoLinks(true);

    try {
      const links = textoLinks
        .split(/\r?\n/)
        .map((linea) => linea.trim())
        .filter(Boolean);

      if (!links.length) {
        setMensajeCarga("Pegá al menos un link para agregarlo.");
        return;
      }

      const urlsValidas = [];
      const invalidas = [];

      links.forEach((link) => {
        try {
          const url = new URL(link);
          urlsValidas.push(url.href);
        } catch {
          invalidas.push(link);
        }
      });

      const existentes = new Set(
        inmuebles.map((item) => item.url?.toLowerCase()).filter(Boolean)
      );

      const nuevas = [];
      let duplicadas = 0;

      for (const [indice, url] of urlsValidas.entries()) {
        if (existentes.has(url.toLowerCase())) {
          duplicadas += 1;
          continue;
        }

        const base = crearInmuebleDesdeLink(url, indice);

        try {
          const respuesta = await fetch(
            "https://aptobog-backend.onrender.com/scrap",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ url }),
            }
          );

          const data = await respuesta.json();

          nuevas.push({
            ...base,
            titulo: data?.titulo || base.titulo,
            precioTexto: data?.precioTexto || base.precioTexto,
            area: data?.area || base.area,
            habitaciones: data?.habitaciones || base.habitaciones,
            nota: data?.ok ? "Datos leídos desde el backend." : base.nota,
          });
        } catch (error) {
          nuevas.push(base);
        }

        existentes.add(url.toLowerCase());
      }

      if (nuevas.length) {
        setInmuebles((prev) => [...nuevas, ...prev]);
      }

      const partes = [];
      if (nuevas.length) partes.push(`${nuevas.length} link(s) agregado(s)`);
      if (duplicadas) partes.push(`${duplicadas} duplicado(s)`);
      if (invalidas.length) partes.push(`${invalidas.length} inválido(s)`);

      setMensajeCarga(partes.length ? partes.join(" · ") : "No hubo cambios.");
      setTextoLinks("");
    } catch (error) {
      console.error("Error agregando links:", error);
      setMensajeCarga("Ocurrió un error procesando los links.");
    } finally {
      setCargandoLinks(false);
    }
  };

  const badgeClass = (estado) => {
    switch (estado) {
      case "por_consultar":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "contactado":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "agendado":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "visitado":
        return "bg-violet-500/20 text-violet-400 border border-violet-500/30";
      case "favorito":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "descartado":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      default:
        return "bg-zinc-700 text-zinc-300";
    }
  };

  const filtrados = useMemo(() => {
    return inmuebles.filter((item) => {
      const coincideBusqueda =
        item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.zona.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.portal.toLowerCase().includes(busqueda.toLowerCase());

      const coincideEstado =
        filtroEstado === "Todos" || item.estado === filtroEstado;

      const coincidePortal =
        filtroPortal === "Todos" || item.portal === filtroPortal;

      const coincidePrecio =
        filtroPrecio === "Todos" ||
        (filtroPrecio === "Hasta 400M" && item.precio <= 400000000) ||
        (filtroPrecio === "400M - 500M" &&
          item.precio > 400000000 &&
          item.precio <= 500000000) ||
        (filtroPrecio === "Más de 500M" && item.precio > 500000000) ||
        (filtroPrecio === "Pendiente" && item.precio === 0);

      return (
        coincideBusqueda && coincideEstado && coincidePortal && coincidePrecio
      );
    });
  }, [inmuebles, busqueda, filtroEstado, filtroPortal, filtroPrecio]);

  const resumen = {
    total: inmuebles.length,
    porConsultar: inmuebles.filter((i) => i.estado === "por_consultar").length,
    consultados: inmuebles.filter((i) => i.estado === "contactado").length,
    descartados: inmuebles.filter((i) => i.estado === "descartado").length,
    favoritos: inmuebles.filter((i) => i.estado === "favorito").length,
    agendados: inmuebles.filter((i) => i.estado === "agendado").length,
    visitados: inmuebles.filter((i) => i.estado === "visitado").length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar
        resumen={resumen}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        eliminarDescartados={eliminarDescartados}
      />

      <main className="flex-1 p-6 space-y-6 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Todos los apartamentos
            </h2>
            <p className="text-zinc-400 mt-1">
              Primero importás los links que te gustaron, luego los filtrás y
              les hacés seguimiento.
            </p>
          </div>

          <div className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
            <button
              type="button"
              onClick={() => setVista("tarjetas")}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                vista === "tarjetas" ? "bg-white text-black" : "text-zinc-400"
              }`}
            >
              Tarjetas
            </button>

            <button
              type="button"
              onClick={() => setVista("lista")}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                vista === "lista" ? "bg-white text-black" : "text-zinc-400"
              }`}
            >
              Lista
            </button>
          </div>
        </div>

        <AddLinkBar
          textoLinks={textoLinks}
          setTextoLinks={setTextoLinks}
          agregarLinks={agregarLinks}
          mensajeCarga={mensajeCarga}
        />

        <Stats resumen={resumen} />

        <section className="bg-zinc-950/70 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none min-w-[220px]"
                placeholder="Buscar por zona, portal o título"
              />

              <select
                value={filtroPrecio}
                onChange={(e) => setFiltroPrecio(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none"
              >
                <option>Todos</option>
                <option>Hasta 400M</option>
                <option>400M - 500M</option>
                <option>Más de 500M</option>
                <option>Pendiente</option>
              </select>

              <select
                value={filtroPortal}
                onChange={(e) => setFiltroPortal(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none"
              >
                <option>Todos</option>
                <option>Finca Raíz</option>
                <option>Metrocuadrado</option>
                <option>Ciencuadras</option>
                <option>OLX</option>
                <option>Otro</option>
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none"
              >
                <option value="Todos">Todos</option>
                <option value="por_consultar">Por consultar</option>
                <option value="contactado">Contactado</option>
                <option value="agendado">Agendado</option>
                <option value="visitado">Visitado</option>
                <option value="favorito">Favorito</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>

            <p className="text-zinc-400 text-sm">{filtrados.length} resultados</p>
          </div>

          {vista === "tarjetas" ? (
            <div className="grid grid-cols-1 gap-5 pt-1">
              {filtrados.map((item) => (
                <ApartamentoCard
                  key={item.id}
                  item={item}
                  cambiarEstado={cambiarEstado}
                  asignarFechaVisita={asignarFechaVisita}
                  badgeClass={badgeClass}
                  actualizarNota={actualizarNota}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="text-left px-4 py-3">Apartamento</th>
                    <th className="text-left px-4 py-3">Portal</th>
                    <th className="text-left px-4 py-3">Zona</th>
                    <th className="text-left px-4 py-3">Precio</th>
                    <th className="text-left px-4 py-3">Estado</th>
                    <th className="text-left px-4 py-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtrados.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-zinc-800 bg-zinc-950"
                    >
                      <td className="px-4 py-4 font-medium">{item.titulo}</td>
                      <td className="px-4 py-4 text-zinc-300">{item.portal}</td>
                      <td className="px-4 py-4 text-zinc-300">{item.zona}</td>
                      <td className="px-4 py-4 text-orange-400 font-semibold">
                        {item.precioTexto}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${badgeClass(
                            item.estado
                          )}`}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(item.url, "_blank")}
                            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"
                          >
                            Abrir
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nuevaNota = prompt(
                                "Escribí o editá la nota:",
                                item.nota || ""
                              );

                              if (nuevaNota !== null) {
                                actualizarNota(item.id, nuevaNota);
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"
                          >
                            Nota
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}