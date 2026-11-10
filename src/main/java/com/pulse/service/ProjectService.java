package com.pulse.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.pulse.entity.Project;
import com.pulse.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    public Project getProject(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found"));
    }

    public Project createProject(Project project) {
        return repository.save(project);
    }

    public Project updateProject(Long id, Project updated) {

        Project existing = getProject(id);

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setDeadline(updated.getDeadline());

        return repository.save(existing);
    }

    public void deleteProject(Long id) {
        Project existing = getProject(id);
        repository.delete(existing);
    }
}