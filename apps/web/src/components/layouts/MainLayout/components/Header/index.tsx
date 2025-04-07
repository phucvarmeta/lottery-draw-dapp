'use client';

// import { HamburgerAnimate } from '@/components/ui/hamburger-animate';
// import { useCommonStore } from '@/stores/commonStore';
import { LogoNav } from './LogoNav';
// import { NavMobile } from './NavMobile';
import { ContainerHeader } from './ContainerHeader';
import Account from './Account';

// const Account = dynamic(() => import('./Account'), { ssr: false });

export const Header = () => {
  // const toggleMenu = useCommonStore.use.setNavTarget();
  // const navTarget = useCommonStore.use.navTarget();

  return (
    <div className="px-0 lg:px-8 fixed lg:pt-5 w-full z-50">
      <ContainerHeader>
        <LogoNav />

        <div className="flex items-center lg:flex-1 justify-between">
          <div className="hidden lg:block"></div>

          <div className="flex items-center gap-4">
            <Account />

            {/* <div className="lg:hidden">
              <HamburgerAnimate className="block w-8 cursor-pointer" onClick={toggleMenu} />
            </div> */}
          </div>
        </div>
      </ContainerHeader>

      {/* <NavMobile isShow={navTarget} /> */}
    </div>
  );
};
