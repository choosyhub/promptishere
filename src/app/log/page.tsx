
'use client';

import { ManualEntryCard } from "@/components/logging/manual-entry-card";
import { TimerCard } from "@/components/logging/timer-card";
import { useProject } from "@/hooks/use-project";
import { ProjectCard } from "@/components/project/project-card";
import { FolderKanban, Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

const NewProjectDialog = () => {
    const { addProject } = useProject();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState<Date | undefined>();

    const handleSubmit = () => {
        if (name && deadline) {
            addProject({ name, deadline });
            setOpen(false);
            setName("");
            setDeadline(undefined);
        }
    };
    
    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            setDeadline(undefined);
            return;
        }
        const currentDeadline = deadline || new Date();
        const newDeadline = new Date(date);
        newDeadline.setHours(currentDeadline.getHours(), currentDeadline.getMinutes());
        setDeadline(newDeadline);
    }
    
    const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
        if (!deadline) return;
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) return;
        
        const isPM = deadline.getHours() >= 12;

        let newDeadline: Date;
        if (type === 'hours') {
            const hours12 = numericValue % 12;
            const hours24 = isPM ? hours12 + 12 : hours12;
            newDeadline = setHours(deadline, hours24);
        } else {
            newDeadline = setMinutes(deadline, numericValue);
        }
        setDeadline(newDeadline);
    }
    
    const handlePeriodChange = (period: 'am' | 'pm') => {
        if (!deadline) return;
        const currentHours = deadline.getHours();
        if (period === 'pm' && currentHours < 12) {
            setDeadline(setHours(deadline, currentHours + 12));
        } else if (period === 'am' && currentHours >= 12) {
            setDeadline(setHours(deadline, currentHours - 12));
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>Set a name and deadline for your new project.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">Deadline</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !deadline && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deadline ? format(deadline, "PPP p") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={deadline} onSelect={handleDateSelect} initialFocus />
                                <div className="p-4 border-t flex items-end gap-2">
                                     <div className="grid gap-1">
                                        <Label htmlFor="hours">Hours</Label>
                                        <Input
                                            id="hours"
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={deadline ? format(deadline, 'h') : ''}
                                            onChange={(e) => handleTimeChange('hours', e.target.value)}
                                            className="w-16"
                                            disabled={!deadline}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor="minutes">Minutes</Label>
                                        <Input
                                            id="minutes"
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={deadline ? format(deadline, 'mm') : ''}
                                            onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                            className="w-16"
                                            disabled={!deadline}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label>Period</Label>
                                        <ToggleGroup 
                                            type="single"
                                            disabled={!deadline}
                                            value={deadline ? format(deadline, 'a').toLowerCase() : ''}
                                            onValueChange={(value) => {
                                                if (value === 'am' || value === 'pm') handlePeriodChange(value)
                                            }}
                                        >
                                            <ToggleGroupItem value="am">AM</ToggleGroupItem>
                                            <ToggleGroupItem value="pm">PM</ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!name || !deadline}>Create Project</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function LogPage() {
  const { projects } = useProject();
  const [showHiddenProjects, setShowHiddenProjects] = useState(false);

  const activeProjects = projects.filter(p => p.isActive);
  const hiddenProjects = projects.filter(p => !p.isActive);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Log Hours</h1>
        <p className="text-muted-foreground">Manually log time or use the live timer.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ManualEntryCard />
        <TimerCard />
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Projects</h2>
                <p className="text-muted-foreground">Manage your active deadlines and associate hours with them.</p>
            </div>
            <div className="flex gap-2">
                {hiddenProjects.length > 0 && (
                    <Button variant="outline" onClick={() => setShowHiddenProjects(!showHiddenProjects)}>
                        <Archive className="mr-2 h-4 w-4" /> Hidden ({hiddenProjects.length})
                    </Button>
                )}
                <NewProjectDialog />
            </div>
        </div>

        {activeProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} showActions={true} />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64">
                <FolderKanban className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">No active projects yet.</p>
                <p className="text-sm text-muted-foreground">Click "New Project" to add your first one.</p>
            </div>
        )}
      </div>

      {showHiddenProjects && hiddenProjects.length > 0 && (
        <>
            <Separator />
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Hidden Projects</h2>
                    <p className="text-muted-foreground">These projects are not displayed on the dashboard.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {hiddenProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} showActions={true} />
                    ))}
                </div>
            </div>
        </>
      )}

    </div>
  );
}
