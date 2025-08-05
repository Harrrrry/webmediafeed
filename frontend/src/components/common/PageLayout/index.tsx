import React from 'react';
import AppHeader from '../AppHeader';
import { BottomNav } from '../../BottomNav';
import { PageLayoutContainer, PageContent } from './PageLayout.styled';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
  className = ''
}) => {
  return (
    <PageLayoutContainer className={className}>
      {showHeader && <AppHeader />}
      <PageContent hasBottomNav={showBottomNav}>
        {children}
      </PageContent>
      {showBottomNav && <BottomNav />}
    </PageLayoutContainer>
  );
};

export default PageLayout; 