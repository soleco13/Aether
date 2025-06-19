import { Button } from '@openfun/cunningham-react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { BoxButton } from '@/components';

import ProConnectImg from '../assets/button-proconnect.svg';
import { useAuth } from '../hooks';
import { gotoLogin, gotoLogout } from '../utils';

export const ButtonLogin = () => {
  const { t } = useTranslation();
  const { authenticated } = useAuth();

  if (!authenticated) {
    return (
      <Button
        onClick={() => gotoLogin()}
        color="primary"
        aria-label={t('Login')}
        className="--docs--button-login"
        $css={css`
          background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
          color: #000000;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          border-radius: 8px;
          padding: 12px 24px;
          transition: all 0.3s ease;
          font-size: 14px;
          
          &:hover {
            background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3);
          }
          
          &:active {
            transform: translateY(0);
          }
        `}
      >
        Войти
      </Button>
    );
  }

  return (
    <Button
      onClick={gotoLogout}
      color="tertiary"
      aria-label={t('Logout')}
      className="--docs--button-logout"
      $css={css`
        background: transparent;
        color: #c0c0c0;
        border: 1px solid #404040;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        border-radius: 8px;
        padding: 8px 16px;
        transition: all 0.3s ease;
        font-size: 14px;
        
        &:hover {
          background: #404040;
          color: #ffffff;
          border-color: #808080;
        }
      `}
    >
      Выйти
    </Button>
  );
};

export const ProConnectButton = () => {
  const { t } = useTranslation();

  return (
    <BoxButton
      onClick={() => gotoLogin()}
      aria-label={t('Proconnect Login')}
      $css={css`
        background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
        color: #000000;
        border: none;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        border-radius: 8px;
        padding: 16px 32px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        
        &:hover {
          background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3);
        }
        
        &:active {
          transform: translateY(0);
        }
      `}
      $radius="8px"
      className="--docs--proconnect-button"
    >
      <ProConnectImg />
      <span>Войти через ProConnect</span>
    </BoxButton>
  );
};
