import styled from 'styled-components';
import { growsomeTheme } from './theme';

// Button Components based on TheAround Design System

export interface ButtonProps {
  $color?: 'primary' | 'green' | 'gray' | 'danger' | 'warning' | 'customPurple';
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'filled' | 'outline' | 'ghost' | 'text';
  $width?: string;
  
  // Standard button props (not prefixed)
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}

const getButtonColors = (color: ButtonProps['$color'], variant: ButtonProps['$variant']) => {
  const colors = {
    primary: {
      main: growsomeTheme.color.Primary500,
      hover: growsomeTheme.color.Primary600,
      active: growsomeTheme.color.Primary700,
      light: growsomeTheme.color.Primary300,
    },
    green: {
      main: growsomeTheme.color.Primary500, // 기본적으로 Primary 사용
      hover: growsomeTheme.color.Primary600,
      active: growsomeTheme.color.Primary700,
      light: growsomeTheme.color.Primary300,
    },
    gray: {
      main: growsomeTheme.color.Gray300,
      hover: growsomeTheme.color.Gray400,
      active: growsomeTheme.color.Gray400,
      light: growsomeTheme.color.Gray100,
    },
    danger: {
      main: growsomeTheme.color.Red500,
      hover: growsomeTheme.color.Red400,
      active: growsomeTheme.color.Red500,
      light: growsomeTheme.color.Red300,
    },
    warning: {
      main: growsomeTheme.color.Yellow500,
      hover: growsomeTheme.color.Yellow400,
      active: growsomeTheme.color.Yellow500,
      light: growsomeTheme.color.Yellow300,
    },
    customPurple: {
      main: growsomeTheme.color.customPurple,
      hover: growsomeTheme.color.customPurple,
      active: growsomeTheme.color.customPurple,
      light: growsomeTheme.color.customPurple,
    },
  };

  const colorSet = colors[color || 'primary'];

  switch (variant) {
    case 'filled':
      return {
        background: colorSet.main,
        color: growsomeTheme.color.White, // 모든 버튼 하얀 텍스트
        border: 'none',
        hoverBackground: colorSet.hover,
        hoverColor: growsomeTheme.color.White,
      };
    case 'outline':
      return {
        background: 'transparent',
        color: colorSet.main,
        border: `2px solid ${colorSet.main}`,
        hoverBackground: colorSet.main,
        hoverColor: growsomeTheme.color.White, // 모든 outline 버튼 하얀 텍스트
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: colorSet.main,
        border: 'none',
        hoverBackground: colorSet.light,
        hoverColor: colorSet.main,
      };
    case 'text':
      return {
        background: 'transparent',
        color: colorSet.main,
        border: 'none',
        hoverBackground: 'transparent',
        hoverColor: colorSet.hover,
      };
    default:
      return {
        background: colorSet.main,
        color: growsomeTheme.color.White,
        border: 'none',
        hoverBackground: colorSet.hover,
        hoverColor: growsomeTheme.color.White,
      };
  }
};

const getButtonSizing = (size: ButtonProps['$size']) => {
  switch (size) {
    case 'small':
      return {
        padding: `${growsomeTheme.spacing.sm} ${growsomeTheme.spacing.md}`,
        fontSize: growsomeTheme.fontSize.TextS,
        borderRadius: growsomeTheme.radius.radius1,
        minHeight: '2.5rem',
      };
    case 'large':
      return {
        padding: `${growsomeTheme.spacing.lg} ${growsomeTheme.spacing.xl}`,
        fontSize: growsomeTheme.fontSize.TextL,
        borderRadius: growsomeTheme.radius.radius3,
        minHeight: '3.5rem',
      };
    default: // medium
      return {
        padding: `${growsomeTheme.spacing.md} ${growsomeTheme.spacing.lg}`,
        fontSize: growsomeTheme.fontSize.TextM,
        borderRadius: growsomeTheme.radius.radius2,
        minHeight: '3rem',
      };
  }
};

