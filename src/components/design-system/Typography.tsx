import styled from 'styled-components';
import { growsomeTheme } from './theme';

// Typography Components based on TheAround Design System
export const Typography = {
  // Display Typography (Headers)
  DisplayXXL700: styled.h1<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayXXL};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    line-height: ${growsomeTheme.lineHeight.tight};
    letter-spacing: ${growsomeTheme.letterSpacing.tighter};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayXL700: styled.h1<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayXL};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    line-height: ${growsomeTheme.lineHeight.tight};
    letter-spacing: ${growsomeTheme.letterSpacing.tight};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayL700: styled.h1<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayL};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    line-height: ${growsomeTheme.lineHeight.tight};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayL600: styled.h2<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayL};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayL500: styled.h2<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayL};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayM700: styled.h2<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayM};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayM600: styled.h3<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayM};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayS600: styled.h4<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayS};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayS500: styled.h4<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayS};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  DisplayXS600: styled.h5<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.DisplayXS};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black800};
    margin: 0;
  `,
  
  // Text Typography (Body text)
  TextXL500: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextXL};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.relaxed};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextL700: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextL};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    line-height: ${growsomeTheme.lineHeight.relaxed};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextL600: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextL};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.relaxed};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextL500: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextL};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.relaxed};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextL400: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextL};
    font-weight: ${growsomeTheme.fontWeight.Regular};
    line-height: ${growsomeTheme.lineHeight.relaxed};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextM700: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextM};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextM600: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextM};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextM500: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextM};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextM400: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextM};
    font-weight: ${growsomeTheme.fontWeight.Regular};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextS600: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextS};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextS500: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextS};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextS400: styled.p<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextS};
    font-weight: ${growsomeTheme.fontWeight.Regular};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextXS600: styled.span<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextXS};
    font-weight: ${growsomeTheme.fontWeight.SemiBold};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextXS500: styled.span<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextXS};
    font-weight: ${growsomeTheme.fontWeight.Medium};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
  TextXS400: styled.span<{color?: string}>`
    font-size: ${growsomeTheme.fontSize.TextXS};
    font-weight: ${growsomeTheme.fontWeight.Regular};
    line-height: ${growsomeTheme.lineHeight.normal};
    color: ${props => props.color || growsomeTheme.color.Black700};
    margin: 0;
  `,
};