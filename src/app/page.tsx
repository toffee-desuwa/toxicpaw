export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          🐾 Toxic<span className="text-red-500">Paw</span>
        </h1>
        <p className="mt-3 text-lg text-neutral-400">
          Scan your pet food label. Get an instant safety grade.
        </p>
        <button
          className="mt-8 rounded-full bg-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
          type="button"
        >
          Scan Label
        </button>
      </div>
    </main>
  );
}
