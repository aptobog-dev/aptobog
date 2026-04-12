export default function AddLinkBar({
  textoLinks,
  setTextoLinks,
  agregarLinks,
  mensajeCarga,
}) {
  return (
    <section className="bg-gradient-to-r from-black via-zinc-950 to-orange-950/40 p-6 rounded-3xl border border-zinc-800 shadow-2xl shadow-black/30">
      <p className="text-sm tracking-[0.25em] text-zinc-400 mb-3">
        ↓ PEGÁ AQUÍ LOS LINKS DE LOS APTOS QUE TE GUSTARON
      </p>

      <div className="flex flex-col xl:flex-row gap-3">
        <textarea
          value={textoLinks}
          onChange={(e) => setTextoLinks(e.target.value)}
          className="flex-1 px-5 py-4 rounded-2xl bg-zinc-900/80 border border-zinc-700 outline-none min-h-[92px] resize-none"
          placeholder={'Pegá uno o varios links, uno por línea...\n\nhttps://www.fincaraiz.com.co/...\nhttps://www.metrocuadrado.com/...'}
        />
        <div className="flex xl:flex-col gap-3 xl:w-48">
          <button
            onClick={agregarLinks}
            className="flex-1 px-4 py-2 rounded-xl bg-orange-500 text-black text-sm font-semibold hover:brightness-110 transition"
          >
            + Analizar
          </button>
          
        </div>
      </div>

      {mensajeCarga && (
        <div className="mt-4 rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-300">
          {mensajeCarga}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4 text-xs">
        {['Fincaraíz', 'Metrocuadrado', 'Ciencuadras', 'OLX', 'Cualquier URL'].map((item) => (
          <span
            key={item}
            className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}