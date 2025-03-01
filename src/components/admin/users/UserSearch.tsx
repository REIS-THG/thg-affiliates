
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
}

export const UserSearch = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onRefresh
}: UserSearchProps) => {
  return (
    <div className="flex gap-2">
      <form onSubmit={onSearch} className="flex gap-2">
        <Input 
          type="text" 
          placeholder="Search by coupon or email" 
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        size="icon"
        title="Refresh"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
