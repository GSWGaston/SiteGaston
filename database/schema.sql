CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  year TEXT,
  status TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft',
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  disciplines JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail TEXT,
  cover TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  accent TEXT NOT NULL DEFAULT '#d8ff4f',
  project_index TEXT NOT NULL DEFAULT '01',
  sort_order INTEGER NOT NULL DEFAULT 0,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT projects_publication_status_check CHECK (publication_status IN ('draft', 'published', 'hidden'))
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS publication_status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS blocks JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE projects SET publication_status = CASE WHEN published THEN 'published' ELSE 'draft' END
WHERE publication_status = 'draft' AND published = true;

CREATE INDEX IF NOT EXISTS projects_publication_sort_idx ON projects (publication_status, sort_order, created_at);
