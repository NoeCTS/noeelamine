import { Link, useLocation } from "react-router-dom";
import { Opener } from "@/components/Opener";
import { ContactSheet } from "@/components/ContactSheet";
import { Masthead, Foot } from "@/components/Chrome";
import { publicFrames } from "@/data/frames";

export default function Index() {
  const total = publicFrames().length;
  // Arriving with an anchor means someone clicked back from a case study. Play
  // the opening only on a fresh visit: scrolling an anchor past a pinned,
  // three-viewport-tall opener is unreliable, and landing on the photograph
  // again is exactly what the link was trying to avoid.
  const returning = useLocation().hash === "#index";

  return (
    <>
      {returning ? (
        <div className="wrap flex items-end gap-4 pt-24">
          <img src="/frames/027.jpg" alt="Cards, self portrait"
            className="h-20 w-32 flex-none object-cover sm:h-24 sm:w-36" />
          <span className="mono pb-1">Frame 027 · developed</span>
        </div>
      ) : (
        <Opener src="/frames/027.jpg" label="Cards, self portrait" frame="027" />
      )}
      <div className="wrap relative z-[1] pt-6">
        <Masthead title="Noe Elamine" note="Archive, not a CV" />
        <div className="mt-9 flex max-w-[62ch] flex-col gap-4">
          <p className="m-0 text-[clamp(1.05rem,1.6vw,1.28rem)] leading-snug">
            I am Noé Elamine. I work as an <strong className="font-medium">Associate Product
            Marketing Manager at Google</strong>, on the Chrome browser team, in London.
          </p>
          <p className="m-0 text-[clamp(1.05rem,1.6vw,1.28rem)] leading-snug">
            In my own time I am the <strong className="font-medium">founder of{" "}
            <Link to="/aube" className="underline decoration-1 underline-offset-4 hover:text-klein-lift">Aube</Link></strong>,
            a platform that reads marketing campaigns for cultural appropriation,
            tokenism, stereotyping and visual authenticity across 90+ markets.
          </p>
          <p className="m-0 text-[15px] leading-relaxed text-grey">
            Before that, strategy and growth at Betteride in Berlin and marketing at
            Publicis in Hamburg. Undergrad at ESCP, postgrad at Imperial. Ten years at a
            French school in Hamburg, which is where the German comes from. I like
            learning about AI and building things.
          </p>
          <p className="m-0 text-[15px] leading-relaxed text-grey">
            <strong className="font-medium text-ink">This is my archive.</strong> Not a CV
            and not quite a portfolio: everything I have made, ordered by when it entered
            rather than by how impressive it is, so a campaign and a photograph sit at the
            same rank.
          </p>
        </div>
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
