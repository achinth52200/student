
"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoader } from '@/hooks/use-loader';
import { PageLoader } from './page-loader';
import { PageTransitionSpinner } from './page-transition-spinner';

export function PageTransitionLoader() {
    const { setIsLoading } = useLoader();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        // Setting a timeout to show the loader for 5 seconds.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); 

        return () => clearTimeout(timer);
    // We only want this to run on route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    return <PageLoader loaderComponent={<PageTransitionSpinner />} />;
}
