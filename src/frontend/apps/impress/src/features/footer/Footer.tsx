import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';

import { Box, Text } from '@/components/';

// Styled компоненты
const FooterContainer = styled(Box)`
  background: #000000;
  border-top: 1px solid #404040;
  padding: 2rem 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 1.5rem 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const LogoBox = styled(Box)`
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
  border-radius: 6px;
  
  &::before {
    content: 'Æ';
    font-size: 0.9rem;
    font-weight: 900;
    color: #000000;
    font-family: 'Inter', sans-serif;
  }
`;

const TitleText = styled(Text)`
  color: #c0c0c0;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
`;

const DescriptionText = styled(Text)`
  color: #c0c0c0;
  font-family: 'Inter', sans-serif;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 300px;
  }
  
  @media (max-width: 480px) {
    max-width: 250px;
  }
`;

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterContainer as="footer">
        <Box
          $align="center"
        $gap="1rem"
        $direction="column"
        >
        {/* Логотип Aether */}
                <Box
                  $align="center"
                  $gap="0.5rem"
                  $direction="row"
        >
          <LogoBox
            $width="24px"
            $height="24px"
            $justify="center"
            $align="center"
          />
          <TitleText
            $size="lg"
            $weight="700"
          >
            Aether
          </TitleText>
        </Box>
        
        {/* Простое описание */}
        <DescriptionText $size="sm">
          Платформа для совместной работы с документами
        </DescriptionText>
      </Box>
    </FooterContainer>
  );
};
