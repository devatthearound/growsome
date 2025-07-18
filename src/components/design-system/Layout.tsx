import styled from 'styled-components';
import { growsomeTheme } from './theme';

// Layout Components based on TheAround Design System

export interface BoxProps {
  $display?: 'block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'inline' | 'inline-block' | 'none';
  $fd?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  $jc?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  $ai?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  $gap?: number | string;
  $pd?: string;
  $mg?: string;
  $bg?: string;
  $wd?: string;
  $hg?: string;
  $br?: string;
  $f?: number;
  $fg?: number;
  $fs?: number;
  $fb?: string;
  $position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  $top?: string;
  $right?: string;
  $bottom?: string;
  $left?: string;
  $zIndex?: number;
  $overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  
  // Component props (not prefixed with $)
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Box = styled.div<BoxProps>`
  position: ${props => props.$position || 'relative'};
  display: ${props => props.$display || 'block'};
  
  ${props => props.$display === 'flex' || props.$display === 'inline-flex' ? `
    flex-direction: ${props.$fd || 'row'};
    justify-content: ${props.$jc || 'flex-start'};
    align-items: ${props.$ai || 'flex-start'};
  ` : ''}
  
  ${props => props.$gap && `gap: ${typeof props.$gap === 'number' ? `${props.$gap}rem` : props.$gap};`}
  ${props => props.$pd && `padding: ${props.$pd};`}
  ${props => props.$mg && `margin: ${props.$mg};`}
  ${props => props.$bg && `background-color: ${props.$bg};`}
  ${props => props.$wd && `width: ${props.$wd};`}
  ${props => props.$hg && `height: ${props.$hg};`}
  ${props => props.$br && `border-radius: ${props.$br};`}
  ${props => props.$f && `flex: ${props.$f};`}
  ${props => props.$fg && `flex-grow: ${props.$fg};`}
  ${props => props.$fs && `flex-shrink: ${props.$fs};`}
  ${props => props.$fb && `flex-basis: ${props.$fb};`}
  ${props => props.$top && `top: ${props.$top};`}
  ${props => props.$right && `right: ${props.$right};`}
  ${props => props.$bottom && `bottom: ${props.$bottom};`}
  ${props => props.$left && `left: ${props.$left};`}
  ${props => props.$zIndex && `z-index: ${props.$zIndex};`}
  ${props => props.$overflow && `overflow: ${props.$overflow};`}
`;

export const RowBox = styled(Box)`
  display: flex;
  flex-direction: row;
`;

export const ColumnBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

// Specialized Layout Components
export const Container = styled(Box)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    padding: 0 ${growsomeTheme.spacing.md};
  }
`;

export const Section = styled(Box)`
  width: 100%;
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["3xl"]} 0;
  }
`;

export const Card = styled(Box)`
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius3};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  padding: ${growsomeTheme.spacing.xl};
  transition: all ${growsomeTheme.transition.normal};
  
  &:hover {
    box-shadow: ${growsomeTheme.shadow.Float1};
    transform: translateY(-2px);
  }
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg};
  }
`;

export const Grid = styled(Box)<{
  $columns?: number;
  $minColumnWidth?: string;
  $columnGap?: string;
  $rowGap?: string;
}>`
  display: grid;
  grid-template-columns: ${props => 
    props.$columns 
      ? `repeat(${props.$columns}, 1fr)` 
      : `repeat(auto-fit, minmax(${props.$minColumnWidth || '300px'}, 1fr))`
  };
  gap: ${props => props.$rowGap || growsomeTheme.spacing.xl} ${props => props.$columnGap || growsomeTheme.spacing.xl};
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
    gap: ${growsomeTheme.spacing.lg};
  }
`;

// Special Layout Utilities
export const Spacer = styled.div<{$size?: keyof typeof growsomeTheme.spacing}>`
  width: 100%;
  height: ${props => growsomeTheme.spacing[props.$size || 'md']};
`;

export const Divider = styled.hr<{
  $orientation?: 'horizontal' | 'vertical';
  $color?: string;
  $thickness?: string;
}>`
  border: none;
  background-color: ${props => props.$color || growsomeTheme.color.Gray200};
  
  ${props => props.$orientation === 'vertical' ? `
    width: ${props.$thickness || '1px'};
    height: 100%;
  ` : `
    width: 100%;
    height: ${props.$thickness || '1px'};
  `}
  
  margin: 0;
`;

export const Flex = styled(Box)`
  display: flex;
`;

export const FlexItem = styled(Box)<{
  $grow?: number;
  $shrink?: number;
  $basis?: string;
}>`
  flex-grow: ${props => props.$grow || 0};
  flex-shrink: ${props => props.$shrink || 1};
  flex-basis: ${props => props.$basis || 'auto'};
`;