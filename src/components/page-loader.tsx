
"use client";

import { useLoader } from "@/hooks/use-loader";
import { CustomLoader } from "./custom-loader";

export function PageLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) {
    return null;
  }

  return <CustomLoader />;
}
