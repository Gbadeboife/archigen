'use client';
import React, { useState, useRef, useEffect } from 'react';

import Image from "next/image";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const directionRef = useRef(1);
  const animationFrameRef = useRef<any>(null);

  useEffect(() => {
    const autoSlide = () => {
      setSliderPosition(prev => {
        let next = prev + (directionRef.current * 0.2);
        
        if (next >= 100) {
          directionRef.current = -1;
          next = 100;
        } else if (next <= 0) {
          directionRef.current = 1;
          next = 0;
        }

        return next;
      });

      animationFrameRef.current = requestAnimationFrame(autoSlide);
    };

    animationFrameRef.current = requestAnimationFrame(autoSlide);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);



  return (
    <div className="pb-6 sm:pb-16">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">

          <div 
            ref={containerRef}
            className={`relative w-full h-96 overflow-hidden`}
          >
            {/* Left Image */}
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center" 
              style={{ 
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
              }}
            >
              <img 
                src="../../public/_static/images/benefits.png" 
                alt="Left placeholder" 
                className="w-full h-full object-cover" 
              />
              <span className="absolute text-blue-800 text-2xl">Before</span>
            </div>

            {/* Right Image */}
            <div 
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              style={{ 
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` 
              }}
            >
              <img 
                src="../../public/_static/images/a-after.png" 
                alt="Right placeholder" 
                className="w-full h-full object-cover" 
              />
              <span className="absolute text-green-800 text-2xl">After</span>
            </div>

            {/* Slider */}
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{ 
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)' 
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-20 bg-white rounded-full shadow-lg"></div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-white left-1/2 -translate-x-1/2"></div>
            </div>
          </div>



          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}




