import LandingContent from "./LandingContent";
import LandingHero from "./LandingHero";
import LandingNavbar from "./LandingNavbar";

export default function LandingPage() {
  return (
    <div className="h-4">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
}
