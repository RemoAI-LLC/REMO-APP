// src/pages/Integrations.tsx
import React from "react";

interface Integration {
  name: string;
  description: string;
  logo: string;
  connected: boolean;
}

const integrations: Integration[] = [
  {
    name: "Slack",
    description: "Collaborate and get notifications in Slack.",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg",
    connected: false,
  },
  {
    name: "Notion",
    description: "Sync your notes and tasks with Notion.",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg",
    connected: true,
  },
  {
    name: "GitHub",
    description: "Connect your repositories and workflows.",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg",
    connected: false,
  },
  // Add more integrations as needed
];

const Integrations: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Integrations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center transition hover:shadow-lg"
          >
            <img
              src={integration.logo}
              alt={integration.name}
              className="h-12 w-12 mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{integration.name}</h2>
            <p className="text-gray-600 text-center mb-4">
              {integration.description}
            </p>
            <button
              className={`px-4 py-2 rounded font-medium transition ${
                integration.connected
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={integration.connected}
            >
              {integration.connected ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
