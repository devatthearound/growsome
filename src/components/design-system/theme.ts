// Growsome Design System - Adapted from TheAround Design System
// Brand Colors: #514fe4, #06ff01, #f2f5fa, #080d34

export const growsomeTheme = {
  color: {
    // Growsome Brand Colors
    Primary500: "#514fe4",
    Green500: "#06ff01", // 네온 그린 - 어두운 배경 전용
    Gray50: "#f2f5fa",
    Black800: "#080d34",
    
    // Supporting colors from TheAround system
    Primary600: "#4240c7",
    Primary700: "#362fb8",
    Primary400: "#6659e7",
    Primary300: "#8b82ea",
    Primary200: "#b1abf0",
    Primary100: "#d8d5f6",
    Primary50: "#F0F0FF",
    Primary25: "#F8F8FF",
    
    // Green colors - 컨텍스트별 사용
    Green600: "#05cc01", // 네온 그린 진한 버전 - 어두운 배경 전용
    Green700: "#049901", // 네온 그린 더 진한 버전 - 어두운 배경 전용
    Green400: "#39ff34", // 네온 그린 밝은 버전 - 어두운 배경 전용
    Green300: "#6cff67", // 네온 그린 더 밝은 버전 - 어두운 배경 전용
    
    // 흰색 배경용 Green 색상들
    GreenSafe500: "#22C55E", // 흰색 배경에서 사용할 안전한 그린
    GreenSafe600: "#16A34A", // 흰색 배경용 진한 그린
    GreenSafe700: "#15803D", // 흰색 배경용 더 진한 그린
    GreenSafe400: "#4ADE80", // 흰색 배경용 밝은 그린
    GreenSafe300: "#86EFAC", // 흰색 배경용 더 밝은 그린
    GreenSafe200: "#BBF7D0", // 흰색 배경용 연한 그린
    GreenSafe100: "#DCFCE7", // 흰색 배경용 더 연한 그린
    GreenSafe50: "#F0FDF4", // 흰색 배경용 가장 연한 그린
    
    Green200: "#C6F6D5",
    Green100: "#d9f7d9",
    Green50: "#F0FFF0",
    
    Gray100: "#e8ebf0",
    Gray200: "#d1d7e1",
    Gray300: "#b9c1d2",
    Gray400: "#a1abc3",
    Gray500: "#8a94b4",
    Gray600: "#7383a5",
    
    Black700: "#0a0f3a",
    Black600: "#0c1140",
    Black500: "#0e1346",
    
    White: "#FFFFFF",
    
    // Status colors
    Red500: "#F04438",
    Red400: "#F56565",
    Red300: "#FC8181",
    Red200: "#FEB2B2",
    Red100: "#FECACA",
    Red50: "#FEF2F2",
    Red600: "#E53E3E",
    
    Yellow500: "#E46A11",
    Yellow400: "#ED8936",
    Yellow300: "#F6AD55",
    Yellow200: "#FAD089",
    Yellow100: "#FDE5B8",
    Yellow50: "#FFFBF0",
    
    Blue500: "#3182CE",
    Blue600: "#2B77CB",
    Blue400: "#4299E1",
    Blue300: "#63B3ED",
    Blue200: "#90CDF4",
    Blue100: "#BEE3F8",
    Blue50: "#EBF8FF",
    
    Orange500: "#FF6B35",
    Orange600: "#E55A2B",
    Orange400: "#FF8A5B",
    Orange300: "#FFA981",
    Orange200: "#FFC8A7",
    Orange100: "#FFE7CD",
    Orange50: "#FFF6F0",
    customPurple: "#443fcf",
  },
  fontSize: {
    TextXS: "1.0rem",
    TextS: "1.2rem", 
    TextM: "1.4rem",
    TextL: "1.6rem",
    TextXL: "1.8rem",
    DisplayXS: "1.8rem",
    DisplayS: "2.0rem",
    DisplayM: "2.4rem",
    DisplayL: "3.2rem",
    DisplayXL: "4.0rem",
    DisplayXXL: "4.8rem",
  },
  fontWeight: {
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
  },
  radius: {
    radius1: "0.4rem",
    radius2: "0.8rem", 
    radius3: "1.2rem",
    radius4: "1.6rem",
    radius5: "2.0rem",
    full: "9999px",
  },
  shadow: {
    Float1: "0px 4px 12px rgba(0, 0, 0, 0.16), 4px 4px 28px rgba(0, 0, 0, 0.08)",
    Float2: "0px 8px 24px rgba(0, 0, 0, 0.2), 8px 8px 32px rgba(0, 0, 0, 0.12)",
    Elevation1: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    Elevation2: "0px 4px 16px rgba(0, 0, 0, 0.15)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
  },
  device: {
    mobile: "screen and (max-width: 767px)",
    tablet: "screen and (min-width: 768px) and (max-width: 1023px)",
    pc: "screen and (min-width: 1024px)",
    wide: "screen and (min-width: 1440px)",
  },
  transition: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
  
  // 배경별 버튼 색상 헬퍼 함수
  getButtonColorForBackground: (backgroundColor: string) => {
    // 어두운 브랜드 배경인지 확인
    const isDarkBrandBackground = 
      backgroundColor === "#514FE4" || 
      backgroundColor === "#514fe4" ||
      backgroundColor === "#060D34" ||
      backgroundColor === "#060d34";
    
    if (isDarkBrandBackground) {
      // 어두운 브랜드 배경: 네온 그린 사용
      return {
        main: "#06ff01",
        hover: "#05cc01",
        active: "#049901",
        text: "#080d34"
      };
    } else {
      // 흰색 배경 포함 나머지: Primary 색상 사용
      return {
        main: "#514fe4",
        hover: "#4240c7",
        active: "#362fb8",
        text: "#FFFFFF"
      };
    }
  }
};