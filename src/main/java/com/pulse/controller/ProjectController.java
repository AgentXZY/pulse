package com.pulse.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.pulse.entity.Project;
import com.pulse.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // Get all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return service.getAllProjects();
    }

    // Get project by ID
    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return service.getProject(id);
    }

    // Create project
    @PostMapping
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody Project project) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createProject(project));
    }

    // Update project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @Valid @RequestBody Project project) {

        return service.updateProject(id, project);
    }

    // Delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id) {

        service.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}