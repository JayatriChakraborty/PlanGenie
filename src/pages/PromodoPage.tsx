
import { useState } from 'react';
import TimerFeature from '@/components/TimerFeature';
import StopwatchFeature from '@/components/StopwatchFeature';
import { Button } from '@/components/ui/button';
import { Timer, Stopwatch } from 'lucide-react';

const PromodoPage = () => {
  const [activeFeature, setActiveFeature] = useState<'timer' | 'stopwatch'>('timer');

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 mb-8 p-1 bg-muted rounded-lg">
          <Button
            onClick={() => setActiveFeature('timer')}
            variant={activeFeature === 'timer' ? 'default' : 'ghost'}
            className="flex-1"
          >
            <Timer className="mr-2 h-4 w-4" />
            Timer
          </Button>
          <Button
            onClick={() => setActiveFeature('stopwatch')}
            variant={activeFeature === 'stopwatch' ? 'default' : 'ghost'}
            className="flex-1"
          >
            <Stopwatch className="mr-2 h-4 w-4" />
            Stopwatch
          </Button>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
            {activeFeature === 'timer' && <TimerFeature />}
            {activeFeature === 'stopwatch' && <StopwatchFeature />}
        </div>
      </div>
    </div>
  );
};

export default PromodoPage;
