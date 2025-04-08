import './App.css';
import * as d3 from "d3";

import { QuadrantChart } from './Scroll'; // Unified chart component
import Section from './section'; // Scroll steps and trigger
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';


function App() {
  const [redditData, setRedditData] = useState([]);
  const [articlesData, setArticlesData] = useState([]);
  const chartRef = useRef(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [selectedInfoMap, setSelectedInfoMap] = useState({});
  const scrollStepRef = useRef(0);
  const dataReady = redditData.length > 0 && articlesData.length > 0;

  // ✅ Load Reddit.csv
  useEffect(() => {
    d3.csv('/data/Reddit.csv', d3.autoType)
      .then((loadedData) => {
        console.log('Reddit Data loaded:', loadedData);
        setRedditData(loadedData);
      })
      .catch((error) => console.error('Error loading Reddit data:', error));
  }, []);

  // ✅ Load Articles.csv
  useEffect(() => {queueMicrotask
    d3.csv('/data/Articles.csv', d3.autoType)
      .then((loadedData) => {
        console.log('Articles Data loaded:', loadedData);
        setArticlesData(loadedData);
      })
      .catch((error) => console.error('Error loading Articles data:', error));
  }, []);

  useEffect(() => {
    
      chartRef.current?.updateVisualization(scrollStep);// 👈 use current step
    
  }, [scrollStep]);
  
  // React to scroll step changes


  // ✅ Merge data (optional: tag sectionIndex if not already done)
  const combinedData = useMemo(() => {
    return [
      ...redditData.map(d => ({
        ...d,
        source: "Reddit",
        size: d.size || 6,
        Predicted_Label: d.Predicted_Label,
        Predicted_Label_gov: d.Predicted_Label_gov,
        Pro_Gov_Score: d.Pro_Gov_Score,
        Crit_Gov_Score: d.Crit_Gov_Score,
        Environment_Score: d.Environment_Score,
        Belief_Score: d.Belief_Score
      })),
      ...articlesData.map(d => ({
        ...d,
        source: "Articles",
        size: d.size || 6,
        Predicted_Label: d.a_Predicted_Label,
        Predicted_Label_gov: d.a_Predicted_Label_gov,
        Pro_Gov_Score: d.a_Pro_Gov_Score,
        Crit_Gov_Score: d.a_Crit_Gov_Score,
        Environment_Score: d.a_Environment_Score,
        Belief_Score: d.a_Belief_Score
      }))
    ];
  }, [redditData, articlesData]);
  
  
  // ✅ Scroll section triggers updateVisualization on chart
  const handleStepChange = (index) => {
    scrollStepRef.current = index;
    setScrollStep(prev => {
      if (prev !== index) {
        // Clear selected info when changing steps
        setSelectedInfoMap({});
        return index;
      }
      return prev;
    });
  };
  
  
const handleBubbleClick = useCallback((d) => {
  const currentStep = scrollStepRef.current;
  const info = `${d.Category || d.type}: ${d.url || d.Source}`;
  setSelectedInfoMap(prev => {
    if (prev[currentStep] === info) return prev;
    return { ...prev, [currentStep]: info };
  });
}, []); // ✅ No dependencies needed


  
  return (
    <div className="app-container">
      {/* LEFT: Sticky Quadrant Chart */}
      <div className="left-visuals">
      {dataReady ? (
         <>
         <QuadrantChart
           ref={chartRef}
           data={combinedData}
           onBubbleClick={handleBubbleClick}
           currentStep={scrollStep}
         />
         
         {/* 👇 Only show image when scrollStep === 2 */}
         {scrollStep === 3 && (
           <div
           style={{
             position: "absolute",
             top: 0,
            
             width: "100%",
             height: "100%",
             display: "flex",
             alignItems: "flex-start",
             justifyContent: "center",
             flexDirection: "column",
              // optional: to hide chart behind
             zIndex: 2, // sit above the chart
             pointerEvents: "none", // image is display-only
              }}
         >
           <img
             src="/Aghori_Water.png"
             alt="Narrative alignment"
             style={{
               maxWidth: "90%",
               height: "90%",
               borderRadius: "8px",
               boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
               marginBottom: "40px"
            
             }}
           />
           
         </div>
         )}
       </>
      ) : (
        <div style={{ padding: "2rem", fontSize: "1.2rem", color: "#666" }}>
          Loading data...
        </div>
      )}
    </div>
  
      {/* RIGHT: Scroll steps */}
      <div className="right-scroll">
      <Section onStepChange={handleStepChange} selectedInfoMap={selectedInfoMap} currentStep={scrollStep}/>

      </div>
    </div>
  );
}

export default App;
