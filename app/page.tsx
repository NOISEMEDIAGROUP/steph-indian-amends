"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const reportBasePath = process.env.NEXT_PUBLIC_REPORT_BASE_PATH ?? "";
const reportAsset = (filename: string) => `${reportBasePath}/${filename}`;

type Metric = { label: string; value: string; note?: string };
type Creative = { title: string; metric: string; note: string; crop: number; stage: string };

const report = {
  client: "Indian Motorcycle",
  period: "July 2026",
  previousPeriod: "June 2026",
  overallMetrics: [
    { label: "Media spend", value: "$583K", note: "↓ 31% MoM" },
    { label: "Impressions", value: "30.63M", note: "↓ 22% MoM" },
    { label: "Clicks", value: "689.8K", note: "↓ 25% MoM" },
    { label: "Leads", value: "10,508", note: "↓ 14% MoM" },
    { label: "CPM", value: "$19.04", note: "↓ 13% MoM" },
    { label: "CPC", value: "$0.85", note: "↓ 8% MoM" },
    { label: "Conversion rate", value: "1.52%", note: "↑ 14% MoM" },
    { label: "Blended CPL", value: "$55.50", note: "↓ 20% MoM" },
  ] satisfies Metric[],
  top: [
    { title: "Efficiency strengthened", text: "$583K generated 10,508 leads at $55.50 CPL. Spend fell 31%, while lead volume declined by only 14%." },
    { title: "Lead delivery beat plan", text: "Leads reached 109% of forecast while spend landed at 101%, with CPL 7% below forecast." },
    { title: "The mix is less Scout-dependent", text: "Bagger rose to 2,177 leads. Chief and Touring contributed 1,449 and 1,372, creating a more balanced portfolio." },
  ],
  topCreative: [
    { title: "Challenger POV", metric: "3.09% CTR · 23K LPV", note: "Rider POV puts movement and the ownership experience in frame one.", crop: 0, stage: "Consideration" },
    { title: "Scout Monthly Payments", metric: "798 leads · $101 CPL", note: "A concrete payment figure makes value immediate without losing the bike.", crop: 1, stage: "Prospecting" },
    { title: "Chieftain Finance", metric: "212 leads · $17 CPL", note: "Direct product and finance proof closes a warm audience efficiently.", crop: 2, stage: "Retargeting" },
  ] satisfies Creative[],
  lowCreative: [
    { title: "Scout Static v1", metric: "1.67% CTR", note: "37% below campaign average. Static product imagery lacked a feed-first hook.", crop: 0, stage: "Consideration" },
    { title: "Social Native Video", metric: "$252 CPL", note: "117% above campaign average. Trend-led treatment did not fit the core audience.", crop: 1, stage: "Prospecting" },
    { title: "Challenger Lifestyle", metric: "$40 CPL", note: "110% above campaign average. Lifestyle alone gave warm riders too little reason to act.", crop: 2, stage: "Retargeting" },
  ] satisfies Creative[],
};

const panels = [
  ["title", "Title"], ["summary", "This month"], ["overall", "Overall results"],
  ["forecast", "Versus forecast"], ["portfolio", "Budget and product"],
  ["google", "Google"], ["google-type", "Google campaign type"], ["google-tier", "Google tier"], ["google-model", "Google model"],
  ["meta", "Meta"], ["meta-funnel", "Meta funnel"], ["meta-product", "Meta product"], ["meta-geo", "Meta geography"],
  ["creative", "Creative"], ["creative-performers", "Top vs low"], ["creative-learnings", "Creative learnings"], ["creative-next", "Creative action"],
  ["next", "What happens next"],
] as const;

