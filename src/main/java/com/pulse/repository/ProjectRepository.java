package com.pulse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pulse.entity.Project;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {

}