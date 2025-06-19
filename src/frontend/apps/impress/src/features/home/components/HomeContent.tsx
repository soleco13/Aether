import { useTranslation } from 'react-i18next';
import { styled, keyframes } from 'styled-components';
import { useState, useEffect } from 'react';

import { Box, Text } from '@/components';
import { Footer } from '@/features/footer';
import { LeftPanel } from '@/features/left-panel';
import { useResponsiveStore } from '@/stores';

import HomeBanner from './HomeBanner';
import { HomeHeader, getHeaderHeight } from './HomeHeader';
import { HomeSection } from './HomeSection';

// Styled компоненты
const MainContainer = styled(Box)`
  background: linear-gradient(135deg, #404040 0%, #000000 100%);
  min-height: 100vh;
`;

const ContentContainer = styled(Box)<{ $minHeight: string }>`
  min-height: ${props => props.$minHeight};
`;

const LeftPanelContainer = styled(Box)`
  & .--aether--left-panel-header {
    display: none;
  }
`;

const SectionsContainer = styled(Box)`
  background: linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  padding: 80px 20px;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const SectionWrapper = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// Добавляем новые styled компоненты для улучшения читаемости
const SectionCard = styled(Box)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 8px;
  }
`;

const SectionTitle = styled(Text)`
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const SectionDescription = styled(Text)`
  color: #e0e0e0 !important;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SectionTag = styled(Text)`
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
  color: #000000 !important;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: 16px;
`;

const ListItem = styled(Text)`
  color: #d0d0d0 !important;
  font-size: 0.95rem;
  padding: 4px 0;
  display: flex;
  align-items: center;
  
  &:before {
    content: '✦';
    color: #c0c0c0;
    margin-right: 12px;
    font-size: 1rem;
  }
`;





// 2. Множественные курсоры
const cursorMove = keyframes`
  0% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(120px) translateY(10px); }
  50% { transform: translateX(200px) translateY(-5px); }
  75% { transform: translateX(80px) translateY(15px); }
  100% { transform: translateX(0) translateY(0); }
`;

const cursorBlink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const CursorsContainer = styled(Box)`
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  height: 120px;
  overflow: hidden;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    padding: 16px;
    height: 100px;
    margin: 16px 0;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    height: 80px;
    margin: 12px 0;
  }
`;

const MockText = styled.div`
  color: #a0a0a0;
  font-family: 'Inter', monospace;
  font-size: 0.9rem;
  line-height: 1.8;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    line-height: 1.6;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.5;
  }
`;

const Cursor = styled.div<{ $color: string; $delay: number }>`
  position: absolute;
  width: 2px;
  height: 18px;
  background: ${props => props.$color};
  animation: 
    ${cursorMove} 8s ease-in-out infinite ${props => props.$delay}s,
    ${cursorBlink} 1s infinite;
  top: 30px;
  box-shadow: 0 0 8px ${props => props.$color};
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -6px;
    width: 14px;
    height: 14px;
    background: ${props => props.$color};
    border-radius: 50%;
    opacity: 0.8;
  }
`;

const UserLabel = styled.div<{ $color: string; $delay: number }>`
  position: absolute;
  background: ${props => props.$color};
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  animation: ${cursorMove} 8s ease-in-out infinite ${props => props.$delay}s;
  top: 12px;
  left: 10px;
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 1px 4px;
    top: 8px;
    left: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 1px 3px;
    top: 6px;
    left: 6px;
  }
`;

// Компонент множественных курсоров
const MultipleCursors = () => {
  const cursors = [
    { color: '#c0c0c0', name: 'Анна', delay: 0, id: 'cursor-anna' },
    { color: '#a0a0a0', name: 'Марк', delay: 2, id: 'cursor-mark' },
    { color: '#808080', name: 'Лиза', delay: 4, id: 'cursor-liza' },
  ];

  return (
    <CursorsContainer>
      <MockText>
        Совместное редактирование документа в реальном времени.<br/>
        Каждый участник видит изменения мгновенно...
      </MockText>
      {cursors.map((cursor) => (
        <div key={cursor.id}>
          <UserLabel $color={cursor.color} $delay={cursor.delay}>
            {cursor.name}
          </UserLabel>
          <Cursor $color={cursor.color} $delay={cursor.delay} />
        </div>
      ))}
    </CursorsContainer>
  );
};

// AI Трансформатор текста
const AITransformContainer = styled(Box)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    margin: 16px 0;
  }
`;

const AIButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, #606060 0%, #404040 50%, #606060 100%)' 
    : 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 25%, #a0a0a0 50%, #c0c0c0 75%, #e0e0e0 100%)'};
  color: ${props => props.$isActive ? '#c0c0c0' : '#000'};
  border: ${props => props.$isActive ? '1px solid rgba(192, 192, 192, 0.3)' : '1px solid rgba(160, 160, 160, 0.2)'};
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  cursor: ${props => props.$isActive ? 'not-allowed' : 'pointer'};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  overflow: hidden;
  
  background-size: 200% 200%;
  animation: ${props => props.$isActive ? 'shimmer 2s ease-in-out infinite' : 'none'};
  
  box-shadow: ${props => props.$isActive 
    ? 'inset 0 0 20px rgba(192, 192, 192, 0.1), 0 0 30px rgba(192, 192, 192, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3)' 
    : 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: ${props => props.$isActive 
      ? 'radial-gradient(circle, #c0c0c0 0%, #808080 100%)' 
      : 'radial-gradient(circle, #000 0%, #404040 100%)'};
    border-radius: 50%;
    transition: all 0.4s ease;
    box-shadow: ${props => props.$isActive 
      ? '0 0 8px rgba(192, 192, 192, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.3)' 
      : '0 0 4px rgba(0, 0, 0, 0.3), inset 0 0 2px rgba(255, 255, 255, 0.5)'};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.15);
    
    &::after {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  
  @keyframes shimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.9rem;
    margin-bottom: 20px;
    gap: 8px;
    
    &::before {
      left: 12px;
      width: 14px;
      height: 14px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 0.85rem;
    margin-bottom: 16px;
    letter-spacing: 0.3px;
    
    &::before {
      left: 10px;
      width: 12px;
      height: 12px;
    }
    
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

const TextContainer = styled.div<{ $isTransformed: boolean }>`
  min-height: 300px;
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  
  @media (max-width: 768px) {
    min-height: 250px;
  }
  
  @media (max-width: 480px) {
    min-height: 200px;
  }
  position: relative;
  overflow: hidden;
`;

const UnstructuredText = styled.div<{ $isVisible: boolean; $isBreaking: boolean }>`
  color: #808080;
  font-size: 0.95rem;
  line-height: 1.3;
  text-align: justify;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0) scale(1)' : 'translateY(-30px) scale(0.95)'};
  transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
  position: ${props => props.$isVisible ? 'relative' : 'absolute'};
  width: 100%;
  
  /* Делаем текст выглядящим плохо */
  word-spacing: -1px;
  letter-spacing: -0.3px;
  font-family: 'Times', serif;
  
  /* Анимация разбиения текста */
  ${props => props.$isBreaking && `
    animation: textBreak 1.5s ease-in-out forwards;
    
    @keyframes textBreak {
      0% { opacity: 1; transform: scale(1); }
      20% { opacity: 0.8; transform: scale(1.02) rotate(0.2deg); }
      40% { opacity: 0.6; transform: scale(0.98) rotate(-0.1deg); }
      60% { opacity: 0.4; transform: scale(1.01) rotate(0.1deg); filter: blur(1px); }
      80% { opacity: 0.2; transform: scale(0.95) rotate(0deg); filter: blur(2px); }
      100% { opacity: 0; transform: scale(0.9); filter: blur(3px); }
    }
  `}
`;

const StructuredText = styled.div<{ $isVisible: boolean; $phase: number }>`
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'};
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s;
  position: ${props => props.$isVisible ? 'relative' : 'absolute'};
  width: 100%;
  top: ${props => props.$isVisible ? 'auto' : '0'};
`;

const StructuredTitle = styled.h3<{ $phase: number }>`
  color: #c0c0c0;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  
  opacity: ${props => props.$phase >= 1 ? 1 : 0};
  transform: ${props => props.$phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)'};
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  transition-delay: ${props => props.$phase >= 1 ? '0.8s' : '0s'};
`;

const FeatureSection = styled.div<{ $phase: number; $index: number }>`
  margin-bottom: 24px;
  
  opacity: ${props => props.$phase >= props.$index + 2 ? 1 : 0};
  transform: ${props => props.$phase >= props.$index + 2 ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)'};
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  transition-delay: ${props => props.$phase >= props.$index + 2 ? `${1.2 + props.$index * 0.3}s` : '0s'};
`;

const FeatureTitle = styled.h4<{ $phase: number; $index: number }>`
  color: #a0a0a0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  
  &::before {
    content: '◆ ';
    color: #c0c0c0;
    margin-right: 8px;
    opacity: ${props => props.$phase >= props.$index + 2 ? 1 : 0};
    transform: ${props => props.$phase >= props.$index + 2 ? 'scale(1)' : 'scale(0)'};
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transition-delay: ${props => props.$phase >= props.$index + 2 ? `${1.5 + props.$index * 0.3}s` : '0s'};
    display: inline-block;
  }
`;

const FeatureDescription = styled.p<{ $phase: number; $index: number }>`
  color: #909090;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
  
  opacity: ${props => props.$phase >= props.$index + 2 ? 1 : 0};
  transform: ${props => props.$phase >= props.$index + 2 ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.6s ease-out;
  transition-delay: ${props => props.$phase >= props.$index + 2 ? `${1.7 + props.$index * 0.3}s` : '0s'};
`;

const FeatureList = styled.ul<{ $phase: number; $index: number }>`
  list-style: none;
  padding: 0;
  margin-left: 16px;
  
  opacity: ${props => props.$phase >= props.$index + 2 ? 1 : 0};
  transform: ${props => props.$phase >= props.$index + 2 ? 'translateY(0)' : 'translateY(15px)'};
  transition: all 0.8s ease-out;
  transition-delay: ${props => props.$phase >= props.$index + 2 ? `${1.9 + props.$index * 0.3}s` : '0s'};
`;

const FeatureItem = styled.li<{ $phase: number; $parentIndex: number; $itemIndex: number }>`
  color: #808080;
  font-size: 0.9rem;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;
  
  opacity: ${props => props.$phase >= props.$parentIndex + 2 ? 1 : 0};
  transform: ${props => props.$phase >= props.$parentIndex + 2 ? 'translateX(0)' : 'translateX(-15px)'};
  transition: all 0.4s ease-out;
  transition-delay: ${props => props.$phase >= props.$parentIndex + 2 ? `${2.1 + props.$parentIndex * 0.3 + props.$itemIndex * 0.1}s` : '0s'};
  
  &::before {
    content: '▸ ';
    color: #a0a0a0;
    margin-right: 8px;
    opacity: ${props => props.$phase >= props.$parentIndex + 2 ? 1 : 0};
    transform: ${props => props.$phase >= props.$parentIndex + 2 ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)'};
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transition-delay: ${props => props.$phase >= props.$parentIndex + 2 ? `${2.2 + props.$parentIndex * 0.3 + props.$itemIndex * 0.1}s` : '0s'};
    display: inline-block;
  }
`;

const AITransformEffect = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 20%,
    rgba(192, 192, 192, 0.1) 30%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(192, 192, 192, 0.1) 70%,
    transparent 80%
  );
  transform: translateX(-100%);
  animation: ${props => props.$isActive ? 'aiProcessing 2s ease-in-out' : 'none'};
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(192, 192, 192, 0.8), transparent);
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
  }
  
  @keyframes aiProcessing {
    0% { transform: translateX(-100%) scale(0.8); opacity: 0; }
    10% { opacity: 1; }
    20% { transform: translateX(-50%) scale(1); }
    80% { transform: translateX(50%) scale(1); }
    90% { opacity: 1; }
    100% { transform: translateX(100%) scale(0.8); opacity: 0; }
  }
