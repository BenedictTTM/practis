'use client';

import Image from 'next/image';

type HowToProps = {
  imageSrc: string;
  altText: string;
  title: string;
};

function HowTo({ imageSrc, altText, title }: HowToProps) {
  return (
    <div className="flex flex-col items-center text-center w-1/2 p-2 relative">
      <div className="flex flex-col items-center">
        <Image
          src={imageSrc}
          alt={altText}
          width={90}
          height={90}
          priority   
          className="transition-transform duration-300 hover:scale-105 object-contain sm:w-[120px] sm:h-[120px] md:w-[180px] md:h-[180px]"
        />
        <h3  style={{ fontFamily: "'Pacifico', cursive" }} className="mt-2 text-xs sm:text-sm md:text-base font-semibold text-gray-700 italic">
          {title}
        </h3>
      </div>
     
    </div>
  );
}

export default function HowToSection() {
  return (
    <section className="w-full  px-4 max-w-7xl mx-auto sm:pb-8 lg:pb-12 py-6" aria-label="How to buy and sell">
      {/* 🟢 Key fix: flex-row on all screens (no md: prefix) */}
      <div className="max-w-xl mx-auto flex flex-row justify-between items-center gap-2 sm:gap-4 md:gap-8">
        <HowTo imageSrc="/manwithgoods.png" altText="man with goods" title="How to Sell" />
        <HowTo imageSrc="/manwithcart.png" altText="man with cart" title="How to Buy" />
      </div>
    </section>
  );
}
