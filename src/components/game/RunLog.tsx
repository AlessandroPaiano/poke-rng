import { useRef, useEffect } from 'react';

interface Props {
  log: string[];
  lessExplanations?: boolean;
}

export default function RunLog({ log, lessExplanations }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  const displayed = lessExplanations ? log.slice(-8) : log;

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-muted-foreground mb-2">📜 Run Log</h3>
      <div className="bg-card border border-border rounded-lg p-3 max-h-40 overflow-y-auto text-xs space-y-1">
        {displayed.map((entry, i) => (
          <div key={i} className="text-card-foreground leading-relaxed">
            <span className="text-muted-foreground mr-1">{log.indexOf(entry) + 1}.</span>
            {entry}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
