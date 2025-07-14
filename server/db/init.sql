CREATE TABLE IF NOT EXISTS raw_events (
    id          UUID        PRIMARY KEY,
    payload     JSONB       NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
