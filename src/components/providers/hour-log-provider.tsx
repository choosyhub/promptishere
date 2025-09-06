
"use client";

import { useState, useEffect, useCallback, useMemo, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { readData, writeData } from '@/lib/data';
import { downloadJson } from '@/lib/utils';
import { calculateLevelInfo } from '@/lib/levels';
import { HourLogContext, TARGET_HOURS, HourLogContextType } from '@/hooks/use-hour-log';
import { format } from 'date-fns';
import type { GistData, LogEntry } from '@/lib/types';

export function HourLogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GistData>({ logs: [], projects: [], totalHours: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Timer State
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerIsActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerIsActive]);

  const startTimer = () => setTimerIsActive(true);
  const pauseTimer = () => setTimerIsActive(false);
  const resetTimer = () => {
    setTimerIsActive(false);
    setTimerTime(0);
  };

  const fetchData = useCallback(async () => {
    setIsLoaded(false);
    try {
      const fileData = await readData();
      setData(fileData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Loading Error",
        description: `Could not load data from file. ${errorMessage}`,
      });
    } finally {
      setIsLoaded(true);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const saveData = useCallback(async (newData: GistData) => {
    try {
        await writeData(newData);
        setData(newData);
    } catch (error) {
        console.error("Failed to save data:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Save Error",
            description: `Could not save your data to file. ${errorMessage}`,
        });
    }
  }, [toast]);

  const addLog = useCallback((hours: number, projectId?: string) => {
    const newLog: LogEntry = {
      date: format(new Date(), 'yyyy-MM-dd'),
      hours,
    };
    if (projectId) {
      newLog.projectId = projectId;
    }

    const newData: GistData = {
      ...data,
      logs: [...data.logs, newLog],
      totalHours: data.totalHours + hours,
    };
    
    saveData(newData);

    const projectName = projectId ? data.projects.find(p => p.id === projectId)?.name : '';

    toast({
        title: "Hours Logged",
        description: `${hours.toFixed(2)} hour(s) have been added ${projectName ? `for ${projectName}` : 'to your log.'}`,
    });
  }, [data, saveData, toast]);

  const logTimer = () => {
    const hours = timerTime / 3600;
    if (hours > 0) {
      addLog(hours);
    }
    resetTimer();
  };

  const resetData = useCallback(() => {
    const emptyData: GistData = {
        logs: [],
        projects: [],
        totalHours: 0,
    };
    saveData(emptyData);
    toast({
      title: 'Data Reset',
      description: 'Your entire log history has been cleared.',
    });
  }, [saveData, toast]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const result = event.target?.result;
            if (typeof result !== 'string') {
                throw new Error("File could not be read.");
            }
            const importedData = JSON.parse(result);

            if ('logs' in importedData && 'totalHours' in importedData && 'projects' in importedData) {
                const parsedProjects = (importedData.projects || []).map((p: any) => ({
                    ...p,
                    deadline: p.deadline ? new Date(p.deadline) : new Date(),
                    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
                }));
                const validatedData = { ...importedData, projects: parsedProjects };

                await saveData(validatedData);
                toast({
                    title: 'Import Successful',
                    description: 'Your data has been imported.',
                });
            } else {
                throw new Error("Invalid data format in JSON file.");
            }
        } catch (error) {
            console.error("Failed to import data:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: 'destructive',
                title: 'Import Failed',
                description: `Could not import data. ${errorMessage}`,
            });
        }
    };
    reader.readAsText(file);
  }, [saveData, toast]);


  const dailyAverageHours = useMemo(() => {
    if (data.logs.length === 0) return 0;
    const uniqueDays = new Set(data.logs.map(log => log.date));
    if (uniqueDays.size === 0) return 0;
    return data.totalHours / uniqueDays.size;
  }, [data.logs, data.totalHours]);

  const levelInfo = useMemo(() => calculateLevelInfo(data.totalHours), [data.totalHours]);

  const exportData = useCallback(() => {
    downloadJson({ logs: data.logs, totalHours: data.totalHours, projects: data.projects }, 'dhanric-deadline-backup');
    toast({
      title: 'Data Exported',
      description: 'Your log history has been downloaded.',
    });
  }, [data, toast]);

  const value: HourLogContextType = {
    logs: data.logs,
    totalHours: data.totalHours,
    remainingHours: TARGET_HOURS - data.totalHours,
    dailyAverageHours,
    levelInfo,
    addLog,
    exportData,
    importData,
    resetData,
    isLoaded,
    refetch: fetchData,
    saveData,
    data,
    // Timer context
    timerTime,
    timerIsActive,
    startTimer,
    pauseTimer,
    resetTimer,
    logTimer,
  };

  return <HourLogContext.Provider value={value}>{children}</HourLogContext.Provider>;
}
