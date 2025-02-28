import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import '../../../css/styles/landing/CarouselEvent.css';

const carouselItems = [
    { id: 1, text: "Event 1: Description of the first event." },
    { id: 2, text: "Event 2: Description of the second event." },
    { id: 3, text: "Event 3: Description of the third event." },
    { id: 4, text: "Event 4: Description of the fourth event." },
    { id: 5, text: "Event 5: Description of the fifth event." },
];

// Animation constants
const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 5;
const DRAG_BUFFER = 50;
const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

const CarouselEvent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const controls = useAnimation();
    const dragX = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    
    // Update position when currentIndex changes
    useEffect(() => {
        controls.start({
            x: -currentIndex * 100 + "%",
            transition: SPRING_OPTIONS
        });
    }, [currentIndex, controls]);

    // Auto-advance timer
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDragging) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
            }
        }, AUTO_DELAY);

        return () => clearInterval(interval);
    }, [isDragging]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    };
    
    const onDragStart = () => {
        setIsDragging(true);
        controls.set({ x: -currentIndex * 100 + "%" });
    };
    
    const onDragEnd = (event, info) => {
        setIsDragging(false);
        const { offset, velocity } = info;
        
        // Determine direction based on drag distance and velocity
        if (offset.x < -DRAG_BUFFER || (velocity.x < -500)) {
            if (currentIndex < carouselItems.length - 1) {
                handleNext();
            } else {
                // Snap back to current position
                controls.start({
                    x: -currentIndex * 100 + "%",
                    transition: SPRING_OPTIONS
                });
            }
        } else if (offset.x > DRAG_BUFFER || (velocity.x > 500)) {
            if (currentIndex > 0) {
                handlePrevious();
            } else {
                // Snap back to current position
                controls.start({
                    x: -currentIndex * 100 + "%",
                    transition: SPRING_OPTIONS
                });
            }
        } else {
            // Not enough drag, snap back
            controls.start({
                x: -currentIndex * 100 + "%",
                transition: SPRING_OPTIONS
            });
        }
    };

    return (
        <div className="carousel-container">
            <div 
                className="carousel-click-zone left"
                onClick={handlePrevious}
                role="button"
                aria-label="Previous slide"
            >
                <div className="click-zone-arrow left">‹</div>
            </div>

            <div 
                className="carousel-click-zone right"
                onClick={handleNext}
                role="button"
                aria-label="Next slide"
            >
                <div className="click-zone-arrow right">›</div>
            </div>

            <div className="carousel-content">
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    animate={controls}
                    style={{ width: `${carouselItems.length * 100}%` }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    className="carousel-items-container"
                >
                    {carouselItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            animate={{
                                scale: currentIndex === idx ? 0.95 : 0.85,
                            }}
                            transition={SPRING_OPTIONS}
                            className="carousel-item"
                            style={{ width: `${100 / carouselItems.length}%` }}
                        >
                            <p>{item.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="carousel-footer">
                <div className="carousel-dots">
                    {carouselItems.map((item, index) => (
                        <span 
                            key={item.id} 
                            className={`dot ${index === currentIndex ? 'active' : ''}`} 
                            onClick={() => setCurrentIndex(index)}
                            role="button"
                            aria-label={`Go to slide ${index + 1}`}
                        ></span>
                    ))}
                </div>
            </div>
            
            <div className="gradient-edge left"></div>
            <div className="gradient-edge right"></div>
        </div>
    );
};

export default CarouselEvent;