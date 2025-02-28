
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/calendar";
import { BarChart4, FileDown, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Helper function to export data as CSV
const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) {
    toast.error("No data to export");
    return;
  }
  
  // Convert data to CSV string
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] === null || row[header] === undefined ? '' : row[header];
      // Handle special characters and commas in the value
      const escaped = `${value}`.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Create and download the CSV file
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and click it
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const DataExport = () => {
  const [exportType, setExportType] = useState("usage");
  const [dateRange, setDateRange] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [format, setFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [couponFilter, setCouponFilter] = useState("");
  const [couponList, setCouponList] = useState<string[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  // Fetch all available coupon codes on coupon filter change
  const handleCouponFilterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setCouponFilter(searchTerm);
    
    if (!searchTerm) {
      setCouponList([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('thg_affiliate_users')
        .select('coupon')
        .ilike('coupon', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      setCouponList(data.map(item => item.coupon));
    } catch (error) {
      console.error("Error fetching coupon codes:", error);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (dateRange === "custom" && (!startDate || !endDate)) {
        toast.error("Please select both start and end dates");
        return;
      }
      
      let query;
      let filename = '';
      
      // Prepare date filters
      let dateFilter = {};
      if (dateRange === "custom" && startDate && endDate) {
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        dateFilter = {
          gte: formattedStartDate,
          lte: formattedEndDate
        };
      } else if (dateRange === "last30") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = {
          gte: thirtyDaysAgo.toISOString().split('T')[0]
        };
      } else if (dateRange === "last90") {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        dateFilter = {
          gte: ninetyDaysAgo.toISOString().split('T')[0]
        };
      } else if (dateRange === "thisyear") {
        const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
        dateFilter = {
          gte: firstDayOfYear.toISOString().split('T')[0]
        };
      }
      
      // Build query based on export type
      if (exportType === "usage") {
        query = supabase.from('coupon_usage').select('*');
        
        if (dateRange !== "all") {
          query = query.filter('date', dateFilter);
        }
        
        if (selectedCoupon) {
          query = query.eq('code', selectedCoupon);
        }
        
        filename = `coupon_usage_export_${new Date().toISOString().split('T')[0]}`;
      } else if (exportType === "affiliates") {
        query = supabase.from('thg_affiliate_users').select('id, coupon, email, role, payment_method, payment_details, notification_email, notification_frequency, email_notifications, created_at');
        filename = `affiliates_export_${new Date().toISOString().split('T')[0]}`;
      } else if (exportType === "earnings") {
        query = supabase.from('coupon_usage')
          .select('code, date, product_name, quantity, earnings, order_status, payout_date');
        
        if (dateRange !== "all") {
          query = query.filter('date', dateFilter);
        }
        
        if (selectedCoupon) {
          query = query.eq('code', selectedCoupon);
        }
        
        filename = `earnings_export_${new Date().toISOString().split('T')[0]}`;
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.info("No data found for the selected criteria");
        return;
      }

      // Export data based on selected format
      if (format === "csv") {
        exportToCSV(data, filename);
        toast.success(`Exported ${data.length} records to ${filename}.csv`);
      } else if (format === "json") {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Exported ${data.length} records to ${filename}.json`);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Export affiliate data for reporting and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>What data would you like to export?</Label>
              <RadioGroup 
                value={exportType} 
                onValueChange={setExportType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="usage" id="usage" />
                  <Label htmlFor="usage" className="font-normal">Coupon Usage Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="affiliates" id="affiliates" />
                  <Label htmlFor="affiliates" className="font-normal">Affiliate User Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="earnings" id="earnings" />
                  <Label htmlFor="earnings" className="font-normal">Earnings & Payouts</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            {exportType !== "affiliates" && (
              <div className="space-y-2">
                <Label>Date Range</Label>
                <RadioGroup 
                  value={dateRange} 
                  onValueChange={setDateRange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-time" />
                    <Label htmlFor="all-time" className="font-normal">All Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last30" id="last30" />
                    <Label htmlFor="last30" className="font-normal">Last 30 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last90" id="last90" />
                    <Label htmlFor="last90" className="font-normal">Last 90 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thisyear" id="thisyear" />
                    <Label htmlFor="thisyear" className="font-normal">This Year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-normal">Custom Range</Label>
                  </div>
                </RadioGroup>
                
                {dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="start-date">Start Date</Label>
                      <DatePicker 
                        date={startDate} 
                        setDate={setStartDate}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="end-date">End Date</Label>
                      <DatePicker 
                        date={endDate} 
                        setDate={setEndDate}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {exportType !== "affiliates" && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Filter by Coupon Code (Optional)</Label>
                  <div className="relative">
                    <Input
                      placeholder="Start typing a coupon code..."
                      value={couponFilter}
                      onChange={handleCouponFilterChange}
                    />
                    {couponList.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-md max-h-48 overflow-y-auto">
                        {couponList.map(coupon => (
                          <div
                            key={coupon}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedCoupon(coupon);
                              setCouponFilter(coupon);
                              setCouponList([]);
                            }}
                          >
                            {coupon}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedCoupon && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm">Selected: {selectedCoupon}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCoupon(null);
                          setCouponFilter("");
                        }}
                        className="h-6 text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleExport} 
              className="w-full"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <FileDown className="mr-2 h-4 w-4 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart4 className="mr-2 h-5 w-5" />
                Export Tips
              </CardTitle>
              <CardDescription>
                Best practices for data exports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Coupon Usage Data</h4>
                <p className="text-sm text-muted-foreground">
                  Contains detailed information about when and how coupon codes were used, including dates, products, and earnings.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Affiliate User Information</h4>
                <p className="text-sm text-muted-foreground">
                  Lists all affiliate users in the system with their coupon codes, contact information, and payment details.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Earnings & Payouts</h4>
                <p className="text-sm text-muted-foreground">
                  Focused view of financial data including earnings and payout statuses for all transactions.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Data Privacy</AlertTitle>
            <AlertDescription>
              Exported data may contain personally identifiable information. Ensure you handle exports in accordance with applicable data protection regulations.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};
