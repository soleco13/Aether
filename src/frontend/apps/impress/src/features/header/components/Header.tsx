import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';

import { Box, StyledLink } from '@/components/';
import { useCunninghamTheme } from '@/cunningham';
import { ButtonLogin, ButtonProfile } from '@/features/auth';
import { useResponsiveStore } from '@/stores';

import { HEADER_HEIGHT } from '../conf';

import { ButtonTogglePanel } from './ButtonTogglePanel';
import { LaGaufre } from './LaGaufre';
import { Title } from './Title';

// Styled компоненты
const HeaderContainer = styled(Box)<{ $padding: string }>`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: ${HEADER_HEIGHT}px;
  padding: 0 ${props => props.$padding};
  background-color: #404040;
  border-bottom: 1px solid #808080;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LogoBox = styled(Box)`
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(192, 192, 192, 0.2);
  }
  
  &::before {
    content: 'Æ';
    font-size: 1.2rem;
    font-weight: 900;
    color: #000000;
    font-family: 'Inter', sans-serif;
  }
`;

export const Header = () => {
  const { t } = useTranslation();
  const { spacingsTokens } = useCunninghamTheme();
  const { isDesktop } = useResponsiveStore();

  return (
    <HeaderContainer
      as="header"
      $padding={spacingsTokens['base']}
      className="--docs--header"
    >
      {!isDesktop && <ButtonTogglePanel />}
      <StyledLink href="/">
        <Box
          $align="center"
          $gap={spacingsTokens['3xs']}
          $direction="row"
          $position="relative"
          $height="fit-content"
          $margin={{ top: 'auto' }}
        >
          {/* Логотип Aether */}
          <LogoBox
            $width="32px"
            $height="32px"
            $justify="center"
            $align="center"
          />
          <Title />
        </Box>
      </StyledLink>
      {!isDesktop ? (
        <Box $direction="row" $gap={spacingsTokens['sm']}>
          <LaGaufre />
        </Box>
      ) : (
        <Box $align="center" $gap={spacingsTokens['sm']} $direction="row">
          <ButtonProfile />
          <ButtonLogin />
          <LaGaufre />
        </Box>
      )}
    </HeaderContainer>
  );
};
