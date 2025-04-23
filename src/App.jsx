import './App.css';
import * as d3 from "d3";

import { QuadrantChart } from './Scroll';
import Section from './section';
import ReligiousEventsMap from "./constant_Variables";
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { FlyToInterpolator } from "@deck.gl/core";
import VerticalFlowChart from './sankey';

// 🎯 Scroll Dots Component
const ScrollDots = ({ steps, currentStep, onDotClick, scrollStep }) => {
  return (
    <div className="scroll-dots-wrapper">
      <div className="scroll-dots-container">
        {Array.from({ length: steps }).map((_, idx) => (
          <div
            key={idx}
            className={`dot ${currentStep === idx ? 'active' : ''}`}
            onClick={() => onDotClick(idx)}
            style={{ cursor: "pointer" }}
          />
        ))}
       
      </div>
    </div>
  );
};


function App() {
  const [redditData, setRedditData] = useState([]);
  const [articlesData, setArticlesData] = useState([]);
  const [kumbhData, setKumbhData] = useState([]);
  const chartRef = useRef(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [selectedInfoMap, setSelectedInfoMap] = useState({});
  const scrollStepRef = useRef(0);
  const dataReady = redditData.length > 0 && articlesData.length > 0;
  const sectionRef = useRef(null);

  const [mapViewState, setMapViewState] = useState({
    longitude: 80,
    latitude: 10,
    zoom: 1.4,
    pitch: 0,
    bearing: 0,
  });

  useEffect(() => {
    d3.csv('/data/Reddit.csv', d3.autoType)
      .then(setRedditData)
      .catch((error) => console.error('Error loading Reddit data:', error));
  }, []);

  useEffect(() => {
    d3.csv('/data/Articles.csv', d3.autoType)
      .then(setArticlesData)
      .catch((error) => console.error('Error loading Articles data:', error));
  }, []);

  useEffect(() => {
    d3.csv('/data/Kumbhdata.csv', d3.autoType)
      .then(setKumbhData)
      .catch((error) => console.error('Error loading kumbhmela data:', error));
  }, []);

  useEffect(() => {
    chartRef.current?.updateVisualization(scrollStep);
  }, [scrollStep]);

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

  const handleStepChange = (index) => {
    scrollStepRef.current = index;
    setScrollStep(prev => {
      if (prev !== index) {
        setSelectedInfoMap({});
  
        // 🎯 Scroll to Step 2 → Zoom in to Prayagraj
        if (index === 2) {
          setMapViewState({
            longitude: 81.8852,
            latitude: 25.4328,
            zoom: 10,
            pitch: 0,
            bearing: 0,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator()
          });
        }
  
        // 🎯 Scroll back to Step 1 → Reset to initial view
        if (index === 1) {
          setMapViewState({
            longitude: 80,
            latitude: 10,
            zoom: 1.4,
            pitch: 0,
            bearing: 0,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator()
          });
        }
  
        return index;
      }
      return prev;
    });
  };

  const handleDotClick = (index) => {
    handleStepChange(index); // Reuse the same logic
    const stepElement = document.querySelector(`#scroll-step-${index}`);
  if (stepElement) {
    stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  };
  
  const OverlayStats = ({ data, step }) => {
    const targetDates = ["13.01.2025", "14.01.2025", "29.01.2025", "03.02.2025", "12.02.2025"];
    const currentDate = targetDates[step];
    
    const filtered = data.find(d => d.Date === currentDate);
  
    if (!filtered) return null;
  
    return (
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "14px 18px",
          borderRadius: "10px",
          fontSize: "13px",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          lineHeight: "1.5em",
          maxWidth: "300px",
          zIndex: 1000,
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)"
        }}
      >
        <div style={{ color: "#000", fontWeight: 600, fontSize: "16px" }}>{filtered.Quality}</div>
        <hr style={{ margin: "8px 0", borderColor: "#343a40" }} />
        
        <div>
          <span style={{ color: "#e2a85d", fontWeight: "bold", fontSize: "16px"  }}>pH:</span>{" "}
          <span style={{ fontWeight: 500 }}>{filtered.pH}</span>
        </div>
        <hr style={{ margin: "8px 0", borderColor: "#343a40" }} />
    
        <div>
          <span style={{ color: "#e86e50", fontWeight: "bold" , fontSize: "16px" }}>BOD:</span>{" "}
          <span style={{ fontWeight: 500 }}>{filtered.BOD}</span>
        </div>
        <hr style={{ margin: "8px 0", borderColor: "#343a40" }} />
    
        <div>
          <span style={{ color: "#c00021", fontWeight: "bold", fontSize: "16px"  }}>Fecal Coliform:</span>{" "}
          <span style={{ fontWeight: 500 }}>{filtered.Fecal_Coliform}</span>
        </div>
      </div>
    );
    
  };
  

  const handleBubbleClick = useCallback((d) => {
    const currentStep = scrollStepRef.current;
  
    // Determine the correct source URL
    const redditLink = d.source === "Reddit" && d.Source?.startsWith("http") ? d.Source : null;
    const articleLink = d.source === "Articles" && d.url?.startsWith("http") ? d.url : null;
    const finalLink = redditLink || articleLink;
  
    const linkHTML = finalLink
      ? `<br/><a href="${finalLink}" target="_blank" rel="noopener noreferrer" style="color:#0066cc; text-decoration:underline;">Read more</a>`
      : "";
  
    const info = `
      <div style="line-height:1.6;">

        <strong>Type:</strong> ${d.source || d.Category}<br/>
        <strong>Author:</strong> ${d.author || d.Published_company || "-"}<br/>
        ${d.Category ? `<strong>Category:</strong> ${d.Category}<br/>` : ""}
        <strong>Title:</strong> ${d.title || d.content || "-"}<br/>
        <strong>Pro-Gov:</strong> ${d.Pro_Gov_Score?.toFixed(2)} |
        <strong>Crit-Gov:</strong> ${d.Crit_Gov_Score?.toFixed(2)}<br/>
        <strong>Environment:</strong> ${d.Environment_Score?.toFixed(2)} |
        <strong>Belief:</strong> ${d.Belief_Score?.toFixed(2)}
        ${linkHTML}
      </div>
    `;
  
    setSelectedInfoMap(prev => {
      if (prev[currentStep] === info) return prev;
      return { ...prev, [currentStep]: info };
    });
  }, []);
  

  return (
    <>
      <div className="app-container">
      
      <div className="scroll-content">
        <div className="left-visuals">
          {dataReady ? (
            <>
              {scrollStep === 0 && (
                <div id="imagedivstyle">
                  <img src="/mainimage.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}
              

              {(scrollStep === 1 || scrollStep === 2) && (
                <ReligiousEventsMap viewState={mapViewState} setViewState={setMapViewState} />
              )}

              {scrollStep === 3 && (
                <div id="imagedivstyle">
                  <img src="/Shah-Snan.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}

              {scrollStep === 4 && (
                <div id="imagedivstyle">
                  <img src="/pooja.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}

              {scrollStep === 5 && (
                <div id="imagedivstyle">
                  <img src="/aghori.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}

              {scrollStep === 6 && (
                <div id="imagedivstyle">
                  <img src="/offering.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}

              {scrollStep === 7 && (
                <div id="imagedivstyle">
                  <img src="/asthivisarjan.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}

              {scrollStep === 8 && (
                <div id="imagedivstyle">
                  <img src="/water.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}

              {scrollStep >= 9 && scrollStep <= 13 && (
                <VerticalFlowChart data={kumbhData} currentStep={scrollStep - 9} />
                
              )}
              {scrollStep >= 9 && scrollStep <= 13 && (
              <OverlayStats data={kumbhData} step={scrollStep - 9} />
            )}


              {scrollStep >= 14 && scrollStep <= 17 && (
                <QuadrantChart
                  ref={chartRef}
                  data={combinedData}
                  onBubbleClick={handleBubbleClick}
                  currentStep={scrollStep}
                />
              )}

              {scrollStep === 18 && (
                <div id="imagedivstyle">
                  <img src="/Aghori_Water.jpg" alt="Narrative" className="imagestyle" />
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "2rem", fontSize: "1.2rem", color: "#666" }}>
              Loading data...
            </div>
          )}
        </div>

        <div className="right-scroll">
        <Section
    onStepChange={handleStepChange}
    selectedInfoMap={selectedInfoMap}
    currentStep={scrollStep}
  />  
   </div>
      </div>
      </div>

      {/* 📍 Add Scroll Indicator Dots */}
      <ScrollDots
  steps={19}
  currentStep={scrollStep}
  onDotClick={handleDotClick}
  scrollStep={scrollStep}
/>

<div id="global-tooltip" className="tooltip"></div>

    </>
  );
}



export default App;
