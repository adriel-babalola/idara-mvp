export const theme = {
    colors: {
        primary: {
            50: '#f0f9ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8'
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        neutral: {
            50: '#fafafa',
            100: '#f4f4f5',
            800: '#27272a',
            900: '#18181b'
        }
    },
    spacing: {
        safe: {
            top: 'env(safe-area-inset-top)',
            bottom: 'env(safe-area-inset-bottom)'
        }
    },
    animations: {
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};
