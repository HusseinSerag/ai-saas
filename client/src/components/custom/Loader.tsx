export default function Loader() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-4">
      <div className="relative h-10 w-10 animate-spin">
        <img src="logo.png" alt="logo" />
      </div>
      <p className="text-sm text-muted-foreground">Genius is thinking</p>
    </div>
  );
}