const BaseButton = styled.button<ButtonProps>`
  /* Reset */
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  font-family: inherit;
  cursor: pointer;
  outline: none;

  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${growsomeTheme.spacing.sm};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  text-decoration: none;
  transition: all ${growsomeTheme.transition.normal};
  position: relative;
  white-space: nowrap;
  user-select: none;

  /* Sizing */
  ${props => {
    const sizing = getButtonSizing(props.$size);
    return `
      padding: ${sizing.padding};
      font-size: ${sizing.fontSize};
      border-radius: ${sizing.borderRadius};
      min-height: ${sizing.minHeight};
    `;
  }}

  /* Width */
  ${props => props.$width && `width: ${props.$width};`}

  /* Colors */
  ${props => {
    const colors = getButtonColors(props.$color, props.$variant);
    return `
      background-color: ${colors.background};
      color: ${colors.color};
      border: ${colors.border};
      
      &:hover:not(:disabled) {
        background-color: ${colors.hoverBackground};
        color: ${colors.hoverColor};
        transform: translateY(-1px);
        box-shadow: ${growsomeTheme.shadow.Elevation2};
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: ${growsomeTheme.shadow.Elevation1};
      }
    `;
  }}

  /* States */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  ${props => props.loading && `
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}

  /* Focus styles */
  &:focus-visible {
    outline: 2px solid ${growsomeTheme.color.Primary500};
    outline-offset: 2px;
  }
`;

// Specific Button Components
export const PrimaryButton = styled(BaseButton).attrs({ $color: 'primary', $variant: 'filled' })``;
export const SecondaryButton = styled(BaseButton).attrs({ $color: 'primary', $variant: 'outline' })``;
export const TertiaryButton = styled(BaseButton).attrs({ $color: 'primary', $variant: 'ghost' })``;
export const GreenButton = styled(BaseButton).attrs({ $color: 'green', $variant: 'filled' })``;
export const DangerButton = styled(BaseButton).attrs({ $color: 'danger', $variant: 'filled' })``;
export const TextButton = styled(BaseButton).attrs({ $variant: 'text' })``;

// Button Group
export const ButtonGroup = styled.div<{
  $orientation?: 'horizontal' | 'vertical';
  $gap?: keyof typeof growsomeTheme.spacing;
}>`
  display: flex;
  flex-direction: ${props => props.$orientation === 'vertical' ? 'column' : 'row'};
  gap: ${props => growsomeTheme.spacing[props.$gap || 'md']};
  
  @media ${growsomeTheme.device.mobile} {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

// Icon Button
export const IconButton = styled(BaseButton)<{
  $iconOnly?: boolean;
}>`
  ${props => props.$iconOnly && `
    padding: ${growsomeTheme.spacing.md};
    min-width: 3rem;
    min-height: 3rem;
    border-radius: ${growsomeTheme.radius.radius2};
  `}
`;

// 어두운 배경 전용 네온 그린 버튼 (#514FE4, #060D34 배경에서만 사용)
export const DarkBackgroundButton = styled(BaseButton)`
  background: ${growsomeTheme.color.Green500} !important; /* #06ff01 */
  color: ${growsomeTheme.color.Black800} !important; /* #080d34 */
  border: none !important;
  
  &:hover:not(:disabled) {
    background: ${growsomeTheme.color.Green600} !important; /* #05cc01 */
    color: ${growsomeTheme.color.Black800} !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(6, 255, 1, 0.3);
  }
  
  &:active:not(:disabled) {
    background: ${growsomeTheme.color.Green700} !important; /* #049901 */
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(6, 255, 1, 0.2);
  }
  
  &:focus-visible {
    outline: 2px solid ${growsomeTheme.color.Green500};
    outline-offset: 2px;
  }
`;

// 사용 예시를 위한 어두운 배경 컨테이너들
export const DarkPrimarySection = styled.div`
  background: ${growsomeTheme.color.Primary500}; /* #514FE4 */
  padding: ${growsomeTheme.spacing.xl};
  color: ${growsomeTheme.color.White};
`;

export const DarkBlackSection = styled.div`
  background: ${growsomeTheme.color.Black800}; /* #060D34 */
  padding: ${growsomeTheme.spacing.xl};
  color: ${growsomeTheme.color.White};
`;

// Floating Action Button
export const FloatingActionButton = styled(BaseButton)`
  position: fixed;
  bottom: ${growsomeTheme.spacing["2xl"]};
  right: ${growsomeTheme.spacing["2xl"]};
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${growsomeTheme.radius.full};
  box-shadow: ${growsomeTheme.shadow.Float2};
  z-index: 1000;
  
  &:hover {
    box-shadow: ${growsomeTheme.shadow.Float2};
    transform: scale(1.05);
  }
  
  @media ${growsomeTheme.device.mobile} {
    bottom: ${growsomeTheme.spacing.xl};
    right: ${growsomeTheme.spacing.xl};
  }
`;