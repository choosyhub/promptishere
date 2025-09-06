
"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useHourLog } from './use-hour-log';
import type { Project } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';


interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'isActive'>) => void;
  deleteProject: (projectId: string) => void;
  toggleProjectVisibility: (projectId: string) => void;
  isLoaded: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { isLoaded, data, saveData } = useHourLog();

  const projects = useMemo(() => {
    if (!isLoaded || !data.projects) return [];
    return (data.projects || []).map(p => ({
        ...p,
        deadline: new Date(p.deadline),
        createdAt: new Date(p.createdAt),
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [isLoaded, data.projects]);
  
  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'isActive'>) => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date(),
      isActive: true, // New projects are active by default
    };
    const updatedProjects = [...data.projects, newProject];
    saveData({ ...data, projects: updatedProjects });
  }, [data, saveData]);

  const deleteProject = (projectId: string) => {
    const updatedProjects = data.projects.filter(p => p.id !== projectId);
    saveData({ ...data, projects: updatedProjects });
  };

  const toggleProjectVisibility = (projectId: string) => {
    const updatedProjects = data.projects.map(p =>
      p.id === projectId ? { ...p, isActive: !p.isActive } : p
    );
    saveData({ ...data, projects: updatedProjects });
  };
  
  const value = { projects, addProject, deleteProject, toggleProjectVisibility, isLoaded };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
