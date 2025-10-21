-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Graviditet (Pregnancy) - hovedtabell
CREATE TABLE pregnancies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

    -- Grunnleggende informasjon
    last_menstruation_date DATE NOT NULL,
    expected_due_date DATE NOT NULL,
    ultrasound_due_date DATE, -- Justert termindato basert på ultralyd

    -- Personlig informasjon
    civil_status TEXT,
    education TEXT,
    occupation TEXT,
    workplace TEXT,
    country_background TEXT,
    language TEXT,
    interpreter_needed BOOLEAN DEFAULT false,

    -- Kontaktinformasjon
    gp_name TEXT,
    gp_phone TEXT,
    midwife_name TEXT,
    midwife_phone TEXT,

    -- Graviditetshistorikk
    is_first_pregnancy BOOLEAN DEFAULT true,
    previous_pregnancies_count INTEGER DEFAULT 0,
    previous_births_count INTEGER DEFAULT 0,

    -- Livsstil
    diet_notes TEXT,
    takes_folic_acid BOOLEAN DEFAULT false,
    physical_activity TEXT,
    smoking BOOLEAN DEFAULT false,
    snus BOOLEAN DEFAULT false,
    alcohol BOOLEAN DEFAULT false,
    other_substances TEXT,

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pregnancies"
    ON pregnancies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pregnancies"
    ON pregnancies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pregnancies"
    ON pregnancies FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pregnancies"
    ON pregnancies FOR DELETE
    USING (auth.uid() = user_id);

-- Tidligere graviditeter/fødsler (historikk)
CREATE TABLE previous_pregnancies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,

    year INTEGER,
    birth_weight INTEGER, -- i gram
    gestational_weeks INTEGER,
    gestational_days INTEGER,
    breastfeeding_months INTEGER,
    was_premature BOOLEAN DEFAULT false,
    had_preeclampsia BOOLEAN DEFAULT false,
    complications TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE previous_pregnancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own previous pregnancies"
    ON previous_pregnancies FOR ALL
    USING (
        pregnancy_id IN (
            SELECT id FROM pregnancies WHERE user_id = auth.uid()
        )
    );

-- Medisinske forhold
CREATE TABLE medical_conditions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,

    condition_name TEXT NOT NULL,
    description TEXT,
    requires_followup BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own medical conditions"
    ON medical_conditions FOR ALL
    USING (
        pregnancy_id IN (
            SELECT id FROM pregnancies WHERE user_id = auth.uid()
        )
    );

