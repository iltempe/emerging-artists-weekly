export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-dim">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-elev border-t-accent" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
