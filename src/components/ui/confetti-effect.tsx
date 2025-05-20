import React, { useCallback, useEffect, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { Options, CreateTypes } from 'canvas-confetti';

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface ConfettiParams {
  confetti: CreateTypes;
}

export function ConfettiEffect({ isActive, onComplete }: ConfettiEffectProps) {
  const refAnimationInstance = useRef<CreateTypes | null>(null);

  const onInit = useCallback((params: ConfettiParams) => {
    refAnimationInstance.current = params.confetti;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: Partial<Options>) => {
    refAnimationInstance.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    if (isActive) {
      fire();
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, fire, onComplete]);

  return (
    <ReactCanvasConfetti
      onInit={onInit}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    />
  );
}
