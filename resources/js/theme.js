import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#287411', // Bamboo Green
            light: '#3da11a',
            dark: '#1e5a0d',
            contrastText: '#fff',
        },
        secondary: {
            main: '#0B4FD1', // Action Blue
            light: '#3c7be3',
            dark: '#0841ad',
            contrastText: '#fff',
        },
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
        info: {
            main: '#3b82f6',
        },
        success: {
            main: '#287411',
        },
        background: {
            default: '#FFFFFF',
            paper: '#ffffff',
        },
        text: {
            primary: '#48413F', // Muted Cocoa
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 700,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 700,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 700,
        },
        body1: {
            fontSize: '0.9375rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontWeight: 700,
                },
                outlined: {
                    borderWidth: 1,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                },
            },
        },
    },
});

export default theme;
