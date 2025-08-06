import { useLanguage } from "../../context/LanguageContext";
import content from "../../content";
import type { UseCaseItem } from "../../content";
import { motion } from "framer-motion";

const Usecases = () => {
  const { language } = useLanguage();
  // Fallback to English if language is not found
  const langContent = content[language] || content["en"];
  const usecases = langContent.usecases;

  // Masonry: split items into 3 columns
  const columns: UseCaseItem[][] = [[], [], []];
  if (usecases.items && usecases.items.length > 0) {
    usecases.items.forEach((item, i) => {
      columns[i % 3].push(item);
    });
  }

  return (
    <section
      id="usecases-section"
      className="w-full py-20 bg-white dark:bg-gray-900 text-center"
    >
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-text">
        {usecases.title}
      </h2>
      <p className="mb-8 text-lg max-w-2xl mx-auto text-text">
        {usecases.subtitle}
      </p>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-12 lg:px-20">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-5">
            {col.map((u, i) => {
              const directions = [
                { x: -100, opacity: 0 }, // from left
                { y: -100, opacity: 0 }, // from top
                { x: 100, opacity: 0 }, // from right
                { x: -100, opacity: 0 }, // from left
                { y: 100, opacity: 0 }, // from bottom
              ];
              const variant = directions[(colIdx * 3 + i) % directions.length];
              return (
                <motion.a
                  key={i}
                  href={u.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={variant}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: (colIdx * 3 + i) * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <div className="relative bg-white dark:bg-black rounded-xl overflow-hidden shadow-md dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-xl dark:hover:shadow-[0_6px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:scale-105 flex flex-col p-4">
                    <h3 className="font-semibold text-lg mb-2 text-text dark:text-white">
                      {u.title}
                    </h3>
                    {/* Light Mode Image */}
                    {u.img && (
                      <img
                        src={u.img}
                        alt={u.title}
                        className="w-auto mx-auto mb-4 block dark:hidden object-contain"
                      />
                    )}
                    {/* Dark Mode Image */}
                    {u.darkImg && (
                      <img
                        src={u.darkImg}
                        alt={`${u.title} (dark mode)`}
                        className="w-auto mx-auto mb-4 hidden dark:block object-contain"
                      />
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>
        ))}
        {/* If no usecases, show message */}
        {(!usecases.items || usecases.items.length === 0) && (
          <div className="col-span-3 text-gray-400 text-center py-20">
            No use cases available.
          </div>
        )}
      </div>

      {/* Explore More Button */}
      <div className="mt-10">
        <button className="text-blue-600 bg-black text-white hover:underline text-sm px-4 py-2 rounded-full">
          {usecases.exploreButton}
        </button>
      </div>
    </section>
  );
};

export default Usecases;
