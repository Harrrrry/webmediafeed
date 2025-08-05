import styled from 'styled-components';

export const PageLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const PageContent = styled.main.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasBottomNav'
})<{ hasBottomNav: boolean }>`
  flex: 1;
  padding-bottom: ${props => props.hasBottomNav ? '80px' : '0'};
`; 