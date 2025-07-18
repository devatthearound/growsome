// Growsome Design System - Main Export File
// Re-exports all components with Growsome brand colors

// Theme
export { growsomeTheme } from './theme';

// Typography
export { Typography } from './Typography';

// Layout
export {
  Box,
  RowBox,
  ColumnBox,
  Container,
  Section,
  Card,
  Grid,
  Spacer,
  Divider,
  Flex,
  FlexItem,
  type BoxProps,
} from './Layout';

// Buttons
export {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  GreenButton,
  DangerButton,
  TextButton,
  ButtonGroup,
  IconButton,
  FloatingActionButton,
  type ButtonProps,
} from './Button';

// Usage Examples and Documentation
export const designSystemInfo = {
  brandColors: {
    primary: '#514fe4', // Purple - Main brand color
    green: '#06ff01',   // Bright green - Accent color  
    background: '#f2f5fa', // Light blue-gray - Background
    text: '#080d34',    // Dark blue - Text color
  },
  usage: {
    typography: `
      // Usage example:
      import { Typography } from '@/components/design-system';
      
      <Typography.DisplayL600 color="#514fe4">
        Main Heading
      </Typography.DisplayL600>
      
      <Typography.TextM400>
        Body text content
      </Typography.TextM400>
    `,
    layout: `
      // Usage example:
      import { ColumnBox, RowBox, Card, Container } from '@/components/design-system';
      
      <Container>
        <ColumnBox gap={2} ai="center">
          <Card>
            <RowBox jc="space-between" ai="center">
              Content here
            </RowBox>
          </Card>
        </ColumnBox>
      </Container>
    `,
    buttons: `
      // Usage example:
      import { PrimaryButton, GreenButton, ButtonGroup } from '@/components/design-system';
      
      <ButtonGroup>
        <PrimaryButton onClick={handleClick}>
          Primary Action
        </PrimaryButton>
        <GreenButton size="large">
          Success Action
        </GreenButton>
      </ButtonGroup>
    `,
  },
  principles: [
    'Consistent spacing using theme values',
    'Accessible color contrasts with brand colors',
    'Mobile-first responsive design',
    'TypeScript support for better DX',
    'Based on proven TheAround Design System patterns',
  ],
};