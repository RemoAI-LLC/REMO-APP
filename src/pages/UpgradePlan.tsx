import React, { useState } from "react";
import { useAccess } from "../context/AccessContext";

type BillingOption = "monthly" | "yearly";

interface Plan {
  title: string;
  description: string;
  popular?: boolean;
  billing: {
    monthly: {
      price: string;
      features: string[];
      button: string;
      link: string;
    };
    yearly: {
      price: string;
      original: string;
      features: string[];
      button: string;
      link: string;
    };
  };
}

const UpgradePlan: React.FC = () => {
  const [billing, setBilling] = useState<BillingOption>("monthly");
  const { subscription } = useAccess();

  const plans: Plan[] = [
    {
      title: "Basic",
      description: "Best for growing startups and growth companies",
      popular: true,
      billing: {
        monthly: {
          price: "$19.99",
          features: [
            "Everything in EarlyBird",
            "Personalized AI assistant",
            "Workflows & automations",
            "Long-term memory",
            "Full access to all LLM models",
          ],
          button: "Upgrade to Basic",
          link: "https://buy.stripe.com/cNi9AT4Gt2Is53McBRafS00",
        },
        yearly: {
          price: "$215.89",
          original: "$239.88",
          features: [
            "Everything in EarlyBird",
            "Personalized AI assistant",
            "Workflows & automations",
            "Long-term memory",
            "Full access to all LLM models",
          ],
          button: "Upgrade to Basic",
          link: "https://buy.stripe.com/cNi9AT4Gt2Is53McBRafS00",
        },
      },
    },
    {
      title: "Professional",
      description: "Best for large companies and teams requiring high security",
      billing: {
        monthly: {
          price: "$49.99",
          features: [
            "Everything in Basic",
            "Advanced security features",
            "Priority support",
            "Custom integrations",
            "Dedicated account manager",
          ],
          button: "Upgrade to Professional",
          link: "https://buy.stripe.com/fZu00jeh3gzieEm1XdafS02",
        },
        yearly: {
          price: "$539.98",
          original: "$599.88",
          features: [
            "Everything in Basic",
            "Advanced security features",
            "Priority support",
            "Custom integrations",
            "Dedicated account manager",
          ],
          button: "Upgrade to Professional",
          link: "https://buy.stripe.com/8x2dR96OBaaU2VE7hxafS03",
        },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
          Upgrade Your Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mb-8 sm:mb-12 px-4">
          Unlock more features and get the most out of Remo AI by upgrading your plan.
        </p>

        {/* Current Plan Status */}
        {subscription && (
          <div className="mb-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
            <div className="text-sm sm:text-base text-blue-800 dark:text-blue-200">
              <strong>Current Plan:</strong> {subscription.type}
            </div>
            <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-1">
              Status: {subscription.status}
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-full p-0.5 flex items-center">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-white dark:bg-white text-gray-900 dark:text-gray-900 shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 ${
                billing === "yearly"
                  ? "bg-white dark:bg-white text-gray-900 dark:text-gray-900 shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Yearly
              <span className="text-xs bg-green-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                Save 10%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const details = plan.billing[billing];
            const isPopular = plan.popular;
            const isCurrentPlan = subscription?.type?.includes(plan.title);

            return (
              <div
                key={plan.title}
                className={`relative bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border transition-all duration-500 hover:scale-105 group ${
                  isCurrentPlan
                    ? "border-blue-500 dark:border-blue-400 shadow-lg"
                    : "border-gray-200/50 dark:border-gray-700/50 hover:border-gray-400/50 dark:hover:border-white/30"
                }`}
                style={{
                  boxShadow: isCurrentPlan 
                    ? "0 0 20px rgba(59, 130, 246, 0.2)" 
                    : "0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentPlan) {
                    const isDark = document.documentElement.classList.contains('dark');
                    if (isDark) {
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 255, 255, 0.15), 0 0 60px rgba(255, 255, 255, 0.1)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.2), 0 0 60px rgba(0, 0, 0, 0.1)";
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentPlan) {
                    const isDark = document.documentElement.classList.contains('dark');
                    if (isDark) {
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.05)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.05)";
                    }
                  }
                }}
              >
                {/* Card content wrapper */}
                <div className="relative z-10">
                  {isPopular && (
                    <div className="absolute top-[-46px] left-1/2 transform -translate-x-1/2">
                      <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-800 dark:border-gray-300 shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-[-46px] left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 dark:bg-blue-400 text-white dark:text-black text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-500 dark:border-blue-300 shadow-lg">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 px-2">
                      {plan.description}
                    </p>

                    {/* Price display */}
                    <div className="mb-6">
                      {billing === "yearly" ? (
                        <div className="flex items-baseline justify-center gap-2 sm:gap-3">
                          <span className="text-base sm:text-lg text-gray-500 dark:text-gray-500 line-through">
                            ${parseFloat(
                              plan.billing.monthly.price.replace("$", "")
                            ) * 12}
                          </span>
                          <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            {details.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm">/year</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            {details.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                            /month
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    {isCurrentPlan ? (
                      <button className="block w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-xs sm:text-sm bg-blue-600 dark:bg-blue-500 text-white cursor-default">
                        Current Plan
                      </button>
                    ) : (
                      <a
                        href={details.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                          isPopular
                            ? "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-lg hover:shadow-xl"
                            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
                        }`}
                      >
                        {details.button}
                      </a>
                    )}
                  </div>

                  {/* Features separator */}
                  <div className="flex items-center mb-6">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="px-3 sm:px-4 text-gray-500 dark:text-gray-500 text-xs font-medium">
                      FEATURES
                    </span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 sm:space-y-3 text-left">
                    {details.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 sm:mt-16 text-gray-600 dark:text-gray-400 text-sm px-4">
          Have questions about upgrading?{" "}
          <a
            href="mailto:hello@hireremo.com"
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
          >
            Contact support
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
