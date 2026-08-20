import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { IntroSection } from '../components/welcome/IntroSection';
import { PhotoHero } from '../components/welcome/PhotoHero';
import { FeatureShowcase } from '../components/welcome/FeatureShowcase';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';

export function WelcomePage() {
  return (
    <div className="font-body">
      <WelcomeNavbar />
      <IntroSection />
      <PhotoHero />
      <FeatureShowcase />
      <WelcomeFooter />
    </div>
  );
}
