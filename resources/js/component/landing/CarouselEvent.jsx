import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import '../../../css/styles/landing/CarouselEvent.css';

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export const CarouselEvent = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, [dragX]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="carousel-container relative overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        {/* Single image per slide with padding */}
        <div className="carousel-slide">
          <img 
            src="/images/sample1.png" 
            alt="Carousel Image 1" 
            className="carousel-image"
          />
        </div>
        <div className="carousel-slide">
          <img 
            src="/images/sample2.png" 
            alt="Carousel Image 2" 
            className="carousel-image"
          />
        </div>
      </motion.div>

      <GradientEdges />
      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
    </div>
  );
};

const Dots = ({ imgIndex, setImgIndex }) => {
  return (
    <div className="dots-container">
      <button 
        className={`dot-button ${imgIndex === 0 ? 'active' : ''}`}
        onClick={() => setImgIndex(0)}
      />
      <button 
        className={`dot-button ${imgIndex === 1 ? 'active' : ''}`}
        onClick={() => setImgIndex(1)}
      />
    </div>
  );
};

const GradientEdges = () => {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-navy-blue/50 to-navy-blue/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-navy-blue/50 to-navy-blue/0" />
    </>
  );
};

export default CarouselEvent;