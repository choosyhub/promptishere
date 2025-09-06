
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHourLog } from "@/hooks/use-hour-log";
import { useProject } from "@/hooks/use-project";
import { Plus } from "lucide-react";

const formSchema = z.object({
  hours: z.coerce
    .number({ invalid_type_error: "Please enter a number." })
    .min(0.1, "Must be greater than 0.")
    .max(16, "Daily cap is 16 hours."),
  projectId: z.string().optional(),
});

export function ManualEntryCard() {
  const { addLog } = useHourLog();
  const { projects } = useProject();
  const activeProjects = projects.filter(p => p.isActive);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: "" as any,
      projectId: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addLog(values.hours, values.projectId);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Entry</CardTitle>
        <CardDescription>Log a block of hours you've completed.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Worked</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2.5" {...field} step="0.1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {activeProjects.length > 0 && (
                <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">No Project</SelectItem>
                                    {activeProjects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Associate these hours with an active project.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              )}
               <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Log Hours
              </Button>
            </CardContent>
        </form>
      </Form>
    </Card>
  );
}
