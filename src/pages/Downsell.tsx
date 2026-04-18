import { OtoPage } from "@/components/OtoPage";
import { Video, FileText, Mail, Megaphone } from "lucide-react";

const DOWNSELL_YES_URL = "[DOWNSELL_YES_URL]";
const DOWNSELL_NO_URL = "[DOWNSELL_NO_URL]";

const Downsell = () => (
  <OtoPage
    headline="Wait — one last thing before you go…"
    subheadline="Not ready for the full accelerator? Get Launch In A Weekend — everything you need to go live in 48 hours, for just $27."
    productName="Launch In A Weekend"
    price="$27"
    included={[
      { icon: <Video className="h-5 w-5" />, text: "6 short video lessons (52 minutes total)" },
      { icon: <FileText className="h-5 w-5" />, text: "One-page launch plan template" },
      { icon: <Mail className="h-5 w-5" />, text: "3 fill-in-the-blank email templates" },
      { icon: <Megaphone className="h-5 w-5" />, text: "12 viral launch post swipes (copy, edit, post)" },
    ]}
    comparison={[
      { label: "DIY", title: "Piece it together yourself", detail: "Free, but takes weeks. By Monday you'll have 3 tabs and zero launch." },
      { label: "Online courses", title: "Generic launch courses", detail: "$200–$500. Hours of content you don't need to ship in 48 hours." },
      { label: "This offer", title: "Launch In A Weekend", detail: "$27. Done in 48 hours, no fluff, just shipped.", highlight: true },
    ]}
    yesText="YES — Add Launch In A Weekend for $27"
    noText="No thanks, I don't need to launch faster"
    noLossText="(Slow launches are kind of my brand.)"
    yesUrl={DOWNSELL_YES_URL}
    noUrl={DOWNSELL_NO_URL}
  />
);

export default Downsell;
