export default function Sidebar({
  resumen,
  filtroEstado,
  setFiltroEstado,
  eliminarDescartados,
}) {
  return (
    <aside className="w-72 bg-black border-r border-zinc-800 p-5 flex flex-col justify-between">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 tracking-tight">
            AptoBog
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Tu buscador personal</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setFiltroEstado('Todos')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold ${
              filtroEstado === 'Todos'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                : 'hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <span>🏠 Todos los aptos</span>
            <span className="text-sm font-bold">({resumen.total})</span>
          </button>

          <button
            onClick={() => setFiltroEstado('por_consultar')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl ${
              filtroEstado === 'por_consultar'
                ? 'bg-zinc-800 text-white'
                : 'hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <span>📋 Por consultar</span>
            <span className="text-sm font-semibold text-zinc-500">
              ({resumen.porConsultar})
            </span>
          </button>

          <button
            onClick={() => setFiltroEstado('contactado')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl ${
              filtroEstado === 'contactado'
                ? 'bg-zinc-800 text-green-400'
                : 'hover:bg-zinc-900 text-green-400'
            }`}
          >
            <span>📞 Contactado</span>
            <span className="text-sm font-semibold text-green-400">
              ({resumen.consultados})
            </span>
          </button>

          <button
            onClick={() => setFiltroEstado('agendado')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl ${
              filtroEstado === 'agendado'
                ? 'bg-zinc-800 text-blue-400'
                : 'hover:bg-zinc-900 text-blue-400'
            }`}
          >
            <span>📅 Agendado</span>
            <span className="text-sm font-semibold text-blue-400">
              ({resumen.agendados})
            </span>
          </button>

          <button
            onClick={() => setFiltroEstado('visitado')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl ${
              filtroEstado === 'visitado'
                ? 'bg-zinc-800 text-violet-400'
                : 'hover:bg-zinc-900 text-violet-400'
            }`}
          >
            <span>🏠 Visitado</span>
            <span className="text-sm font-semibold text-violet-400">
              ({resumen.visitados})
            </span>
          </button>

          {/* 🔥 BLOQUE DESCARTADOS PRO */}
          <div
            onClick={() => setFiltroEstado('descartado')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer ${
              filtroEstado === 'descartado'
                ? 'bg-zinc-800 text-rose-400'
                : 'hover:bg-zinc-900 text-rose-400'
            }`}
          >
            <span className="flex items-center gap-2">
              🗑️ Descartados
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 evita que active el filtro
                  eliminarDescartados();
                }}
                className="px-2.5 py-1 rounded-lg border border-zinc-700 text-[11px] text-zinc-400 hover:bg-zinc-900"
              >
                Vaciar
              </button>

              <span className="text-sm font-semibold text-rose-400">
                ({resumen.descartados})
              </span>
            </div>
          </div>

          <button
            onClick={() => setFiltroEstado('favorito')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl ${
              filtroEstado === 'favorito'
                ? 'bg-zinc-800 text-yellow-400'
                : 'hover:bg-zinc-900 text-yellow-400'
            }`}
          >
            <span>⭐ Favoritos</span>
            <span className="text-sm font-semibold text-yellow-400">
              ({resumen.favoritos})
            </span>
          </button>
        </nav>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
        <p className="font-medium text-white">
          {resumen.total} apartamentos guardados
        </p>
        <p className="mt-1">Última actividad: hoy</p>
        <p className="mt-3 text-zinc-500">
          Pegás links arriba, el sistema extrae los datos y aquí abajo ya los
          podés filtrar, organizar y seguir.
        </p>
      </div>
    </aside>
  );
}