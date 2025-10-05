
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
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Reduced timeout for quicker transitions

        return () => clearTimeout(timer);
    // We only want this to run on route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    return <PageLoader />;
}
