import Email_Agent from "./src/assets/Usecases/Email_Agent.gif";
import Email_AgentDark from "./src/assets/Usecases/Email_AgentDark.gif";
import To_do from "./src/assets/Usecases/To-dos.gif";
import ToDoDark from "./src/assets/Usecases/To-dos_Dark.gif";
import Foodorder from "./src/assets/Usecases/FoodOrder.gif";
import FoodOrderDark from "./src/assets/Usecases/FoodOrderDark.gif";
import Remainders from "./src/assets/Usecases/Remainders.gif";
import RemaindersDark from "./src/assets/Usecases/RemaindersDark.gif";
import JobApply from "./src/assets/Usecases/Job_Apply.gif";
import JobApplyDark from "./src/assets/Usecases/Job_Apply_Dark.gif";
import blog1 from "./src/assets/Blogs/MEETREMO.png";
import blog2 from "./src/assets/Blogs/REMOAI_Assistant.png";
import blog3 from "./src/assets/Blogs/Blog4.png";
import blog6 from "./src/assets/Blogs/REMOvsTraditionalAI.png"
import blog5 from "./src/assets/Blogs/Blog5.png";
import blog4 from "./src/assets/Blogs/Blog6.png";
import logo from "./src/assets/MainLogo.png";

import { FaTelegram, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface NavLink {
  id: string;
  title: string;
}

export interface UseCaseItem {
  title: string;
  desc: string;
  img: string;
  darkImg?: string;
  learnmore: string;
  redirectUrl: string;
  size: string;
}

export interface BlogItem {
  title: string;
  img?: string;
  redirectUrl: string;
  description?: string;
  timestamp: string;
  buttonLabel?: string;
  type?: "article" | "quote" | "minimal" | "overlay";
}

export interface FooterContent {
  logo: string;
  address: string[];
  phone: string;
  email: string;
  quickLinks: string[];
  social: { name: string; url: string; icon: IconType }[];
  legal: { label: string; url: string }[];
  copyright: string;
  labels: {
    quickLinks: string;
    social: string;
    legal: string;
    phone: string;
    email: string;
  };
}

export interface LanguageContent {
  navLinks: NavLink[];
  banner: {
    title: string;
    description: string;
    videoId?: string;
    videoTitle?: string;
  };
  usecases: {
    title: string;
    subtitle: string;
    exploreButton: string;
    items: UseCaseItem[];
  };
  blogs: {
    title: string;
    subtitle: string;
    exploreButton: string;
    items: BlogItem[];
  };
  footer: FooterContent;
}

const content: Record<string, LanguageContent> = {
  en: {
    navLinks: [
      { id: "usecases", title: "Use Cases" },
      { id: "blogs", title: "Blogs" },
      { id: "pricing", title: "Pricing" },
      { id: "getstarted", title: "Get Started" },
    ],
    banner: {
      title: "Hello, I am Remo",
      description: "Personal AI Assistant can be hired by every human on the Planet",
    },
    usecases: {
      title: "Remo Works on",
      subtitle: "Hire Remo and make your works easy",
      exploreButton: "Explore more use cases →",
      items: [
        {
          title: "Draft Emails ",
          desc: "Let our AI draft emails for you, saving you time and ensuring your messages are clear and professional.",
          learnmore: "Learn more →",
          redirectUrl: "https://docs.remo.gg",
          img: Email_Agent,
          darkImg: Email_AgentDark,
          size: "normal",
        },
        {
          title: "Order Food",
          desc: "Order your favorite meals effortlessly using our AI assistant, which can handle everything from menu selection to payment.",
          learnmore: "Learn more →",
          redirectUrl: "https://docs.remo.gg",
          img: Foodorder,
          darkImg: FoodOrderDark,
          size: "normal",
        },
        {
          title: "Manage your To-Do List",
          desc: "Use our AI agent to manage your tasks, set reminders, and keep your to-do list organized.",
          learnmore: "Learn more →",
          redirectUrl: "https://docs.remo.gg",
          img: To_do,
          darkImg: ToDoDark,
          size: "tall",
        },
        {
          title: "Apply for Jobs",
          desc: "Order your favorite meals effortlessly using our AI assistant, which can handle everything from menu selection to payment.",
          learnmore: "Learn more →",
          redirectUrl: "https://docs.remo.gg",
          img: JobApply,
          darkImg: JobApplyDark,
          size: "normal",
        },
        {
          title: "Set Reminders",
          desc: "Let our AI draft emails for you, saving you time and ensuring your messages are clear and professional.",
          learnmore: "Learn more →",
          redirectUrl: "https://docs.remo.gg",
          img: Remainders,
          darkImg: RemaindersDark,
          size: "normal",
        },
      ],
    },
    blogs: {
      title: "Read our latest blog posts",
      subtitle: "Insights, stories, and updates from the Remo team and community.",
      exploreButton: "Explore more blogs →",
      items: [
        {
          title: "Meet Remo: Your personal AI Assistant",
          img: blog1,
          redirectUrl: "https://substack.com/@hireremo/p-166561971",
          description: "Explore how Remo is redefining personal productivity using AI.",
          timestamp: "June 15, 2025",
          buttonLabel: "Read More",
          type: "article",
        },
        {
          title: "REMO 101",
          description:"A personal AI Assistant that can be hired by every human on the planet. Personal assistants are not just for the rich anymore!!",
          img: blog2,
          redirectUrl: "https://substack.com/@hireremo/p-166678115",
          timestamp: "June 18, 2025",
          buttonLabel: "Read More",
          type: "overlay",
        },
        {
          title: "Personalizing Your Own AI Assistant: Why Remo Is Different",
          img: blog3,
          redirectUrl: "https://substack.com/home/post/p-166678355",
          description: "Unlocking the next generation of digital productivity through true personalization.",
          timestamp: "June 15, 2025",
          buttonLabel: "Read More",
          type: "article",
        },
        {
          title: "REMO 101",
          description:"A personal AI Assistant that can be hired by every human on the planet. Personal assistants are not just for the rich anymore!!",
          img: blog5,
          redirectUrl: "https://substack.com/@hireremo/p-166678115",
          timestamp: "June 18, 2025",
          buttonLabel: "Read More",
          type: "article",
        },
        
        {
          title: "Currently at the SF Museum of Modern Art",
          img: blog4,
          redirectUrl: "https://substack.com/@hireremo/p-166678451",
          description: "Exploring AI-generated art at the intersection of creativity and code.",
          timestamp: "June 19, 2025",
          buttonLabel: "Read More",
          type: "article",
        },
        {
          title: "Remo vs Traditional AI's",
          img: blog6,
          redirectUrl: "https://substack.com/@hireremo/p-166678451",
          description: "Discover how Remo makes AI more personal, powerful, and practical.",
          timestamp: "June 15, 2025",
          buttonLabel: "Read More",
          type: "article",
        },
        
        
        
      ],
    },
    footer: {
      logo,
      address: [
        "405 E Lamburnum Ave ste 3",
        "Richmond, VA 23222",
        "United States",
      ],
      phone: "+1 901-219-1273",
      email: "support@remo.com",
      quickLinks: ["Pricing", "Resources", "About us", "FAQ", "Contact us"],
      social: [
        { name: "Twitter", url: "https://x.com/hireremo", icon: FaTwitter },
        { name: "LinkedIn", url: "https://www.linkedin.com/company/remoai-hq/", icon: FaLinkedin },
        { name: "Discord", url: "https://discord.gg/bvhFdHnjwd", icon: FaDiscord },
        { name: "Telegram", url: "https://t.me/RemoAI_HQ", icon: FaTelegram },
      ],
      legal: [
        { label: "Support", url: "/support" },
        { label: "Terms of service", url: "/terms-of-service" },
        { label: "Privacy policy", url: "/privacy-policy" },
      ],
      copyright: "© 2025 Remo AI. All rights reserved.",
      labels: {
        quickLinks: "Quick links",
        social: "Social",
        legal: "Legal",
        phone: "Phone number",
        email: "Email",
      },
    },
    
  },
};

export default content;
