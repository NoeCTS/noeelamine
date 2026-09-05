import { Opener } from "@/components/Opener";
import { AsciiName } from "@/components/AsciiName";
import { Masthead, Foot, SiteNav } from "@/components/Chrome";

export default function Index() {
  return (
    <>
      {/* The opening is always here. Coming back carries #index, which lands you
          at the name and the photograph with the opening still above you, so it
          is there to scroll up into rather than gone. */}
      <Opener src="/frames/027.jpg" label="Noe Elamine, self portrait" />
      <div id="index" className="wrap relative z-[1] scroll-mt-6 pt-6">
        <Masthead ascii title={<AsciiName text="NOÉ ELAMINE" />} note="An archive of my work" />
        <div className="mt-5 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 max-w-[68ch]">
            <div className="typed typed-lead flex flex-col gap-5">
              <p>
                I work as an <strong>Associate Product Marketing Manager at{" "}
                <span className="goog" aria-label="Google">
                  <i aria-hidden="true">G</i><i aria-hidden="true">o</i><i aria-hidden="true">o</i>
                  <i aria-hidden="true">g</i><i aria-hidden="true">l</i><i aria-hidden="true">e</i>
                </span></strong> on the Chrome browser team.
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
        <section className="pt-16">
          <p className="mono mb-2">The sections</p>
          <SiteNav scale="main" />
        </section>
        <Foot nav={false} />
      </div>
    </>
  );
}
