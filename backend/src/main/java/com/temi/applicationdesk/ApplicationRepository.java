package com.temi.applicationdesk;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationRepository {

    private final JdbcTemplate database;

    public ApplicationRepository(JdbcTemplate database) {
        this.database = database;
    }

    public List<JobApplication> findAll() {
        String sql = """
            SELECT id, company, role, status
            FROM applications
            ORDER BY company, role, id
            """;

        return database.query(sql, (row, rowNumber) ->
            new JobApplication(
                row.getString("id"),
                row.getString("company"),
                row.getString("role"),
                row.getString("status")
            )
        );
    }

    public JobApplication create(JobApplication application) {
        String id = UUID.randomUUID().toString();

        JobApplication saved = new JobApplication(
            id,
            application.company().trim(),
            application.role().trim(),
            application.status()
        );

        database.update(
            """
            INSERT INTO applications (id, company, role, status)
            VALUES (?, ?, ?, ?)
            """,
            saved.id(),
            saved.company(),
            saved.role(),
            saved.status()
        );

        return saved;
    }

    public boolean update(String id, JobApplication application) {
        int changedRows = database.update(
            """
            UPDATE applications
            SET company = ?, role = ?, status = ?
            WHERE id = ?
            """,
            application.company().trim(),
            application.role().trim(),
            application.status(),
            id
        );

        return changedRows > 0;
    }

    public boolean delete(String id) {
        int changedRows = database.update(
            "DELETE FROM applications WHERE id = ?",
            id
        );

        return changedRows > 0;
    }
}