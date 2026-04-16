import { useState } from "react";

export default function ApartamentoCard({
  item,
  cambiarEstado,
  asignarFechaVisita,
  badgeClass,
  actualizarNota,
}) {
  const [fechaTemp, setFechaTemp] = useState("");
  const [horaTemp, setHoraTemp] = useState("");

  const estadoTextoClass = (estado) => {
    switch (estado) {
      case "por_consultar":
        return "text-zinc-400";
      case "contactado":
        return "text-green-400";
      case "agendado":
        return "text-blue-400";
      case "visitado":
        return "text-violet-400";
      case "favorito":
        return "text-yellow-400";
      case "descartado":
        return "text-rose-400";
      default:
        return "text-zinc-300";
    }
  };

  const formatearEstado = (estado) => {
    switch (estado) {
      case "por_consultar":
        return "Por consultar";
      case "contactado":
        return "Contactado";
      case "agendado":
        return "Agendado";
      case "visitado":
        return "Visitado";
      case "favorito":
        return "Favorito";
      case "descartado":
        return "Descartado";
      default:
        return estado;
    }
  };

  const guardarVisita = () => {
    asignarFechaVisita(item.id, fechaTemp, horaTemp);

    if (fechaTemp && horaTemp) {
      setFechaTemp("");
      setHoraTemp("");
    }
  };

  const abrirGoogleCalendar = () => {
  if (!item.fechaVisita) return;

  const [fecha, hora] = item.fechaVisita.split(" ");
  if (!fecha || !hora) return;

  const inicio = new Date(`${fecha}T${hora}`);
  const fin = new Date(inicio.getTime() + 60 * 60 * 1000);

  const formatearFechaGoogle = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      "00"
    );
  };

  const titulo = `Visita apto - ${item.titulo}`;
  const detalles = [
    `Portal: ${item.portal}`,
    `Precio: ${item.precioTexto || "Pendiente"}`,
    `Zona: ${item.zona || "Pendiente"}`,
    `Link: ${item.url || ""}`,
    `Nota: ${item.nota || ""}`,
  ].join("\n");

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    titulo
  )}&dates=${formatearFechaGoogle(inicio)}/${formatearFechaGoogle(
    fin
  )}&details=${encodeURIComponent(detalles)}`;

  window.open(url, "_blank");
};

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4 hover:border-zinc-700 transition">
      <div className="flex justify-between items-center gap-3">
        <h3 className="text-lg font-semibold leading-tight text-white">
          {item.titulo}
        </h3>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${badgeClass(
            item.estado
          )}`}
        >
          {formatearEstado(item.estado)}
        </span>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-2 text-sm">
          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Buscador:
            </span>
            <span className="text-zinc-300">{item.portal}</span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Link:
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title={item.url}
              className="text-blue-400 underline truncate block max-w-md"
            >
              {item.url || "Pendiente"}
            </a>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Descripción del apto:
            </span>
            <span className="text-zinc-300">
              {item.titulo || "Pendiente de extraer"}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Ubicación:
            </span>
            <span className="text-zinc-300">
              {item.zona || "Pendiente de extraer"}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Área:
            </span>
            <span className="text-zinc-300">
              {item.area || "Pendiente de extraer"}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Habitaciones:
            </span>
            <span className="text-zinc-300">{item.habitaciones || "-"}</span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Parqueadero:
            </span>
            <span className="text-zinc-300">
              {item.parqueadero ?? "Pendiente"}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Precio:
            </span>
            <span className="text-orange-400 font-semibold">
              {item.precioTexto || "Pendiente"}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium w-44 inline-block">
              Estado:
            </span>
            <span className={`font-semibold ${estadoTextoClass(item.estado)}`}>
              {formatearEstado(item.estado)}
            </span>
          </div>

          {item.fechaVisita && (
            <div>
              <span className="text-zinc-500 font-medium w-44 inline-block">
                Visita:
              </span>
              <span className="text-blue-300">{item.fechaVisita}</span>
            </div>
          )}
        </div>

        <div className="w-full xl:w-96 mt-16 xl:mt-24">
          <label className="block text-zinc-500 font-medium text-sm mb-2 text-right">
            Nota / observación:
          </label>
          <textarea
            value={item.nota || ""}
            onChange={(e) => actualizarNota(item.id, e.target.value)}
            placeholder="Ej: se llamó pero no contestaron"
            className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-2xl p-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.open(item.url, "_blank")}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs hover:bg-zinc-700"
        >
          Abrir
        </button>

        <select
          value={item.estado}
          onChange={(e) => cambiarEstado(item.id, e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-400"
        >
          <option value="por_consultar">Por consultar</option>
          <option value="contactado">Contactado</option>
          <option value="agendado">Agendado</option>
          <option value="visitado">Visitado</option>
          <option value="favorito">Favorito</option>
          <option value="descartado">Descartado</option>
        </select>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={fechaTemp}
            onChange={(e) => setFechaTemp(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded px-2 py-1"
          />

          <input
            type="time"
            value={horaTemp}
            onChange={(e) => setHoraTemp(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded px-2 py-1"
          />

          <button
            type="button"
            onClick={guardarVisita}
            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:brightness-110"
          >
            Guardar visita
          </button>
          {item.estado === "agendado" && item.fechaVisita && (
  <button
    type="button"
    onClick={abrirGoogleCalendar}
    className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:brightness-110"
  >
    Google Calendar
  </button>
)}
        </div>
      </div>
    </div>
  );
}