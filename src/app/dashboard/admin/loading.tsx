export default function Loading() {
  return (
    <div className="min-h-screen bg-lumi-milk flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-lumi-blush border-t-lumi-rose animate-spin" />
        <p className="text-lumi-muted text-sm">Завантаження...</p>
      </div>
    </div>
  );
}