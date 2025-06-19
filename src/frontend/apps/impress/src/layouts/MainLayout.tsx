import { PropsWithChildren } from 'react';
import { css } from 'styled-components';

import { Box } from '@/components';
import { useCunninghamTheme } from '@/cunningham';
import { Header } from '@/features/header';
import { HEADER_HEIGHT } from '@/features/header/conf';
import { LeftPanel } from '@/features/left-panel';
import { MAIN_LAYOUT_ID } from '@/layouts/conf';
import { useResponsiveStore } from '@/stores';

type MainLayoutProps = {
  backgroundColor?: 'white' | 'grey';
};

export function MainLayout({
  children,
  backgroundColor = 'white',
}: PropsWithChildren<MainLayoutProps>) {
  const { isDesktop } = useResponsiveStore();
  const { colorsTokens } = useCunninghamTheme();
  const currentBackgroundColor = !isDesktop ? 'white' : backgroundColor;

  return (
    <Box 
      className="--docs--main-layout auto-hide-container"
      $css={css`
        .auto-hide-container {
          --header-visible: 1;
          --panel-visible: 1;
        }
        
        .auto-hide-container:not(.mouse-active) {
          --header-visible: 0;
          --panel-visible: 0;
        }
        
        .auto-hide-container.mouse-near-top {
          --header-visible: 1;
        }
        
        .auto-hide-container.mouse-near-left {
          --panel-visible: 1;
        }
      `}
    >
      <Box
        $css={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transform: translateY(calc(-100% * (1 - var(--header-visible))));
          transition: transform 0.3s ease-in-out;
        `}
      >
      <Header />
      </Box>
      <Box
        $direction="row"
        $margin={{ top: `${HEADER_HEIGHT}px` }}
        $width="100%"
      >
        <Box
          $css={css`
            position: fixed;
            top: ${HEADER_HEIGHT}px;
            left: 0;
            bottom: 0;
            z-index: 999;
            transform: translateX(calc(-100% * (1 - var(--panel-visible))));
            transition: transform 0.3s ease-in-out;
          `}
      >
        <LeftPanel />
        </Box>
        <Box
          as="main"
          id={MAIN_LAYOUT_ID}
          $align="center"
          $flex={1}
          $width="100%"
          $height={`calc(100dvh - ${HEADER_HEIGHT}px)`}
          $padding={{
            all: isDesktop ? 'base' : '0',
          }}
          $margin={{
            left: isDesktop ? 'calc(300px * var(--panel-visible))' : '0',
          }}
          $background={
            currentBackgroundColor === 'white'
              ? colorsTokens['greyscale-000']
              : colorsTokens['greyscale-050']
          }
          $css={css`
            overflow-y: auto;
            overflow-x: clip;
            transition: margin-left 0.3s ease-in-out;
          `}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
