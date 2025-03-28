import React, { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, RotateCcw, Play, LucideCalendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Calendar from "@/components/ui/calendar";
import Loading from "@/components/ui/loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { PromptInputSectionProps } from "@/lib/types";

// Memoize Calendar to prevent unnecessary re-renders
const MemoizedCalendar = React.memo(Calendar);

export const PromptInputSection: React.FC<PromptInputSectionProps> = ({
  date,
  time,
  recurrence,
  prompt,
  isExecuting,
  isScheduled,
  setDate,
  setTime,
  setRecurrence,
  setPrompt,
  promptResponse,
  setPromptResponse,
  setLogs,
  isSSEconnected,
  setIsSSEconnected,
  handleExecute,
  handleSchedule,
  handleRunTask,
}) => {
  const [executionTime, setExecutionTime] = useState("");
  
  // Use useCallback to memoize the calendar change handler
  const handleCalendarChange = useCallback((newISO: string) => {
    const selectedDate = new Date(newISO);
    setDate({ from: selectedDate, to: selectedDate });
    setExecutionTime(newISO);
  }, [setDate]);

  // Memoize reset function to prevent unnecessary re-renders
  const handleReset = useCallback(() => {
    setPrompt("");
    setDate({ from: new Date(), to: new Date() });
    setTime("12:00");
    setRecurrence("none");
    setExecutionTime("");
  }, [setPrompt, setDate, setTime, setRecurrence]);

  return (
    <div className="space-y-6">
      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-slate-300">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal border-slate-700 bg-background hover:bg-slate-700 text-slate-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                {date && date.from ? (
                  format(date.from, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}{" "}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-slate-700 bg-background">
              <MemoizedCalendar
                value={executionTime}
                onChange={handleCalendarChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-slate-300">
            Time
          </Label>
          <div className="flex space-x-2">
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border-slate-700 bg-background text-white"
            />

            <Select
              value={recurrence}
              onValueChange={(value: any) => setRecurrence(value)}
            >
              <SelectTrigger className="w-[180px] border-slate-700 bg-background text-white">
                <SelectValue placeholder="Recurrence" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-background text-white">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-slate-300">
          Prompt
        </Label>
        <Textarea
          id="prompt"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] border-slate-700 bg-background text-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-background hover:text-white transition-all duration-300"
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          variant="default"
          className="bg-emerald-700 hover:bg-emerald-600 text-white transition-all duration-300"
          onClick={() => {
            handleRunTask(false);
          }}
          disabled={isExecuting || !prompt.trim()}
        >
          
          {isExecuting ? (
            <div className="container mx-auto h-[100vh] flex items-center justify-center">
            <Loading/>
          </div>
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Execute Now
        </Button>

        <Button
          variant="default"
          className="bg-blue-700 hover:bg-blue-600 text-white transition-all duration-300"
          onClick={handleSchedule}
          disabled={isScheduled || !prompt.trim() || !date || !time}
        >
          {isScheduled ? (
            <div className="container mx-auto h-[100vh] flex items-center justify-center">
            <Loading/>
          </div>
          ) : (
            <LucideCalendar className="mr-2 h-4 w-4" />
          )}
          Schedule
        </Button>
      </div>
    </div>
  );
};