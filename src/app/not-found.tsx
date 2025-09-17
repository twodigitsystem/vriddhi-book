"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotFoundPage() {
  const router = useRouter();
  const [draggedShapes, setDraggedShapes] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleShapeDrag = (shapeId: string, x: number, y: number) => {
    setDraggedShapes((prev) => ({ ...prev, [shapeId]: { x, y } }));
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-violet-900 to-purple-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Stars */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Interactive Floating Shapes */}
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        onDrag={(_, info) =>
          handleShapeDrag("triangle", info.point.x, info.point.y)
        }
        className="absolute top-20 left-20 cursor-grab active:cursor-grabbing"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileDrag={{ scale: 1.2, rotate: 30 }}
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 transform rotate-45 rounded-lg opacity-80 shadow-lg" />
      </motion.div>

      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        onDrag={(_, info) =>
          handleShapeDrag("circle", info.point.x, info.point.y)
        }
        className="absolute top-32 right-16 cursor-grab active:cursor-grabbing"
        whileHover={{ scale: 1.1 }}
        whileDrag={{ scale: 1.2 }}
        animate={{
          x: [-5, 5, -5],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-violet-600 rounded-full opacity-70 shadow-xl" />
      </motion.div>

      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        onDrag={(_, info) =>
          handleShapeDrag("hexagon", info.point.x, info.point.y)
        }
        className="absolute bottom-24 left-12 cursor-grab active:cursor-grabbing"
        whileHover={{ scale: 1.1, rotate: -15 }}
        whileDrag={{ scale: 1.2, rotate: -30 }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-violet-300 to-purple-400 transform rotate-12 rounded-md opacity-75 shadow-lg" />
      </motion.div>

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-2xl mx-auto relative z-10 w-full">
        {/* Rocket Animation */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-8"
        >
          <motion.div
            className="mx-auto w-24 h-24 relative"
            animate={{
              y: [-8, 8, -8],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Rocket className="w-24 h-24 text-violet-400 mx-auto" />
            {/* Rocket exhaust */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gradient-to-t from-orange-400 via-red-400 to-yellow-300 rounded-full opacity-80"
              animate={{
                scaleY: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>

        {/* 404 Text with Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-violet-300 bg-clip-text text-transparent leading-none mb-4">
            404
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Lost in Space?
          </h2>
          <p className="text-lg text-violet-200 max-w-lg mx-auto leading-relaxed">
            It seems the page you're looking for has drifted into the cosmos.
            Don't worry, we can navigate back to safety.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleGoHome}
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 min-w-[200px]"
            >
              <Home className="w-5 h-5" />
              Return to Homepage
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="border-2 border-violet-400 text-violet-300 hover:bg-violet-400/10 hover:border-violet-300 font-semibold px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 min-w-[200px] bg-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </motion.div>
        </motion.div>

        {/* Interactive Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-sm text-violet-300 mt-8 italic"
        >
          💫 Try dragging the floating shapes around while you decide where to
          go!
        </motion.p>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-violet-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
