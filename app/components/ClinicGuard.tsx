// components/ClinicGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveClinicId } from "@/lib/activeClinic";

export default function ClinicGuard() {
  const router = useRouter();

  useEffect(() => {
    const clinicId = getActiveClinicId();
    if (!clinicId) {
      router.replace("/dashboard/clinics");
    }
  }, [router]);

  return null;
}
