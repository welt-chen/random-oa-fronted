import { useEffect } from "react";
import {
  LaborExtractionSection,
  type AllocationResult,
} from "@/components/labor/LaborExtractionSection";
import { useAuthStore } from "@/store/useAuthStore";

export default function LotteryPage() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleAllocationComplete = (_result: AllocationResult) => {
  };

  return (
    <div className="h-full p-6">
      <div className="space-y-4">
        <LaborExtractionSection
          onAllocationComplete={handleAllocationComplete}
        />
      </div>
    </div>
  );
}