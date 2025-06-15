
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

const TimerFeature = () => {
  const [minutes, setMinutes] = useState(25);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const toggle = () => {
    if (secondsLeft > 0) {
      setIsActive(!isActive);
    }
  };

  const reset = () => {
    setIsActive(false);
    const newTotalSeconds = (minutes || 0) * 60;
    setTotalSeconds(newTotalSeconds);
    setSecondsLeft(newTotalSeconds);
  };
  
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = parseInt(e.target.value, 10);
    if (isNaN(newMinutes) || newMinutes < 0) {
      newMinutes = 0;
    }
    setMinutes(newMinutes);
    if (!isActive) {
        const newTotalSeconds = newMinutes * 60;
        setTotalSeconds(newTotalSeconds);
        setSecondsLeft(newTotalSeconds);
    }
  };
  
  const displayMinutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const displaySeconds = (secondsLeft % 60).toString().padStart(2, '0');

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
      <div className="text-6xl md:text-8xl font-mono font-bold text-foreground">
        {displayMinutes}:{displaySeconds}
      </div>
      <Progress value={progress} className="w-full max-w-md" />
      <div className="flex items-center gap-4">
        <label htmlFor="minutes-input" className="text-muted-foreground">Set Minutes:</label>
        <Input
          id="minutes-input"
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          className="w-24 text-center"
          disabled={isActive}
          min="0"
        />
      </div>
      <div className="flex gap-4">
        <Button onClick={toggle} size="lg" className="w-28">
          {isActive ? <Pause /> : <Play />}
          <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
        </Button>
        <Button onClick={reset} size="lg" variant="outline" className="w-28">
          <RotateCcw />
          <span className="ml-2">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default TimerFeature;
