import React from 'react';
import { motion, useMotionValue, animate } from "framer-motion";
import '../../../css/styles/landing/QuickAccessSection.css';

const QuickAccessSection = () => {
  // Aurora gradient setup
  const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
  const color = useMotionValue(COLORS_TOP[0]);
  
  React.useEffect(() => {
    // Animate the color changes in a loop
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  const actions = [
    {
      id: 1,
      title: "Submit Quality Report",
      description: "A quality report is a document that assesses the performance, standards, and compliance of a product or service, highlighting areas for improvement and ensuring adherence to regulatory requirements.",
      link: "/quality-report"
    },
    {
      id: 2,
      title: "View Reports",
      description: "View reports refers to the action of accessing and reviewing documented analyses or summaries that provide insights into performance, findings, data, or data related to a specific subject or project.",
      link: "/reports"
    },
    {
      id: 3,
      title: "Manage Documents",
      description: "Manage documents involves organizing, storing, retrieving, and maintaining files to ensure efficient access and compliance with relevant standards or protocols.",
      link: "/documents"
    },
    {
      id: 4,
      title: "View Dashboard",
      description: "View dashboard means accessing a visual interface that displays key metrics, data, and performance indicators for quick analysis and decision-making.",
      link: "/dashboard"
    }
  ];

  return (
    <div className="quick-access-wrapper">
      <div className="quick-access-container">
        <div className="quick-access-header">
          <h2>Quick Access Action</h2>
        </div>
        
        <div className="timeline-layout">
          <div className="timeline-line"></div>
          <div className="trophy-icon">🏆</div>
          
          <div className="cards-layout">
            {/* Card 1 - Top Left */}
            <div className="card-position card-1">
              <motion.div 
                className="card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="action-card">
                  <div className="card-number">#1</div>
                  <h3>{actions[0].title}</h3>
                  <p>{actions[0].description}</p>
                </div>
                <div className="vertical-line"></div>
              </motion.div>
            </div>
            
            {/* Card 3 - Top Right */}
            <div className="card-position card-3">
              <motion.div 
                className="card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="action-card">
                  <div className="card-number">#3</div>
                  <h3>{actions[2].title}</h3>
                  <p>{actions[2].description}</p>
                </div>
                <div className="vertical-line"></div>
              </motion.div>
            </div>
            
            {/* Card 2 - Bottom Left */}
            <div className="card-position card-2">
              <motion.div 
                className="card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="action-card">
                  <div className="card-number">#2</div>
                  <h3>{actions[1].title}</h3>
                  <p>{actions[1].description}</p>
                </div>
                <div className="vertical-line"></div>
              </motion.div>
            </div>
            
            {/* Card 4 - Bottom Right */}
            <div className="card-position card-4">
              <motion.div 
                className="card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="action-card">
                  <div className="card-number">#4</div>
                  <h3>{actions[3].title}</h3>
                  <p>{actions[3].description}</p>
                </div>
                <div className="vertical-line"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessSection;
