import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
  ariaLabel?: string;
}

interface FlashSalesCountdownProps {
  /** Next refresh time from backend (ISO string) */
  nextRefreshAt?: string;
  /** Milliseconds until next refresh */
  refreshesIn?: number;
  /** Callback when countdown reaches zero */
  onCountdownComplete?: () => void;
}

// ============================================================================
// CONSTANTS - Centralized configuration
// ============================================================================
const TIMER_CONFIG = {
  UPDATE_INTERVAL: 1000,
  FALLBACK_HOURS: 1, // Fallback if backend doesn't respond
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const padZero = (num: number): string => String(num).padStart(2, '0');

/**
 * Convert milliseconds to time state
 */
const millisecondsToTimeState = (ms: number): TimeState => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

/**
 * Calculate time remaining from target date
 */
const calculateTimeRemaining = (targetDate: Date): TimeState => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  // If time has passed, return zeros
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return millisecondsToTimeState(difference);
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * TimeUnit Component - Displays individual time unit (days, hours, etc.)
 * Memoized to prevent unnecessary re-renders
 */
const TimeUnit: React.FC<TimeUnitProps> = React.memo(({ value, label, ariaLabel }) => (
  <div 
    className="flex flex-col items-center min-w-[50px] sm:min-w-[60px]"
    role="timer"
    aria-label={ariaLabel || `${value} ${label}`}
  >
    <span className="text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tabular-nums">
      {padZero(value)}
    </span>
  </div>
));

TimeUnit.displayName = 'TimeUnit';

/**
 * TimeSeparator Component - Colon separator between time units
 */
const TimeSeparator: React.FC = React.memo(() => (
  <span 
    className="text-lg text-[#DB4444] sm:text-xl md:text-2xl font-semibold self-end pb-0.5 sm:pb-1 md:pb-1.5"
    aria-hidden="true"
  >
    :
  </span>
)); 

TimeSeparator.displayName = 'TimeSeparator';

/**
 * SectionHeader Component - "Today's" label with indicator bar
 */
const SectionHeader: React.FC = React.memo(() => (
  <div className="flex items-center gap-1 sm:gap-2">
    <div
      className="w-3.5 sm:w-4 md:h-6 h-4 sm:h-7 rounded bg-[#DB4444]"
      aria-hidden="true"
    />
    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#DB4444]">
      Today's
    </span>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

/**
 * FlashSalesCountdown Component
 * 
 * A performant, accessible countdown timer for flash sales promotions.
 * Synced with backend refresh time for accurate countdown.
 * 
 * Features:
 * - Real-time sync with backend refresh schedule
 * - Type-safe TypeScript implementation
 * - Fully responsive design (mobile-first)
 * - Accessibility compliant (ARIA labels, semantic HTML)
 * - Performance optimized (memoization, efficient updates)
 * - Clean separation of concerns
 */
export default function FlashSalesCountdown({
  nextRefreshAt,
  refreshesIn,
  onCountdownComplete,
}: FlashSalesCountdownProps = {}) {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const [time, setTime] = useState<TimeState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // ==========================================================================
  // INITIALIZE TARGET DATE FROM BACKEND
  // ==========================================================================
  useEffect(() => {
    if (nextRefreshAt) {
      // Use backend's exact refresh time
      setTargetDate(new Date(nextRefreshAt));
    } else if (refreshesIn) {
      // Calculate from milliseconds
      const target = new Date(Date.now() + refreshesIn);
      setTargetDate(target);
    } else {
      // Fallback: 1 hour from now
      const fallback = new Date(Date.now() + TIMER_CONFIG.FALLBACK_HOURS * 3600000);
      setTargetDate(fallback);
    }
  }, [nextRefreshAt, refreshesIn]);

  // ==========================================================================
  // COUNTDOWN LOGIC
  // ==========================================================================
  const updateTimer = useCallback(() => {
    if (!targetDate) return;

    const remaining = calculateTimeRemaining(targetDate);
    setTime(remaining);

    // Trigger callback when countdown completes
    if (
      remaining.days === 0 &&
      remaining.hours === 0 &&
      remaining.minutes === 0 &&
      remaining.seconds === 0
    ) {
      onCountdownComplete?.();
    }
  }, [targetDate, onCountdownComplete]);

  useEffect(() => {
    if (!targetDate) return;

    // Update immediately
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, TIMER_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateTimer, targetDate]);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================
  const isExpiring = useMemo(() => {
    return time.days === 0 && time.hours === 0 && time.minutes < 10;
  }, [time.days, time.hours, time.minutes]);

  const timeRemaining = useMemo(() => {
    const total = time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds;
    return `${total} seconds remaining`;
  }, [time]);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <section 
      className=""
      aria-labelledby="flash-sales-heading"
      role="region"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-3  ">
        {/* Today's on top */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <SectionHeader />
          {/* Flash Sales and timer on the same line */}
          <div className="flex items-end gap-3 sm:gap-4 flex-wrap">
            <h2
              id="flash-sales-heading"
              className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-[#1A1A1A]"
            >
              Flash Sales
            </h2>

            <div
              className={`flex items-end gap-2 sm:gap-3 ${isExpiring ? 'animate-pulse' : ''}`}
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              aria-label={timeRemaining}
            >
              <TimeUnit value={time.days} label="Days" ariaLabel={`${time.days} days`} />
              <TimeSeparator />
              <TimeUnit value={time.hours} label="Hours" ariaLabel={`${time.hours} hours`} />
              <TimeSeparator />
              <TimeUnit value={time.minutes} label="Minutes" ariaLabel={`${time.minutes} minutes`} />
              <TimeSeparator />
              <TimeUnit value={time.seconds} label="Seconds" ariaLabel={`${time.seconds} seconds`} />
            </div>
          </div>
        </div>

        {/* Optional: Urgency indicator when time is running out */}
        
      </div>
    </section>
  );
}