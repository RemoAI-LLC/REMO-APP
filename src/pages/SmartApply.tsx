import React from "react";
import { FaRobot, FaFileAlt, FaRocket } from "react-icons/fa";

const SimplyApply: React.FC = () => {
  return (
    <div className="pt-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Simplify Your Job Search with SimplyApply
        </h1>
        <p className="text-lg sm:text-xl text-subtle max-w-2xl mx-auto mb-8">
          Let AI tailor your resume, match you to jobs, and apply automatically
          — saving you hours of effort.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-black transition">
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[#fafafa] dark:bg-gray-800">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <FaFileAlt size={40} className="mx-auto text-black mb-4" />
            <h3 className="text-xl font-semibold">AI-Powered Resumes</h3>
            <p className="text-subtle mt-2">
              Automatically tailor your resume to each job posting using smart
              prompts.
            </p>
          </div>
          <div>
            <FaRobot size={40} className="mx-auto text-black mb-4" />
            <h3 className="text-xl font-semibold">One-Click Apply</h3>
            <p className="text-subtle mt-2">
              Auto-apply to relevant jobs across platforms like LinkedIn and
              Indeed.
            </p>
          </div>
          <div>
            <FaRocket size={40} className="mx-auto text-black mb-4" />
            <h3 className="text-xl font-semibold">Track Applications</h3>
            <p className="text-subtle mt-2">
              View job matches, application statuses, and AI suggestions in one
              place.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <ol className="text-left space-y-6 text-lg max-w-2xl mx-auto list-decimal list-inside">
            <li>Upload your current resume or create one using our builder.</li>
            <li>
              Search or import jobs from LinkedIn or upload job descriptions.
            </li>
            <li>Let AI tailor your resume and apply automatically.</li>
            <li>
              Track your applications and get feedback or retry suggestions.
            </li>
          </ol>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-black text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to simplify your job hunt?
        </h2>
        <p className="mb-6">
          Start applying smarter, faster, and more efficiently today.
        </p>
        <button className="bg-[#fafafa] text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition">
          Try SimplyApply Now
        </button>
      </section>
    </div>
  );
};

export default SimplyApply;
