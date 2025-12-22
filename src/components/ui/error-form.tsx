export function ErrorForm({ message }: { message: string }) {
  return (
    <p className="text-sm text-rose-400 font-semibold animate-in fade-in slide-in-from-top-1 duration-300">
      {message}
    </p>
  );
}
