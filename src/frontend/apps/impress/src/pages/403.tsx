import { Button } from '@openfun/cunningham-react';
import Head from 'next/head';
import Image from 'next/image';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import img403 from '@/assets/icons/icon-403.png';
import { Box, Icon, StyledLink, Text } from '@/components';
import { PageLayout } from '@/layouts';
import { NextPageWithLayout } from '@/types/next';

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Доступ запрещен - Aether</title>
        <meta property="og:title" content="Доступ запрещен - Aether" key="title" />
      </Head>
      
      <Box
        $css={css`
          min-height: 100vh;
          background: linear-gradient(135deg, #404040 0%, #000000 100%);
          position: relative;
          overflow: hidden;
          
          /* Фоновые звезды */
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(2px 2px at 20px 30px, #c0c0c0, transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(192, 192, 192, 0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(192, 192, 192, 0.6), transparent),
              radial-gradient(1px 1px at 130px 80px, #c0c0c0, transparent),
              radial-gradient(2px 2px at 160px 30px, rgba(192, 192, 192, 0.7), transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            opacity: 0.6;
            z-index: 1;
          }
        `}
      >
      <Box
        $align="center"
          $justify="center"
        $margin="auto"
          $gap="2rem"
          $padding="4rem 2rem"
          $css={css`
            position: relative;
            z-index: 2;
            min-height: 100vh;
          `}
        >
          {/* Логотип Aether */}
          <Box
            $align="center"
        $gap="1rem"
            $css={css`
              margin-bottom: 2rem;
            `}
      >
            <Box
              $css={css`
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: 900;
                font-family: 'Inter', sans-serif;
                color: #000000;
                box-shadow: 0 8px 24px rgba(192, 192, 192, 0.2);
              `}
            >
              Æ
            </Box>
            
            <Text
              as="h1"
              $css={css`
                font-size: 2rem;
                font-weight: 800;
                color: #c0c0c0;
                font-family: 'Inter', sans-serif;
                margin: 0;
              `}
            >
              Aether
            </Text>
          </Box>

          {/* Контент ошибки */}
          <Box
            $align="center"
            $gap="1.5rem"
            $css={css`
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(10px);
              border: 1px solid #404040;
              border-radius: 16px;
              padding: 3rem 2rem;
              max-width: 500px;
              width: 100%;
              text-align: center;
            `}
          >
            {/* Иконка ошибки */}
            <Box
              $css={css`
                width: 120px;
                height: 120px;
                background: linear-gradient(135deg, #404040 0%, #808080 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                font-weight: 700;
                color: #c0c0c0;
                font-family: 'Inter', sans-serif;
                margin-bottom: 1rem;
              `}
            >
              403
            </Box>

            <Text
              as="h2"
              $css={css`
                font-size: 1.5rem;
                font-weight: 600;
                color: #c0c0c0;
                font-family: 'Inter', sans-serif;
                margin: 0 0 1rem 0;
              `}
            >
              Доступ запрещен
            </Text>

            <Text
              as="p"
              $css={css`
                font-size: 1rem;
                color: #808080;
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                margin: 0 0 2rem 0;
                max-width: 350px;
              `}
            >
              У вас недостаточно прав для просмотра этого документа. Обратитесь к администратору или владельцу документа.
          </Text>

          <StyledLink href="/">
              <Button
                $css={css`
                  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
                  color: #000000;
                  border: none;
                  font-family: 'Inter', sans-serif;
                  font-weight: 600;
                  border-radius: 12px;
                  padding: 16px 32px;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  
                  &:hover {
                    background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(192, 192, 192, 0.3);
                  }
                  
                  &:active {
                    transform: translateY(0);
                  }
                `}
                icon={<Icon iconName="house" $color="#000000" />}
              >
                На главную
              </Button>
          </StyledLink>
          </Box>

          {/* Дополнительная информация */}
          <Text
            as="p"
            $css={css`
              font-size: 14px;
              color: #404040;
              font-family: 'Inter', sans-serif;
              text-align: center;
              margin-top: 2rem;
            `}
          >
            Платформа для совместной работы с документами
          </Text>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout withFooter={false}>{page}</PageLayout>;
};

export default Page;
