import { OtoPage } from "@/components/OtoPage";
import { GraduationCap, BookOpen, FileText, Video, Users } from "lucide-react";

const OTO2_YES_URL = "https://buy.stripe.com/eVqbJ35R2fMx7SPg2o8EM05";
const OTO2_NO_URL = "/thank-you?from_oto=true";

const Oto2 = () => (
  <OtoPage
    headline="Wait — before your PDF arrives…"
    subheadline="Join the AI Monetization Accelerator and go from prompts to profit in 30 days — guided, structured, and done-with-you."
    productName="AI Monetization Accelerator"
    price="$97"
    originalPrice="$297"
    included={[
      { icon: <GraduationCap className="h-5 w-5" />, text: "30 daily lessons (10 min each) — one action per day" },
      { icon: <BookOpen className="h-5 w-5" />, text: "5 revenue playbooks (freelance, digital products, coaching, agency, affiliate)" },
      { icon: <FileText className="h-5 w-5" />, text: "Done-for-you launch assets (emails, posts, page copy)" },
      { icon: <Video className="h-5 w-5" />, text: "Weekly live group calls with Q&A" },
      { icon: <Users className="h-5 w-5" />, text: "Private community — accountability + feedback" },
    ]}
    comparison={[
      { label: "DIY", title: "Learn from YouTube", detail: "Free, but scattered. Months of trial-and-error and 47 open tabs." },
      { label: "Hire a coach", title: "1:1 coaching", detail: "$2,000–$5,000 with zero guarantee you'll actually launch anything." },
      { label: "This offer", title: "AI Monetization Accelerator", detail: "$97 one-time. A structured 30-day path with live support.", highlight: true },
    ]}
    yesText="YES — Add the Accelerator for $97"
    noText="No thanks, I'll work it out on my own"
    noLossText="(I enjoy reinventing the wheel for 6 months straight.)"
    yesUrl={OTO2_YES_URL}
    noUrl={OTO2_NO_URL}
  />
);

export default Oto2;
