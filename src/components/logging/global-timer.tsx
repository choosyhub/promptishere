
"use client";

import { useHourLog } from "@/hooks/use-hour-log";
import { formatTime } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pause, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalTimer() {
    const { timerTime, timerIsActive, startTimer, pauseTimer, logTimer } = useHourLog();

    if (timerTime === 0 && !timerIsActive) {
        return null;
    }

    return (
        <div className={cn(
            "flex items-center justify-between gap-2 w-full rounded-lg p-2 transition-colors",
            timerIsActive ? "bg-primary/10" : "bg-muted"
        )}>
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8">
                     <div className={cn(
                        "h-2 w-2 rounded-full bg-primary transition-all duration-500",
                        timerIsActive ? "animate-pulse" : ""
                    )} />
                </div>
                <div>
                    <div className="font-mono font-semibold text-lg">{formatTime(timerTime)}</div>
                    <div className="text-xs text-muted-foreground -mt-1">{timerIsActive ? 'Running...' : 'Paused'}</div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {timerIsActive ? (
                    <Button size="icon" variant="ghost" onClick={pauseTimer}>
                        <Pause className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button size="icon" variant="ghost" onClick={startTimer}>
                        <Play className="h-4 w-4" />
                    </Button>
                )}
                 <Button size="icon" variant="ghost" onClick={logTimer}>
                    <Square className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
