-- CreateExtension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateFunction
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTable users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('admin'))
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- CreateTable admin_sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    user_agent TEXT NULL,
    ip_address INET NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_admin_sessions_exp CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id
    ON admin_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
    ON admin_sessions(expires_at);

CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_sessions_token_hash
    ON admin_sessions(token_hash);

-- CreateTable animals
CREATE TABLE IF NOT EXISTS animals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(20) NOT NULL,
    breed VARCHAR(120) NULL,
    sex VARCHAR(20) NOT NULL DEFAULT 'unknown',
    age_months INT NULL,
    size VARCHAR(20) NULL,
    color VARCHAR(80) NULL,
    weight_kg NUMERIC(5,2) NULL,
    description TEXT NULL,
    health_notes TEXT NULL,
    intake_date DATE NULL,
    is_vaccinated BOOLEAN NOT NULL DEFAULT FALSE,
    is_neutered BOOLEAN NOT NULL DEFAULT FALSE,
    is_dewormed BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT chk_animals_species CHECK (species IN ('dog', 'cat', 'other')),
    CONSTRAINT chk_animals_sex CHECK (sex IN ('male', 'female', 'unknown')),
    CONSTRAINT chk_animals_size CHECK (size IN ('small', 'medium', 'large') OR size IS NULL),
    CONSTRAINT chk_animals_status CHECK (status IN ('available', 'in_process', 'adopted', 'unavailable')),
    CONSTRAINT chk_animals_age CHECK (age_months IS NULL OR age_months >= 0),
    CONSTRAINT chk_animals_weight CHECK (weight_kg IS NULL OR weight_kg >= 0)
);

CREATE TRIGGER trg_animals_updated_at
BEFORE UPDATE ON animals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_animals_status
    ON animals(status);

CREATE INDEX IF NOT EXISTS idx_animals_species
    ON animals(species);

CREATE INDEX IF NOT EXISTS idx_animals_published_active
    ON animals(status, created_at DESC)
    WHERE published = TRUE AND deleted_at IS NULL;

-- CreateTable animal_images
CREATE TABLE IF NOT EXISTS animal_images (
    id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NULL,
    mime_type VARCHAR(80) NULL,
    alt_text VARCHAR(180) NULL,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT chk_animal_images_sort_order CHECK (sort_order >= 0)
);

CREATE INDEX IF NOT EXISTS idx_animal_images_animal_id
    ON animal_images(animal_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_animal_cover_image
    ON animal_images(animal_id)
    WHERE is_cover = TRUE AND deleted_at IS NULL;

-- CreateTable news
CREATE TABLE IF NOT EXISTS news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    category VARCHAR(30) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NULL,
    image_url TEXT NULL,
    event_date DATE NULL,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMP NULL,
    created_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT chk_news_category CHECK (
        category IN ('donation', 'missing', 'event', 'raffle', 'announcement')
    )
);

CREATE TRIGGER trg_news_updated_at
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_news_slug_active
    ON news(slug)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_news_published
    ON news(published, published_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_news_category
    ON news(category)
    WHERE deleted_at IS NULL;
