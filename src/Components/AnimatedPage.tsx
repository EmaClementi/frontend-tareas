import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        filter: "blur(4px)"
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: "blur(4px)",
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

export const AnimatedPage = ({ children }: Props) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: "100%", minHeight: "100vh" }}
        >
            {children}
        </motion.div>
    );
};
