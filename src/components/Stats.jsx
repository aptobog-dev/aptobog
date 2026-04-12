export default function Stats({ resumen }) {
  const stats = [
  { label: 'Total guardados', value: resumen?.total ?? 0, tone: 'text-white' },
  { label: 'Por consultar', value: resumen?.porConsultar ?? 0, tone: 'text-zinc-400' },
  { label: 'Consultado', value: resumen?.consultados ?? 0, tone: 'text-emerald-400' },
  { label: 'Descartados', value: resumen?.descartados ?? 0, tone: 'text-rose-400' },
];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 backdrop-blur"
        >
          <p className={`text-4xl font-bold ${item.tone}`}>{item.value}</p>
          <p className="text-sm text-zinc-400 mt-2 uppercase tracking-[0.18em]">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}