export default function Home() {
  const storyRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useMemo(() => `${((active + 1) / panels.length) * 100}%`, [active]);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const items = Array.from(story.querySelectorAll<HTMLElement>("[data-story-panel]"));
    const sync = () => {
      const origin = window.matchMedia("(max-width: 820px)").matches ? story.getBoundingClientRect().top : story.getBoundingClientRect().left;
      const index = items.reduce((best, item, i) => {
        const edge = window.matchMedia("(max-width: 820px)").matches ? item.getBoundingClientRect().top : item.getBoundingClientRect().left;
        const bestEdge = window.matchMedia("(max-width: 820px)").matches ? items[best].getBoundingClientRect().top : items[best].getBoundingClientRect().left;
        return Math.abs(edge - origin) < Math.abs(bestEdge - origin) ? i : best;
      }, 0);
      setActive(index);
    };
    story.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => { story.removeEventListener("scroll", sync); window.removeEventListener("resize", sync); };
  }, []);

  const go = (index: number) => {
    const el = document.getElementById(panels[Math.max(0, Math.min(panels.length - 1, index))][0]);
    el?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    setMenuOpen(false);
  };

  return <div className="report-shell">
    <div className="read-progress"><span style={{ width: progress }} /></div>
    <header className="topbar">
      <button className="noise-mark" onClick={() => go(0)} aria-label="Return to title"><Image src={reportAsset("noise-logo-black.png")} alt="Noise Media" width={1920} height={830} priority unoptimized /></button>
      <div className="report-name"><span>Noise ×</span><strong>{report.client}</strong></div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open report menu"><i/><i/><i/></button>
    </header>
    <aside className={`chapter-nav ${menuOpen ? "open" : ""}`}><p>Jump to slide</p><nav>{panels.map((p, i) => <button key={p[0]} className={active === i ? "active" : ""} onClick={() => go(i)}><span>{String(i + 1).padStart(2,"0")}</span>{p[1]}</button>)}</nav></aside>
    <main className="horizontal-story" ref={storyRef} aria-label="Performance report" onWheel={(e) => { if (window.matchMedia("(max-width: 820px)").matches || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; e.preventDefault(); storyRef.current?.scrollBy({ left: e.deltaY }); }}>
      <section className="story-panel title-panel thank-you-chapter" id="title" data-story-panel>
        <div className="thank-you-main"><p className="thank-kicker">Monthly paid media review</p><h1>Indian Motorcycle</h1><p className="title-period">{report.period} · Noise Media</p></div>
        <div className="thank-foot"><span>Performance · creative · next actions</span><span>01 / {panels.length}</span></div>
      </section>

      <section className="story-panel light" id="summary" data-story-panel>
        <Header n="02" eyebrow="Executive summary" title="This month in 3 points." intro="The story before the detail: what moved, why it matters and where the next month should focus." />
        <div className="month-points">{report.top.map((p,i)=><article key={p.title}><span>0{i+1}</span><h3>{p.title}</h3><p>{p.text}</p></article>)}</div>
        <div className="priority-callout"><span>Next month priority</span><p>Protect the new efficiency base while rebuilding volume and shifting demand toward Touring and Chief.</p></div>
      </section>

      <section className="story-panel results-hero light" id="overall" data-story-panel>
        <Header n="03" eyebrow="Overall results" title="Less spend delivered stronger efficiency." intro="All account-level metrics in one view. Channel detail follows later." />
        <MetricGrid metrics={report.overallMetrics} cols={4}/>
        <Takeaway>Spend fell faster than demand. The account generated leads 20% more efficiently and finished ahead of the lead forecast.</Takeaway>
      </section>

      <section className="story-panel light" id="forecast" data-story-panel>
        <Header n="04" eyebrow="Overall · versus forecast" title="Lead delivery beat plan without overspending." intro="Actual delivery versus the July forecast. The numbers are the story; one conclusion sits below." />
        <MetricGrid metrics={[
          {label:"Media spend",value:"$583K",note:"101% of $579K forecast"},{label:"Meta spend",value:"$381K",note:"101% of $376K forecast"},{label:"Google spend",value:"$201K",note:"99% of $202K forecast"},{label:"Impressions",value:"30.63M",note:"317% of 9.66M forecast"},
          {label:"Sessions",value:"689.8K",note:"75% of 914.6K forecast"},{label:"Leads",value:"10,508",note:"109% of 9,659 forecast"},{label:"CPS",value:"$0.85",note:"135% of $0.63 forecast"},{label:"CPL",value:"$55.50",note:"93% of $60 forecast"},
        ]} cols={4}/>
        <Takeaway>Visibility overdelivered and lead efficiency beat plan. The remaining gap is traffic cost, not conversion performance.</Takeaway>
      </section>

      <section className="story-panel light" id="portfolio" data-story-panel>
        <Header n="05" eyebrow="Budget and product" title="Bagger growth is reducing dependence on Scout." intro="Budget closed on plan. The product mix is becoming more balanced, but Touring and Chief still need deliberate support." />
        <div className="movement-grid"><article><span>Budget delivery</span><strong>99.74%</strong><p>$578,187 spent against $579,690 budget.</p></article><article><span>Scout leads</span><strong>4,197</strong><p>Still the largest demand driver across the portfolio.</p></article><article><span>Bagger leads</span><strong>2,177</strong><p>Now the second-largest contributor after focused creative and media support.</p></article></div>
        <Takeaway>Keep Bagger momentum. Build dedicated Touring and Chief routes rather than relying on Scout volume to carry the mix.</Takeaway>
      </section>

      <section className="story-panel light" id="google" data-story-panel>
        <Header n="06" eyebrow="Google · headline" title="Google did more with less as CPA fell 17%." intro="A deliberate pull-back in spend reduced volume, but conversions declined more slowly and efficiency improved." />
        <MetricGrid metrics={[{label:"Spend",value:"$201,420",note:"↓ 35% MoM"},{label:"Conversions",value:"5,287",note:"↓ 21% MoM"},{label:"CPA",value:"$38.10",note:"↓ 17% MoM"},{label:"Conversion rate",value:">1.8%",note:"Second straight month"}]} cols={4}/>
        <StoryBoxes items={[
          ["What the results tell us","$38.10","The account absorbed a 35% spend cut while CPA improved to its lowest level since March."],
          ["Biggest win","−17% CPA","Lead volume fell less than spend, confirming a real efficiency gain."],
          ["What is driving performance","PMax","Performance Max supplied 84% of Google conversions by capturing high-intent demand."],
          ["What we do next","Value-weight","Optimise toward priority models, not form volume alone."],
        ]}/>
      </section>

      <section className="story-panel light" id="google-type" data-story-panel><Header n="07" eyebrow="Google · campaign type" title="PMax drives scale; Brand remains the cheapest route." intro="Two campaign jobs, judged against the result each is meant to produce."/><div className="detail-grid cols-3"><article><span>Brand</span><strong>$28.65 CPA</strong><b>843 conversions · $24.1K spend</b><p>Protect this efficient intent-capture route.</p></article><article><span>Performance Max</span><strong>$39.89 CPA</strong><b>4,444 conversions · $177.3K spend</b><p>Keep the scale, but improve the quality signal.</p></article><article><span>Overall takeaway</span><strong>84%</strong><b>of Google conversions from PMax</b><p>Scale is concentrated in PMax; steering the model mix is now more important than finding more forms.</p></article></div></section>

      <section className="story-panel light" id="google-tier" data-story-panel><Header n="08" eyebrow="Google · tier" title="Efficiency improved across every tier, not one isolated segment." intro="Catch All stayed cheapest. Tier 3 posted the lowest CPA among the main tiers."/><MetricGrid metrics={[{label:"Tier 1",value:"$42.12",note:"1,960 conversions"},{label:"Tier 2",value:"$39.29",note:"1,751 conversions"},{label:"Tier 3",value:"$28.05",note:"1,035 conversions"},{label:"Canada",value:"$46.63",note:"327 conversions"},{label:"Canada FR",value:"$58.71",note:"11 conversions"},{label:"Catch All",value:"$25.25",note:"202 conversions"}]} cols={3}/><Takeaway>Lean into Catch All where lead quality holds, while keeping tier controls aligned to dealer priority.</Takeaway></section>

      <section className="story-panel light" id="google-model" data-story-panel><Header n="09" eyebrow="Google · model" title="The algorithm is still choosing volume over the desired model mix." intro="Chief and Pursuit take 54% of PMax cost. Brand demand is led by core terms and Scout."/><div className="detail-grid cols-4"><article><span>PMax · Chief</span><strong>$39.11</strong><b>1,243 conversions</b><p>$48.6K spend.</p></article><article><span>PMax · Pursuit</span><strong>$42.89</strong><b>1,133 conversions</b><p>$48.6K spend.</p></article><article><span>PMax · Scout</span><strong>$34.20</strong><b>794 conversions</b><p>$27.2K spend.</p></article><article><span>Brand · Core</span><strong>$24.83</strong><b>601 conversions</b><p>$14.9K spend.</p></article></div><Takeaway>Introduce weighted conversion values so efficient volume also moves the portfolio toward the bikes the business wants to sell.</Takeaway></section>

      <section className="story-panel light" id="meta" data-story-panel><Header n="10" eyebrow="Meta · headline" title="Warm audiences carried Meta's efficiency gain." intro="Spend fell 29%, yet lead volume declined by only around 300 as retargeting became more efficient."/><StoryBoxes items={[
        ["What the results tell us","$72 CPL","Meta became 20% more efficient while operating at lower investment."],
        ["Biggest win","$20 CPL","Retargeting generated 2,711 leads on 25% less spend."],
        ["What is driving performance","Warm intent","Finance, colour and product proof gave high-intent riders a direct reason to convert."],
        ["What we do next","Protect $20","Reinvest into retargeting first, then rebuild prospecting without returning to June cost levels."],
      ]}/></section>

      <section className="story-panel light" id="meta-funnel" data-story-panel><Header n="11" eyebrow="Meta · funnel" title="Retargeting grew leads while spend fell." intro="Every funnel stage is doing a different job. The comparison should stay within objective."/><div className="detail-grid cols-3"><article><span>Consideration</span><strong>178,151 clicks</strong><b>$48.4K spend · 2.63% CTR</b><p>Traffic at $0.33 per landing-page view.</p></article><article><span>Prospecting conversion</span><strong>2,366 leads</strong><b>$116 CPL · 2.06% CVR</b><p>The scale engine, but not the efficiency hero.</p></article><article><span>Retargeting conversion</span><strong>2,711 leads</strong><b>$20 CPL · 5.7% CVR</b><p>More leads despite 25% less spend.</p></article></div></section>

      <section className="story-panel light" id="meta-product" data-story-panel><Header n="12" eyebrow="Meta · product" title="Bagger reached its retail-share goal; Touring and Chief remain the gap." intro="The creative model shown drove the lead classification."/><MetricGrid metrics={[{label:"Scout",value:"63%",note:"3,246 leads · target 42%"},{label:"Bagger",value:"29%",note:"1,480 leads · target 29%"},{label:"Touring",value:"4%",note:"207 leads · target 18%"},{label:"Chief",value:"4%",note:"183 leads · target 12%"}]} cols={4}/><Takeaway>Maintain Bagger support. Make Touring and Chief the next creative development priority so the mix keeps moving toward retail goals.</Takeaway></section>

      <section className="story-panel light" id="meta-geo" data-story-panel><Header n="13" eyebrow="Meta · geography" title="Dealer-tier investment is broadly aligned; lower budgets require concentration." intro="At reduced investment, priority locations need enough signal to optimise."/><MetricGrid metrics={[{label:"Tier 1",value:"$151 CPL",note:"42% spend · target 45–50%"},{label:"Tier 2",value:"$120 CPL",note:"31% spend · target 25–30%"},{label:"Tier 3",value:"$127 CPL",note:"12% spend · target 15–20%"},{label:"Retargeting",value:"$20 CPL",note:"15% spend · 2,711 leads"}]} cols={4}/><Takeaway>For September, concentrate on Tier 1 and non-Snowbelt Tier 2 dealers; pause Tier 3 when budget cannot support learning.</Takeaway></section>

      <section className="story-panel light" id="creative" data-story-panel><Header n="14" eyebrow="Creative · what wins" title="Movement creates desire; product and finance close the sale." intro="Creative is the main focus here: large assets, one result and one reason each."/><div className="creative-hero-grid">{report.topCreative.map(c=><CreativeCard key={c.title} creative={c}/>)}</div></section>

      <section className="story-panel light" id="creative-performers" data-story-panel><Header n="15" eyebrow="Creative · top vs low" title="The winners make the bike or benefit obvious immediately." intro="Best and weakest assets shown side by side, with the result and the shortest useful explanation."/><div className="performer-split"><div><p className="performer-label">Top performers</p>{report.topCreative.map(c=><CompactCreative key={c.title} creative={c}/>)}</div><div><p className="performer-label low">Low performers</p>{report.lowCreative.map(c=><CompactCreative key={c.title} creative={c}/>)}</div></div></section>

      <section className="story-panel light" id="creative-learnings" data-story-panel><Header n="16" eyebrow="Creative · learnings" title="Four rules should shape the next month of work." intro="What performance tells us about the creative, not a restatement of the numbers."/><div className="learn-grid learn-grid-4">{[
        ["Movement earns attention","Riding footage and POV create a stronger opening hook than passive static imagery."],
        ["Tangible benefits convert","Payments, finance and clear product detail give prospects a reason to act."],
        ["Warm audiences need clarity","Retargeting works best with branded, product-first offer creative."],
        ["Match the funnel job","Lifestyle builds interest; product and finance should carry conversion."],
      ].map((x,i)=><article key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></section>

      <section className="story-panel light" id="creative-next" data-story-panel><Header n="17" eyebrow="Creative · what we do next" title="Keep the proof. Improve the weak signal. Test the next growth routes." intro="Action-led priorities for the next creative cycle."/><div className="kit-grid"><article><span>KEEP</span><ul><li>Riding and POV video for consideration</li><li>Direct finance and payment messaging</li><li>Product-first retargeting</li></ul></article><article><span>IMPROVE</span><ul><li>Open every video with movement</li><li>Reduce text-heavy statics</li><li>Make the model and benefit legible at once</li></ul></article><article><span>TEST</span><ul><li>Touring and Chief payment variants</li><li>6–15s Porch House edits</li><li>Stripped-back versus branded prospecting</li></ul></article></div></section>

      <section className="story-panel light" id="next" data-story-panel><Header n="18" eyebrow="Next steps" title="What happens next." intro="Short, action-led recommendations grouped by what we continue, improve and test."/><div className="happens-grid"><article><span>CONTINUE</span><div><h3>Protect efficiency</h3><p>Rebuild volume while holding blended CPL at or below the $60 forecast.</p></div><div><h3>Back Bagger momentum</h3><p>Keep model support at the level that brought Bagger to its 29% retail-share goal.</p></div></article><article><span>OPTIMISE</span><div><h3>Value-weight Google</h3><p>Move PMax toward priority models, not form volume alone.</p></div><div><h3>Concentrate dealer spend</h3><p>Focus lower budgets on Tier 1 and higher-opportunity Tier 2 locations.</p></div></article><article><span>TEST</span><div><h3>Build missing-model demand</h3><p>Launch Touring and Chief routes across lifestyle, product and finance.</p></div><div><h3>Close the quality loop</h3><p>Join CRM outcomes to media so the next budget follows lead quality.</p></div></article></div></section>
    </main>
    <div className="slide-controls" aria-label="Report page navigation"><button onClick={()=>go(active-1)} disabled={active===0} aria-label="Previous panel">← <span>Previous</span></button><div><span>{panels[active][1]}</span><strong>{String(active+1).padStart(2,"0")} / {panels.length}</strong></div><button onClick={()=>go(active+1)} disabled={active===panels.length-1} aria-label="Next panel"><span>Next</span> →</button></div>
  </div>;
}

function Header({n,eyebrow,title,intro}:{n:string;eyebrow:string;title:string;intro:string}) { return <header className="chapter-header insight-header"><div className="section-number">{n}</div><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><p>{intro}</p></header>; }
function MetricGrid({metrics,cols}:{metrics:Metric[];cols:number}) { return <div className={`detail-grid cols-${cols}`}>{metrics.map(m=><article key={m.label}><span>{m.label}</span><strong>{m.value}</strong>{m.note&&<b>{m.note}</b>}</article>)}</div>; }
function Takeaway({children}:{children:React.ReactNode}) { return <div className="takeaway-bar"><span>Overall performance takeaway</span><p>{children}</p></div>; }
function StoryBoxes({items}:{items:string[][]}) { return <div className="story-boxes">{items.map(x=><article key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><p>{x[2]}</p></article>)}</div>; }
function CreativeVisual({creative}:{creative:Creative}) { return <span className="creative-image"><Image src={reportAsset("indian-creative-triptych.png")} alt={`${creative.title} Indian Motorcycle creative`} width={1200} height={675} unoptimized style={{left:`${-creative.crop*100}%`}}/><i>{creative.stage}</i></span>; }
function CreativeCard({creative}:{creative:Creative}) { return <article><CreativeVisual creative={creative}/><div><strong>{creative.metric}</strong><span>{creative.stage}</span><h3>{creative.title}</h3><p>{creative.note}</p></div></article>; }
function CompactCreative({creative}:{creative:Creative}) { return <article><CreativeVisual creative={creative}/><div><b>{creative.metric}</b><h3>{creative.title}</h3><p>{creative.note}</p></div></article>; }
