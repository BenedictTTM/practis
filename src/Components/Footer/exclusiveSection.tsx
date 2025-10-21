import React from "react";
import { LuSendHorizontal } from "react-icons/lu";

type ExclusiveSectionProps = {
  email: string;
  setEmail: (value: string) => void;
  handleSubscribe: (e?: React.SyntheticEvent) => void | Promise<void>;
};

export default function ExclusiveSection({ email, setEmail, handleSubscribe }: ExclusiveSectionProps) {
  return (
    <div className="lg:col-span-1">
      <h3 className="text-lg font-semibold mb-4">Exclusive</h3>
      <p className="text-sm mb-4">Subscribe</p>
      <p className="text-sm text-gray-400 mb-4">Get 10% off your first order</p>
      <div className="flex w-full max-w-xs pr-10 ">
       
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className=" max-w-40 flex-1 px-3 py-2 bg-transparent border-2 border-gray-300   rounded-l rounded-2  text-sm focus:outline-none focus:border-gray-200"
        />
        <button
          onClick={handleSubscribe}
          aria-label="Subscribe"
          title="Subscribe"
          className="px-3 py-2 bg-transparent border-2 border-gray-300 border-l-0 rounded-r hover:bg-gray-800 transition-colors"
        >
          <LuSendHorizontal size={16} />
        </button>

      </div>
    </div>
  );
}
