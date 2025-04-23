import React from "react";
import { Scrollama, Step } from "react-scrollama";
import  ReligiousEventsMap  from "./constant_Variables";
import StreamGraph from './sankey';

const Section = ({ onStepChange, selectedInfoMap, currentStep }) => {
  const steps = [
    <div style={{ textAlign: 'left' }}>
    <h1 style={{ color: '#932b23', fontSize: '2.6rem', fontWeight: 700 }}>
      Faith Meets Ecology
    </h1>
    <p style={{ color: '#222', fontSize: '1.2rem', lineHeight: 1.6 }}>
      Understanding Public Sentiment on<br />
      Kumbh Mela's Environmental Footprint <br/> <br/>
    </p>
    <p style={{ color: '#222', fontSize: '0.8rem', lineHeight: 1.6 }}>
      By Priyanka Karnam
    </p>

  </div>,

    `<p>Kumbh Mela is the largest religious gathering in the world, with <span class="highlighted"> approximately 400 million people </span> attending over a span of 45 days.<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></p>`,

    `<span class="sectiontitle">Where does this take place?</span> 
    <p> <br/>At the confluence of River Ganga, River Yamuna, and
    mythical Saraswati, at Sangam, Prayagraj,
    which is located in India.<br/><br/><br/><br/></p>`,

    `<span class="sectiontitle"> Holy Dip - Shahi Snan (Primary Ritual)</span> 
    <p> <br/>A sacred bath taken by saints and pilgrims in the confluence of rivers, believed to cleanse sins and purify the soul. It is the most auspicious act during Kumbh Mela.</p>`,

    `<span class="sectiontitle"> Religious Ceremonies & Prayers</span> 
    <p> <br/>Throughout the Mela, devotees perform traditional rituals, chant mantras, and offer prayers to seek blessings, enlightenment, and spiritual merit.</p>`,

    `<span class="sectiontitle"> Darshan of Naga Sadhus</span> 
    <p> <br/>Pilgrims gather to witness and receive blessings from Naga Sadhus—ascetic warriors who renounce all worldly possessions and symbolize ultimate spiritual discipline.</p>`,

    `<span class="sectiontitle">  Offerings to the River</span> 
    <p> <br/>Devotees make offerings of flowers, diyas (oil lamps), and sacred items to the river, symbolizing gratitude, purification, and reverence for nature.</p>`,

    `<span class="sectiontitle"> Merging the Ashes of the Deceased</span> 
    <p> <br/>Ashes of loved ones are immersed in the sacred waters, believed to free the soul from the cycle of rebirth and lead it toward liberation (moksha).</p>`,

    `“This grand religious gathering, while spiritually significant, has a profound environmental footprint that extends far beyond the festival grounds. The rituals, offerings, and mass congregation at the Kumbh Mela often contribute to river pollution, directly affecting not only the health and well-being of millions of pilgrims but also the delicate ecosystems that depend on these waters.”`,

    `<span class="sectiontitle">Paush Poornima</span> 
    <p> <br/>Marks the beginning of the Kumbh Mela bathing period. Devotees take a holy dip on this full moon day, symbolizing spiritual renewal and the start of auspicious rituals.</br></br></br></p>`,

    `<span class="sectiontitle">Makar Sankranti</span> 
    <p> <br/>A major bathing day when the Sun enters Capricorn. It signifies the end of winter solstice and is considered highly sacred for taking a dip in the holy rivers.</br></br></br></p>`,

    `<span class="sectiontitle">Mauni Amavasya (Amawasya)</span> 
    <p> <br/>The most significant bathing day of the Kumbh Mela. It is believed that bathing on this new moon day brings the greatest spiritual merit. Observers also practice silence (maun vrat).</br></br></br></p>`,

    `<span class="sectiontitle"> Basant Panchami (Panchami)</span> 
    <p> <br/>Celebrated in honor of Goddess Saraswati, the deity of wisdom. Pilgrims bathe to seek knowledge and purity while also celebrating the arrival of spring.</br></br></br></p>`,

    `<span class="sectiontitle">Maghi Poornima (Poornima)</span> 
    <p> <br/>The final full moon bathing day during the Mela. It holds spiritual importance as many devotees conclude their religious observances with one last purifying dip.</br></br></br></p>`,

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
   
   `<span class="sectiontitle">Classification of sentiments</span>
   <p> </br>To explore public sentiment surrounding religious gatherings and environmental beliefs, data from Reddit and news outlets was collected and analyzed. The content was classified based on 
   whether it aligned with environmental concerns or religious beliefs, and further assessed for its alignment with government policies.</p>
   <p style="font-size: 11px; color: #932b23;" ></br>Click or hover the bubbles for more infromation</p>`,

    `<span class="sectiontitle"> Classification of Sentiments in Reddit</span>
    <p><br/>The analysis of Reddit posts reveals that nearly half (48%) of the content is belief-aligned, followed by 40% aligning with environmental concerns, and 12% categorized as neutral. In terms of government alignment, a majority of the posts (52%) are critical of the government, while 27% remain neutral and 21% show pro-government sentiment. Overall, the Reddit discourse reflects a strong inclination toward personal or spiritual values and a critical stance on governmental actions.</p>
   <p style="font-size: 11px; color: #932b23;" ></br>Click or hover the bubbles for more infromation</p>`,

    `<span class="sectiontitle">Classification of Sentiments in News Outlets</span>
    <p><br/>The analysis of news articles reveals that both international and Indian media predominantly reflect a belief-aligned sentiment. Among international articles, 64.29% are critical of the government, and 57.14% are belief-aligned. Similarly, Indian articles show that 49.02% are critical of the government, while an even higher percentage—72.55%—align with belief-driven narratives. This suggests a consistent focus on spiritual or religious themes across both categories, accompanied by a largely critical perspective on governmental actions.</p>
    <p style="font-size: 11px; color: #932b23;" ></br>Click or hover the bubbles for more infromation</p>
    `,

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
            id={`scroll-step-${index}`} 
              style={{
                margin: "0 0 400px",
                padding: "30px",
                opacity: currentStep === index ? 1 : 0.3,
                transition: "opacity 0.4s ease-in-out",
                height: "80vh",
              }}
            >
             
             {typeof content === "string" ? (
  <p dangerouslySetInnerHTML={{ __html: content }} />
) : (
  content
)}
 {index === 0 && (
    <div className="right-scroll-arrow"><br/><br/><br/><br/>↓ Scroll</div>
  )}
             {index === 9 && (
              <img
                src="/warli15.svg" // or use `src={warlike}` if imported
                alt="Warlike visual"
                id="imgstyle"
              />
            )}
            {index === 10 && (
              <img
                src="/warli35.svg" // or use `src={warlike}` if imported
                alt="Warlike visual"
                id="imgstyle"
              />
            )}
            {index === 11 && (
              <img
                src="/warli.svg" // or use `src={warlike}` if imported
                alt="Warlike visual"
                id="imgstyle"
              />
            )}
               {index === 12 && (
              <img
                src="/warli23.svg" // or use `src={warlike}` if imported
                alt="Warlike visual"
                id="imgstyle"
              />
            )}
            {index === 13 && (
              <img
                src="/warli20.svg" // or use `src={warlike}` if imported
                alt="Warlike visual"
                id="imgstyle"
              />
            )}

            {index === 2 && (
              <img
                src="/map.jpg" // or use `src={warlike}` if imported
                
                id="imgstyle"
              />
            )}

            {index === 1 && (
              <img
                src="/map_legend.svg" // or use `src={warlike}` if imported
                
                id="imgstyle"
              />
            )}


              {currentStep === index && typeof selectedInfoMap[index] === "string" && selectedInfoMap[index].length > 0 && (


              <div
              style={{
                marginTop: "20px",
                color: "#333",
                background: "#faf9f9",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.6em"
              }}
              dangerouslySetInnerHTML={{
                __html: `<strong style="font-size: 16px;">Selected Info:</strong><br/>${selectedInfoMap[index]}`
              }}
              />
              )}
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  );
};

export default Section;
