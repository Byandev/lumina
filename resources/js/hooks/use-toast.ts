import { toast as sonnerToast } from 'sonner';

export function useToast() {
    const showSuccess = (title: string, description?: string) => {
        sonnerToast.success(title, {
            description,
            className: 'bg-green-50 border-green-200 text-green-900 border',
            duration: 4000,
        });
    };

    const showError = (title: string, description?: string) => {
        sonnerToast.error(title, {
            description,
            className: 'bg-red-50 border-red-200 text-red-900 border',
            duration: 6000,
        });
    };

    const showWarning = (title: string, description?: string) => {
        sonnerToast.warning(title, {
            description,
            className: 'bg-yellow-50 border-yellow-200 text-yellow-900 border',
            duration: 5000,
        });
    };

    const showInfo = (title: string, description?: string) => {
        sonnerToast.info(title, {
            description,
            className: 'bg-blue-50 border-blue-200 text-blue-900 border',
            duration: 4000,
        });
    };

    return {
        toast: sonnerToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}

// Or simpler version if you prefer:
export function useSimpleToast() {
    return {
        showSuccess: (title: string, description?: string) =>
            sonnerToast.success(title, { description }),
        showError: (title: string, description?: string) =>
            sonnerToast.error(title, { description }),
        showWarning: (title: string, description?: string) =>
            sonnerToast.warning(title, { description }),
        showInfo: (title: string, description?: string) =>
            sonnerToast.info(title, { description }),
    };
}