`;

// Компонент AI трансформатора
const AITextTransformer = () => {
  const [isTransformed, setIsTransformed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const unstructuredText = "Aether — это тот самый невесомый поток идей и знаний, где каждый документ словно отдельная планета в вашей личной вселенной, а участники команды вращаются вокруг неё, оставляя за собой яркие следы правок и комментариев; здесь вы не просто создаёте заметки, вы строите целую галактику мыслей, перетаскивая блоки и превращая простые слова в чёткие структуры с помощью магии Markdown, резюмируете гигабайты текста за секунды и исправляете опечатки, не отрываясь от вдохновения, а AI‑ассистент подскажет вам лучшее формулировки, переведёт на любой язык и подарит новые идеи, словно далекий путеводитель по звёздным системам; реальное время синхронизации, настраиваемые права доступа и бесконечный экспорт в PDF, DOCX или ODT делают Aether не просто инструментом, а вашим космическим кораблём для исследования безграничного пространства знаний, и всё это бесплатно, без подписок и скрытых платежей, с кодом под MIT‑лицензией и поддержкой российского сообщества, где каждый может внести свой вклад и стать частью проекта, который растёт и эволюционирует вместе с вами.";

  const handleTransform = () => {
    if (isAnimating) return;
    
    if (!isTransformed) {
      // Запускаем трансформацию
      setIsAnimating(true);
      setIsBreaking(true);
      
      // Фаза 1: Разбиение оригинального текста
      setTimeout(() => {
        setIsTransformed(true);
        setAnimationPhase(1);
      }, 1500);
      
      // Фазы 2-4: Появление структурированных секций
      setTimeout(() => setAnimationPhase(2), 2300);
      setTimeout(() => setAnimationPhase(3), 2900);
      setTimeout(() => setAnimationPhase(4), 3500);
      
      setTimeout(() => {
        setIsAnimating(false);
        setIsBreaking(false);
      }, 4500);
    } else {
      // Возвращаем к оригиналу
      setIsAnimating(true);
      setAnimationPhase(0);
      setIsTransformed(false);
      setIsBreaking(false);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  return (
    <AITransformContainer>
      <AIButton $isActive={isAnimating} onClick={handleTransform} disabled={isAnimating}>
        {isTransformed ? 'Восстановить оригинал' : 'Структурировать с AI'}
      </AIButton>
      
      <TextContainer $isTransformed={isTransformed}>
        <AITransformEffect $isActive={isAnimating && !isTransformed} />
        
        <UnstructuredText $isVisible={!isTransformed} $isBreaking={isBreaking}>
          {unstructuredText}
        </UnstructuredText>
        
        <StructuredText $isVisible={isTransformed} $phase={animationPhase}>
          <StructuredTitle $phase={animationPhase}>
            Aether — Космический корабль для ваших идей
          </StructuredTitle>
          
          <FeatureSection $phase={animationPhase} $index={0}>
            <FeatureTitle $phase={animationPhase} $index={0}>Совместная работа</FeatureTitle>
            <FeatureDescription $phase={animationPhase} $index={0}>
              Каждый документ — отдельная планета в вашей вселенной, где участники команды 
              оставляют яркие следы правок и комментариев в реальном времени.
            </FeatureDescription>
          </FeatureSection>

          <FeatureSection $phase={animationPhase} $index={1}>
            <FeatureTitle $phase={animationPhase} $index={1}>AI-ассистент</FeatureTitle>
            <FeatureDescription $phase={animationPhase} $index={1}>
              Ваш далёкий путеводитель по звёздным системам знаний:
            </FeatureDescription>
            <FeatureList $phase={animationPhase} $index={1}>
              <FeatureItem $phase={animationPhase} $parentIndex={1} $itemIndex={0}>Улучшает формулировки и стиль</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={1} $itemIndex={1}>Переводит на любые языки</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={1} $itemIndex={2}>Генерирует новые идеи</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={1} $itemIndex={3}>Резюмирует гигабайты текста за секунды</FeatureItem>
            </FeatureList>
          </FeatureSection>

          <FeatureSection $phase={animationPhase} $index={2}>
            <FeatureTitle $phase={animationPhase} $index={2}>Возможности платформы</FeatureTitle>
            <FeatureList $phase={animationPhase} $index={2}>
              <FeatureItem $phase={animationPhase} $parentIndex={2} $itemIndex={0}>Структурирование с помощью Markdown</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={2} $itemIndex={1}>Настраиваемые права доступа</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={2} $itemIndex={2}>Экспорт в PDF, DOCX, ODT</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={2} $itemIndex={3}>Бесплатно с открытым кодом (MIT)</FeatureItem>
              <FeatureItem $phase={animationPhase} $parentIndex={2} $itemIndex={4}>Поддержка российского сообщества</FeatureItem>
            </FeatureList>
          </FeatureSection>
        </StructuredText>
      </TextContainer>
    </AITransformContainer>
  );
};

export function HomeContent() {
  const { t } = useTranslation();
  const { isSmallMobile } = useResponsiveStore();

  return (
    <MainContainer as="main">
      <HomeHeader />
      {isSmallMobile && (
        <LeftPanelContainer>
          <LeftPanel />
        </LeftPanelContainer>
      )}
      
      <ContentContainer
        $minHeight={`calc(100vh - ${getHeaderHeight(isSmallMobile)}px)`}
        >
          <HomeBanner />
      </ContentContainer>
      
      {/* Новые секции с описанием возможностей */}
      <SectionsContainer>
        <SectionWrapper $direction="column" $gap="80px">
          
          {/* Секция "Почему выбирают Aether?" */}
          <Box $direction="column" $gap="40px" $align="center">
            <SectionTitle
              as="h2"
              $size="h3"
              $weight="bold"
              $textAlign="center"
              $margin="none"
            >
              Почему выбирают Aether?
            </SectionTitle>
          </Box>

          {/* Мгновенное совместное редактирование */}
          <SectionCard>
            <SectionTag>Совместная работа</SectionTag>
            <SectionTitle
              as="h3"
              $size="h4"
              $weight="bold"
              $margin={{ bottom: '16px' }}
            >
              Мгновенное совместное редактирование
            </SectionTitle>
            <SectionDescription>
              Видите курсоры коллег в реальном времени, общаетесь прямо в документе, 
              настраиваете гибкие права доступа и публикуете общие ссылки за секунды.
            </SectionDescription>
            <MultipleCursors />
          </SectionCard>

          {/* AI-ассистент */}
          <SectionCard>
            <SectionTag>Искусственный интеллект</SectionTag>
            <SectionTitle
              as="h3"
              $size="h4"
              $weight="bold"
              $margin={{ bottom: '16px' }}
            >
              AI‑ассистент под рукой
            </SectionTitle>
            <SectionDescription>
              Мощные AI-инструменты для повышения продуктивности:
            </SectionDescription>
            <SectionDescription>
              Перефразируйте текст одним кликом
            </SectionDescription>
            <SectionDescription>
              Лаконично резюмируйте большие фрагменты
            </SectionDescription>
            <SectionDescription>
              Исправляйте опечатки и грамматические ошибки
            </SectionDescription>
            <SectionDescription>
              Переводите документы на любые языки
            </SectionDescription>
            <SectionDescription>
              Создавайте промпты из выделенного текста и управляйте ими
            </SectionDescription>
            <AITextTransformer />
          </SectionCard>

        </SectionWrapper>
      </SectionsContainer>
      
        <Footer />
    </MainContainer>
  );
}
