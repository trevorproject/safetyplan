import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { ResourcesHero } from '../components/resources/ResourcesHero';
import { FreeResources } from '../components/resources/FreeResources';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { SpeakableSection } from '../components/accessibility/SpeakableSection';

export function ResourcesPage() {
  return (
    <div className="font-body">
      <WelcomeNavbar />
      <main>
        <SpeakableSection id="resources-hero">
          <ResourcesHero />
        </SpeakableSection>
        <SpeakableSection id="resources-free">
          <FreeResources />
        </SpeakableSection>
      </main>
      <WelcomeFooter />
    </div>
  );
}
