import { Input } from "./ui/input";

interface PastureHeroProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const PastureHero = ({ searchValue, onSearchChange }: PastureHeroProps) => {
  return (
    <div 
      className="relative w-full rounded-3xl px-12 py-16 overflow-hidden"
      style={{
        backgroundColor: '#DCECCF',
      }}
    >
      <div className="relative z-10 flex items-center justify-between gap-8">
        <h2 className="text-6xl font-black leading-tight tracking-tight text-foreground">
          THE PROJECT<br />PASTURE
        </h2>
        <div className="w-full max-w-md">
          <Input
            type="search"
            placeholder="Search"
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-14 rounded-2xl border-border text-lg px-6 shadow-sm bg-white/80"
          />
        </div>
      </div>
    </div>
  );
};
