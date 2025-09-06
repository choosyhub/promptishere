
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, differenceInSeconds, intervalToDuration } from "date-fns";
import type { Project } from "@/lib/types";
import { useProject } from "@/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
}

export const ProjectCard = ({ project, showActions = false }: ProjectCardProps) => {
  const [now, setNow] = useState(new Date());
  const { deleteProject, toggleProjectVisibility } = useProject();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const totalSeconds = differenceInSeconds(new Date(project.deadline), new Date(project.createdAt));
  const elapsedSeconds = differenceInSeconds(now, new Date(project.createdAt));
  const percentageElapsed = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 100;
  
  const isPastDeadline = now > new Date(project.deadline);

  const duration = intervalToDuration({
    start: isPastDeadline ? new Date(project.deadline) : now,
    end: new Date(project.deadline)
  });

  const formattedCountdown = isPastDeadline 
    ? "Deadline Passed"
    : `${duration.days || 0}d ${duration.hours || 0}h ${duration.minutes || 0}m ${duration.seconds || 0}s`;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>Deadline: {format(new Date(project.deadline), "PPP p")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div>
          <p className="text-sm font-medium mb-1">
            Time Remaining
          </p>
          <p className="text-xl font-sans font-semibold">
            {formattedCountdown}
          </p>
        </div>
        <Progress value={Math.min(100, percentageElapsed)} className="h-2" />
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => toggleProjectVisibility(project.id)} className="w-full">
                {project.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {project.isActive ? "Hide from Dashboard" : "Show on Dashboard"}
            </Button>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete the project "{project.name}". This cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete project
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};
