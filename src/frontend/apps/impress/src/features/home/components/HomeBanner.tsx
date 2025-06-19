import { Button } from '@openfun/cunningham-react';
import { useTranslation } from 'react-i18next';
import { css, keyframes, styled } from 'styled-components';

import { Box, Icon, Text } from '@/components';
import { useCunninghamTheme } from '@/cunningham';
import { ProConnectButton, gotoLogin } from '@/features/auth';
import { useResponsiveStore } from '@/stores';

import { getHeaderHeight } from './HomeHeader';

// Анимация падающих звезд по диагонали
const fallingStars = keyframes`
  0% {
    transform: translateY(-100vh) translateX(-50px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(150px) rotate(180deg);
    opacity: 0;
  }
`;

// Анимация мерцания для статичных звезд
const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

// Styled компонент для падающей звезды
const FallingStarDiv = styled.div<{ delay: number; duration: number; left: string }>`
  position: absolute;
  left: ${props => props.left};
  top: -10px;
  width: 3px;
  height: 3px;
  background: linear-gradient(45deg, #c0c0c0, #808080);
  border-radius: 50%;
  animation: ${fallingStars} ${props => props.duration}s linear ${props => props.delay}s infinite;
  box-shadow: 0 0 6px #c0c0c0, 0 0 12px #808080;
`;

// Styled компонент для статичной звезды
const StaticStarDiv = styled.div<{ top: string; left: string; delay: number }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: 2px;
  height: 2px;
  background: #c0c0c0;
  border-radius: 50%;
  animation: ${twinkle} 3s ease-in-out ${props => props.delay}s infinite;
  box-shadow: 0 0 4px #c0c0c0;
`;

// Styled контейнер для баннера
const BannerContainer = styled(Box)`
  background: linear-gradient(135deg, #404040 0%, #000000 100%);
  overflow: hidden;
  min-height: 600px;
  
  @media (max-width: 768px) {
    min-height: 500px;
  }
  
  @media (max-width: 480px) {
    min-height: 450px;
  }
`;

// Styled контейнер для контента
const ContentContainer = styled(Box)`
  z-index: 2;
`;

// Styled контейнер для логотипа
const LogoContainer = styled(Box)`
  margin-bottom: 2rem;
`;

// Styled логотип
const LogoBox = styled(Box)`
  background: linear-gradient(135deg, #808080 0%, #c0c0c0 100%);
  border-radius: 20px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(192, 192, 192, 0.1);
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 16px 48px rgba(192, 192, 192, 0.2);
  }
  
  &::before {
    content: 'Æ';
    font-size: 3rem;
    font-weight: 900;
    color: #000000;
    font-family: 'Inter', sans-serif;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    border-radius: 16px;
    margin-bottom: 0.8rem;
    
    &::before {
      font-size: 2.5rem;
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 12px;
    margin-bottom: 0.6rem;
    
    &::before {
      font-size: 2rem;
    }
    
    &:hover {
      transform: none;
    }
  }
`;

// Styled заголовок
const TitleText = styled(Text)`
  color: #c0c0c0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

// Styled подзаголовок
const SubtitleText = styled(Text)<{ $isMobile: boolean }>`
  color: #808080;
  font-size: ${props => props.$isMobile ? '1rem' : '1.25rem'};
  max-width: 500px;
  font-family: 'Inter', sans-serif;
  text-align: center;
  margin: 0 auto;
`;

// Styled кнопка
const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
  color: #000000;
  border: none;
  padding: 18px 36px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: normal;
  box-shadow: 0 8px 24px rgba(192, 192, 192, 0.15);
  
  &:hover {
    background: linear-gradient(135deg, #808080 0%, #c0c0c0 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(192, 192, 192, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(192, 192, 192, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 28px;
    font-size: 0.95rem;
    border-radius: 8px;
    
    &:hover {
      transform: none;
    }
  }
`;

// Компонент падающей звезды
const FallingStar = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <FallingStarDiv delay={delay} duration={duration} left={left} />
);

// Компонент статичной звезды
const StaticStar = ({ top, left, delay }: { top: string; left: string; delay: number }) => (
  <StaticStarDiv top={top} left={left} delay={delay} />
);

export default function HomeBanner() {
  const { t } = useTranslation();
  const { componentTokens } = useCunninghamTheme();
  const { isMobile, isSmallMobile } = useResponsiveStore();
  const withProConnect = componentTokens['home-proconnect'];

  // Генерируем массив падающих звезд
  const fallingStarsArray = Array.from({ length: 15 }, (_, i) => ({
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 6,
    left: `${Math.random() * 100}%`,
  }));

  // Генерируем массив статичных звезд
  const staticStarsArray = Array.from({ length: 50 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
  }));

  return (
    <BannerContainer
      $maxWidth="100vw"
      $width="100%"
      $justify="center"
      $align="center"
      $height="100vh"
      $margin={{ top: `-${getHeaderHeight(isSmallMobile)}px` }}
      $position="relative"
    >
      {/* Статичные звезды */}
      {staticStarsArray.map((star, index) => (
        <StaticStar
          key={`static-${index}`}
          top={star.top}
          left={star.left}
          delay={star.delay}
        />
      ))}

      {/* Падающие звезды */}
      {fallingStarsArray.map((star, index) => (
        <FallingStar
          key={`falling-${index}`}
          delay={star.delay}
          duration={star.duration}
          left={star.left}
        />
      ))}

      {/* Основной контент */}
      <ContentContainer
        $width="100%"
        $justify="center"
        $align="center"
        $position="relative"
        $direction="column"
        $gap="2rem"
      >
        {/* Логотип Aether */}
        <LogoContainer
          $align="center"
          $gap="1rem"
          $direction="column"
        >
          <LogoBox
            $width="100px"
            $height="100px"
            $justify="center"
            $align="center"
          />
          
          <TitleText
            as="h1"
            $size={!isMobile ? '4rem' : '2.5rem'}
            $weight="800"
            $textAlign="center"
            $margin="none"
          >
            Aether
          </TitleText>
          
          <SubtitleText
            $size={!isMobile ? 'xl' : 'lg'}
            $weight="400"
            $textAlign="center"
            $margin="none"
            $isMobile={isMobile}
          >
            Платформа для умных заметок и командной работы
          </SubtitleText>
          
          {/* Дополнительное описание */}
          <SubtitleText
            $size={!isMobile ? 'lg' : 'md'}
            $weight="300"
            $textAlign="center"
            $margin="none"
            $isMobile={isMobile}
            style={{ 
              marginTop: '1rem',
              lineHeight: '1.6',
              maxWidth: '600px'
            }}
          >
            
          </SubtitleText>
        </LogoContainer>

        {/* Кнопка "Начать работу" */}
        <Box $align="center">
          {withProConnect ? (
            <ProConnectButton />
          ) : (
            <StyledButton onClick={() => gotoLogin()}>
              Начать работу
            </StyledButton>
          )}
        </Box>
      </ContentContainer>
    </BannerContainer>
  );
}
