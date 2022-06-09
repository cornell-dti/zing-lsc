import { createTheme } from '@mui/material'
import { montserratFont } from '@core/Constants/Typography'

// old colors
export const colors = {
  mediumviolet: '#C794EE',
  verylightviolet: '#FCFAFF',
  black: '#222222',
  white: '#FFFFFF',
  lightpurple: '#FBF9FF',
  darkpurple: '#CE9EF2',
  lightviolet: '#E5CEFA',
  paleviolet: '#F7EDFF',
  red: '#FF6584',
  lightyellow: '#F6F9DA',
  yellow: '#FFFFB1',
  darkyellow: '#F9E21B',
  verylightgreen: '#F0F9F4',
  lightgreen: '#CEF5D6',
  darkgreen: '#157E2C',
  darkgray: '#5C5B6A',
}

// module augmentation, needed for TypeScript
declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary']
  }
  interface PaletteOptions {
    purple: PaletteOptions['primary']
  }
  interface Palette {
    essentials: Palette['primary']
  }
  interface PaletteOptions {
    essentials: PaletteOptions['primary']
  }
  interface Palette {
    green: Palette['primary']
  }
  interface PaletteOptions {
    green: PaletteOptions['primary']
  }
  interface PaletteColor {
    120?: string
    100?: string
    75?: string
    50?: string
    30?: string
    25?: string
    12?: string
    16?: string
    6?: string
  }
  interface SimplePaletteColorOptions {
    120?: string
    100?: string
    75?: string
    50?: string
    30?: string
    25?: string
    16?: string
    12?: string
    6?: string
  }
}

// constants for colors in the case where theme is not accessible:
export const purple = {
  120: '#6D52AF',
  100: '#815ED4',
  75: '#A186DF',
  50: '#C0AEEA',
  30: '#D9CFF2',
  25: '#DFD7F4',
  16: '#EBE5F8',
  12: '#F0ECFA',
}

export const essentials = {
  100: '#2F2E41',
  75: '#5C5B6A',
  50: '#898992',
  25: '#B8B7BC',
  12: '#DBDBDD',
  6: '#EDEDEE',
}

export const themeFont = 'Montserrat, Arial, sans-serif'

// https://www.figma.com/file/5sae0s8rk6r9iVwpn74RY4/Zing-Components?node-id=804%3A10807
// can pick the different colors with sx (e.g. color: 'purple.120')
// essentials is all the blacks (white is located within "common")
// this theme statement defines all of the colors
let theme = createTheme({
  palette: {
    essentials: {
      main: '#2F2E41',
      100: '#2F2E41',
      75: '#5C5B6A',
      50: '#898992',
      25: '#B8B7BC',
      12: '#DBDBDD',
      6: '#EDEDEE',
    },
    purple: {
      main: '#815ED4',
      120: '#6D52AF',
      100: '#815ED4',
      75: '#A186DF',
      50: '#C0AEEA',
      30: '#D9CFF2',
      25: '#DFD7F4',
      16: '#EBE5F8',
      12: '#F0ECFA',
    },
    green: {
      main: '#157E2C',
      120: '#55705B',
      100: '#157E2C',
      50: '#CEF5D6',
      6: '#F0F9F4',
    },
    primary: {
      main: '#815ED4',
      light: '#A186DF',
      dark: '#6D52AF',
    },
    error: {
      main: '#FF6584',
      light: '#FFE2E8',
      dark: '#EE7F7F',
    },
    info: {
      main: '#F9E21B',
      light: '#F6F9DA',
    },
    success: {
      main: '#157E2C',
      light: '#CEF5D6',
    },
  },
  typography: {
    fontFamily: themeFont,
    fontWeightMedium: 600,
  },
})

// this defines everything else
theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      // inject font face in to CSS
      styleOverrides: `
      @font-face {
        font-family: ${montserratFont.fontFamily};
        font-style: ${montserratFont.fontStyle};
        font-display: ${montserratFont.fontDisplay};
        font-weight: ${montserratFont.fontWeight};
        src: ${montserratFont.src};
      }
    `,
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: themeFont,
      },
    },
    MuiButton: {
      defaultProps: {
        // make the default contained
        variant: 'contained',
      },
      styleOverrides: {
        // for all buttons
        root: {
          fontFamily: themeFont,
          fontWeight: 600,
          borderRadius: 40,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 6,
          paddingTop: 6,
          textTransform: 'initial',
          fontSize: '1.1rem',
        },
        sizeSmall: {
          fontSize: '0.85rem',
        },
        containedPrimary: {
          backgroundColor: theme.palette.purple.main,
          color: theme.palette.common.white,
          '&.Mui-disabled': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.essentials[25],
          },
        },
        outlinedSecondary: {
          borderColor: theme.palette.purple[100],
          backgroundColor: theme.palette.common.white,
          color: theme.palette.purple[100],
          '&:hover': {
            backgroundColor: theme.palette.essentials[6],
            borderColor: theme.palette.purple[100],
          },
          '&.Mui-disabled': {
            color: theme.palette.essentials[50],
            backgroundColor: theme.palette.essentials[25],
            borderColor: theme.palette.essentials[50],
          },
        },
        // textPrimary: {
        //   color: theme.palette.purple[50],
        // },
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
        size: 'large',
      },
      styleOverrides: {
        colorPrimary: {
          // need this otherwise width gets messed up if in line with other bordered buttons
          border: `1px solid transparent`,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: theme.palette.purple[120],
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.essentials[25],
            color: theme.palette.common.white,
          },
        },
        colorSecondary: {
          border: `1px solid ${theme.palette.primary.main}`,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.essentials[6],
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-disabled': {
            color: theme.palette.essentials[50],
            backgroundColor: theme.palette.essentials[25],
            borderColor: theme.palette.essentials[50],
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        colorPrimary: {
          color: theme.palette.primary.main,
        },
        colorSecondary: {
          color: theme.palette.essentials[50],
          '&.Mui-checked': {
            color: theme.palette.essentials[50],
          },
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        PaperProps: {
          sx: { borderRadius: '10px' }, // For some reason this does not work in styleOverrides
        },
      },
      styleOverrides: {
        list: {
          '& .MuiMenuItem-root': {
            '&:hover': {
              backgroundColor: theme.palette.purple[16],
            },
          },
        },
        paper: {
          marginTop: '4px',
        },
      },
    },
  },
})

export default theme
