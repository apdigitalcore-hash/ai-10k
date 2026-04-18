import { OtoPage } from "@/components/OtoPage";
import { LayoutDashboard, Calendar, Workflow, PlayCircle, Link2 } from "lucide-react";

const OTO1_YES_URL = "https://buy.stripe.com/fZu5kFbbmcAlc95cQc8EM04";
const OTO1_NO_URL = "/oto2";

const Oto1 = () => (
  <OtoPage
    headline="Wait — before your PDF arrives…"
    subheadline="Add the AI Business Dashboard and turn your 50 prompts into a fully automated command center — just $47 today."
    productName="AI Business Dashboard"
    price="$47"
    originalPrice="$127"
    included={[
      { icon: <LayoutDashboard className="h-5 w-5" />, text: "Pre-loaded Notion template wired for AI workflows" },
      { icon: <Calendar className="h-5 w-5" />, text: "30-day content calendar (plug-and-play)" },
      { icon: <Workflow className="h-5 w-5" />, text: "12 workflow templates for marketing, sales & ops" },
      { icon: <PlayCircle className="h-5 w-5" />, text: "Short video walkthroughs (watch over my shoulder)" },
      { icon: <Link2 className="h-5 w-5" />, text: "Prompt chaining bonus (stack agents for compound results)" },
    ]}
    comparison={[
      { label: "DIY", title: "Build your own system", detail: "20+ hours of setup. $0 out of pocket — but it costs you your entire weekend." },
      { label: "Hire someone", title: "Notion consultant", detail: "$300–$800 and weeks of back-and-forth before you ship anything." },
      { label: "This offer", title: "AI Business Dashboard", detail: "$47 one-time. Ready in minutes, not weekends.", highlight: true },
    ]}
    yesText="YES — Add the Dashboard for $47"
    noText="No thanks, I'll figure it out myself"
    noLossText="(I'd rather burn 20 hours rebuilding this from scratch.)"
    yesUrl={OTO1_YES_URL}
    noUrl={OTO1_NO_URL}
  />
);

export default Oto1;
