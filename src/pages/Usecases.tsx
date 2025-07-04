import { useLanguage } from "../../context/LanguageContext";
import content from "../../content";
import { motion } from "framer-motion";

const sizeClasses = {
  tall: "col-span-1 md:col-span-2 lg:col-span-1 md:row-span-4 lg:h-[660px]",
  normal: "col-span-1 md:col-span-2 lg:col-span-1 md:row-span-2 lg:h-80",
};

const Usecases = () => {
  const { language } = useLanguage();
  const { usecases } = content[language];

  return (
    <section id="usecases-section" className="w-full py-20 bg-bg text-center">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-text">
        {usecases.title}
      </h2>
      <p className="mb-8 text-lg max-w-2xl mx-auto text-subtle">
        {usecases.subtitle}
      </p>

      {/* Use Case Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-12 lg:px-20">
        {usecases.items.map((u, i) => {
          const directions = [
            { x: -100, opacity: 0 }, // from left
            { y: -100, opacity: 0 }, // from top
            { x: 100, opacity: 0 }, // from right
            { x: -100, opacity: 0 }, // from left
            { y: 100, opacity: 0 }, // from bottom
          ];
          const variant = directions[i % directions.length];

          return (
            <motion.a
              key={i}
              href={u.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={variant}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              className={
                sizeClasses[u.size as keyof typeof sizeClasses] ||
                sizeClasses.normal
              }
            >
              <div className="relative bg-white dark:bg-black rounded-xl overflow-hidden shadow-md dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-xl dark:hover:shadow-[0_6px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:scale-105 h-full min-h-[300px] flex flex-col p-4">
                <h3 className="font-semibold text-lg mb-2 text-text dark:text-white">
                  {u.title}
                </h3>

                {/* Light Mode Image */}
                {u.img && (
                  <img
                    src={u.img}
                    alt={u.title}
                    className="max-w-full h-auto mb-4 block dark:hidden object-contain"
                  />
                )}

                {/* Dark Mode Image */}
                {u.darkImg && (
                  <img
                    src={u.darkImg}
                    alt={`${u.title} (dark mode)`}
                    className="max-w-full h-auto mb-4 hidden dark:block object-contain"
                  />
                )}
              </div>
            </motion.a>
          );
        })}
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
