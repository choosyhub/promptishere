
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHourLog } from "@/hooks/use-hour-log";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const calculateProjection = (totalHours: number, dailyAverage: number, fixedDailyHours?: number) => {
    if (totalHours >= 10000) {
        return { success: true, data: { estimatedEndDate: new Date().toISOString(), remainingDays: 0 } };
    }

    let dailyHours = fixedDailyHours ?? dailyAverage;

    if (dailyHours <= 0) {
        return { success: false, error: 'Cannot project with zero or negative daily hours.' };
    }
    
    const targetHours = 10000;
    const remainingHours = targetHours - totalHours;
    const remainingDays = remainingHours / dailyHours;

    const estimatedEndDate = new Date();
    estimatedEndDate.setDate(estimatedEndDate.getDate() + remainingDays);

    return {
        success: true,
        data: {
            estimatedEndDate: estimatedEndDate.toISOString(),
            remainingDays: Math.ceil(remainingDays),
        }
    };
};

export function ProjectionCard() {
    const { totalHours, dailyAverageHours, isLoaded } = useHourLog();
    const [projection, setProjection] = useState<{ endDate: string; remainingDays: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleProjection = () => {
            setIsLoading(true);
            setError(null);
            setProjection(null);

            const result = calculateProjection(totalHours, dailyAverageHours, 16);

            if (result.success) {
                setProjection({
                    endDate: format(new Date(result.data.estimatedEndDate), "MMMM d, yyyy"),
                    remainingDays: result.data.remainingDays,
                });
            } else {
                setError(result.error);
            }
            setIsLoading(false);
        };
        
        if (isLoaded) {
            handleProjection();
        }
    }, [isLoaded, totalHours, dailyAverageHours]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>End Date Projection</CardTitle>
                <CardDescription>Estimated completion date based on a fixed pace of 16 hours/day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                )}

                {!isLoading && projection && (
                     <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Estimated Completion</AlertTitle>
                        <AlertDescription>
                            <p className="font-bold text-lg">{projection.endDate}</p>
                            <p>Approximately {projection.remainingDays.toLocaleString()} days remaining.</p>
                        </AlertDescription>
                    </Alert>
                )}

                {!isLoading && error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Projection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
