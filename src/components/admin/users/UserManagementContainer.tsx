
import { UserSearch } from "@/components/admin/users/UserSearch";
import { AffiliateTable } from "@/components/admin/users/AffiliateTable";
import { UserPagination } from "@/components/admin/users/Pagination";
import { AddAffiliateDialog } from "@/components/admin/users/AddAffiliateDialog";
import { useAffiliateData } from "@/components/admin/users/hooks/useAffiliateData";

export const UserManagementContainer = () => {
  const {
    affiliates,
    isLoading,
    currentPage,
    searchTerm,
    totalPages,
    setCurrentPage,
    setSearchTerm,
    handleSearch,
    loadAffiliates
  } = useAffiliateData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <UserSearch 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          onRefresh={loadAffiliates}
        />
        <AddAffiliateDialog onAffilateAdded={loadAffiliates} />
      </div>

      <AffiliateTable 
        affiliates={affiliates} 
        isLoading={isLoading}
        onRefresh={loadAffiliates}
      />

      <UserPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
