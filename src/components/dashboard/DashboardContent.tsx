
import { AffiliateEarnings } from "@/components/AffiliateEarnings";
import { UsageAnalytics } from "@/components/UsageAnalytics";
import { UsageHistory } from "@/components/UsageHistory";
import { motion } from "framer-motion";

interface DashboardContentProps {
  viewAll: boolean;
  couponCode: string;
  isTransitioning?: boolean;
}

export const DashboardContent = ({ viewAll, couponCode, isTransitioning = false }: DashboardContentProps) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <div className="space-y-4 md:space-y-8">
      <motion.section 
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/70 p-4 md:p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm"
        aria-label="Affiliate Earnings"
        tabIndex={0}
      >
        <AffiliateEarnings viewType={viewAll ? 'all' : 'personal'} isTransitioning={isTransitioning} />
      </motion.section>
      
      <motion.section 
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/70 p-4 md:p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm"
        aria-label="Usage Analytics"
        tabIndex={0}
      >
        <UsageAnalytics couponCode={couponCode} viewAll={viewAll} isTransitioning={isTransitioning} />
      </motion.section>
      
      <motion.section 
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/70 p-4 md:p-6 rounded-lg shadow-sm border border-[#9C7705]/10 backdrop-blur-sm"
        aria-label="Usage History"
        tabIndex={0}
      >
        <UsageHistory viewAll={viewAll} isTransitioning={isTransitioning} />
      </motion.section>
    </div>
  );
};
