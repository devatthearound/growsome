import "styled-components";

export interface DefaultTheme {
    color: {
        Primary50: string;
        Primary100: string;
        Primary200: string;
        Primary300: string;
        Primary400: string;
        Primary500: string;
        Primary600: string;
        Primary700: string;
        Primary800: string;
        Primary900: string;

        Green50: string;
        Green100: string;
        Green200: string;
        Green300: string;
        Green400: string;
        Green500: string;
        Green600: string;
        Green700: string;
        Green800: string;
        Green900: string;

        Red50: string;
        Red100: string;
        Red200: string;
        Red300: string;
        Red400: string;
        Red500: string;
        Red600: string;
        Red700: string;
        Red800: string;
        Red900: string;

        Yellow50: string;
        Yellow100: string;
        Yellow200: string;
        Yellow300: string;
        Yellow400: string;
        Yellow500: string;
        Yellow600: string;
        Yellow700: string;
        Yellow800: string;
        Yellow900: string;

        Blue50: string;
        Blue100: string;
        Blue200: string;
        Blue300: string;
        Blue400: string;
        Blue500: string;
        Blue600: string;
        Blue700: string;
        Blue800: string;
        Blue900: string;

        Black500: string;
        Black600: string;
        Black700: string;
        Black800: string;
        Black900: string;

        Gray25: string;
        Gray50: string;
        Gray100: string;
        Gray200: string;
        Gray300: string;
        Gray400: string;

        White: string;


        B0 : string;
        BB900: string;
        BB800: string;
        BB700: string;
        BB600: string;
        BB500: string;
        BB400: string;
        BB300: string;
        BB200: string;
        BB100: string;
        BB50: string;
        BP500: string;
        BP400: string;
        BP300: string;
        BP200: string;
        BP100: string;
        BS500: string;
        BS400: string;
        BS300: string;
        BS200: string;
        BS100: string;
        BPP500: string;
        BPP400: string;
        BPP300: string;
        BPP200: string;
        BPP100: string;
        BG200: string;
        BG100: string;
        R500: string;
        R400: string;
        R300: string;
        R200: string;
        R100: string;
        R75: string;
        R50: string;
        Y500: string;
        Y400: string;
        Y300: string;
        Y200: string;
        Y100: string;
        Y75: string;
        Y50: string;
        G500: string;
        G400: string;
        G300: string;
        G200: string;
        G100: string;
        G75: string;
        G50: string;
        T500: string;
        T400: string;
        T300: string;
        T200: string;
        T100: string;
        T75: string;
        T50: string;
        B500: string;
        B400: string;
        B300: string;
        B200: string;
        B100: string;
        B75: string;
        B50: string;
        P500: string;
        P400: string;
        P300: string;
        P200: string;
        P100: string;
        P75: string;
        P50: string;


        N900: string;
        N800: string;
        N700: string;
        N600: string;
        N500: string;
        N400: string;
        N300: string;
        N200: string;
        N100: string;
        N90: string;
        N80: string;
        N70: string;
        N60: string;
        N50: string;
        N40: string;
        N30: string;
        N20: string;
        N10: string;
        N0: string;
        N900A: string;
        N800A: string;
        N700A: string;
        N600A: string;
        N500A: string;
        N400A: string;
        N300A: string;
        N200A: string;
        N100A: string;
        N90A: string;
        N80A: string;
        N70A: string;
        N60A: string;
        N50A: string;
        N40A: string;
        N30A: string;
        N20A: string;
        N10A: string;
    },
    fontSize: {
        TextXS: string;
        TextS: string;
        TextM: string;
        TextL: string;
        DisplayXS: string;
        DisplayS: string;
        DisplayM: string;
        DisplayL: string;
        DisplayXLL: string;
    },
    svgColor: {
        main: string;
        grayscale500: string;
        primary800: string;
        N50: string;
        N100: string;
        N500: string;
        N900: string;
        B300: string;
        N80: string;
        N0: string;
        N60: string;
        BB500: string;
    },
    fontWeight: {
        Bold: number;
        SemiBold: number;
        Medium: number;
        Regular: number;
    },
    shadow: {
        Float1: string;
    },
    textMarginTop:{
        high: number;
        normal: number;
        low: number;
    },
    lineHeight: {
        high: number;
        normal: number;
        low: number;
    },
    letterSpacing: {
        wide: number;
        normal: number;
        narrow: number;
    },
    radius: {
        radius1: string,
        radius2: string,
        radius3: string,
        radius4: string,
    },
    device: {
        smMoblie: string,
        mobile: string,
        tablet: string,
        pc: string,
        moblie_pc: string
    }
}