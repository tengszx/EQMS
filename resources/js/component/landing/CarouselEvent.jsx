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
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);

    return (
        <div className="carousel-container">
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
                        ></span>
                    ))}
                </div>
                {/* Add your buttons here if needed */}
            </div>
        </div>
    );
};

export default CarouselEvent;