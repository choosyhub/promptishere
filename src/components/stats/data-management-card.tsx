
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHourLog } from "@/hooks/use-hour-log";
import { Download, Trash2, AlertTriangle, Upload } from "lucide-react";
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
import { Input } from "../ui/input";

export function DataManagementCard() {
    const { exportData, importData, resetData, isLoaded } = useHourLog();
    const [showFirstConfirm, setShowFirstConfirm] = useState(false);
    const [showSecondConfirm, setShowSecondConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleReset = () => {
        resetData();
        setShowFirstConfirm(false);
        setShowSecondConfirm(false);
    }
    
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importData(file);
        }
        // Reset file input to allow importing the same file again
        event.target.value = '';
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or reset your progress data.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <Button onClick={handleImportClick} disabled={!isLoaded}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                </Button>
                <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="application/json"
                />

                <Button onClick={exportData} disabled={!isLoaded}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>

                <AlertDialog open={showFirstConfirm} onOpenChange={setShowFirstConfirm}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={!isLoaded}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Reset Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete all your logged hours and project data. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                setShowFirstConfirm(false);
                                setShowSecondConfirm(true);
                            }}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showSecondConfirm} onOpenChange={setShowSecondConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="text-destructive" /> Final Confirmation
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Your entire history will be erased. Are you sure you want to proceed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                                Yes, delete my data
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
