
"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoader } from '@/hooks/use-loader';
import { PageLoader } from './page-loader';

export function PageTransitionLoader() {
    const { setIsLoading } = useLoader();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        // Setting a timeout of 0 allows the state to update and the browser to render
        // before we turn it off. This ensures the loader appears for a micro-task,
        // giving the perception of an instant transition while still allowing
        // the loader to handle slower page loads if needed.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 0); 

        return () => clearTimeout(timer);
    // We only want this to run on route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    return <PageLoader />;
}
