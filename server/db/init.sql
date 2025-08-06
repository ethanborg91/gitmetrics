CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    email TEXT UNIQUE NOT NULL, 
    hashed_password TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS raw_events (
    id UUID PRIMARY KEY, 
    payload JSONB NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
    user_id UUID REFERENCES users(id) ON DELETE CASCADE  
);