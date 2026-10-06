-- CSV Import/Export Audit History
CREATE TABLE public.csv_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation TEXT NOT NULL CHECK (operation IN ('IMPORT', 'EXPORT')),
    module_name TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    filename TEXT,
    total_records INT DEFAULT 0,
    successful_records INT DEFAULT 0,
    error_records INT DEFAULT 0,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CSV Conflicts
CREATE TABLE public.csv_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_id UUID REFERENCES public.csv_history(id) ON DELETE CASCADE,
    row_data JSONB,
    conflict_reason TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KarateTech Participant Identity Mapping
CREATE TABLE public.scms_karatetech_participant_links (
    scms_member_id TEXT NOT NULL,
    scms_participant_id TEXT,
    karatetech_participant_id TEXT,
    club_id UUID REFERENCES public.clubs(id),
    sync_status TEXT DEFAULT 'PENDING' CHECK (sync_status IN ('PENDING', 'LINKED', 'SYNCED', 'CONFLICT', 'ERROR', 'DISCONNECTED')),
    sync_version INT DEFAULT 1,
    last_synced_at TIMESTAMPTZ,
    last_sync_direction TEXT CHECK (last_sync_direction IN ('SCMS_TO_KT', 'KT_TO_SCMS')),
    PRIMARY KEY (scms_member_id)
);

-- Sync History Audit
CREATE TABLE public.sync_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scms_participant_id TEXT,
    karatetech_participant_id TEXT,
    club_id UUID,
    operation TEXT,
    direction TEXT,
    status TEXT,
    fields_changed JSONB,
    conflicts JSONB,
    user_id UUID REFERENCES public.profiles(id),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    completion_time TIMESTAMPTZ,
    error_message TEXT
);

-- Audit Logs for General System Actions
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    changes JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.csv_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scms_karatetech_participant_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
