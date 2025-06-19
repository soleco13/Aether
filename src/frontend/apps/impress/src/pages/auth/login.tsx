import { Button } from '@openfun/cunningham-react';
import Head from 'next/head';
import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Box, Text } from '@/components';
import { gotoLogin, useAuth } from '@/features/auth';
import { PageLayout } from '@/layouts';
import { NextPageWithLayout } from '@/types/next';

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { authenticated } = useAuth();

  useEffect(() => {
    if (authenticated) {
      window.location.href = '/';
    }
  }, [authenticated]);

  return (
    <>
      <Head>
        <title>Вход в Aether</title>
        <meta property="og:title" content="Вход в Aether" key="title" />
        <meta name="description" content="Войти в Aether - платформу для совместной работы с документами" />
      </Head>
      
      <Box
        $css={css`
          min-height: 100vh;
          background: linear-gradient(135deg, #404040 0%, #000000 100%);
          position: relative;
          overflow: hidden;
          
          /* Анимированные звезды */
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
            animation: twinkle 3s ease-in-out infinite alternate;
          }
          
          @keyframes twinkle {
            0% { opacity: 0.4; }
            100% { opacity: 0.8; }
          }
        `}
      >
        <Box
          $align="center"
          $justify="center"
          $margin="auto"
          $gap="3rem"
          $padding="4rem 2rem"
          $css={css`
            position: relative;
            z-index: 2;
            min-height: 100vh;
          `}
        >
          {/* Главный логотип */}
          <Box
            $align="center"
            $gap="1.5rem"
            $css={css`
              margin-bottom: 2rem;
            `}
          >
            <Box
              $css={css`
                width: 120px;
                height: 120px;
                background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
                border-radius: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                font-weight: 900;
                font-family: 'Inter', sans-serif;
                color: #000000;
                box-shadow: 0 16px 48px rgba(192, 192, 192, 0.2);
                animation: float 6s ease-in-out infinite;
              `}
            >
              Æ
            </Box>
            
            <Box $align="center" $gap="0.5rem">
              <Text
                as="h1"
                $css={css`
                  font-size: 3rem;
                  font-weight: 800;
                  color: #c0c0c0;
                  font-family: 'Inter', sans-serif;
                  margin: 0;
                  text-shadow: 0 4px 16px rgba(192, 192, 192, 0.3);
                `}
              >
                Aether
              </Text>
              
              <Text
                as="p"
                $css={css`
                  font-size: 1.2rem;
                  color: #808080;
                  font-family: 'Inter', sans-serif;
                  margin: 0;
                  text-align: center;
                `}
              >
                Эфирная коллаборация документов
              </Text>
            </Box>
          </Box>

          {/* Форма входа */}
          <Box
            $align="center"
            $gap="2rem"
            $css={css`
              background: rgba(0, 0, 0, 0.7);
              backdrop-filter: blur(20px);
              border: 1px solid #404040;
              border-radius: 20px;
              padding: 4rem 3rem;
              max-width: 480px;
              width: 100%;
              text-align: center;
              box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
            `}
          >
            <Box $align="center" $gap="1rem">
              <Text
                as="h2"
                $css={css`
                  font-size: 1.8rem;
                  font-weight: 700;
                  color: #c0c0c0;
                  font-family: 'Inter', sans-serif;
                  margin: 0;
                `}
              >
                Добро пожаловать
              </Text>
              
              <Text
                as="p"
                $css={css`
                  font-size: 1rem;
                  color: #808080;
                  font-family: 'Inter', sans-serif;
                  line-height: 1.6;
                  margin: 0;
                  max-width: 300px;
                `}
              >
                Войдите в свой аккаунт, чтобы получить доступ к платформе совместной работы с документами
              </Text>
            </Box>

            {/* Кнопка входа */}
            <Button
              onClick={() => gotoLogin(false)}
              $css={css`
                background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
                color: #000000;
                border: none;
                font-family: 'Inter', sans-serif;
                font-weight: 700;
                border-radius: 16px;
                padding: 20px 40px;
                font-size: 18px;
                transition: all 0.3s ease;
                cursor: pointer;
                width: 100%;
                max-width: 280px;
                position: relative;
                overflow: hidden;
                
                &:hover {
                  background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%);
                  transform: translateY(-3px);
                  box-shadow: 0 12px 32px rgba(192, 192, 192, 0.4);
                }
                
                &:active {
                  transform: translateY(-1px);
                }
                
                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                  transition: left 0.6s;
                }
                
                &:hover::before {
                  left: 100%;
                }
              `}
            >
              Войти в Aether
            </Button>

            {/* Дополнительная информация */}
            <Box
              $align="center"
              $gap="0.5rem"
              $css={css`
                margin-top: 1rem;
                padding-top: 1.5rem;
                border-top: 1px solid #404040;
              `}
            >
              <Text
                $css={css`
                  font-size: 14px;
                  color: #404040;
                  font-family: 'Inter', sans-serif;
                  text-align: center;
                `}
              >
                Безопасная авторизация через единую систему входа
              </Text>
            </Box>
          </Box>

          {/* Особенности платформы */}
          <Box
            $align="center"
            $gap="2rem"
            $direction="row"
            $css={css`
              max-width: 800px;
              width: 100%;
              margin-top: 2rem;
              
              @media (max-width: 768px) {
                flex-direction: column;
                gap: 1rem;
              }
            `}
          >
            {[
              { icon: "📝", title: "Совместное редактирование", desc: "Работайте над документами в реальном времени" },
              { icon: "🔗", title: "Легкий обмен", desc: "Делитесь документами одним кликом" },
              { icon: "🎨", title: "Богатое форматирование", desc: "Создавайте красивые документы" }
            ].map((feature, index) => (
              <Box
                key={index}
                $align="center"
                $gap="0.5rem"
                $css={css`
                  background: rgba(0, 0, 0, 0.4);
                  backdrop-filter: blur(10px);
                  border: 1px solid #404040;
                  border-radius: 12px;
                  padding: 1.5rem;
                  text-align: center;
                  flex: 1;
                  min-height: 120px;
                  transition: all 0.3s ease;
                  
                  &:hover {
                    background: rgba(64, 64, 64, 0.3);
                    transform: translateY(-2px);
                    border-color: #808080;
                  }
                `}
              >
                <Text
                  $css={css`
                    font-size: 24px;
                    margin-bottom: 0.5rem;
                  `}
                >
                  {feature.icon}
                </Text>
                <Text
                  $css={css`
                    font-size: 14px;
                    font-weight: 600;
                    color: #c0c0c0;
                    font-family: 'Inter', sans-serif;
                    margin-bottom: 0.25rem;
                  `}
                >
                  {feature.title}
                </Text>
                <Text
                  $css={css`
                    font-size: 12px;
                    color: #808080;
                    font-family: 'Inter', sans-serif;
                    line-height: 1.4;
                  `}
                >
                  {feature.desc}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Анимация плавания логотипа */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </Box>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout withFooter={false}>{page}</PageLayout>;
};

export default Page; 