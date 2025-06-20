import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Popover } from 'react-aria-components';
import styled, { css } from 'styled-components';

import { useCunninghamTheme } from '@/cunningham';

import { BoxProps } from './Box';

const StyledPopover = styled(Popover)`
  background-color: white;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #dddddd;
  transition: opacity 0.2s ease-in-out;
`;

interface StyledButtonProps {
  $css?: BoxProps['$css'];
}
const StyledButton = styled(Button)<StyledButtonProps>`
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  font-size: 0.938rem;
  padding: 0;
  ${({ $css }) => $css};
`;

export interface DropButtonProps {
  button: ReactNode;
  buttonCss?: BoxProps['$css'];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  label?: string;
}

export const DropButton = ({
  button,
  buttonCss,
  isOpen = false,
  onOpenChange,
  children,
  label,
}: PropsWithChildren<DropButtonProps>) => {
  const { themeTokens } = useCunninghamTheme();
  const font = themeTokens['font']?.['families']['base'];
  const [isLocalOpen, setIsLocalOpen] = useState(isOpen);

  const triggerRef = useRef(null);

  useEffect(() => {
    setIsLocalOpen(isOpen);
  }, [isOpen]);

  const onOpenChangeHandler = (isOpen: boolean) => {
    setIsLocalOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  return (
    <>
      <StyledButton
        ref={triggerRef}
        onPress={() => onOpenChangeHandler(true)}
        aria-label={label}
        $css={css`
          font-family: ${font};
          ${buttonCss};
        `}
        className="--aether--drop-button"
      >
        {button}
      </StyledButton>

      <StyledPopover
        triggerRef={triggerRef}
        isOpen={isLocalOpen}
        onOpenChange={onOpenChangeHandler}
        className="--aether--drop-button-popover"
      >
        {children}
      </StyledPopover>
    </>
  );
};
