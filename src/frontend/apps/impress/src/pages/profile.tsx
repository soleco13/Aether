import { Button } from '@openfun/cunningham-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';

import { Box } from '@/components';
import { useAuth } from '@/features/auth';
import { useUserUpdate } from '@/core/api/useUserUpdate';
import { NextPageWithLayout } from '@/types/next';

// Styled компоненты для космического дизайна
const ProfileContainer = styled(Box)`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #404040 0%, #000000 100%);
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(192, 192, 192, 0.6), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(192, 192, 192, 0.4), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(192, 192, 192, 0.5), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(192, 192, 192, 0.3), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    opacity: 0.3;
    animation: sparkle 4s linear infinite;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.1; }
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ProfileCard = styled(Box)`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(192, 192, 192, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 2;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const ProfileHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(192, 192, 192, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  color: #000000;
  box-shadow: 0 8px 24px rgba(192, 192, 192, 0.2);
  animation: float 6s ease-in-out infinite;
  flex-shrink: 0;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 1.5rem;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #c0c0c0;
  margin: 0 0 0.5rem 0;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const UserEmail = styled.p`
  font-size: 1rem;
  color: #808080;
  margin: 0;
  font-family: 'Inter', sans-serif;
  word-break: break-all;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const InfoSection = styled(Box)`
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #c0c0c0;
  margin: 0 0 1rem 0;
  font-family: 'Inter', sans-serif;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(Box)`
  background: rgba(64, 64, 64, 0.6);
  border: 1px solid rgba(192, 192, 192, 0.2);
  border-radius: 10px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(192, 192, 192, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #808080;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: #c0c0c0;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ActionButton = styled(Button)`
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
  color: #000000;
  border: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s ease;
  font-size: 0.875rem;

  &:hover {
    background: linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(192, 192, 192, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 20px;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #c0c0c0;
  border: 1px solid rgba(192, 192, 192, 0.3);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s ease;
  font-size: 0.875rem;

  &:hover {
    background: rgba(192, 192, 192, 0.1);
    color: #ffffff;
    border-color: rgba(192, 192, 192, 0.5);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 20px;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(192, 192, 192, 0.3);
  border-radius: 50%;
  color: #c0c0c0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(192, 192, 192, 0.5);
    color: #ffffff;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const EditForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(64, 64, 64, 0.7);
  border: 1px solid rgba(192, 192, 192, 0.3);
  border-radius: 8px;
  color: #c0c0c0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(192, 192, 192, 0.6);
    background: rgba(64, 64, 64, 0.9);
    box-shadow: 0 0 0 3px rgba(192, 192, 192, 0.1);
  }

  &::placeholder {
    color: rgba(192, 192, 192, 0.5);
  }

  &[type="password"] {
    letter-spacing: 0.1em;
  }
`;

const SaveButton = styled(ActionButton)`
  grid-column: 1 / -1;
  justify-self: start;
  width: auto;
  min-width: 150px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(64, 64, 64, 0.7);
  border: 1px solid rgba(192, 192, 192, 0.3);
  border-radius: 8px;
  color: #c0c0c0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(192, 192, 192, 0.6);
    background: rgba(64, 64, 64, 0.9);
    box-shadow: 0 0 0 3px rgba(192, 192, 192, 0.1);
  }

  option {
    background: #404040;
    color: #c0c0c0;
    border: none;
  }
`;

const MessageBox = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  margin-bottom: 1rem;
  background: ${props => props.type === 'success' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.type === 'success' 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.type === 'success' 
    ? '#22c55e' 
    : '#ef4444'};
`;

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { user, authenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    language: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const userUpdateMutation = useUserUpdate();

  // Инициализация данных при загрузке пользователя
  React.useEffect(() => {
    if (user) {
      setEditData({
        language: user.language || 'ru-ru'
      });
    }
  }, [user]);

  // Обработка сохранения профиля
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await userUpdateMutation.mutateAsync({
        id: user.id,
        language: editData.language
      });
      setSuccessMessage('Профиль успешно обновлен!');
      setIsEditing(false);
      
      // Убираем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Ошибка при обновлении профиля. Попробуйте еще раз.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const languageOptions = [
    { value: 'ru-ru', label: 'Русский' },
  ];

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Личный кабинет - Aether</title>
        </Head>
        <ProfileContainer>
          <CloseButton onClick={() => router.push('/')} title="Закрыть">
            ×
          </CloseButton>
          <ProfileCard>
            <Box $justify="center" $align="center" style={{ minHeight: '300px', textAlign: 'center' }}>
              <UserName style={{ marginBottom: '1rem' }}>Необходима авторизация</UserName>
              <UserEmail style={{ marginBottom: '2rem' }}>Пожалуйста, войдите в систему для доступа к личному кабинету</UserEmail>
              <ActionButton onClick={() => router.push('/login')}>
                Войти в систему
              </ActionButton>
            </Box>
          </ProfileCard>
        </ProfileContainer>
      </>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Не указано';
    }
  };

  return (
    <>
      <Head>
        <title>Личный кабинет - Aether</title>
        <meta name="description" content="Личный кабинет пользователя в системе Aether" />
      </Head>
      
      <ProfileContainer>
        <CloseButton onClick={() => router.push('/')} title="Закрыть">
          ×
        </CloseButton>
        <ProfileCard>
          <ProfileHeader>
            <Avatar>
              {getInitials(user?.full_name || user?.short_name || 'User')}
            </Avatar>
            <UserInfo>
              <UserName>
                {user?.full_name || user?.short_name || 'Пользователь'}
              </UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserInfo>
          </ProfileHeader>

          <InfoSection>
            <InfoTitle>Информация о профиле</InfoTitle>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>Полное имя</InfoLabel>
                <InfoValue>{user?.full_name || 'Не указано'}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Короткое имя</InfoLabel>
                <InfoValue>{user?.short_name || 'Не указано'}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Логин</InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Пароль</InfoLabel>
                <InfoValue>••••••••</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>ID пользователя</InfoLabel>
                <InfoValue>{user?.id}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Статус</InfoLabel>
                <InfoValue style={{ color: '#4ade80' }}>Активен</InfoValue>
              </InfoCard>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <InfoTitle>Действия</InfoTitle>
            <ButtonGroup>
              <ActionButton onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Отменить' : 'Редактировать профиль'}
              </ActionButton>
              <SecondaryButton onClick={() => router.push('/')}>
                На главную
              </SecondaryButton>
            </ButtonGroup>
          </InfoSection>

          {isEditing && (
            <InfoSection>
              <InfoTitle>Редактирование профиля</InfoTitle>
              <EditForm onSubmit={(e) => {
                e.preventDefault();
                // Здесь будет логика сохранения
                console.log('Saving profile data:', editData);
                setIsEditing(false);
              }}>
                <InputGroup>
                  <InfoLabel>Полное имя</InfoLabel>
                  <Input
                    type="text"
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    placeholder="Введите полное имя"
                  />
                </InputGroup>
                
                <InputGroup>
                  <InfoLabel>Короткое имя</InfoLabel>
                  <Input
                    type="text"
                    value={editData.shortName}
                    onChange={(e) => setEditData({...editData, shortName: e.target.value})}
                    placeholder="Введите короткое имя"
                  />
                </InputGroup>
                
                <InputGroup>
                  <InfoLabel>Email</InfoLabel>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    placeholder="Введите email"
                  />
                </InputGroup>
                
                <InputGroup>
                  <InfoLabel>Текущий пароль</InfoLabel>
                  <Input
                    type="password"
                    value={editData.currentPassword}
                    onChange={(e) => setEditData({...editData, currentPassword: e.target.value})}
                    placeholder="Введите текущий пароль"
                  />
                </InputGroup>
                
                <InputGroup>
                  <InfoLabel>Новый пароль</InfoLabel>
                  <Input
                    type="password"
                    value={editData.newPassword}
                    onChange={(e) => setEditData({...editData, newPassword: e.target.value})}
                    placeholder="Введите новый пароль"
                  />
                </InputGroup>
                
                <InputGroup>
                  <InfoLabel>Подтвердить пароль</InfoLabel>
                  <Input
                    type="password"
                    value={editData.confirmPassword}
                    onChange={(e) => setEditData({...editData, confirmPassword: e.target.value})}
                    placeholder="Подтвердите новый пароль"
                  />
                </InputGroup>
                
                <SaveButton type="submit">
                  Сохранить изменения
                </SaveButton>
              </EditForm>
            </InfoSection>
          )}
        </ProfileCard>
      </ProfileContainer>
    </>
  );
};

// Убираем getLayout чтобы страница заняла весь экран без header и боковой панели

export default ProfilePage; 