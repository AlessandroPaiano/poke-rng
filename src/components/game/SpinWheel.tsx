import { useRef, useEffect, useState, useCallback } from 'react';
import type { WheelSegment } from '@/hooks/useGameState';

interface Props {
  segments: WheelSegment[];
  onResult: (seg: WheelSegment) => void;
  disabled?: boolean;
}

export default function SpinWheel({ segments, onResult, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [liveLabel, setLiveLabel] = useState('');
  const rafRef = useRef<number>(0);
  const size = 300;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !segments.length) return;
    const ctx = canvas.getContext('2d')!;
    const cx = size / 2, cy = size / 2, r = size / 2 - 8;
    ctx.clearRect(0, 0, size, size);

    const total = segments.reduce((s, seg) => s + seg.weight, 0);
    let angle = -Math.PI / 2;

    segments.forEach(seg => {
      const slice = (seg.weight / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (slice > 0.15) {
        const mid = angle + slice / 2;
        const lr = r * 0.62;
        ctx.save();
        ctx.translate(cx + Math.cos(mid) * lr, cy + Math.sin(mid) * lr);
        ctx.rotate(mid + Math.PI / 2);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.min(13, Math.max(9, slice * 30))}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 3;
        const txt = seg.label.length > 10 ? seg.label.slice(0, 9) + '…' : seg.label;
        ctx.fillText(txt, 0, 0);
        ctx.restore();
      }
      angle += slice;
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [segments]);

  const getSegmentAtAngle = useCallback((deg: number) => {
    if (!segments.length) return '';
    const total = segments.reduce((s, seg) => s + seg.weight, 0);
    const arrowAngle = ((-deg % 360) + 360) % 360;
    let cumulative = 0;
    for (const seg of segments) {
      cumulative += (seg.weight / total) * 360;
      if (arrowAngle < cumulative) return seg.label;
    }
    return segments[segments.length - 1].label;
  }, [segments]);

  // Update live label during spin via rAF
  useEffect(() => {
    if (!spinning || !wheelRef.current) return;
    const update = () => {
      if (wheelRef.current) {
        const style = getComputedStyle(wheelRef.current);
        const transform = style.transform;
        if (transform && transform !== 'none') {
          const values = transform.match(/matrix\((.+)\)/);
          if (values) {
            const parts = values[1].split(', ');
            const a = parseFloat(parts[0]);
            const b = parseFloat(parts[1]);
            const angle = Math.atan2(b, a) * (180 / Math.PI);
            setLiveLabel(getSegmentAtAngle(angle));
          }
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spinning, getSegmentAtAngle]);

  // Update label when not spinning
  useEffect(() => {
    if (!spinning) {
      setLiveLabel(getSegmentAtAngle(rotation));
    }
  }, [rotation, spinning, segments, getSegmentAtAngle]);

  const handleSpin = useCallback(() => {
    if (spinning || disabled || !segments.length) return;

    const total = segments.reduce((s, seg) => s + seg.weight, 0);
    let rand = Math.random() * total;
    let selectedIdx = 0;
    for (let i = 0; i < segments.length; i++) {
      rand -= segments[i].weight;
      if (rand <= 0) { selectedIdx = i; break; }
    }

    let segStart = 0;
    for (let i = 0; i < selectedIdx; i++) {
      segStart += (segments[i].weight / total) * 360;
    }
    const segAngle = (segments[selectedIdx].weight / total) * 360;
    const landAt = segStart + segAngle * (0.25 + Math.random() * 0.5);

    const targetMod = (360 - landAt + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const diff = (targetMod - currentMod + 360) % 360;
    const spins = (5 + Math.floor(Math.random() * 4)) * 360;
    const newRotation = rotation + spins + diff;

    setRotation(newRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      onResult(segments[selectedIdx]);
    }, 4200);
  }, [spinning, disabled, segments, rotation, onResult]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Arrow */}
        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-10 text-primary drop-shadow-lg"
          style={{ fontSize: '28px', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          ▼
        </div>
        {/* Wheel container */}
        <div
          ref={wheelRef}
          className="rounded-full glow-primary"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.7, 0.1, 1)' : 'none',
          }}
        >
          <canvas ref={canvasRef} width={size} height={size} className="rounded-full" />
        </div>
      </div>
      {/* Current segment indicator */}
      <div className="text-sm font-bold text-primary truncate max-w-[250px] text-center">
        ▶ {liveLabel}
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning || disabled}
        className="px-8 py-3 rounded-full font-bold text-lg transition-all duration-200
          bg-primary text-primary-foreground hover:scale-105 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          glow-primary"
      >
        {spinning ? '🎰 Spinning...' : '🎡 Click to Spin'}
      </button>
    </div>
  );
}
