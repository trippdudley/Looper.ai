const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        LevelFormat, PageBreak } = require("docx");
const fs = require("fs");
const path = require("path");

const ACCENT = "0D7C66";
const DARK = "0C1117";
const MUTED = "666666";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const accentBorder = { style: BorderStyle.SINGLE, size: 6, color: ACCENT };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun(text)] });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ font: "Arial", size: 22, ...opts, text })],
  });
}

function label(text) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ font: "Arial", size: 18, color: ACCENT, bold: true, text })],
  });
}

function timing(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ font: "Consolas", size: 18, color: MUTED, text })],
  });
}

function quote(text) {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360, right: 360 },
    children: [new TextRun({ font: "Arial", size: 22, italics: true, text })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD", space: 1 } },
    children: [],
  });
}

function problemItem(num, title, desc) {
  return [
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ font: "Consolas", size: 18, color: ACCENT, bold: true, text: num + "  " }),
        new TextRun({ font: "Arial", size: 22, bold: true, text: title }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      indent: { left: 480 },
      children: [new TextRun({ font: "Arial", size: 20, color: MUTED, text: desc })],
    }),
  ];
}

function featureItem(title, tag, desc) {
  return [
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ font: "Arial", size: 22, bold: true, text: title + "  " }),
        new TextRun({ font: "Consolas", size: 16, color: ACCENT, bold: true, text: "[" + tag + "]" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      indent: { left: 240 },
      children: [new TextRun({ font: "Arial", size: 20, color: MUTED, text: desc })],
    }),
  ];
}

