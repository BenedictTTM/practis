import React, { useState, useEffect } from 'react';

export default function FlashSalesCountdown() {
  const [time, setTime] = useState({
    days: 0,
    hours: 3,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
        // Decrease seconds
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          
          // Decrease minutes
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            
            // Decrease hours
            if (hours > 0) {
              hours--;
            } else {
              hours = 59;
              
              // Decrease days
              if (days > 0) {
                days--;
              } else {
                // Reset to 3 hours when countdown reaches zero
                return {
                  days: 0,
                  hours: 3,
                  minutes: 0,
                  seconds: 0
                };
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="text-[#DB4444] text-xs font-medium mb-1">{label}</div>
      <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-sm">
        <span className="text-3xl font-bold text-black">
          {String(value).padStart(2, '0')}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded"></div>
        <h2 className="text-[#DB4444] font-semibold text-lg">Today's</h2>
      </div>
      
      <div className="flex items-center gap-16">
        <h1 className="text-4xl font-bold text-black">Flash Sales</h1>
        
        <div className="flex items-center gap-3">
          <TimeUnit value={time.days} label="Days" />
          <span className="text-3xl font-bold text-[#DB4444] mb-6">:</span>
          <TimeUnit value={time.hours} label="Hours" />
          <span className="text-3xl font-bold text-[#DB4444] mb-6">:</span>
          <TimeUnit value={time.minutes} label="Minutes" />
          <span className="text-3xl font-bold text-[#DB4444] mb-6">:</span>
          <TimeUnit value={time.seconds} label="Seconds" />
        </div>
      </div>
    </div>
  );
}