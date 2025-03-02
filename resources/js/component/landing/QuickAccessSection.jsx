import React from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
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

  // Use motion template to create a dynamic background gradient
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

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
    <motion.div className="quick-access-container" style={{ backgroundImage }}>
      <div className="quick-access-header">
        <h2>Quick Access Action</h2>
      </div>
      
      <div className="timeline-container">
        <div className="timeline-line"></div>
        <div className="trophy-icon">🏆</div>
        
        <div className="actions-grid">
          {actions.map((action) => (
            <motion.div 
              key={action.id}
              className={`action-item ${action.id % 2 === 0 ? 'action-right' : 'action-left'}`}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: action.id * 0.1 }}
            >
              <div className={`number-indicator indicator-${action.id}`}>
                #{action.id}
              </div>
              
              <a href={action.link} className="action-card-link">
                <motion.div 
                  className="action-card glass-effect"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="gradient">{action.title}</h3>
                  <p>{action.description}</p>
                </motion.div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAccessSection;