import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function FlashHandler() {
    const { props } = usePage() as any;

    useEffect(() => {

        const flash = props.flash || {};

        if (flash.success) {
            console.log('FlashHandler: Showing success toast:', flash.success);
            toast.success(flash.success);
        }
        if (flash.error) {
            console.log('FlashHandler: Showing error toast:', flash.error);
            toast.error(flash.error);
        }
        if (flash.warning) {
            console.log('FlashHandler: Showing warning toast:', flash.warning);
            toast.warning(flash.warning);
        }
        if (flash.info) {
            console.log('FlashHandler: Showing info toast:', flash.info);
            toast.info(flash.info);
        }
    }, [props.flash]);

    return null;
}
