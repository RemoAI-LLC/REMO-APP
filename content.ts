import AI from "./src/assets/Usecases/AI.jpg"
import blog1 from "./src/assets/Blogs/Japan.jpg";
import logo from "./src/assets/FooterLogo.svg";

export interface NavLink {
  id: string;
  title: string;
}

export interface UseCaseItem {
  title: string;
  desc: string;
  category: string;
  img: string;
  learnmore: string,
  redirectUrl: string,
}

export interface BlogItem {
  title: string;
  desc: string;
  img: string;
  learnmore: string,
}

export interface FooterContent {
  logo: string;
  address: string[];
  phone: string;
  email: string;
  quickLinks: string[];
  social: string[];
  legal: string[];
  copyright: string;
  labels: {
    quickLinks: string,
    social: string,
    legal: string,
    phone: string,
    email: string,
  };
}

export interface LanguageContent {
  navLinks: NavLink[];
  banner: {
    title: string,
    description: string,
    videoId: string,
    videoTitle: string,
  };
  usecases: {
    title: string,
    subtitle: string,
    exploreButton: string,
    
    filters: string[],
    items: UseCaseItem[],
  };
  blogs: {
    title: string,
    subtitle: string,
    exploreButton: string,
    
    items: BlogItem[],
  };
  footer: FooterContent;
}

