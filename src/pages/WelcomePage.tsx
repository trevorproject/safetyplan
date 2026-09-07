import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { IntroSection } from '../components/welcome/IntroSection';
import { PhotoHero } from '../components/welcome/PhotoHero';
import { FeatureShowcase } from '../components/welcome/FeatureShowcase';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';

export function WelcomePage() {
  return (
    <div className="font-body">
      <WelcomeNavbar />
      <main>
        <SpeakableSection id="welcome-intro">
          <IntroSection />
        </SpeakableSection>
        <SpeakableSection id="welcome-hero">
          <PhotoHero />
        </SpeakableSection>
        <SpeakableSection id="welcome-features">
          <FeatureShowcase />
        </SpeakableSection>
      </main>
      <WelcomeFooter />
    </div>
  );
}
