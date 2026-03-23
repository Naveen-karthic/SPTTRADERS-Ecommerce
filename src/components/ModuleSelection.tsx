import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ModuleSelection: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'grocery',
      name: 'Grocery',
      icon: '🛒',
      description: 'Fresh groceries delivered to your doorstep',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'fertilizer',
      name: 'Fertilizer',
      icon: '🌱',
      description: 'Quality fertilizers for your farm',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const handleModuleClick = (moduleId: string) => {
    navigate(`/module/${moduleId}/categories`);
  };

  return (
    <div className="w-full">
      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => handleModuleClick(module.id)}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-indigo-300 hover:scale-105">
              {/* Module Image */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
                <img
                  src={module.image}
                  alt={module.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
                  <span className="text-3xl">{module.icon}</span>
                </div>
              </div>

              {/* Module Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {module.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{module.description}</p>

                {/* Explore Button */}
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 font-semibold text-sm">
                    Explore Categories →
                  </span>
                  <div className="bg-indigo-100 rounded-full p-2 group-hover:bg-indigo-600 transition-colors">
                    <svg
                      className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelection;
