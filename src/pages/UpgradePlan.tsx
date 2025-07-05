import React, { useState } from "react";


type PlanTier = "Basic" | "Premium";

interface Plan {
  tier: PlanTier;
  billing: "Monthly" | "Yearly";
}

const UpgradePlan: React.FC = () => {
  // This should come from user context or API
  const currentPlan: Plan = {
    tier: "Premium", // Change to "Basic" or "Premium"
    billing: "Monthly", // Change to "Monthly" or "Yearly"
  };

  const [showYearly, setShowYearly] = useState(false);

  const plans = [
    {
      tier: "Basic" as PlanTier,
      name: "Basic Assistant",
      monthlyPrice: "$19.99/mo",
      yearlyPrice: "$215.89/yr",
      yearlyOriginal: "$239.88",
      features: [
        "Unlimited messages",
        "Unlimited access to GPT‑4o, OpenAI o4-mini",
        "Email/Outlook integration",
        "Google Calendar",
        "Task management tools",
        "Notes",
        "Reminders",
      ],
      links: {
        monthly: "https://buy.stripe.com/basic-monthly-link",
        yearly: "https://buy.stripe.com/basic-yearly-link",
      },
    },
    {
      tier: "Premium" as PlanTier,
      name: "Premium Assistant",
      monthlyPrice: "$49.99/mo",
      yearlyPrice: "$539.98/yr",
      yearlyOriginal: "$599.88",
      features: [
        "All features of Basic Assistant",
        "Personalized AI assistant",
        "Workflows & automations",
        "Long-term memory",
        "Full access to all LLM models",
      ],
      links: {
        monthly: "https://buy.stripe.com/fZu00jeh3gzieEm1XdafS02",
        yearly: "https://buy.stripe.com/8x2dR96OBaaU2VE7hxafS03",
      },
    },
  ];

  const renderPlanCard = (plan: typeof plans[number]) => {
    const isCurrent =
      plan.tier === currentPlan.tier &&
      ((showYearly && currentPlan.billing === "Yearly") ||
        (!showYearly && currentPlan.billing === "Monthly"));

    const isDowngrade =
      currentPlan.tier === "Premium" && plan.tier === "Basic";

    return (
      <div
        key={plan.tier}
        className={`flex flex-col rounded-xl p-6 border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 relative shadow-sm ${
          isCurrent ? "border-2 border-blue-400 dark:border-blue-500 shadow-md" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {isCurrent && (
          <span className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-2">
            Current Plan
          </span>
        )}

        <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>

        {!isCurrent &&
          plan.tier === "Premium" &&
          !(isDowngrade && showYearly) && (
            <span className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-full">
              Best Value
            </span>
          )}

        {!isCurrent &&
          plan.tier === "Basic" &&
          showYearly &&
          !isCurrent && (
            <span className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-full">
              Save 10%
            </span>
          )}

        <div className="flex flex-col items-center mb-4">
          {showYearly ? (
            <>
              <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                {plan.yearlyOriginal}
              </span>
              <span
                className={`text-4xl font-bold ${
                  plan.tier === "Premium" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {plan.yearlyPrice}
              </span>
            </>
          ) : (
            <span
              className={`text-4xl font-bold ${
                plan.tier === "Premium" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {plan.monthlyPrice}
            </span>
          )}
        </div>

        <ul className="text-sm space-y-2 mb-6 text-left flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <span
                className={`mr-2 ${
                  plan.tier === "Premium" ? "text-green-500 dark:text-green-400" : "text-blue-400 dark:text-blue-300"
                }`}
              >
                {plan.tier === "Premium" ? "✓" : "•"}
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {isCurrent ? (
          <button className="block text-center w-full py-2 rounded-lg font-medium text-sm bg-blue-600 dark:bg-blue-500 text-white cursor-default">
            Current Plan
          </button>
        ) : (
          <a
            href={showYearly ? plan.links.yearly : plan.links.monthly}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full py-2 rounded-lg font-medium text-sm bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600"
          >
            {isDowngrade
              ? `Switch to ${plan.name} (${showYearly ? "Yearly" : "Monthly"})`
              : `Upgrade to ${plan.name} (${showYearly ? "Yearly" : "Monthly"})`}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
       
        
        <h2 className="text-4xl font-bold mb-4">Upgrade Your Plan</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Unlock more features and get the most out of Remo AI by upgrading your plan.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            <div className="relative group">
              <button
                onClick={() => setShowYearly(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  !showYearly
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                Monthly
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Monthly billing
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setShowYearly(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  showYearly
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Save 10%
                </span>
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Yearly billing (Save 10%)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map(renderPlanCard)}
        </div>

        <div className="mt-12 text-gray-400 dark:text-gray-500 text-sm">
          Have questions about upgrading?{" "}
          <a href="mailto:hello@hireremo.com" className="text-blue-600 dark:text-blue-400 underline">
            Contact support
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
