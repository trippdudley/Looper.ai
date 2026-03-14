import React, { useState, useEffect, useRef } from "react";
import { Mic, Link2, Flag, Search, Layers, Database, Brain, Target, TrendingUp, GraduationCap, Wrench, User, ClipboardList, BarChart3, Globe, ChevronDown } from "lucide-react";

const C = {
  bg:"#0B0F1A", surface:"#111827", card:"#1A2235",
  accent:"#38BDF8", accentDim:"#1E3A5F",
  teal:"#34D399", tealDim:"#134E3A",
  amber:"#FBBF24", red:"#F87171",
  text:"#E2E8F0", muted:"#94A3B8", dim:"#475569", white:"#FFFFFF",
};


function useVis(ref, th=0.15) {
  const [v,setV]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:th});o.observe(el);return()=>o.disconnect();},[ref,th]);
  return v;
}
function S({children,delay=0}){const r=useRef(null);const v=useVis(r,0.12);return <div ref={r} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(36px)",transition:`all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`}}>{children}</div>;}
function Stat({number,label,color=C.accent}){return <div style={{textAlign:"center",padding:"24px 12px"}}><div style={{fontSize:40,fontWeight:800,color,letterSpacing:"-2px"}}>{number}</div><div style={{fontSize:12,color:C.muted,marginTop:4,textTransform:"uppercase",letterSpacing:"1.5px"}}>{label}</div></div>;}
function Pill({name}){return <span style={{display:"inline-block",padding:"6px 14px",borderRadius:20,border:`1px solid ${C.dim}`,color:C.muted,fontSize:13,margin:"4px",fontFamily:"'DM Mono',monospace"}}>{name}</span>;}
function BA({before,after}){return <div style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr",alignItems:"center",marginBottom:10}}><div style={{padding:"11px 14px",background:"rgba(248,113,113,0.07)",borderRadius:8,border:"1px solid rgba(248,113,113,0.18)",fontSize:14,color:C.muted}}><span style={{color:C.red,marginRight:8,fontWeight:700}}>✕</span>{before}</div><div style={{textAlign:"center",color:C.dim,fontSize:16}}>→</div><div style={{padding:"11px 14px",background:"rgba(52,211,153,0.07)",borderRadius:8,border:"1px solid rgba(52,211,153,0.18)",fontSize:14,color:C.text}}><span style={{color:C.teal,marginRight:8,fontWeight:700}}>✓</span>{after}</div></div>;}
function TL({phase,title,desc,active}){return <div style={{display:"flex",gap:16,marginBottom:24}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:40}}><div style={{width:14,height:14,borderRadius:"50%",background:active?C.teal:"transparent",border:`2px solid ${active?C.teal:C.dim}`}}/><div style={{width:2,flex:1,background:C.dim,marginTop:4}}/></div><div style={{paddingBottom:8}}><div style={{fontSize:11,color:C.teal,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>{phase}</div><div style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:4}}>{title}</div><div style={{fontSize:14,color:C.muted,lineHeight:1.6}}>{desc}</div></div></div>;}
function IconBox({icon:Icon,color=C.teal,size=20}){return <div style={{width:40,height:40,borderRadius:10,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={size} color={color} strokeWidth={1.8}/></div>;}

export default function LooperNarrative(){
  const [fly,setFly]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setFly(s=>(s+1)%5),2200);return()=>clearInterval(t);},[]);

  const pillars=[
    {num:"01",title:"Connect the Stack",desc:"Replace six tools with one unified platform.",color:C.accent},
    {num:"02",title:"Amplify the Pro",desc:"Summaries, record strings, and diagnostics — automatically.",color:C.teal},
    {num:"03",title:"Build the Record",desc:"A persistent history that follows every golfer.",color:C.amber},
    {num:"04",title:"Build Golf's AI Engine",desc:"The first prescriptive models trained on real coaching outcomes.",color:C.text},
  ];
  const flyData=[
    {label:"Sessions captured",icon:ClipboardList,step:0},
    {label:"Structured data",icon:Database,step:1},
    {label:"Models trained",icon:Brain,step:2},
    {label:"Better insights",icon:Target,step:3},
    {label:"More adoption",icon:TrendingUp,step:4},
  ];

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Mono:wght@400&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.dim};border-radius:3px}
        @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* THESIS */}
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"0 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 60%,rgba(56,189,248,0.04) 0%,transparent 55%)"}}/>
        <div style={{maxWidth:680,position:"relative",zIndex:1}}>
          <div style={{animation:"fadeUp 1s ease-out"}}>
            <div style={{fontSize:12,color:C.accent,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:28,fontFamily:"'DM Mono',monospace"}}>Thesis</div>
            <h1 style={{fontSize:44,fontWeight:800,letterSpacing:"-2px",lineHeight:1.12,marginBottom:28,color:C.text}}>AI will transform how golf is taught, how players learn, and how equipment is fitted.</h1>
          </div>
          <div style={{animation:"fadeUp 1s ease-out 0.3s both"}}>
            <p style={{fontSize:22,fontWeight:700,color:C.amber,lineHeight:1.4,marginBottom:28}}>But not the way the industry is approaching it.</p>
          </div>
          <div style={{animation:"fadeUp 1s ease-out 0.5s both"}}>
            <p style={{fontSize:17,color:C.muted,lineHeight:1.7,marginBottom:16}}>Hardware companies sell sensors. Content platforms sell subscriptions. Launch monitor makers guard proprietary ecosystems. Every player in golf tech is optimized for a single layer.</p>
            <p style={{fontSize:17,color:C.muted,lineHeight:1.7,marginBottom:16}}>No one is building the structured data layer that connects coaching decisions to fitting decisions to on-course outcomes over time. No one is capturing the reasoning behind what great coaches and fitters actually do.</p>
            <p style={{fontSize:17,color:C.muted,lineHeight:1.7,marginBottom:32}}>Without that infrastructure, there is nothing for AI to learn from. Sensor data alone is not enough. The missing asset is a persistent record of decisions and outcomes.</p>
          </div>
          <div style={{animation:"fadeUp 1s ease-out 0.7s both"}}>
            <div style={{padding:"22px 24px",borderLeft:`3px solid ${C.accent}`,background:`${C.accentDim}22`,borderRadius:"0 12px 12px 0"}}>
              <p style={{fontSize:20,color:C.accent,fontWeight:700,lineHeight:1.4,fontFamily:"'Playfair Display',serif",fontStyle:"italic"}}>The question is not whether AI will reshape golf. The question is who builds the infrastructure first.</p>
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:36,color:C.dim,fontSize:13,animation:"pulse 2s infinite",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <ChevronDown size={20} color={C.dim} strokeWidth={1.5}/>
        </div>
      </div>

      {/* HERO — looper.ai reveal */}
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"0 24px",position:"relative",overflow:"hidden",borderTop:`1px solid ${C.dim}18`}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 35%,rgba(52,211,153,0.05) 0%,transparent 60%)"}}/>
        <div style={{textAlign:"center",maxWidth:740,position:"relative",zIndex:1}}>
          <S><div style={{marginBottom:8}}>
            <div style={{display:"inline-block"}}><span style={{fontSize:62,fontWeight:800,letterSpacing:"-2.5px",color:C.text}}>looper</span><span style={{fontSize:62,fontWeight:800,letterSpacing:"-2.5px",color:C.teal}}>.ai</span></div>
          </div>
          <p style={{fontSize:20,color:C.muted,marginBottom:48,fontFamily:"'Playfair Display',serif",fontStyle:"italic"}}>The operating system for golf coaching and fitting</p></S>
          <S delay={0.15}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {pillars.slice(0,3).map((p,i) => (
                <div key={i} style={{padding:"20px 14px",borderRadius:12,border:`1px solid ${C.dim}33`,background:`${C.card}88`,textAlign:"left"}}>
                  <div style={{fontSize:28,fontWeight:800,color:p.color,opacity:0.3,marginBottom:6,fontFamily:"'DM Mono',monospace"}}>{p.num}</div>
                  <div style={{fontSize:14,fontWeight:700,color:p.color,marginBottom:6,lineHeight:1.3}}>{p.title}</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,padding:"20px 24px",borderRadius:12,border:`1px solid ${C.dim}33`,background:`${C.card}88`,textAlign:"left",display:"flex",alignItems:"center",gap:20}}>
              <div style={{fontSize:28,fontWeight:800,color:pillars[3].color,opacity:0.3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{pillars[3].num}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:pillars[3].color,marginBottom:4,lineHeight:1.3}}>{pillars[3].title}</div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{pillars[3].desc}</div>
              </div>
            </div>
          </S>
        </div>
        <div style={{position:"absolute",bottom:36,color:C.dim,fontSize:13,animation:"pulse 2s infinite",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span>Scroll to explore</span>
          <ChevronDown size={20} color={C.dim} strokeWidth={1.5}/>
        </div>
      </div>

      {/* PROBLEM */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"120px 24px"}}>
        <S><div style={{fontSize:12,color:C.red,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>The Problem</div>
        <h2 style={{fontSize:38,fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:24}}>Golf coaching and fitting have a <span style={{color:C.red}}>memory problem</span>.</h2></S>
        <S delay={0.1}><p style={{fontSize:18,color:C.muted,lineHeight:1.7,marginBottom:20}}>Coaches and fitters run their businesses across disconnected tools. The professional carries all the context in their head.</p>
        <p style={{fontSize:18,color:C.muted,lineHeight:1.7,marginBottom:32}}>When a session ends, the most valuable part — the diagnosis, the reasoning, the "why" behind every decision — disappears. The next session starts from scratch.</p></S>
        <S delay={0.15}><div style={{padding:"28px 24px",background:C.surface,borderRadius:16,marginBottom:32,border:`1px solid ${C.dim}22`}}>
          <div style={{fontSize:12,color:C.dim,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:16}}>Today's academy tech stack</div>
          <div style={{display:"flex",flexWrap:"wrap"}}>{["TrackMan","Foresight","V1 Sports","CoachNow","Acuity","Stripe","K-Motion","Squarespace"].map(t=><Pill key={t} name={t}/>)}</div>
          <div style={{marginTop:18,padding:"16px 18px",background:"rgba(248,113,113,0.05)",borderRadius:10,border:"1px solid rgba(248,113,113,0.12)"}}>
            <p style={{fontSize:14,color:C.muted,lineHeight:1.6,fontStyle:"italic"}}>"I have a scheduling website, launch monitor software, 3D software, video software, emails, texts, an academy website… it would be better if these were all integrated."</p>
            <p style={{fontSize:12,color:C.dim,marginTop:8}}>— Academy owner</p>
          </div>
        </div></S>
        <S delay={0.2}><h3 style={{fontSize:20,fontWeight:700,marginBottom:16}}>What disappears after every session</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:36}}>
          {[{icon:Mic,title:"Coaching reasoning",desc:"The cue that clicked. The prioritization choice. The feel-vs-real translation."},
            {icon:Wrench,title:"Fitting rationale",desc:"Why one shaft over another. The distance-vs-dispersion tradeoff. The delivery pattern that drove the call."},
            {icon:Link2,title:"Session context",desc:"What was worked on last time. What was prescribed. What actually changed."},
            {icon:Flag,title:"Real-world outcomes",desc:"Whether the prescription worked on the course. Whether improvement stuck over time."}
          ].map((item,i)=>(
            <div key={i} style={{padding:"20px",background:C.card,borderRadius:12,border:`1px solid ${C.dim}22`}}>
              <IconBox icon={item.icon} color={C.muted}/>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4,marginTop:12}}>{item.title}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{item.desc}</div>
            </div>
          ))}
        </div></S>
        <S delay={0.1}><div style={{padding:"22px 24px",borderLeft:`3px solid ${C.teal}`,background:`${C.tealDim}22`,borderRadius:"0 12px 12px 0"}}>
          <p style={{fontSize:18,color:C.teal,fontWeight:600,fontFamily:"'Playfair Display',serif",fontStyle:"italic",lineHeight:1.5}}>The missing asset in golf is not more swing data. It is a persistent record of coaching and fitting decisions and outcomes.</p>
        </div></S>
      </div>

      {/* SOLUTION */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"80px 24px 120px"}}>
        <S><div style={{fontSize:12,color:C.teal,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>The Solution</div>
        <h2 style={{fontSize:38,fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:24}}>One system. <span style={{color:C.teal}}>Everything connected.</span></h2>
        <p style={{fontSize:18,color:C.muted,lineHeight:1.7,marginBottom:40}}>looper.ai replaces the fragmented stack with a single platform — then layers AI as an amplifier of coaches and fitters.</p></S>
        <S delay={0.1}>
          <BA before="6–7 disconnected tools" after="One unified platform"/>
          <BA before="Context carried in the pro's head" after="Record strings link every session"/>
          <BA before="Coaching reasoning vanishes" after="Audio AI captures the 'why'"/>
          <BA before="Fitting rationale never recorded" after="Build sheets with full reasoning"/>
          <BA before="No outcome tracking" after="GHIN + Arccos close the loop"/>
          <BA before="New coach starts from scratch" after="Persistent record follows the golfer"/>
        </S>
      </div>

      {/* AMPLIFIER */}
      <div style={{background:C.surface,padding:"100px 24px",borderTop:`1px solid ${C.dim}18`,borderBottom:`1px solid ${C.dim}18`}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <S><div style={{fontSize:12,color:C.teal,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Day One Value</div>
          <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:12}}>The coach and fitter amplifier</h2>
          <p style={{fontSize:17,color:C.muted,lineHeight:1.7,marginBottom:36}}>Before any prescriptive AI exists, looper.ai makes every professional faster and more effective.</p></S>
          {[{icon:Mic,title:"Automatic Session Summaries",desc:"Audio capture transcribes the conversation. AI extracts what was identified, what was prescribed, and why. Both pro and player get a structured summary in minutes.",tag:"COACHING + FITTING"},
            {icon:Link2,title:"Record Strings",desc:"Every session links to the last. What was worked on, what was prescribed, what changed. A coach picking up with a returning student — or a fitter seeing a golfer whose swing evolved — never starts cold.",tag:"CONTINUITY"},
            {icon:Flag,title:"On-Course Closed Loop",desc:"GHIN tracks handicap and score trends. Arccos tracks shot-level strokes gained. Did the swing change improve on-course dispersion? Did the new driver build deliver carry gains in competition?",tag:"OUTCOMES"},
            {icon:Search,title:"Professional-Language Diagnostics",desc:"For coaches: 'This is primarily strike variability.' For fitters: 'This delivery pattern favors a low-spin, tip-stable shaft.' Data translated into the language pros already think in.",tag:"INTELLIGENCE"}
          ].map((item,i)=>(
            <S key={i} delay={i*0.07}><div style={{padding:"24px",background:C.card,borderRadius:14,marginBottom:14,border:`1px solid ${C.dim}22`,display:"flex",gap:18,alignItems:"flex-start"}}>
              <IconBox icon={item.icon} color={C.teal}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:16,fontWeight:700,color:C.text}}>{item.title}</span>
                  <span style={{fontSize:10,color:C.teal,letterSpacing:"1px",padding:"2px 8px",border:`1px solid ${C.tealDim}`,borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{item.tag}</span>
                </div>
                <p style={{fontSize:14,color:C.muted,lineHeight:1.6}}>{item.desc}</p>
              </div>
            </div></S>
          ))}
          <S delay={0.3}><div style={{padding:"20px 24px",borderLeft:`3px solid ${C.teal}`,background:`${C.tealDim}22`,borderRadius:"0 12px 12px 0",marginTop:16}}>
            <p style={{fontSize:15,color:C.teal,fontWeight:600,lineHeight:1.5}}>Pros use looper.ai because after every session it saves them time, makes follow-up automatic, and makes their expertise visible and persistent. The data moat happens naturally.</p>
          </div></S>
        </div>
      </div>

      {/* FLYWHEEL */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"120px 24px"}}>
        <S><div style={{fontSize:12,color:C.accent,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>The Endgame</div>
        <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:12}}>The wedge is workflow.<br/><span style={{color:C.teal}}>The moat is data.</span></h2>
        <p style={{fontSize:17,color:C.muted,lineHeight:1.7,marginBottom:40}}>Every session captured on the platform feeds the AI engine. The engine gets smarter. Smarter recommendations drive more adoption. The flywheel compounds.</p></S>
        <S delay={0.1}><div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,marginBottom:20}}>
          {flyData.map((item,i)=>{const Icon=item.icon;const active=fly===item.step;return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{padding:"14px 16px",borderRadius:12,background:active?`${C.tealDim}66`:"transparent",border:`1.5px solid ${active?C.teal:C.dim}`,color:active?C.teal:C.muted,fontSize:13,fontWeight:600,textAlign:"center",transition:"all 0.4s ease",minWidth:110}}>
                <div style={{marginBottom:6,display:"flex",justifyContent:"center"}}><Icon size={20} strokeWidth={1.8} color={active?C.teal:C.dim}/></div>
                {item.label}
              </div>
              {i<4&&<span style={{color:C.teal,fontSize:18,opacity:active?1:0.25,transition:"opacity 0.4s"}}>→</span>}
            </div>
          );})}
        </div>
        <div style={{textAlign:"center",padding:"14px 20px",background:`${C.tealDim}22`,borderRadius:10,fontSize:14,color:C.muted,border:`1px solid ${C.tealDim}44`}}>
          Replicating this requires building the OS, earning adoption, accumulating thousands of structured interactions, and waiting for outcomes. <span style={{color:C.teal,fontWeight:600}}>That is a multi-year head start.</span>
        </div></S>
      </div>

      {/* MARKET */}
      <div style={{background:C.surface,padding:"100px 24px",borderTop:`1px solid ${C.dim}18`,borderBottom:`1px solid ${C.dim}18`}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <S><div style={{fontSize:12,color:C.accent,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>The Market</div>
          <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1.5px",marginBottom:32}}>A convergence moment</h2></S>
          <S delay={0.1}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:0}}>
            <Stat number="$2.0B" label="U.S. Instruction"/>
            <Stat number="$3.5B" label="U.S. Fitting" color={C.teal}/>
            <Stat number="$1.7B" label="Simulators" color={C.amber}/>
            <Stat number="10M" label="New Golfers" color={C.text}/>
          </div></S>
          <S delay={0.15}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
            {[{stat:"28%",label:"Participation increase since 2016"},{stat:"71%",label:"Under-35 golfers consuming digital coaching"},{stat:"⅔",label:"Shoot above 90 — biggest segment, least likely to seek help"}].map((s,i)=>(
              <div key={i} style={{padding:"18px",background:C.card,borderRadius:12,textAlign:"center",border:`1px solid ${C.dim}22`}}>
                <div style={{fontSize:26,fontWeight:800,color:C.accent}}>{s.stat}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:6,lineHeight:1.4}}>{s.label}</div>
              </div>
            ))}
          </div></S>
          <S delay={0.2}><div style={{marginTop:28}}>
            <div style={{fontSize:12,color:C.dim,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:14}}>Beachhead customers</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[{icon:GraduationCap,title:"Premium Academies",desc:"3–10 instructors, already on TrackMan or Foresight"},
                {icon:Wrench,title:"Fitting Studios",desc:"Club Champion, Cool Clubs, independents"},
                {icon:User,title:"High-Volume Pros",desc:"50+ students, recurring lesson books"}
              ].map((b,i)=>(
                <div key={i} style={{padding:"18px",background:C.bg,borderRadius:12,border:`1px solid ${C.dim}22`}}>
                  <IconBox icon={b.icon} color={C.accent} size={18}/>
                  <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4,marginTop:10}}>{b.title}</div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div></S>
        </div>
      </div>

      {/* ROADMAP */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"120px 24px"}}>
        <S><div style={{fontSize:12,color:C.teal,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>The Roadmap</div>
        <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1.5px",marginBottom:32}}>Built in layers, each funding the next</h2></S>
        <S delay={0.1}>
          <TL active phase="Months 1–6" title="Foundation" desc="Session schema. Audio pipeline. Coaching ontology with elite instructors. Equipment ontology MVP. Scheduling and comms. First launch monitor integration."/>
          <TL active phase="Months 4–12" title="OS v1 — The Record" desc="Session capture, AI summaries, record strings, longitudinal profiles, coach and fitter dashboard. GHIN integration. Device calibration layer."/>
          <TL phase="Months 10–18" title="The Amplifier" desc="Coach and fitter diagnostics. Strike maps. Uncertainty scoring. Arccos on-course integration. Surrogate prediction models."/>
          <TL phase="Months 12–20" title="Fitting OS" desc="Full equipment ontology. Fitting session workflow. Physics-constrained build sheet generation."/>
          <TL phase="Months 16–24" title="Learning Loop" desc="Player embeddings. Hierarchical models that learn across coaches and sites. Active learning: 'what should we test next?'"/>
          <TL phase="Months 20–30" title="Golf's AI Engine" desc="Prescriptive recommendations for coaching and fitting. Outcome-based intelligence. Uncertainty bands on every recommendation."/>
        </S>
      </div>

      {/* BUSINESS MODEL */}
      <div style={{background:C.surface,padding:"100px 24px",borderTop:`1px solid ${C.dim}18`,borderBottom:`1px solid ${C.dim}18`}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <S><div style={{fontSize:12,color:C.accent,letterSpacing:"3px",textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Business Model</div>
          <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1.5px",marginBottom:24}}>Four stages of value</h2>
          <div style={{fontSize:11,color:C.red,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",padding:"6px 14px",border:`1px solid ${C.red}33`,borderRadius:6,display:"inline-block",marginBottom:28}}>Preliminary — Under active refinement</div></S>
          <S delay={0.1}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            {[{icon:Layers,num:"01",title:"The OS",time:"Year 1–2",price:"$500–$1,500/mo",desc:"Unified coaching and fitting platform. Connect the stack.",color:C.accent},
              {icon:Brain,num:"02",title:"Intelligence",time:"Year 2–3",price:"+$500–$1,000/mo",desc:"AI prescriptive engine for coaching and fitting.",color:C.teal},
              {icon:User,num:"03",title:"Consumer",time:"Year 3–5",price:"$20–$30/mo",desc:"Persistent record + AI for any golfer.",color:C.amber},
              {icon:Globe,num:"04",title:"Multi-Sport",time:"Year 4+",price:"Platform",desc:"Tennis, baseball, pitching, personal training.",color:C.muted}
            ].map((s,i)=>{const Icon=s.icon;return(
              <div key={i} style={{padding:"22px",background:C.card,borderRadius:12,border:`1px solid ${C.dim}22`}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:`${s.color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={16} color={s.color} strokeWidth={2}/></div>
                  <span style={{fontSize:16,fontWeight:700,color:C.text}}>{s.title}</span>
                </div>
                <div style={{fontSize:12,color:s.color,fontWeight:600,marginBottom:6}}>{s.time} · {s.price}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{s.desc}</div>
              </div>
            );})}
          </div></S>
          <S delay={0.15}><div style={{padding:"22px",background:C.card,borderRadius:12,border:`1px solid ${C.dim}22`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <BarChart3 size={16} color={C.dim} strokeWidth={1.8}/>
              <span style={{fontSize:12,color:C.dim,textTransform:"uppercase",letterSpacing:"1.5px"}}>5-Year trajectory</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,textAlign:"center"}}>
              {[{yr:"Y1",rev:"$20K",team:"3"},{yr:"Y2",rev:"$729K",team:"9"},{yr:"Y3",rev:"$4.3M",team:"18"},{yr:"Y4",rev:"$14.9M",team:"25"},{yr:"Y5",rev:"$40.3M",team:"28"}].map((y,i)=>(
                <div key={i}>
                  <div style={{fontSize:12,color:C.teal,fontWeight:700,marginBottom:4}}>{y.yr}</div>
                  <div style={{fontSize:17,fontWeight:800,color:C.text}}>{y.rev}</div>
                  <div style={{fontSize:11,color:C.dim,marginTop:2}}>{y.team} people</div>
                  <div style={{height:Math.max(6,[2,8,28,60,100][i]),background:`linear-gradient(180deg,${C.teal},${C.tealDim})`,borderRadius:4,marginTop:8}}/>
                </div>
              ))}
            </div>
          </div></S>
        </div>
      </div>

      {/* CLOSING */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"120px 24px 80px",textAlign:"center"}}>
        <S>
          <div style={{marginBottom:24}}><span style={{fontSize:32,fontWeight:800,letterSpacing:"-1px",color:C.text}}>looper</span><span style={{fontSize:32,fontWeight:800,letterSpacing:"-1px",color:C.teal}}>.ai</span></div>
          <h2 style={{fontSize:38,fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.2,marginBottom:20}}>Every great golfer has had a <span style={{color:C.teal}}>looper</span>.</h2>
          <p style={{fontSize:18,color:C.muted,lineHeight:1.7,maxWidth:520,margin:"0 auto 32px",fontFamily:"'Playfair Display',serif",fontStyle:"italic"}}>Someone who knows your game, remembers what happened last time, and helps you make better decisions.</p>
          <p style={{fontSize:16,color:C.muted,lineHeight:1.7,maxWidth:520,margin:"0 auto 36px"}}>looper.ai captures what great coaches and fitters know, structures it, and makes it permanent. Then it builds the AI engine that learns from it at scale.</p>
          <div style={{padding:"20px 28px",borderLeft:`3px solid ${C.teal}`,background:`${C.tealDim}22`,borderRadius:"0 12px 12px 0",display:"inline-block",textAlign:"left",maxWidth:460}}>
            <p style={{fontSize:15,color:C.teal,fontWeight:600,lineHeight:1.5}}>The hook is workflow. The value is the amplifier. The endgame is golf's AI engine.</p>
          </div>
        </S>
        <S delay={0.2}><div style={{marginTop:56,padding:"16px",borderTop:`1px solid ${C.dim}22`}}>
          <p style={{fontSize:12,color:C.dim}}>looper.ai · Preliminary · March 2026 · Confidential</p>
        </div></S>
      </div>
    </div>
  );
}
