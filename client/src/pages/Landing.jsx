import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import {
  RiMoneyDollarCircleLine,
  RiPieChartLine,
  RiRobot2Line,
} from "react-icons/ri";
import { BsDatabase, BsGraphUp, BsShield } from "react-icons/bs";
import {
  AiOutlineApi,
  AiOutlineUser,
  AiOutlineDashboard,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <RiMoneyDollarCircleLine className="w-6 h-6" />,
    title: "Smart Financial Tracking",
    description:
      "Effortlessly monitor your income, expenses, and investments in one place.",
  },
  {
    icon: <RiPieChartLine className="w-6 h-6" />,
    title: "Investment Analytics",
    description:
      "Get detailed insights and analytics about your investment portfolio.",
  },
  {
    icon: <RiRobot2Line className="w-6 h-6" />,
    title: "AI-Powered Recommendations",
    description:
      "Receive personalized financial advice powered by advanced AI algorithms.",
  },
];

const pocFeatures = [
  {
    icon: <RiRobot2Line className="w-8 h-8" />,
    title: "LLM Integration",
    description:
      "Advanced GPT-based model for personalized financial advice and natural interactions.",
  },
  {
    icon: <BsDatabase className="w-8 h-8" />,
    title: "Robust Data Model",
    description:
      "Structured database for comprehensive financial information storage and analysis.",
  },
  {
    icon: <AiOutlineApi className="w-8 h-8" />,
    title: "Advanced APIs",
    description:
      "Secure authentication, data upload, AI recommendations, and comprehensive reporting.",
  },
  {
    icon: <BsShield className="w-8 h-8" />,
    title: "Security First",
    description:
      "Enterprise-grade security for your sensitive financial data and transactions.",
  },
  {
    icon: <BsGraphUp className="w-8 h-8" />,
    title: "Anomaly Detection",
    description:
      "AI-driven algorithms to identify unusual patterns and prevent financial issues.",
  },
  {
    icon: <AiOutlineDashboard className="w-8 h-8" />,
    title: "Analytics Dashboard",
    description:
      "Comprehensive visual interface for monitoring and analyzing financial metrics.",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Security", "Business", "Enterprise"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Contact", "Blog"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Help Center", "API Status", "Terms of Service"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms", "Security", "Cookies"],
  },
];

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white"
          >
            FinanceAI
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => navigate("/login")}
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
              onClick={() => navigate("/register")}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-8"
          >
            Your Personal Financial Advisor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Harness the power of AI to make smarter financial decisions
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
          >
            Start Your Journey
            <FiArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-indigo-500 mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PoC Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Proof of Concept Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform leverages cutting-edge technology to provide you with
            the most comprehensive financial management experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {pocFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors duration-300 ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="text-indigo-500 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="py-20"></div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="text-center text-gray-400">
              <p> 2024 FinanceAI. All rights reserved.</p>
              <p className="mt-2 text-sm">
                Revolutionizing personal financial management with intelligent,
                data-driven insights
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
