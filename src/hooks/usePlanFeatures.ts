import { useGetCurrentUserEstablishment } from "@/services/establishments/queries";
import { useGetSubscriptionsPlans } from "@/services/subscriptions/queries";

export function usePlanFeatures() {
  const { data: establishment } = useGetCurrentUserEstablishment();
  const { data: plans } = useGetSubscriptionsPlans();

  const currentPlan = plans?.find((p) => p.id === establishment?.planID);

  const isSoloPlan = currentPlan?.name === "Solo";
  const isFreeOrSolo = isSoloPlan || currentPlan?.price === 0;

  return {
    // Plan details
    planName: currentPlan?.name,
    planPrice: currentPlan?.price ?? 0,
    maxWorkers: currentPlan?.maxWorkers ?? 1,
    
    // Features
    hasPublicStorefront: currentPlan?.hasPublicStorefront ?? false,
    canInviteWorkers: (currentPlan?.maxWorkers ?? 0) > 1,
    
    // Plan checks
    isSoloPlan,
    isFreeOrSolo,
    isStarterOrAbove: !isSoloPlan && (currentPlan?.maxWorkers ?? 0) >= 2,
    
    // Loading states
    isLoading: !establishment || !plans,
    currentPlan,
  };
}
