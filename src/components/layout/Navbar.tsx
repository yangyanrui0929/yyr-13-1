import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Puzzle, 
  Volume2, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar, 
  BarChart3,
  Menu,
  X,
  Shell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/builder', label: '句式组合', icon: Puzzle },
  { path: '/pronunciation', label: '发音实验室', icon: Volume2 },
  { path: '/classroom', label: '海螺课堂', icon: GraduationCap },
  { path: '/lexicon', label: '词库管理', icon: BookOpen },
  { path: '/students', label: '学生档案', icon: Users },
  { path: '/courses', label: '课程中心', icon: Calendar },
  { path: '/records', label: '教学记录', icon: BarChart3 },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[var(--z-header)] bg-gradient-to-r from-[var(--color-ocean-deep)] via-[var(--color-ocean-mid)] to-[var(--color-ocean-deep)] shadow-lg">
      <div className="relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 120%27 preserveAspectRatio=%27none%27%3E%3Cpath d=%27M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z%27 fill=%27%2374B9FF%27 opacity=%270.5%27/%3E%3C/svg%3E')]" 
          style={{ backgroundSize: '200% 100%', animation: 'wave 10s linear infinite' }}
        />
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="text-3xl"
              >
                <Shell className="text-[var(--color-sand)]" size={32} />
              </motion.div>
              <h1 className="text-xl font-bold text-white font-[var(--font-display)] hidden sm:block">
                海螺语言学院
              </h1>
            </NavLink>
            
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
                      isActive 
                        ? 'text-white bg-white/20' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-sand)] rounded-full"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div>
            
            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-[var(--color-ocean-deep)]/95 backdrop-blur-lg border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3',
                    isActive 
                      ? 'text-white bg-white/20' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-pearl)]">
      <Navbar />
      <main className="pt-20 pb-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};
