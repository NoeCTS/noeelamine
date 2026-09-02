import { useState } from "react";
import { Link } from "react-router-dom";
import { Opener } from "@/components/Opener";
import { ContactSheet } from "@/components/ContactSheet";
import { Masthead, Foot } from "@/components/Chrome";
import { publicFrames } from "@/data/frames";

export default function Index() {
  const total = publicFrames().length;
  // The opening plays once a session. Coming back from a case study should not
  // mean scrolling past a full screen photograph again to reach the links.
  const [first] = useState(() => {
    try {
      if (sessionStorage.getItem("opened")) return false;
      sessionStorage.setItem("opened", "1");
      return true;
    } catch { return true; }
  });

  return (
    <>
      {first ? (
        <Opener src="/frames/027.jpg" label="Cards, self portrait" />
      ) : (
        <div className="wrap flex items-end gap-5 pt-24">
          <img src="/frames/027.jpg" alt="Cards, self portrait"
            className="h-24 w-36 flex-none object-cover" />
          <span className="mono pb-1">Frame 001 · already developed</span>
        </div>
      )}
      <div className="wrap relative z-[1] pt-6">
        <Masthead title="Noe Elamine" note="Archive, not a CV" />
        <p className="mt-9 max-w-[54ch] text-[clamp(1.05rem,1.6vw,1.28rem)] leading-snug">
          An archive, not a CV. Product marketing at Google on Chrome, building Aube,
          and everything else I have made. <span className="text-grey">
          The index below is a contact sheet ordered by when each frame entered the
          archive, so a campaign and a photograph sit at the same rank.</span>
        </p>
        <section className="mt-20">
          <div className="mb-6 flex flex-wrap items-baseline gap-4">
            <span className="num text-[1.4rem] text-grey">01</span>
            <h2 className="m-0 font-display text-[clamp(1.5rem,4vw,2.5rem)] uppercase leading-none" style={{ fontWeight: 400 }}>The index</h2>
            <span className="mono ml-auto">{total} frames</span>
          </div>
          <ContactSheet />
        </section>
        <Foot />
      </div>
    </>
  );
}
