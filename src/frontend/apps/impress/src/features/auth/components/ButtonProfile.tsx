import { Button } from '@openfun/cunningham-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { useAuth } from '../hooks';

export const ButtonProfile = () => {
  const { t } = useTranslation();
  const { authenticated, user } = useAuth();
  const router = useRouter();

  if (!authenticated) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Button
      onClick={() => router.push('/profile')}
      color="secondary"
      aria-label={t('Profile')}
      className="--docs--button-profile"
      $css={css`
        &.c__button.c__button--secondary.c__button--medium {
          background: transparent !important;
          color: #c0c0c0 !important;
          border: 1px solid #404040 !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          transition: all 0.3s ease !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        
        &.c__button.c__button--secondary.c__button--medium:hover {
          background: #404040 !important;
          color: #ffffff !important;
          border-color: #808080 !important;
        }
        
        &.c__button.c__button--secondary.c__button--medium:active {
          transform: translateY(0) !important;
        }
      `}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: '900',
          color: '#000000'
        }}
      >
        {getInitials(user?.full_name || user?.short_name || 'User')}
      </div>
      {t('Profile')}
    </Button>
  );
}; 