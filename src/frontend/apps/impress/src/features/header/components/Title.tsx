import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';

import { Box, Text } from '@/components/';
import { useCunninghamTheme } from '@/cunningham';

// Styled компоненты
const TitleText = styled(Text)`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const BetaText = styled(Text)`
  line-height: 9px;
`;

export const Title = () => {
  const { t } = useTranslation();
  const { spacingsTokens, componentTokens } =
    useCunninghamTheme();
  const isBeta = componentTokens['beta'];

  return (
    <Box
      $direction="row"
      $align="center"
      $gap={spacingsTokens['2xs']}
      className="--docs--title"
    >
      <TitleText
        $margin="none"
        as="h2"
        $color="#c0c0c0"
        $zIndex={1}
        $size="1.375rem"
      >
        Aether
      </TitleText>
      {isBeta && (
        <BetaText
          $padding={{
            horizontal: '6px',
            vertical: '4px',
          }}
          $size="11px"
          $theme="primary"
          $variation="500"
          $weight="bold"
          $radius="12px"
          $width="40px"
          $height="16px"
          $background="#ECECFF"
          $color="#5958D3"
        >
          BETA
        </BetaText>
      )}
    </Box>
  );
};
