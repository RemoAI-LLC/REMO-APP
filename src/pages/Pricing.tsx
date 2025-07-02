import React, { useState } from "react";

type BillingOption = "monthly" | "annual";

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
    annual: {
      price: string;
      original: string;
      features: string[];
      button: string;
      link: string;
    };
  };
}

const plans: Plan[] = [
  {
    title: "Basic Assistant",
    description: "Per user/month, billed",
    billing: {
      monthly: {
        price: "$19.99",
        features: [
          "Unlimited messages",
          "UnLimited access to GPT‑4o, OpenAI o4-mini",
          "Email/Outlook ",
          "Google Calendar",
          "Task management tools",
          "Notes",
          "Remainders",
        ],
        button: "Start Monthly Basic",
        link: "https://checkout.stripe.com/pay/abc123",
      },
      annual: {
        price: "$215.89",
        original: "$239.88",
        features: [
          "Unlimited messages",
          "UnLimited access to GPT‑4o, OpenAI o4-mini",
          "Email/Outlook ",
          "Google Calendar",
          "Task management tools",
          "Notes",
          "Remainders",
        ],
        button: "Start Annual Basic",
        link: "https://checkout.stripe.com/pay/abc123",
      },
    },
  },
  {
    title: "Premium Assistant",
    description: "Per user/month, billed",
    popular: true,
    billing: {
      monthly: {
        price: "$49.99",
        features: [
          "All features of Basic Assistant",
          "Personalized Your AI assistant",
          "Workflows",
          "Long-term memory",
          "Full access to different LLM models",
        ],
        button: "Start Monthly Premium",
        link: "https://checkout.stripe.com/pay/abc123",
      },
      annual: {
        price: "$539.98",
        original: "$599.88",
        features: [
          "All features of Basic Assistant",
          "Personalized Your AI assistant",
          "Workflows",
          "Long-term memory",
          "Full access to different LLM models",
        ],
        button: "Start Annual Premium",
        link: "https://checkout.stripe.com/pay/abc123",
      },
    },
  },
];

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<BillingOption>("annual");

  return (
    <div className="min-h-screen bg-white text-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Plans and Pricing</h2>
        <p className="text-gray-500 mb-8">
          Save more with annual billing — up to 10% discount included.
        </p>

        {/* Toggle */}
        <div className="inline-flex border border-gray-300 rounded-full overflow-hidden mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 text-sm font-medium ${
              billing === "monthly"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2 text-sm font-medium ${
              billing === "annual"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Annual <span className="ml-1 text-xs text-green-500">Save 10%</span>
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const details = plan.billing[billing];

            return (
              <div
                key={plan.title}
                className="flex flex-col rounded-xl p-6 border bg-white text-gray-900 border-gray-200 relative shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-1">{plan.title}</h3>

                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                    🔥 Popular
                  </span>
                )}

                {/* Price display */}
                {billing === "annual" ? (
                  <div className="flex flex-col items-center">
                    {"original" in details && (
                      <span className="text-xl text-gray-400 line-through">
                        {details.original}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-green-600">
                      {details.price}
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold">{details.price}</div>
                )}

                <p className="text-sm mb-6">
                  {plan.description} {billing}
                </p>

                <ul className="text-sm space-y-2 mb-6 text-left">
                  {details.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <a
                    href={details.link}
                    target="_blank" // optional: open in new tab
                    rel="noopener noreferrer"
                    className="block text-center w-full py-2 rounded-lg font-medium text-sm bg-gray-900 text-white hover:bg-gray-700"
                  >
                    {details.button}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
