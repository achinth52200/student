
"use client";

import { useLoader } from "@/hooks/use-loader";
import { CustomLoader } from "./custom-loader";

export function PageLoader({ loaderComponent }: { loaderComponent?: React.ReactNode }) {
  const { isLoading } = useLoader();

  if (!isLoading) {
    return null;
  }

  return loaderComponent || <CustomLoader />;
}
