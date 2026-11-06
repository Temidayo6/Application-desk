CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Saved',
    CONSTRAINT valid_status CHECK (
        status IN ('Saved', 'Applied', 'Interview', 'Offer', 'Closed')
    )
);