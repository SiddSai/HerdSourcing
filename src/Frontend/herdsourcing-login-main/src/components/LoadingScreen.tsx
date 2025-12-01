const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-secondary/50 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground">
          HerdSourcing
        </h1>
        <p className="text-base text-muted-foreground font-light">
          Gathering the herd…
        </p>
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--pink-accent))] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