-- Konsultasjoner (Checkups)
CREATE TABLE checkups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,

    -- Tidspunkt
    checkup_date DATE NOT NULL,
    gestational_weeks INTEGER,
    gestational_days INTEGER,

    -- Type konsultasjon
    checkup_type TEXT, -- 'Første konsultasjon', 'Rutinekontroll', 'Ultralyd', etc
    location TEXT, -- 'Fastlege', 'Jordmor', 'Sykehus'
    performed_by TEXT, -- Navn på helsepersonell

    -- Målinger
    weight_kg DECIMAL(5,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    symphysis_fundal_height_cm DECIMAL(4,1),

    -- Urinprøve
    urine_protein TEXT, -- 'Negativ', 'Spor', '+', '++', '+++'
    urine_glucose TEXT,
    urine_bacteria BOOLEAN,

    -- Blodprøver
    hemoglobin DECIMAL(4,1),

    -- Fosterlyd
    fetal_heartbeat BOOLEAN,
    fetal_heartbeat_rate INTEGER,

    -- Fosterbevegelser
    fetal_movements TEXT,

    -- Notater
    notes TEXT,
    next_appointment_date DATE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE checkups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkups"
    ON checkups FOR ALL
    USING (
        pregnancy_id IN (
            SELECT id FROM pregnancies WHERE user_id = auth.uid()
        )
    );

-- Ultralyd undersøkelser
CREATE TABLE ultrasounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,

    ultrasound_date DATE NOT NULL,
    gestational_weeks INTEGER NOT NULL,
    gestational_days INTEGER,

    -- Type ultralyd
    ultrasound_type TEXT, -- 'Tidlig ultralyd (uke 11-13)', 'Rutine ultralyd (uke 17-19)', 'Ekstra ultralyd'

    -- Målinger
    crown_rump_length_mm DECIMAL(5,1), -- Sete-isse lengde (CRL)
    biparietal_diameter_mm DECIMAL(5,1), -- BPD
    head_circumference_mm DECIMAL(6,1), -- HC
    abdominal_circumference_mm DECIMAL(6,1), -- AC
    femur_length_mm DECIMAL(5,1), -- FL
    estimated_fetal_weight_g INTEGER,

    -- Nukkapakelse (for tidlig ultralyd)
    nuchal_translucency_mm DECIMAL(3,1),

    -- Morkake og fostervann
    placenta_location TEXT,
    placenta_notes TEXT,
    amniotic_fluid_level TEXT, -- 'Normal', 'Høy', 'Lav'

    -- Antall fostre
    number_of_fetuses INTEGER DEFAULT 1,

    -- Funn
    findings TEXT,
    anomalies_detected BOOLEAN DEFAULT false,

    -- NIPT samtykke
    nipt_consent_given BOOLEAN,

    performed_by TEXT,
    location TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ultrasounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ultrasounds"
    ON ultrasounds FOR ALL
    USING (
        pregnancy_id IN (
            SELECT id FROM pregnancies WHERE user_id = auth.uid()
        )
    );

-- Blodprøver og tester
CREATE TABLE blood_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,

    test_date DATE NOT NULL,
    test_type TEXT NOT NULL, -- 'Hemoglobin', 'Blodtype', 'Antistoffer', 'Infeksjonsprøver', etc

    -- Blodtype
    blood_type TEXT, -- 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'

    -- Hemoglobin
    hemoglobin_value DECIMAL(4,1),

    -- Antistoffer
    antibodies_detected BOOLEAN,
    antibody_details TEXT,

    -- Infeksjonsprøver
    rubella_immune BOOLEAN,
    hepatitis_b TEXT,
    hiv TEXT,
    syphilis TEXT,

    -- Andre tester
    test_result TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blood_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blood tests"
    ON blood_tests FOR ALL
    USING (
        pregnancy_id IN (
            SELECT id FROM pregnancies WHERE user_id = auth.uid()
        )
    );

-- Påminnelser for kommende kontroller
CREATE TABLE reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,

    reminder_date DATE NOT NULL,
    reminder_type TEXT NOT NULL, -- 'Kontroll', 'Ultralyd', 'Blodprøve', 'Annet'
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,

    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminders"
    ON reminders FOR ALL
    USING (
        pregnancy_id IN (
            SELECT id FROM pregnancies WHERE user_id = auth.uid()
        )
    );

-- Indekser for bedre ytelse
CREATE INDEX idx_pregnancies_user_id ON pregnancies(user_id);
CREATE INDEX idx_pregnancies_active ON pregnancies(user_id, is_active);
CREATE INDEX idx_checkups_pregnancy_id ON checkups(pregnancy_id);
CREATE INDEX idx_checkups_date ON checkups(pregnancy_id, checkup_date);
CREATE INDEX idx_ultrasounds_pregnancy_id ON ultrasounds(pregnancy_id);
CREATE INDEX idx_blood_tests_pregnancy_id ON blood_tests(pregnancy_id);
CREATE INDEX idx_reminders_pregnancy_id ON reminders(pregnancy_id);
CREATE INDEX idx_reminders_date ON reminders(pregnancy_id, reminder_date, is_completed);

-- Funksjoner for automatisk oppdatering av updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pregnancies_updated_at BEFORE UPDATE ON pregnancies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkups_updated_at BEFORE UPDATE ON checkups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
