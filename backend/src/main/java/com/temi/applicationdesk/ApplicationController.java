package com.temi.applicationdesk;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository repository;

    public ApplicationController(ApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<JobApplication> getApplications() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication createApplication(
            @Valid @RequestBody JobApplication application) {

        return repository.create(application);
    }

    @PutMapping("/{id}")
    public JobApplication updateApplication(
            @PathVariable("id") String id,
            @Valid @RequestBody JobApplication application) {

        if (!repository.update(id, application)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Application not found"
            );
        }

        return new JobApplication(
            id,
            application.company().trim(),
            application.role().trim(),
            application.status()
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplication(@PathVariable("id") String id) {
        if (!repository.delete(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Application not found"
            );
        }
    }
}