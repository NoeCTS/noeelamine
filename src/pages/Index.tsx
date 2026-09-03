import { Opener } from "@/components/Opener";
import { ContactSheet } from "@/components/ContactSheet";
import { Masthead, Foot } from "@/components/Chrome";
import { publicFrames } from "@/data/frames";

export default function Index() {
  const total = publicFrames().length;

  return (
    <>
      <Opener src="/frames/027.jpg" label="Cards, self portrait" frame="027" />
      <div className="wrap relative z-[1] pt-6">
        <Masthead title="Noe Elamine" note="Archive, not a CV" />
        <p className="mt-9 max-w-[54ch] text-[clamp(1.05rem,1.6vw,1.28rem)] leading-snug">
          An archive, not a CV. Product marketing at Google, building Aube,
          and everything else I have made. <span className="text-grey">
          The index below is a contact sheet ordered by when each frame entered the
          archive, so a campaign and a photograph sit at the same rank.</span>
        </p>
        <section id="index" className="scroll-mt-20 pt-20">
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
