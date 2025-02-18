import React, { useState, useEffect } from 'react';
import '../../../css/styles/landing/CarouselEvent.css'

const carouselItems = [
    { id: 1, text: "Event 1: Description of the first event." },
    { id: 2, text: "Event 2: Description of the second event." },
    { id: 3, text: "Event 3: Description of the third event." },
    { id: 4, text: "Event 4: Description of the fourth event." },
    { id: 5, text: "Event 5: Description of the fifth event." },
];

const CarouselEvent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handlePrevious = (e) => {
        e.preventDefault();
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
        );
    };

    const handleNext = (e) => {
        e.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    };

    return (
        <div className="carousel-container">
            {/* Left click zone */}
            <div 
                className="carousel-click-zone left"
                onClick={handlePrevious}
                role="button"
                aria-label="Previous slide"
            >
                <div className="click-zone-arrow left">‹</div>
            </div>

            {/* Right click zone */}
            <div 
                className="carousel-click-zone right"
                onClick={handleNext}
                role="button"
                aria-label="Next slide"
            >
                <div className="click-zone-arrow right">›</div>
            </div>

            <div className="carousel-content">
                <div className="carousel-item">
                    <p>{carouselItems[currentIndex].text}</p>
                </div>
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
        </div>
    );
};

export default CarouselEvent;