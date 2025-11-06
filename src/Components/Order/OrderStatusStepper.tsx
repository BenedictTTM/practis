"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

type Status = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | string;

interface Props {
  current: Status;
}

const steps = [
  { key: "PENDING", label: "Pending" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

function normalize(status: Status): string {
  const s = (status || "").toString().toUpperCase();
  if (s === "COMPLETED") return "DELIVERED";
  if (s === "CONFIRMED") return "PENDING"; // treat confirmed as still pre-ship
  return s;
}

export function OrderStatusStepper({ current }: Props) {
  const normalized = normalize(current);
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === normalized)
  );

  return (
    <div className="w-full max-w-5xl mx-auto mt-2 mb-6">
      <div className="flex items-center justify-between px-2 sm:px-0">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-center">
                {idx > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      idx <= activeIndex ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                )}
                <div
                  className={`flex items-center justify-center rounded-full border ${
                    isActive || isCompleted
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300 bg-gray-100 text-gray-400"
                  } w-8 h-8 ml-2 mr-2`}
                >
                  {isActive || isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="block w-2.5 h-2.5 rounded-full bg-gray-300" />
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      idx < activeIndex ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div
                className={`mt-2 text-xs font-medium ${
                  isActive ? "text-red-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusStepper;
