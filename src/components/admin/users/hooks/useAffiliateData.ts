
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AffiliateUser } from "@/components/admin/users/types";
import { fetchAffiliates, ITEMS_PER_PAGE_EXPORT } from "@/components/admin/users/affiliateService";

export const useAffiliateData = () => {
  const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalAffiliates, setTotalAffiliates] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const loadAffiliates = async () => {
    setIsLoading(true);
    try {
      const { affiliates, totalCount } = await fetchAffiliates(currentPage, searchTerm);
      setAffiliates(affiliates);
      setTotalAffiliates(totalCount);
    } catch (error) {
      console.error("Error fetching affiliate users:", error);
      toast.error("Failed to load affiliate users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAffiliates();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadAffiliates();
  };

  const totalPages = Math.ceil(totalAffiliates / ITEMS_PER_PAGE_EXPORT);

  return {
    affiliates,
    isLoading,
    currentPage,
    searchTerm,
    totalPages,
    setCurrentPage,
    setSearchTerm,
    handleSearch,
    loadAffiliates
  };
};
