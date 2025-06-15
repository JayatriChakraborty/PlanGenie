
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const StopwatchFeature = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const countRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      if (countRef.current) clearInterval(countRef.current);
    } else {
      setIsActive(true);
      countRef.current = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    if (countRef.current) clearInterval(countRef.current);
    setTime(0);
  };

  const formatTime = (time: number) => {
    const milliseconds = `0${Math.floor((time % 1000) / 10)}`.slice(-2);
    const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
      <div className="text-6xl md:text-8xl font-mono font-bold text-foreground">
        {formatTime(time)}
      </div>
      <div className="flex gap-4">
        <Button onClick={handleToggle} size="lg" className="w-28">
          {isActive ? <Pause /> : <Play />}
          <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
        </Button>
        <Button onClick={handleReset} size="lg" variant="outline" className="w-28">
          <RotateCcw />
          <span className="ml-2">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default StopwatchFeature;
