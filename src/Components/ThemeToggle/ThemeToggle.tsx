import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'light' ? 0 : 180,
                    scale: theme === 'light' ? 1 : 0,
                    opacity: theme === 'light' ? 1 : 0
                }}
                className="toggle-icon sun"
            >
                ☀️
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : -180,
                    scale: theme === 'dark' ? 1 : 0,
                    opacity: theme === 'dark' ? 1 : 0
                }}
                className="toggle-icon moon"
            >
                🌙
            </motion.div>
        </motion.button>
    );
}
