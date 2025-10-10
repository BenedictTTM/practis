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

// ============================================================================
// CONSTANTS - Centralized configuration
// ============================================================================
const TIMER_CONFIG = {
  INITIAL_HOURS: 3,
  RESET_HOURS: 3,
  UPDATE_INTERVAL: 1000,
} as const;

const THEME = {
  primary: '#DB4444',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const padZero = (num: number): string => String(num).padStart(2, '0');

const calculateNextTime = (current: TimeState): TimeState => {
  let { days, hours, minutes, seconds } = current;

  if (seconds > 0) {
    return { ...current, seconds: seconds - 1 };
  }

  seconds = 59;

  if (minutes > 0) {
    return { days, hours, minutes: minutes - 1, seconds };
  }

  minutes = 59;

  if (hours > 0) {
    return { days, hours: hours - 1, minutes, seconds };
  }

  hours = 23;

  if (days > 0) {
    return { days: days - 1, hours, minutes, seconds };
  }

  // Reset when countdown reaches zero
  return {
    days: 0,
    hours: TIMER_CONFIG.RESET_HOURS,
    minutes: 0,
    seconds: 0,
  };
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
    className="text-lg  text-gray-800 sm:text-xl md:text-2xl font-semibold self-end pb-0.5 sm:pb-1 md:pb-1.5"
    style={{ color: THEME.primary }}
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
  <div className="flex items-center gap-2 sm:gap-3">
    <div
      className="w-3.5 sm:w-4 h-6 sm:h-7 rounded"
      style={{ backgroundColor: THEME.primary }}
      aria-hidden="true"
    />
    <span
      className="text-xs sm:text-sm font-semibold uppercase tracking-wide"
      style={{ color: THEME.primary }}
    >
      Today's
    </span>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

/**
 * FlashSalesCountdown Component
 * 
 * A performant, accessible countdown timer for flash sales promotions.
 * Features:
 * - Type-safe TypeScript implementation
 * - Fully responsive design (mobile-first)
 * - Accessibility compliant (ARIA labels, semantic HTML)
 * - Performance optimized (memoization, efficient updates)
 * - Clean separation of concerns
 */
export default function FlashSalesCountdown() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const [time, setTime] = useState<TimeState>({
    days: 0,
    hours: TIMER_CONFIG.INITIAL_HOURS,
    minutes: 0,
    seconds: 0,
  });

  // ==========================================================================
  // COUNTDOWN LOGIC
  // ==========================================================================
  const updateTimer = useCallback(() => {
    setTime(calculateNextTime);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateTimer, TIMER_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateTimer]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        {/* Today's on top */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <SectionHeader />
          {/* Flash Sales and timer on the same line */}
          <div className="flex items-end gap-3 sm:gap-4 flex-wrap">
            <h2
              id="flash-sales-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
              style={{ color: THEME.text.primary }}
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