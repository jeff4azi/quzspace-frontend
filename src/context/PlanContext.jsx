import { createContext, useContext, useState } from "react";
import { mockUser } from "../data/mockUser";

const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [userPlan, setUserPlan] = useState(mockUser.plan || "free");

  const togglePlan = () => {
    setUserPlan((prev) => (prev === "free" ? "premium" : "free"));
  };

  const isFree = userPlan === "free";
  const isPremium = userPlan === "premium";

  // Max quizzes per study space: 2 for Free plan, 5 for Pro/Premium plan
  const maxQuizzesLimit = isFree ? 2 : 5;

  return (
    <PlanContext.Provider
      value={{
        userPlan,
        setUserPlan,
        togglePlan,
        isFree,
        isPremium,
        maxQuizzesLimit,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
