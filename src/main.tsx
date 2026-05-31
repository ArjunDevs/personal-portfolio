import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'lenis/dist/lenis.css'
import App from './App.tsx'

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, MorphSVGPlugin);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
