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
            className={`relative size-full overflow-hidden`}
          >
            {/* Left Image */}
            <div 
              className="absolute left-0 top-0 flex size-full items-center justify-center" 
              style={{ 
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
              }}
            >
              <Image 
                src="/_static/images/preview-before.png" 
                alt="Left placeholder" 
                width={800}
                height={600}
                priority
                unoptimized
                className="size-full object-cover" 
              />
            </div>

            {/* Right Image */}
            <div 
              className="absolute left-0 top-0 flex size-full items-center justify-center"
              style={{ 
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` 
              }}
            >
              <Image
                src="/_static/images/preview-after.png" 
                alt="Right placeholder" 
                width={800}
                height={600}
                priority
                unoptimized
                className="size-full object-cover" 
              />
            </div>

            {/* Slider */}
            <div 
              className="absolute left-0 top-0 size-full"
              style={{ 
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)' 
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-20 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg"></div>
              <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white"></div>
            </div>
          </div>



          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}




