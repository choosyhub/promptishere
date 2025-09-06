
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHourLog } from "@/hooks/use-hour-log";
import { levels } from "@/lib/levels";
import { Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function LevelCard() {
    const { levelInfo, isLoaded } = useHourLog();
    const nextLevel = levels.find(l => l.hours === levelInfo.nextLevelHours);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
                {isLoaded ? (
                    <>
                        <div className="text-2xl font-bold">{levelInfo.level}</div>
                        {levelInfo.level !== "Mastery" ? (
                            <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress to {nextLevel?.name}</span>
                                    <span>{levelInfo.progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={levelInfo.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {levelInfo.hoursForNext.toFixed(1)} hours to go.
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">You've reached the pinnacle!</p>
                        )}
                    </>
                ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
