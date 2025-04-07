import { ContainerFooter } from './ContainerFooter';
import { PrivacyTerms } from './PrivacyTerms';
import { Socials } from './Socials';

export const Footer = () => {
  return (
    <div className="footer text-white/50 transition-colors duration-200">
      <ContainerFooter>
        <PrivacyTerms />

        <div className="hover:text-white">2025</div>
      </ContainerFooter>
    </div>
  );
};
