import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Opener } from "@/components/Opener";
import { Masthead, Foot, SiteNav } from "@/components/Chrome";

// Whether the opening has already run in this JS session. Module scope rather
// than sessionStorage, which would survive a reload: loading the site afresh is
// a genuine arrival and earns the opener again. Returning to the index from
// inside the site is not, and does not.
let openerPlayed = false;

export default function Index() {
  const { hash } = useLocation();
  // The opener is an arrival, not a toll gate. The nav and every zone's way
  // back carry #index, which skips it outright; the flag covers the rest.
  const [playOpener] = useState(() => hash !== "#index" && !openerPlayed);
  // Recorded in an effect, not in the initializer above. That keeps the
  // initializer pure, so a StrictMode double-render cannot set the flag before
  // the second call reads it and quietly suppress the opening for good.
  useEffect(() => { openerPlayed = true; }, []);

  return (
    <>
      {/* A return to the index goes straight to the name. The frame that used to
          stand in for the opening here was a third photograph on a page that is
          meant to be the sections and not a gallery. */}
      {playOpener && (
        <Opener src="/frames/027.jpg" label="Noe Elamine, self portrait" frame="027" />
      )}
      <div className="wrap relative z-[1] pt-6">
        <Masthead title="Noe Elamine" note="An archive of my work" />
        <div className="mt-5 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 max-w-[68ch]">
            <div className="typed typed-lead flex flex-col gap-5">
              <p>
                I work as an <strong>Associate Product Marketing Manager at
                Google</strong> on the Chrome browser team.
              </p>
              <p>
                In my free time I am also building{" "}
                <strong>
                  <a href="https://aube-ai.com" target="_blank" rel="noopener noreferrer">
                    Aube
                  </a>
                </strong>, a platform that analyses
                marketing campaigns for cultural appropriation, tokenism, stereotypes,
                and visual authenticity etc, across 90+ markets.
              </p>
              <p>
                I did my undergrad at ESCP and my postgrad at Imperial.
              </p>
              <p>
                I like learning about AI and building cool stuff.
              </p>
              <p>
                This is an archive of all my work. Thanks for taking a look.
              </p>
            </div>
          </div>

          {/* The archive is full of frames and none of them were me. The intro
              should say what I look like before it says what I have made. */}
          {/* Stacked, the portrait belongs under the name, not after four
              paragraphs of text. Beside the column it can sit where it falls. */}
          <figure className="order-first m-0 w-[min(300px,72%)] lg:order-none lg:w-full">
            <span className="plate block">
              <img src="/portrait.jpg" alt="Noe Elamine"
                className="w-full object-cover" style={{ aspectRatio: "1 / 1" }} />
            </span>
            <figcaption className="mono mt-2">Noé Elamine · London</figcaption>
          </figure>
        </div>
        {/* The sections themselves are the landing page. The work sits inside
            them rather than being spilled out here as a wall of thumbnails. */}
        <section id="index" className="scroll-mt-20 pt-16">
          <p className="mono mb-2">The sections</p>
          <SiteNav scale="main" />
        </section>
        <Foot nav={false} />
      </div>
    </>
  );
}