const content: Record<string, LanguageContent> = {
  en: {
    navLinks: [
      { id: "usecases", title: "Use Cases" },
      { id: "blogs", title: "Blogs" },
      { id: "aboutus", title: "About Us" },
      { id: "getstarted", title: "Get Started" },
    ],
    banner: {
      title: "Your REMO",
      description:
        "Remo is a Personal AI Assistant combined with the AI Agents that manages all the daily tasks as a professional and personal Assistant. Remo makes the work easy and manageable.",
      videoId: "F8NKVhkZZWI",
      videoTitle: "What are AI Agents?",
    },
    usecases: {
      title: "Explore the use cases based on categories",
      subtitle: "Hire Remo and make your works easy",
      exploreButton: "Explore more use cases →",
      filters: [
        "Top Notch",
        "Industry",
        "Career",
        "Education",
        "Web 3",
        "Social Media",
        "Life Style",
      ],
      items: [
        {
          title: "Generate Smart Resume",
          desc: "Use our AI agent to analyze job descriptions and auto-tailor your resume for each role.",
          category: "Career",
          learnmore: "Learn more →",
          redirectUrl: "/",
          img: AI,
        },
        {
          title: "SmartApply AI",
          desc: "Use our AI to analyze job descriptions, tailor your resume, and apply to jobs seamlessly.",
          category: "Career",
          learnmore: "Learn more →",
          redirectUrl: "/SmartApply",
          img: AI,
        },
        
        {
          title: "Compare Market Competitors",
          desc: "Let the AI research and summarize competitive product analysis in minutes.",
          category: "Industry",
          learnmore: "Learn more →",
          redirectUrl: "/",
          img: AI,
        },
        {
          title: "Visualize Stock Trends",
          desc: "Use our finance agent to explore trends and generate interactive charts.",
          category: "Top Notch",
          learnmore: "Learn more →",
          redirectUrl: "/",
          img: AI,
        },
        {
          title: "Plan Your Day Efficiently",
          desc: "Lifestyle AI creates optimized daily routines and reminders for your schedule.",
          category: "Education",
          learnmore: "Learn more →",
          redirectUrl: "/",
          img: AI,
        },
        {
          title: "Research with AI Agents",
          desc: "Ask complex research questions and get answers with citations and summaries.",
          category: "Web 3",
          learnmore: "Learn more →",
          redirectUrl: "/",
          img: AI,
        },
        {
          title: "Onboard New Employees",
          desc: "HR agents can auto-generate onboarding plans, checklists, and internal docs.",
          category: "Social Media",
          learnmore: "Learn more →",
          redirectUrl: "/",
          img: AI,
        },
      ],
    },
    blogs: {
      title: "Read our latest blog posts",
      subtitle:
        "Insights, stories, and updates from the Remo team and community.",
      exploreButton: "Explore more blogs →",
      items: [
        {
          title: "How Remo is Revolutionizing Personal AI",
          desc: "A deep dive into the technology and philosophy behind Remo, and how it is changing the way we interact with AI.",
          img: blog1,
          learnmore: "Learn more →",
        },
        {
          title: "10 Surprising Use Cases for Remo",
          desc: "Discover unique and unexpected ways people are using Remo to improve their daily lives and workflows.",
          img: blog1,
          learnmore: "Learn more →",
        },
        {
          title: "The Future of AI Assistants",
          desc: "Exploring the trends and innovations shaping the next generation of AI-powered personal assistants.",
          img: blog1,
          learnmore: "Learn more →",
        },
        {
          title: "Integrating Remo with Your Favorite Tools",
          desc: "Step-by-step guides on connecting Remo to popular productivity and communication platforms.",
          img: blog1,
          learnmore: "Learn more →",
        },
        {
          title: "Bonus: Behind the Scenes at Remo",
          desc: "Go behind the scenes to learn how the Remo team builds and tests cutting-edge features.",
          img: blog1,
          learnmore: "Learn more →",
        },
        {
          title: "Integrating Remo with Your Favorite Tools",
          desc: "Step-by-step guides on connecting Remo to popular productivity and communication platforms.",
          img: blog1,
          learnmore: "Learn more →",
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
      social: ["Facebook", "Instagram", "LinkedIn", "Twitter", "Youtube"],
      legal: ["Terms of service", "Privacy policy", "Cookie policy"],
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

  es: {
    navLinks: [
      { id: "usecases", title: "Casos de Uso" },
      { id: "blogs", title: "Blogs" },
      { id: "aboutus", title: "Sobre Nosotros" },
      { id: "getstarted", title: "Empezar" },
    ],
    banner: {
      title: "Tu REMO",
      description:
        "Remo es un asistente de IA personal combinado con agentes de IA que gestiona todas las tareas diarias como un asistente profesional y personal. Remo hace que el trabajo sea fácil y manejable.",
      videoId: "F8NKVhkZZWI",
      videoTitle: "¿Qué son los agentes de IA?",
    },
    usecases: {
      title: "Explora los casos de uso por categoría",
      subtitle: "Contrata a Remo y haz tu trabajo más fácil",
      exploreButton: "Explorar más casos de uso →",
      filters: [
        "Top Notch",
        "Industry",
        "Career",
        "Education",
        "Web 3",
        "Social Media",
        "Life Style",
      ],
      items: [
        {
          title: "Generar currículum inteligente",
          desc: "Usa nuestro agente de IA para analizar descripciones de trabajo y personalizar tu currículum.",
          category: "Career",
          learnmore: "Aprender más →",
          redirectUrl: "http://localhost:5173",
          img: AI,
        },
        {
          title: "Comparar competidores del mercado",
          desc: "Permite que la IA investigue y resuma análisis competitivos en minutos.",
          category: "Industry",
          learnmore: "Aprender más →",
          redirectUrl: "http://localhost:5173",
          img: AI,
        },
        {
          title: "Visualizar tendencias bursátiles",
          desc: "Explora tendencias financieras y genera gráficos interactivos.",
          category: "Top Notch",
          learnmore: "Aprender más →",
          redirectUrl: "http://localhost:5173",
          img: AI,
        },
        {
          title: "Planifica tu día eficientemente",
          desc: "La IA de estilo de vida crea rutinas diarias optimizadas y recordatorios.",
          category: "Education",
          learnmore: "Aprender más →",
          redirectUrl: "http://localhost:5173",
          img: AI,
        },
        {
          title: "Investigar con agentes de IA",
          desc: "Haz preguntas complejas y recibe respuestas con citas y resúmenes.",
          category: "Web 3",
          learnmore: "Aprender más →",
          redirectUrl: "http://localhost:5173",
          img: AI,
        },
        {
          title: "Incorporar nuevos empleados",
          desc: "Los agentes de RRHH pueden generar planes de incorporación, listas de verificación y documentos internos.",
          category: "Social Media",
          learnmore: "Aprender más →",
          redirectUrl: "http://localhost:5173",
          img: AI,
        },
      ],
    },
    blogs: {
      title: "Lee nuestras últimas publicaciones del blog",
      subtitle:
        "Ideas, historias y actualizaciones del equipo y la comunidad de Remo.",
      exploreButton: "Explorar más blogs →",
      items: [
        {
          title: "Cómo Remo está revolucionando la IA personal",
          desc: "Una inmersión profunda en la tecnología y filosofía detrás de Remo.",
          learnmore: "Aprender más →",
          img: blog1,
        },
        {
          title: "10 casos de uso sorprendentes para Remo",
          desc: "Descubre formas únicas en que las personas usan Remo a diario.",
          learnmore: "Aprender más →",
          img: blog1,
        },
        {
          title: "El futuro de los asistentes de IA",
          desc: "Tendencias e innovaciones que están moldeando la nueva generación de asistentes inteligentes.",
          learnmore: "Aprender más →",
          img: blog1,
        },
        {
          title: "Integra Remo con tus herramientas favoritas",
          desc: "Guías paso a paso para conectar Remo con herramientas de productividad.",
          learnmore: "Aprender más →",
          img: blog1,
        },
        {
          title: "Bonus: Detrás de escena en Remo",
          desc: "Conoce cómo el equipo de Remo construye y prueba nuevas funciones.",
          learnmore: "Aprender más →",
          img: blog1,
        },
        {
          title: "Integra Remo con tus herramientas favoritas",
          desc: "Guías paso a paso para conectar Remo con herramientas de productividad.",
          learnmore: "Aprender más →",
          img: blog1,
        },
      ],
    },
    footer: {
      logo,
      address: [
        "405 E Lamburnum Ave ste 3",
        "Richmond, VA 23222",
        "Estados Unidos",
      ],
      phone: "+1 901-219-1273",
      email: "support@remo.com",
      quickLinks: [
        "Precios",
        "Recursos",
        "Sobre nosotros",
        "Preguntas frecuentes",
        "Contáctanos",
      ],
      social: ["Facebook", "Instagram", "LinkedIn", "Twitter", "Youtube"],
      legal: [
        "Términos de servicio",
        "Política de privacidad",
        "Política de cookies",
      ],
      copyright: "© 2025 Remo AI. Todos los derechos reservados.",
      labels: {
        quickLinks: "Enlaces rápidos",
        social: "Redes sociales",
        legal: "Legal",
        phone: "Teléfono",
        email: "Correo electrónico",
      },
    },
  },
};

export default content;
