import React from "react";
import { Scrollama, Step } from "react-scrollama";

const Section = ({ onStepChange, selectedInfoMap, currentStep }) => {
  const steps = [
    `Given the sheer scale of this event and its
    significant environmental impact—ranging from strained water
    resources and rising pollution levels to the
    generation of non-biodegradable
    waste—are people truly aware of these challenges?
    <span class="highlighted">
     How effectively is this situation being communicated through
     the media, and what do people actually
     believe or perceive about the
     environmental consequences of such gatherings?
   </span>`,

    `<span class="sectiontitle"> Classification of Sentiments in Reddit</span>`,

    `<span class="sectiontitle">Classification of Sentiments in News Outlets</span?`,

    `As faith and environmental
    responsibility converge,
      perspectives diverge—some
      believe that devotion and nature
      must coexist in harmony, while
      others argue that one must take
      precedence over the other. Yet,
      amidst this contemplation, a
      deeper question emerges: 
      <span class="highlighted">
      Can we reimagine sacred
      gatherings in a way that
      honors both spiritual
      traditions and the well-being
      of the planet?</span>`
  ];

  return (
    <div style={{ width: "100%", margin: "0 auto", paddingTop: "50px" }}>
      <Scrollama onStepEnter={({ data }) => onStepChange(data)}>
        {steps.map((content, index) => (
          <Step data={index} key={index}>
            <div
              style={{
                margin: "0 0 400px",
                padding: "30px",
                
    
                opacity: currentStep === index ? 1 : 0.3,
                transition: "opacity 0.4s ease-in-out",
                height: "80vh",
              }}
            >
             
             <p dangerouslySetInnerHTML={{ __html: content }} />


              {currentStep === index && typeof selectedInfoMap[index] === "string" && selectedInfoMap[index].length > 0 && (


                <div
                  style={{
                    marginTop: "20px",
                    fontStyle: "italic",
                    color: "#333",
                    background: "#faf9f9",
                    padding: "10px",
                    borderRadius: "8px",
                   
                  }}
                >
                  <strong>Selected Info:</strong><br />
                  {selectedInfoMap[index]}
                </div>
              )}
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  );
};

export default Section;