function metricRow(cells) {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: i === 0 ? 3000 : 2120, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({
          children: [new TextRun({ font: "Arial", size: 18, bold: i === 0, text })],
        })],
      })
    ),
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // TITLE PAGE
      spacer(), spacer(), spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({ font: "Arial", size: 56, bold: true, text: "LOOPER" }),
          new TextRun({ font: "Arial", size: 56, bold: true, color: ACCENT, text: ".AI" }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ font: "Arial", size: 28, color: MUTED, text: "Sizzle Reel \u2014 Scene Map" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ font: "Arial", size: 20, color: MUTED, text: "Total Duration: 120 seconds (2:00)" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ font: "Arial", size: 20, color: MUTED, text: "8 Scenes \u00B7 400ms crossfade between each" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ font: "Arial", size: 20, color: MUTED, text: "Audio: \"Legacy in Motion\" (50% volume, fades on end)" })],
      }),
      spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT, space: 8 } },
        spacing: { before: 200 },
        children: [new TextRun({ font: "Arial", size: 18, color: MUTED, text: "SCENE ORDER: Thesis \u2192 Problem \u2192 Coach OS First Act \u2192 Live Session \u2192 Summary \u2192 Player Record \u2192 Endgame \u2192 Close" })],
      }),

      // SCENE 0
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 0: Thesis"),
      timing("Duration: 8 seconds \u00B7 Dark cinematic"),
      divider(),
      heading("Beat 1", HeadingLevel.HEADING_2),
      timing("0.6s \u2013 3.8s"),
      label("ON SCREEN"),
      quote("AI will transform how golf is taught, how players learn, and how equipment is fitted."),
      body("Serif italic, 24px, centered. White text on dark background with subtle grid overlay.", { color: MUTED, size: 20 }),
      spacer(),
      heading("Beat 2", HeadingLevel.HEADING_2),
      timing("4.1s \u2013 7.3s"),
      label("ON SCREEN"),
      quote("But not the way the industry is approaching it."),
      body("Serif italic, 26px, accent green. Subverts the opening line.", { color: MUTED, size: 20 }),

      // SCENE 1
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 1: The Problem"),
      timing("Duration: 14 seconds \u00B7 Dark cinematic"),
      divider(),
      heading("Beat 1 \u2014 Industry Quote", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 3.2s"),
      label("ON SCREEN"),
      quote("I have a scheduling website, launch monitor software, 3D software, video software, emails, texts, an academy website... it would be better if these were all integrated."),
      body("\u2014 PGA TEACHING PROFESSIONAL, 22 YEARS", { color: MUTED, size: 20 }),
      spacer(),

      heading("Beat 2 \u2014 Coach & Academy Problems", HeadingLevel.HEADING_2),
      timing("3.8s \u2013 7.8s (4s hold)"),
      label("CARD: FOR THE COACH AND ACADEMY TODAY"),
      spacer(),
      ...problemItem("01", "No persistent student record", "Every lesson starts from scratch. The coach\u2019s memory is the only system."),
      ...problemItem("02", "6\u20138 disconnected tools", "TrackMan on one screen. Video in another app. Drills via text. Payments somewhere else."),
      ...problemItem("03", "No way to scale", "29 billable hours a week. No infrastructure for between-lesson support."),
      ...problemItem("04", "No proof of what works", "No longitudinal data connecting what was taught to what actually improved."),
      spacer(),

      heading("Beat 3 \u2014 Player Problems", HeadingLevel.HEADING_2),
      timing("8.4s \u2013 12.4s (4s hold)"),
      label("CARD: FOR THE PLAYER TODAY"),
      spacer(),
      ...problemItem("01", "No continuity between lessons", "The coach doesn\u2019t remember what was worked on last time."),
      ...problemItem("02", "No follow-up after the lesson ends", "Only 8% of first-time students hear from their instructor again."),
      ...problemItem("03", "No way to tell if lessons are working", "78% of players never track progress beyond keeping score."),
      ...problemItem("04", "Overload, then nothing", "Information overload during the lesson. Nothing to reference after."),
      spacer(),

      heading("Beat 4 \u2014 Structural Insight", HeadingLevel.HEADING_2),
      timing("13s onward (persists to crossfade)"),
      label("ON SCREEN"),
      quote("No one is building the structured data layer that connects coaching decisions to fitting decisions to on-course outcomes over time."),

      // SCENE 2
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 2: Coach OS First Act"),
      timing("Duration: 14 seconds \u00B7 Dark cinematic"),
      divider(),

      heading("Act 1 \u2014 Brand Reveal", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 3.2s"),
      label("ON SCREEN"),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ font: "Arial", size: 36, bold: true, text: "LOOPER" }),
          new TextRun({ font: "Arial", size: 36, bold: true, color: ACCENT, text: ".AI" }),
        ],
      }),
      quote("Expertise, engineered."),
      body("THE COACHING OS FOR THE AGE OF AI", { size: 18, color: MUTED }),
      spacer(),

      heading("Act 2 \u2014 Day One Value", HeadingLevel.HEADING_2),
      timing("3.8s \u2013 12.4s"),
      label("INTRO LINE (3.8\u20135.6s)"),
      quote("We begin by creating the operating system for coaching in the age of AI."),
      spacer(),
      label("FEATURE CARDS (staggered, 6\u201311.2s)"),
      ...featureItem("Integrated Coaching Operating System", "COACHING + FITTING", "Single pane of glass that connects the coaching infrastructure."),
      ...featureItem("Automatic Session Summaries", "CAPTURE", "Audio capture transcribes the conversation. AI extracts what was identified, what was prescribed, and why."),
      ...featureItem("Record Strings", "CONTINUITY", "Every session links to the last. A coach picking up with a returning student never starts cold."),
      ...featureItem("On-Course Closed Loop", "OUTCOMES", "GHIN tracks handicap trends. Arccos tracks shot-level strokes gained. Did what we tried actually work?"),
      ...featureItem("Professional-Language Diagnostics", "INTELLIGENCE", "Data translated into the language pros already think in. Strike variability, not launch monitor jargon."),

      // SCENE 3
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 3: Live Session Demo"),
      timing("Duration: 31 seconds \u00B7 Light UI"),
      divider(),

      heading("Beat 1 \u2014 Editorial", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 2.2s"),
      label("ON SCREEN"),
      quote("Now watch a coaching session. In real time."),
      spacer(),

      heading("Beat 2 \u2014 Platform Callout", HeadingLevel.HEADING_2),
      timing("2.8s \u2013 7s"),
      label("UI APPEARS (2.8s), CALLOUT OVERLAY (3.5\u20137s)"),
      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 360 },
        border: { left: accentBorder },
        children: [new TextRun({ font: "Arial", size: 22, bold: true, text: "A single pane of glass for coaching." })],
      }),
      body("It connects a coach\u2019s currently disconnected tools into the OS, from launch monitor and video tools.", { size: 20, color: MUTED }),
      spacer(),

      heading("Beat 3 \u2014 Swing & Data", HeadingLevel.HEADING_2),
      timing("7.5s \u2013 12s"),
      label("SWING VIDEO (7.5s) + SHOT DATA (8.5\u201310.5s)"),
      body("Actual swing video plays. 9 metrics count up:"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 2120, 2120, 2120],
        rows: [
          metricRow(["Metric", "Value", "", "Delta"]),
          metricRow(["Ball Speed", "132.4 mph", "", ""]),
          metricRow(["Launch Angle", "17.2\u00B0", "", ""]),
          metricRow(["Spin Rate", "6,240 rpm", "", ""]),
          metricRow(["Carry", "172 yds", "", ""]),
          metricRow(["Club Speed", "87.3 mph", "", ""]),
          metricRow(["Attack Angle", "\u20134.2\u00B0", "", ""]),
          metricRow(["Club Path", "+1.8\u00B0", "", "\u25B2 2.1\u00B0"]),
          metricRow(["Face Angle", "+0.4\u00B0", "", "\u25B2 1.4\u00B0"]),
          metricRow(["Dynamic Loft", "23.1\u00B0", "", ""]),
        ],
      }),
      spacer(),

      heading("Beat 4 \u2014 AI Context", HeadingLevel.HEADING_2),
      timing("12s \u2013 17.5s (typewriter effect)"),
      label("AI SESSION CONTEXT"),
      quote("Working on external rotation feel \u2014 \"brush the grass past the ball.\" This swing: path improved +2.1\u00B0 vs session baseline. Strike location moved 4mm toward center. Face-to-path gap narrowing. Confidence: 76% \u2014 contact pattern stabilizing. 3 more swings at current difficulty before progressing to 5-iron."),
      spacer(),
      label("LLM CALLOUT (below UI)"),
      body("LLM transcribes coach inputs and player feedback, contextualizes for that swing, and connects the data in real-time.", { italics: true, color: MUTED, size: 20 }),
      spacer(),

      heading("Beat 5 \u2014 Spotlight", HeadingLevel.HEADING_2),
      timing("19.5s \u2013 22.5s"),
      body("AI CONTEXTUALIZES EVERY SWING", { bold: true }),
      body("Against the session goal, the player\u2019s history, and motor learning science. Columns 1 & 2 dim. AI column highlighted.", { color: MUTED, size: 20 }),
      spacer(),

      heading("Beat 6 \u2014 Zoom & Close", HeadingLevel.HEADING_2),
      timing("22.5s \u2013 28s"),
      body("ONE INTERFACE. EVERY TOOL. EVERY INSIGHT.", { bold: true, size: 24 }),
      body("Zoom out to 92%, zoom back in, fade to black at 28s.", { color: MUTED, size: 20 }),

      // SCENE 4
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 4: Session Summary"),
      timing("Duration: 14 seconds \u00B7 Light UI"),
      divider(),

      heading("Beat 1 \u2014 Editorial", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 2.2s"),
      quote("Every session produces a complete summary."),
      spacer(),

      heading("Beat 2 \u2014 Summary Card", HeadingLevel.HEADING_2),
      timing("3s onward"),
      label("HEADER"),
      body("SESSION SUMMARY \u00B7 Mar 14, 2026 | Moe Norman | Coach: M. Thompson | 55 min | 20 swings"),
      spacer(),
      label("WHAT WE WORKED ON"),
      body("Focus: Strike consistency \u2014 mid-iron contact"),
      body("Cue: \"Brush the grass past the ball\" [EXTERNAL CUE]"),
      body("Clubs: 7-iron, 5-iron"),
      spacer(),
      label("KEY METRICS"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 2120, 2120, 2120],
        rows: [
          metricRow(["Metric", "Start", "End", "Delta"]),
          metricRow(["Club Path", "+0.3\u00B0", "+1.8\u00B0", "\u25B2 1.5\u00B0"]),
          metricRow(["Strike Center", "6mm toe", "2mm toe", "\u25B2 4mm"]),
          metricRow(["Dispersion", "17.3 yds", "14.2 yds", "\u25B2 3.1 yds"]),
          metricRow(["Carry Consistency", "\u00B18 yds", "\u00B15 yds", "\u25B2 3 yds"]),
        ],
      }),
      spacer(),
      label("PRACTICE PLAN"),
      body("1. Gate drill \u2014 7-iron / 3x/week \u00B7 20 balls", { bold: true }),
      body("2. Towel strike drill / 2x/week \u00B7 15 balls", { bold: true }),
      body("3. Feet-together 9-iron / Warm-up \u00B7 10 balls", { bold: true }),
      spacer(),
      label("NEXT SESSION"),
      body("Progress to 5-iron and evaluate transfer."),
      body("SESSION GOAL MET \u2014 READY TO PROGRESS", { bold: true, color: ACCENT, size: 20 }),
      spacer(),
      heading("Spotlights", HeadingLevel.HEADING_2),
      body("Spotlight 1 (6\u20139s): \"ONE CLICK. THE STUDENT GETS THEIR PLAN.\" \u2014 Practice Plan highlighted", { bold: true }),
      body("Spotlight 2 (9.5\u201312.5s): \"THE RECORD IS PERSISTENT. THE LOOP CLOSES.\" \u2014 Entire card highlighted", { bold: true }),

      // SCENE 5
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 5: Player Record"),
      timing("Duration: 16 seconds \u00B7 Dark \u2192 Light transition"),
      divider(),

      heading("Beat 1 \u2014 Title Card", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 2.4s"),
      quote("Every lesson builds the player\u2019s record."),
      spacer(),

      heading("Beat 2 \u2014 Player Record UI", HeadingLevel.HEADING_2),
      timing("3.2s onward"),
      label("PLAYER HEADER"),
      body("Moe Norman \u00B7 12 sessions \u00B7 Last visit: Mar 7, 2026 \u00B7 Handicap: 8.4 [\u25B2 IMPROVING]"),
      spacer(),

      heading("Spotlight 1 (5.5s) \u2014 Last Session", HeadingLevel.HEADING_2),
      label("LAST SESSION SUMMARY"),
      body("SESSION 12 \u00B7 MAR 7, 2026 \u00B7 7-IRON / 5-IRON", { bold: true }),
      body("Focus: Strike consistency. Key feels: \"Brush the grass past the ball,\" pressure shift to lead foot, strike moved 4mm toe to center."),
      body("Drills: Gate drill, Towel strike drill, Feet-together 9-iron", { color: MUTED, size: 20 }),
      spacer(),

      heading("Spotlight 2 (8.5s) \u2014 On-Course", HeadingLevel.HEADING_2),
      label("ON THE COURSE TRENDS"),
      body("GHIN: Scoring Avg 82.3, Best Round 79, Differential 7.8"),
      body("ARCCOS: FW 64%, GIR 44%, SG Approach +0.3, Putts/GIR 1.82"),
      spacer(),
      label("AI PATTERN DETECTION"),
      quote("Consistent miss right with mid-irons correlates with SG: Approach improvement when strike is centered. Session focus on low-point control is directly improving on-course performance."),
      spacer(),

      heading("Spotlight 3 (11.5s) \u2014 Session History", HeadingLevel.HEADING_2),
      label("PERSISTENT RECORD"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 1800, 4160, 2200],
        rows: [
          metricRow(["#", "Date", "Focus", "Badge"]),
          metricRow(["12", "Mar 7", "Strike consistency", "External cue"]),
          metricRow(["11", "Feb 21", "Low-point control", "Constraint drill"]),
          metricRow(["10", "Feb 7", "Face-to-path gap", "Internal cue"]),
          metricRow(["9", "Jan 24", "Driver dispersion", "Equipment change"]),
          metricRow(["8", "Jan 10", "Wedge distance control", "Variable practice"]),
        ],
      }),

      // SCENE 6
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 6: Endgame \u2014 Golf AI at Scale"),
      timing("Duration: 15 seconds \u00B7 Dark cinematic"),
      divider(),

      heading("Beat 1 \u2014 Transition Editorial", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 3.4s"),
      label("ON SCREEN"),
      quote("The coaching OS is Act One."),
      body("Serif italic, 24px, white text. Establishes that everything shown so far is the foundation.", { color: MUTED, size: 20 }),
      spacer(),

      heading("Beat 2 \u2014 Act Two Header", HeadingLevel.HEADING_2),
      timing("4.0s \u2013 6.0s"),
      label("ON SCREEN"),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ font: "Arial", size: 24, italics: true, text: "Act Two: build the infrastructure to power " }),
          new TextRun({ font: "Arial", size: 24, italics: true, color: ACCENT, text: "golf AI at scale." }),
        ],
      }),
      spacer(),

      heading("Beat 3 \u2014 Data Flywheel", HeadingLevel.HEADING_2),
      timing("6.5s \u2013 9.5s"),
      label("FLYWHEEL HEADER"),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ font: "Arial", size: 26, bold: true, text: "The wedge is workflow. " }),
          new TextRun({ font: "Arial", size: 26, bold: true, color: ACCENT, text: "The moat is data." }),
        ],
      }),
      body("Every session captured on the platform feeds the AI engine. The engine gets smarter. Smarter recommendations drive more adoption. The flywheel compounds.", { color: MUTED, size: 20 }),
      spacer(),
      label("FLYWHEEL CARDS (staggered)"),
      body("Row 1:  Sessions captured \u2192 Structured data \u2192 Models trained"),
      body("Row 2:  Better insights \u2192 More adoption"),
      body("Each card has an icon. \"Structured data\" card highlighted with accent border + green dot.", { color: MUTED, size: 20 }),
      spacer(),

      heading("Beat 4 \u2014 Scale Pillars", HeadingLevel.HEADING_2),
      timing("9.8s \u2013 11.5s"),
      label("THREE PILLAR CARDS (staggered)"),
      ...featureItem("Proprietary coaching dataset", "DATA MOAT", "Every session generates structured data connecting coaching decisions to fitting decisions to on-course outcomes."),
      ...featureItem("AI models trained on real instruction", "INTELLIGENCE", "The first models built on professional coaching interactions \u2014 not generic golf content."),
      ...featureItem("Industry-standard infrastructure", "PLATFORM", "The data layer the golf industry will build on. APIs, analytics, and intelligence for every stakeholder."),
      spacer(),

      heading("Beat 5 \u2014 Callout", HeadingLevel.HEADING_2),
      timing("12.2s onward"),
      label("CALLOUT"),
      new Paragraph({
        spacing: { after: 120 },
        indent: { left: 360 },
        border: { left: accentBorder },
        children: [
          new TextRun({ font: "Arial", size: 20, text: "Replicating this requires building the OS, earning adoption, accumulating thousands of structured interactions, and waiting for outcomes. " }),
          new TextRun({ font: "Arial", size: 20, bold: true, color: ACCENT, text: "That is a multi-year head start." }),
        ],
      }),

      // SCENE 7
      new Paragraph({ children: [new PageBreak()] }),
      heading("Scene 7: Close"),
      timing("Duration: 6 seconds \u00B7 Dark cinematic"),
      divider(),

      heading("Beat 1 \u2014 Looper Origin", HeadingLevel.HEADING_2),
      timing("0.4s \u2013 3.2s"),
      quote("Every great golfer has had a looper. Someone who knows your game, remembers what happened last time, and helps you make better decisions."),
      spacer(),

      heading("Beat 2 \u2014 Wordmark", HeadingLevel.HEADING_2),
      timing("3.8s onward"),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({ font: "Arial", size: 44, bold: true, text: "LOOPER" }),
          new TextRun({ font: "Arial", size: 44, bold: true, color: ACCENT, text: ".AI" }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ font: "Arial", size: 24, italics: true, text: "Expertise, engineered." })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ font: "Consolas", size: 18, color: MUTED, text: "looper.ai" })],
      }),
    ],
  }],
});

const outPath = path.join(__dirname, "..", "Sizzle Reel - Scene Map v2.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Created: " + outPath);
});
