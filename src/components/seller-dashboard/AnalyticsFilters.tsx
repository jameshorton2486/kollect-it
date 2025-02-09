
import React from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (newDateRange: DateRange | undefined) => void;
  timeFrame: "daily" | "weekly" | "monthly";
  onTimeFrameChange: (value: "daily" | "weekly" | "monthly") => void;
  chartType: "area" | "bar" | "pie";
  onChartTypeChange: (value: "area" | "bar" | "pie") => void;
}

export function AnalyticsFilters({
  dateRange,
  onDateRangeChange,
  timeFrame,
  onTimeFrameChange,
  chartType,
  onChartTypeChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="grid gap-4 md:flex md:items-center md:gap-6">
      <DateRangePicker
        value={dateRange}
        onChange={onDateRangeChange}
      />
      <Select
        value={timeFrame}
        onValueChange={onTimeFrameChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time frame" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={chartType}
        onValueChange={onChartTypeChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select chart type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="area">Area Chart</SelectItem>
          <SelectItem value="bar">Bar Chart</SelectItem>
          <SelectItem value="pie">Pie Chart</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
