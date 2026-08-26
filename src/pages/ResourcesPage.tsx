import { WelcomeNavbar } from '../components/welcome/WelcomeNavbar';
import { ResourcesHero } from '../components/resources/ResourcesHero';
import { FreeResources } from '../components/resources/FreeResources';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';

export function ResourcesPage() {
  return (
    <div className="font-body">
      <WelcomeNavbar />
      <ResourcesHero />
      <FreeResources />
      <WelcomeFooter />
    </div>
  );
}
