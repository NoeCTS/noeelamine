import { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Handshake,
  MapPin,
  Megaphone,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import gsap from 'gsap';
import GrainOverlay from '@/components/GrainOverlay';
import CustomCursor from '@/components/CustomCursor';
import { usePageTransition } from '@/components/PageTransition';
import betterideLogoYellow from '@/assets/betteride-logo-yellow.png';
import betterideFlyer1 from '@/assets/betteride-flyer-1.jpg';
import betterideFlyer2 from '@/assets/betteride-flyer-2.jpg';
import betterideFlyer3 from '@/assets/betteride-flyer-3.png';

const constraints = [
  'Near-zero marketing budget.',
  'Two-sided cold start: users need shops, shops need users.',
  'Bike shops were skeptical of extractive platforms.',
  'I executed strategy and operations solo.',
];

const marketStats = [
  { label: 'Bikes per 1,000 Berlin residents', value: '710' },
  { label: 'People cycling daily in Berlin', value: '500K' },
  { label: 'Cycling share of city trips', value: '13-17%' },
  { label: 'German bike market value (2024)', value: 'EUR 6.33B' },
  { label: 'Bike thefts per day in Berlin (2023)', value: '78/day' },
  { label: 'Activation spend', value: '< EUR 200' },
];

const charlottenburgReasons = [
  {
    title: 'Higher willingness to pay for convenience',
    detail: 'Affluent residents were more likely to choose professional repair over DIY.',
  },
  {
    title: 'Quality and trust orientation',
    detail: 'Strong fit for local-shop partnerships and service credibility.',
  },
  {
    title: 'Dense touchpoint repetition',
    detail: 'One focused district made every activation reinforce the next.',
  },
];

const activations = [
  {
    title: 'Dead Bicycles Museum',
    objective: 'Turn a visible urban problem into a memorable repair trigger.',
    execution:
      'Mock museum plaques on abandoned bikes with humor + QR call to action.',
    whyItWorked:
      'Locally relevant, highly shareable, and almost zero production cost.',
  },
  {
    title: 'Door Hangers',
    objective: 'Hit people only when repair need was obvious.',
    execution:
      'Placed on visibly damaged bikes with direct repair messaging.',
    whyItWorked: 'Contextual timing made relevance immediate.',
  },
  {
    title: 'Fake Parking Tickets',
    objective: 'Create instant attention in public space.',
    execution:
      'Citation-style notices reframing neglect with a sustainability angle.',
    whyItWorked: 'Familiar format drove recall and conversation.',
  },
  {
    title: 'Three Flyer Variants',
    objective: 'Test messaging quickly in one district.',
    execution:
      'Problem-led, solution-led, and community-led copy across cafes and transit points.',
    whyItWorked: 'Improved message-market fit without paid media.',
  },
  {
    title: 'LinkedIn B2B Content',
    objective: 'Warm shop owners before outreach.',
    execution:
      'Practical posts on seasonality, demand, and digital visibility.',
    whyItWorked: 'Raised credibility before in-person conversations.',
  },
];

const trustSteps = [
  'Face-to-face outreach focused on listening first.',
  'Freemium onboarding with zero upfront risk.',
  'Monetization only after proven value: first customer + two-month window.',
];

const whyApproachWorked = [
  'Concentrated geography created recognition density.',
  'Physical activation built legitimacy with both cyclists and shops.',
  'Freemium model aligned incentives and reduced B2B friction.',
  'Constraints forced focus on highest-impact work only.',
];

const keyLearnings = [
  'Constraints can improve strategic clarity.',
  'Trust in B2B marketplaces must be earned before monetization.',
  'Data gives direction; on-the-ground execution gives precision.',
  'Physical and digital channels perform best when tightly connected.',
];

const Betteride = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = usePageTransition();

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0c0902] text-foreground overflow-x-hidden">
      <GrainOverlay />
      <CustomCursor cursorRef={cursorRef} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16">
        <button
          onClick={() => navigateWithTransition('/')}
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </button>

        <section className="mb-12 rounded-3xl overflow-hidden border border-[#2f2610]">
          <div className="bg-[#0c0902] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#2f2610]">
            <div className="flex items-center gap-3">
              <img src={betterideLogoYellow} alt="Betteride logo mark" className="h-11 w-11 object-contain" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#ffc000]/85">Betteride</p>
                <p className="text-xs text-white/70">Go-to-market activation case study</p>
              </div>
            </div>
            <a
              href="https://betteride.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] px-4 py-2 border border-[#ffc000]/40 text-[#ffc000] hover:bg-[#ffc000] hover:text-[#0c0902] transition-colors"
            >
              betteride.eu <ExternalLink size={13} />
            </a>
          </div>

          <div className="bg-[#ffc000] text-[#0c0902] px-6 py-10 md:px-10 md:py-14">
            <p
              className="text-xs uppercase tracking-[0.22em] mb-4"
              style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif' }}
            >
              Strategy + Execution
            </p>
            <h1
              className="text-[clamp(2.8rem,8vw,6.2rem)] leading-[0.9] uppercase"
              style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.03em' }}
            >
              Building A Two-Sided
              <br />
              Marketplace From Zero
            </h1>
            <p className="mt-5 max-w-3xl text-base md:text-lg text-[#1a1304]/90">
              I designed and executed Betteride’s launch in Berlin by combining focused district strategy, guerrilla cyclist activation, and a trust-first bike-shop model.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.15em]">
              <span className="inline-flex items-center gap-2 px-3 py-2 border border-[#1a1304]/30">
                <MapPin size={13} /> Berlin
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 border border-[#1a1304]/30">
                <Users size={13} /> Solo marketing ownership
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 border border-[#1a1304]/30">
                <Target size={13} /> B2C + B2B GTM
              </span>
            </div>
          </div>
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#3a2f16] bg-[#100c05] p-6 md:p-7">
            <h2
              className="text-3xl uppercase mb-4 text-[#ffc000]"
              style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
            >
              01 Challenge
            </h2>
            <ul className="space-y-2.5 text-white/82 leading-relaxed text-sm md:text-base">
              {constraints.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1 text-[#ffc000]">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[#d5bf82] bg-[#fdf6dc] text-[#181104] p-6 md:p-7">
            <h2
              className="text-3xl uppercase mb-4"
              style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
            >
              01 Objective
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[#2f240f]/90">
              Solve the marketplace cold-start by generating local cyclist demand and converting skeptical bike shops with a model that proved value before payment.
            </p>
            <div className="mt-5 border border-[#d5bf82] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#5f4a1a] mb-1">Success Criteria</p>
              <p className="text-sm text-[#2f240f]/90 leading-relaxed">
                Visible neighborhood presence, qualified shop interest, and a replicable launch process under tight resource constraints.
              </p>
            </div>
          </article>
        </section>

        <section className="mb-12 rounded-3xl border border-[#d8cba7] bg-[#f7f2e6] text-[#120d05] px-6 py-8 md:px-8 md:py-10">
          <h2
            className="text-4xl uppercase mb-2"
            style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
          >
            02 Market Context
          </h2>
          <p className="text-[#2c2313]/85 max-w-3xl mb-6">
            Berlin had strong cycling behavior, high bike value, and visible repair need. That combination made a repair marketplace both relevant and commercially plausible.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {marketStats.map((stat) => (
              <article key={stat.label} className="border border-[#d8cba7] bg-white px-4 py-4">
                <p className="text-2xl font-semibold text-[#151005]">{stat.value}</p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.1em] text-[#5d4b23]">{stat.label}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-[#6d5731]">
            Sources referenced in deck: Berlin Police, ZIV, VSF, Statista, ADFC
          </p>
        </section>

        <section className="mb-12 rounded-3xl border border-[#2f2610] bg-[#0f0b04] px-6 py-8 md:px-8 md:py-10">
          <h2
            className="text-4xl uppercase mb-2 text-[#ffc000]"
            style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
          >
            03 Strategic Insight: Why Charlottenburg
          </h2>
          <p className="text-white/75 max-w-3xl">
            Instead of spreading across the city, I chose one beachhead district where income, cycling culture, and behavioral fit could compound faster.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {charlottenburgReasons.map((item) => (
              <article key={item.title} className="border border-[#3d3114] bg-black/30 p-5">
                <h3 className="text-sm uppercase tracking-[0.14em] text-[#ffc000] mb-2">{item.title}</h3>
                <p className="text-sm text-white/75 leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 border border-[#3d3114] bg-black/35 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#d7b568] mb-2">Beachhead Logic</p>
            <p className="text-sm text-white/80 leading-relaxed">
              The same user seeing Betteride repeatedly in one neighborhood drives recognition and trust faster than scattered citywide activity.
            </p>
          </div>
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#2f2610] bg-[#100c05] text-white px-6 py-7">
            <h2
              className="text-3xl uppercase mb-4 text-[#ffc000]"
              style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
            >
              04 Dual-Track GTM
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[#3a2f16] p-4 bg-black/25">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#ffc000] mb-2">
                  <Megaphone size={13} /> B2C
                </p>
                <p className="text-sm text-white/82 leading-relaxed">
                  Physical guerrilla activations to trigger local demand.
                </p>
              </div>
              <div className="border border-[#3a2f16] p-4 bg-black/25">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#ffc000] mb-2">
                  <Handshake size={13} /> B2B
                </p>
                <p className="text-sm text-white/82 leading-relaxed">
                  Trust-first partner outreach with risk removed.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#c7b47a] bg-[#fff4cf] text-[#161004] px-6 py-7">
            <h2
              className="text-3xl uppercase mb-3"
              style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
            >
              Why Physical Activation
            </h2>
            <p className="text-sm md:text-base text-[#2e230f]/90 leading-relaxed mb-4">
              Paid acquisition for marketplace apps can be expensive. With limited budget, physical activation created reach, memorability, and local legitimacy at a fraction of the cost.
            </p>
            <div className="border border-[#c7b47a] bg-white/70 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#6d551f] mb-1">
                <TrendingUp size={13} /> Strategic Benefit
              </p>
              <p className="text-sm text-[#2e230f]/90 leading-relaxed">
                B2C visibility also improved B2B conversion because shop owners could see Betteride active in their district.
              </p>
            </div>
          </article>
        </section>

        <section className="mb-12 rounded-3xl border border-[#2f2610] bg-[#0f0b04] px-6 py-8 md:px-8 md:py-10">
          <h2
            className="text-4xl uppercase mb-2 text-[#ffc000]"
            style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
          >
            05 B2C Activation System
          </h2>
          <p className="text-white/72 max-w-3xl">
            Five low-cost activations were designed to drive attention, relevance, and message testing in one district.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {activations.map((activation, idx) => (
              <article key={activation.title} className="border border-[#3d3114] bg-black/30 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold">{activation.title}</h3>
                  <p
                    className="text-xl leading-none text-[#ffc000]"
                    style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                </div>
                <p className="text-sm text-white/76 mb-2.5">
                  <span className="text-[#ffc000]/90">Objective:</span> {activation.objective}
                </p>
                <p className="text-sm text-white/70 leading-relaxed mb-2">
                  <span className="text-[#ffc000]/90">Execution:</span> {activation.execution}
                </p>
                <p className="text-sm text-white/66 leading-relaxed">
                  <span className="text-[#ffc000]/90">Why it worked:</span> {activation.whyItWorked}
                </p>
              </article>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-7">
            {[betterideFlyer1, betterideFlyer2, betterideFlyer3].map((img, idx) => (
              <article key={img} className="border border-[#3d3114] bg-black/35 overflow-hidden">
                <img src={img} alt={`Betteride activation creative ${idx + 1}`} className="w-full h-full object-cover" />
                <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[#d0b56a] border-t border-[#3d3114]">
                  Activation visual {idx + 1}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-[#d7bd72] bg-[#fff1bf] text-[#151006] px-6 py-8 md:px-8 md:py-10">
          <h2
            className="text-4xl uppercase mb-2"
            style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
          >
            06 B2B Trust Model
          </h2>
          <p className="max-w-3xl text-[#35270f]/85">
            Local shops had legitimate concerns. The model was designed so Betteride carried the early risk, not the partner.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {trustSteps.map((step, idx) => (
              <article key={step} className="border border-[#d7bd72] bg-white/75 p-5">
                <p
                  className="text-xl text-[#7c5a11] mb-2 uppercase"
                  style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </p>
                <p className="text-sm text-[#3a2b12]/85 leading-relaxed">{step}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 border border-[#d7bd72] bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7c5a11] mb-1">Conversion Trigger</p>
            <p className="text-sm text-[#3a2b12]/90 leading-relaxed">
              Payment discussion began only after a shop had received real customers and experienced value for two months.
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-[#2f2610] bg-[#0c0902] px-6 py-8 md:px-8 md:py-10">
          <h2
            className="text-4xl uppercase mb-5 text-[#ffc000]"
            style={{ fontFamily: '"Bebas Neue","Arial Narrow","Segoe UI",sans-serif', letterSpacing: '0.04em' }}
          >
            07 Why This Approach Worked
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border border-[#3a2f16] bg-black/30 p-5">
              <h3 className="text-sm uppercase tracking-[0.18em] text-[#ffc000] mb-3">Strategic Outcomes</h3>
              <ul className="space-y-2.5 text-sm md:text-base text-white/80">
                {whyApproachWorked.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-[#ffc000]">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="border border-[#3a2f16] bg-black/30 p-5">
              <h3 className="text-sm uppercase tracking-[0.18em] text-[#ffc000] mb-3">Key Learnings + My Role</h3>
              <ul className="space-y-2.5 text-sm md:text-base text-white/80 mb-5">
                {keyLearnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="text-xs uppercase tracking-[0.16em] text-[#d8b14a] mb-2">Scope</p>
              <p className="text-sm text-white/70 leading-relaxed">
                End-to-end ownership: market research, district selection, messaging strategy, creative production, physical deployment, bike-shop outreach, and B2B content.
              </p>
            </article>
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-4 pb-8">
          <button
            onClick={() => navigateWithTransition('/')}
            className="px-5 py-3 border border-white/20 text-xs uppercase tracking-[0.16em] hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Back Home
          </button>
          <a
            href="https://betteride.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#ffc000]/50 text-xs uppercase tracking-[0.16em] text-[#ffc000] hover:bg-[#ffc000] hover:text-[#0c0902] transition-colors"
          >
            Visit Betteride <ExternalLink size={14} />
          </a>
        </section>
      </main>
    </div>
  );
};

export default Betteride;
