'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle2, BookOpen, Rocket, BrainCircuit, Star } from 'lucide-react';

const steps = [
    {
        icon: BookOpen,
        level: "Beginner",
        label: "Kiến thức nền tảng",
        status: "completed",
        align: "left"
    },
    {
        icon: Rocket,
        level: "Intermediate",
        label: "Kỹ năng thực chiến",
        status: "completed",
        align: "right"
    },
    {
        icon: BrainCircuit,
        level: "Advanced",
        label: "Tư duy nâng cao",
        status: "current",
        align: "left"
    }
];

export default function LearningPathSimulation() {
    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden">
            {/* Background elements - Removed to let parent background show */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-3xl animate-pulse" />
                <div className="absolute top-[30%] -left-[10%] w-[300px] h-[300px] rounded-full bg-secondary/20 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] rounded-full bg-brand-pink/20 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                <div className="relative w-full py-2">
                    {/* Winding Path SVG - Adjusted coordinates to match tighter spacing */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 512 600" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ad1c9a" />
                                <stop offset="100%" stopColor="#67178d" />
                            </linearGradient>
                        </defs>
                        {/* Static Background Path */}
                        <path
                            d="M 256 50 C 256 100 120 120 120 200 C 120 280 392 300 392 380 C 392 460 256 480 256 550"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        {/* Animated Progress Path */}
                        <motion.path
                            d="M 256 50 C 256 100 120 120 120 200 C 120 280 392 300 392 380 C 392 460 256 480 256 550"
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 0.82 }}
                            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                        />
                    </svg>

                    <div className="space-y-10 relative">
                        {steps.map((step, index) => {
                            const isLeft = step.align === "left";

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (index * 0.4), duration: 0.5 }}
                                    className={`flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'} relative z-10`}
                                >
                                    {/* Spacing for alignment */}
                                    <div className="w-4 lg:w-16"></div>

                                    {/* Icon Bubble */}
                                    <div className={`relative group ${isLeft ? 'mr-5' : 'ml-5'}`}>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 + (index * 0.4), type: "spring" }}
                                            whileHover={{ scale: 1.05 }}
                                            className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-[4px] border-white relative z-20 ${step.status === "completed"
                                                ? "bg-gradient-to-br from-primary to-secondary text-white"
                                                : step.status === "current"
                                                    ? "bg-white text-primary border-primary/20 ring-2 ring-primary/10"
                                                    : "bg-white text-slate-300"
                                                }`}
                                        >
                                            <step.icon size={32} />
                                        </motion.div>

                                        {/* Status Badge */}
                                        {step.status === "completed" && (
                                            <div className="absolute -top-1.5 -right-1.5 z-30 bg-green-500 text-white rounded-full p-1 shadow border-2 border-white">
                                                <CheckCircle2 size={14} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
                                        <div className={`inline-block p-3.5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-md max-w-[240px] ${step.status === "current"
                                            ? "bg-white/90 border-primary/30 shadow-lg shadow-primary/10"
                                            : "bg-white/60 border-white/50"
                                            }`}>
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                                                {step.level}
                                            </div>
                                            <div className={`font-bold text-[15px] leading-tight ${step.status === "current" ? "text-foreground" : "text-muted-foreground"
                                                }`}>
                                                {step.label}
                                            </div>

                                            {/* Mini Progress Bar for Current Step */}
                                            {step.status === "current" && (
                                                <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-primary to-secondary"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: "60%" }}
                                                        transition={{ duration: 1.5, delay: 1.5 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Spacer */}
                                    <div className="w-2 lg:w-8"></div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Final Goal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.5, type: "spring" }}
                        className="relative z-10 flex flex-col items-center mt-10"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full animate-pulse" />
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white relative z-20"
                            >
                                <Award className="text-white drop-shadow-md" size={40} />
                                <div className="absolute -top-1.5 -right-1.5">
                                    <Star className="text-yellow-200 fill-yellow-200" size={20} />
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-3.5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-200 shadow-sm text-yellow-700 font-bold text-[13px] flex items-center gap-2">
                            <Award size={16} />
                            <span>Chứng chỉ Expert đang đợi!</span>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
