import { useCallback, useEffect, useRef, useState } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./components/Hero";
import { Loader } from "./components/Loader";
import { About } from "./components/about";
import { Experience } from "./components/experience";
import { PersonalProjects } from "./components/projects";
import { Contact } from "./components/contact";
import CustomCursor from "./components/custom-cursor";

function App() {
  const lenisRef = useRef<LenisRef>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (loading) {
      lenis?.stop();
    } else {
      lenis?.start();
      // Layout is fully settled once the loader hands off; recompute trigger
      // positions so reveals fire at the right scroll offsets.
      ScrollTrigger.refresh();
    }
  }, [loading]);

  useEffect(() => {
    // Variable fonts swap in after first paint and shift element heights, which
    // invalidates ScrollTrigger's cached start/end positions. Refresh once the
    // fonts are ready so triggers line up with the final layout.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const handleLoaderComplete = useCallback(() => setLoading(false), []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        // Route same-page hash links (the navbar) through Lenis's smooth
        // scrollTo instead of the browser's instant jump.
        anchors: { offset: 0, duration: 1.2 },
      }}
      ref={lenisRef}
    >
      <div className="w-screen">
        <CustomCursor />
        <Hero />
        <About />
        <Experience />
        <PersonalProjects />
        <Contact />
      </div>
      {loading && <Loader onComplete={handleLoaderComplete} />}
    </ReactLenis>
  );
}

export default App;
