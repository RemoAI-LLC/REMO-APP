import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import content from "../../content";
import { useNavigate } from "react-router-dom";

const Usecases: React.FC = () => {
  const { language } = useLanguage();
  const { usecases } = content[language];
  const filters = usecases.filters;
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const navigate = useNavigate();

  const filteredUsecases = usecases.items.filter(
    (u) => u.category === activeFilter
  );

  const handleUsecaseClick = (url: string) => {
    navigate(url);
  };

  return (
    <section id="usecases-section" className="w-full pt-20 pb-32 bg-bg text-center">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2 rounded-full text-base cursor-pointer transition-colors duration-200 ${
              f === activeFilter
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Use Case Cards */}
      <div className="grid gap-6 px-4 sm:px-8 md:px-12 lg:px-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsecases.length === 0 ? (
          <p className="text-subtle col-span-full">
            No use cases for this category yet.
          </p>
        ) : (
          filteredUsecases.map((u, i) => (
            <div
              key={i}
              className="bg-card dark:bg-gray-900 rounded-xl overflow-hidden shadow-md dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-xl dark:hover:shadow-[0_6px_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-105"
            >
              <img
                src={u.img}
                alt={u.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-text dark:text-white">
                  {u.title}
                </h3>
                <p className="text-sm text-subtle dark:text-gray-400">
                  {u.desc}
                </p>
                <div className="mt-4 flex justify-center">
                  <button
                    className="text-blue-600 bg-black text-white hover:underline text-sm px-4 py-2 rounded-full cursor-pointer"
                    onClick={() => handleUsecaseClick(u.redirectUrl)}
                  >
                    {u.learnmore}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Usecases;