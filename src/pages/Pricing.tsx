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
        price: "$19.99/mo",
        features: [
          "Unlimited messages",
          "Unlimited access to GPT‑4o, OpenAI o4-mini",
          "Email/Outlook integration",
          "Google Calendar",
          "Task management tools",
          "Notes",
          "Reminders",
        ],
        button: "Start Monthly Basic",
        link: "https://buy.stripe.com/cNi9AT4Gt2Is53McBRafS00",
      },
      annual: {
        price: "$215.89/yr",
        original: "$239.88",
        features: [
          "Unlimited messages",
          "Unlimited access to GPT‑4o, OpenAI o4-mini",
          "Email/Outlook integration",
          "Google Calendar",
          "Task management tools",
          "Notes",
          "Reminders",
        ],
        button: "Start Annual Basic",
        link: "https://buy.stripe.com/aFaeVdc8VaaU1RAbxNafS01",
      },
    },
  },
  {
    title: "Premium Assistant",
    description: "Per user/month, billed",
    popular: true,
    billing: {
      monthly: {
        price: "$49.99/mo",
        features: [
          "All features of Basic Assistant",
          "Personalized AI assistant",
          "Workflows & automations",
          "Long-term memory",
          "Full access to all LLM models",
        ],
        button: "Start Monthly Premium",
        link: "https://buy.stripe.com/fZu00jeh3gzieEm1XdafS02",
      },
      annual: {
        price: "$539.98/yr",
        original: "$599.88",
        features: [
          "All features of Basic Assistant",
          "Personalized AI assistant",
          "Workflows & automations",
          "Long-term memory",
          "Full access to all LLM models",
        ],
        button: "Start Annual Premium",
        link: "https://buy.stripe.com/8x2dR96OBaaU2VE7hxafS03",
      },
    },
  },
];

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<BillingOption>("monthly");

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
       
        
        <h2 className="text-4xl font-bold mb-4">Plans and Pricing</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Save more with annual billing — up to 10% discount included.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === "annual"
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Save 10%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const details = plan.billing[billing];

            return (
              <div
                key={plan.title}
                className="flex flex-col rounded-xl p-6 border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 relative shadow-sm min-w-[300px] max-w-md h-full"
              >
                <h3 className="text-lg font-semibold mb-1">{plan.title}</h3>

                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-full">
                    Best Value
                  </span>
                )}

                {/* Price display */}
                {billing === "annual" ? (
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                      {plan.billing.annual.original}
                    </span>
                    <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                      {details.price}
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{details.price}</div>
                )}

                <ul className="text-sm space-y-2 mb-6 text-left flex-1">
                  {details.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="text-green-500 dark:text-green-400 mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={details.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center w-full py-2 rounded-lg font-medium text-sm text-white hover:opacity-90 ${
                    plan.popular 
                      ? (billing === "annual" ? 'bg-green-700 dark:bg-green-600 hover:bg-green-800 dark:hover:bg-green-700' : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600')
                      : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                  }`}
                >
                  {details.button}
                </a>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-gray-400 dark:text-gray-500 text-sm">
          Have questions about our plans? <a href="mailto:hello@hireremo.com" className="text-blue-600 dark:text-blue-400 underline">Contact support</a>.
        </div>
      </div>
    </div>
  );
};

export default Pricing;
