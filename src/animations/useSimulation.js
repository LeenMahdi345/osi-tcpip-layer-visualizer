import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildTimeline } from './timeline';

/**
 * Playback engine for the timeline.
 *
 * The timeline itself is pure data, so this hook only owns three things:
 * which step is showing, whether it is auto-advancing, and how fast.
 * Changing the model, protocol or message rebuilds the timeline and rewinds.
 */
export function useSimulation(model, context) {
  const steps = useMemo(() => buildTimeline(model, context), [model, context]);

  const [rawIndex, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const lastIndex = steps.length - 1;
  // Switching from OSI (16 steps) to TCP/IP (10 steps) can leave the index past
  // the end for one render, so clamp on the way out instead of trusting state.
  const index = Math.min(rawIndex, lastIndex);
  const isFinished = index >= lastIndex;
  const hasStarted = index > 0;

  // Rewind whenever the timeline is rebuilt (new model / protocol / message).
  const timelineRef = useRef(steps);
  useEffect(() => {
    if (timelineRef.current !== steps) {
      timelineRef.current = steps;
      setIndex(0);
      setIsPlaying(false);
    }
  }, [steps]);

  // Auto-advance while playing.
  useEffect(() => {
    if (!isPlaying) return undefined;

    if (index >= lastIndex) {
      setIsPlaying(false);
      return undefined;
    }

    const delay = (steps[index]?.durationMs ?? 1200) / speed;
    const timer = setTimeout(() => setIndex((current) => Math.min(current + 1, lastIndex)), delay);
    return () => clearTimeout(timer);
  }, [isPlaying, index, lastIndex, speed, steps]);

  const start = useCallback(() => {
    setIndex(1);
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setIndex((current) => Math.min(current + 1, lastIndex));
  }, [lastIndex]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  const seek = useCallback(
    (target) => {
      setIsPlaying(false);
      setIndex(Math.min(Math.max(target, 0), lastIndex));
    },
    [lastIndex],
  );

  return {
    steps,
    step: steps[index],
    index,
    progress: lastIndex > 0 ? index / lastIndex : 0,
    isPlaying,
    hasStarted,
    isFinished,
    speed,
    setSpeed,
    start,
    reset,
    togglePlay,
    stepForward,
    stepBack,
    seek,
  };
}
