"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/skeleton"; // shadcn/ui

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const ResultCard = ({ children, className, custom }: any) => (
  <motion.div
    variants={fadeIn}
    custom={custom}
    className={cn(
      "relative backdrop-blur-sm bg-[var(--white)]/90 shadow-lg rounded-[var(--radius)] p-4 sm:p-6 md:p-8",
      className,
    )}
  >
    {children}
  </motion.div>
);

export default function ResultSkeleton() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-4xl mx-auto py-12 px-4 text-center text-[var(--gray-dark)]"
    >
      <div className="relative z-10 space-y-6">
        {/* Gauges */}
        <ResultCard custom={0} className="text-center">
          <div className="flex justify-center mb-6">
            <Skeleton className="h-8 sm:h-10 w-3/4 max-w-xl rounded-md" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </ResultCard>
        {/* Charts */}
        <ResultCard custom={4}>
          <div className="space-y-3">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-64 w-full" />
          </div>
        </ResultCard>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultCard custom={1}>
          <Skeleton className="h-5 w-48 mb-3" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-3 w-3/4 mt-2" />
          </div>
        </ResultCard>

        <ResultCard custom={2}>
          <Skeleton className="h-5 w-40 mb-3" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-3 w-8/12" />
          </div>
        </ResultCard>
      </div>
    </motion.div>
  );
}
