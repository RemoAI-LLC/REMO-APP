import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTelegram, FaTwitter, FaLinkedin, FaDiscord, FaGlobe, FaGithub, FaYoutube } from "react-icons/fa";

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  });

  // Social media links from REMO-WEB
  const socialLinks = [
    { name: "Website", url: "https://hireremo.com", icon: FaGlobe },
    { name: "Twitter", url: "https://x.com/hireremo", icon: FaTwitter },
    { name: "Telegram", url: "https://t.me/hireremo", icon: FaTelegram },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/hireremo", icon: FaLinkedin },
    { name: "GitHub", url: "https://github.com/remoai-llc", icon: FaGithub },
    { name: "YouTube", url: "https://www.youtube.com/@HireRemo", icon: FaYoutube },
    { name: "Discord", url: "https://discord.gg/bvhFdHnjwd", icon: FaDiscord },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer finished
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen maintenance-gradient flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/MainLogo.png" 
              alt="REMO Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            REMO
          </h1>
        </motion.div>

        {/* Main Maintenance Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="maintenance-card rounded-2xl p-6 md:p-8 mb-6"
        >

          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            We're Making Things Better
          </h2>
          
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            REMO is currently undergoing  maintenance to bring you an even better experience. 
            We're working hard to get everything back up and running smoothly.
          </p>

          {/* Live Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center mb-6"
          >
            <p className="text-gray-700 text-base mb-3">Estimated Time Remaining</p>
            <div className="flex gap-3 text-gray-900">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {formatTime(timeLeft.hours)}
                </div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {formatTime(timeLeft.minutes)}
                </div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {formatTime(timeLeft.seconds)}
                </div>
                <div className="text-xs text-gray-600">Seconds</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-6"
        >
          <p className="text-gray-700 text-base mb-2">
            We'll be back shortly!
          </p>
          <p className="text-gray-900 text-xl md:text-2xl font-bold">
            Please check back soon
          </p>
        </motion.div>

        {/* Social Connections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mb-6"
        >
          <p className="text-gray-600 text-xs mb-3">Connect with us</p>
          <div className="flex justify-center items-center gap-3">
            {socialLinks.map(({ name, url, icon: Icon }, index) => (
              <motion.a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 2 + index * 0.1 }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="text-gray-500 text-xs"
        >
          <p>© 2024 REMO. All rights reserved.</p>
          <p className="mt-1">
            Need immediate assistance? Contact us at{' '}
            <a href="mailto:support@remo.ai" className="text-blue-600 hover:underline">
              support@remo.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default App; 