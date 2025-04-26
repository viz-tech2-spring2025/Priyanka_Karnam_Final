# Faith meets Ecology

1) Overview

This project visualizes the relationship between public sentiment, religious gatherings, and environmental impact during Kumbh Mela.
It combines an interactive scroll-driven narrative, live maps, images, data visualizations (Sankey chart and Quadrant bubble charts), and real-time sentiment analysis.

Built with React, D3.js, Deck.gl, and Scrollama.

2) Technologies Used

React (Vite or Create React App)
D3.js (for CSV loading, data processing, and visualizations)
Deck.gl (for interactive maps)
Scrollama (for scroll-based interactions)
HTML/CSS (styling, custom transitions)
JavaScript Hooks (useState, useEffect, useRef, useMemo, useCallback)

3) Features

Smooth scroll-driven narrative combined with interactive visuals.
Deck.gl based animated map zooming on key events.
Dynamic Sankey chart showing water quality changes over key ritual dates.
Quadrant charts that map Reddit and News content based on sentiment and belief alignment.
Scroll Dots Navigation for easy jump between sections.
Responsive design for better viewing across devices.


4) Dataset and analysis

Reddit.csv: Contains Reddit posts related to environmental and religious discussions around Kumbh Mela, collected using the Reddit API.
Articles.csv: Includes news articles sourced from both Indian and international media, focusing on Kumbh Mela’s events and environmental impact. Articles were extracted using Serp API.
Kumbhdata.csv: Provides water quality measurements (Fecal Coliform, BOD, pH) recorded during key ritual bathing days at Kumbh Mela.
Additional Notes: Sentiment predictions for both Reddit posts and news articles were generated using zero-shot classification. The dataset covers perspectives from both Indian and international sources.

5) Users: Policy makers, General public

6) Credits

Designed and Developed by Priyanka Karnam
MFA Information Design and Data Visualization
Advisor Support: Elina Oikonomaki
