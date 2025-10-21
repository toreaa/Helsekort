-- Fake data for testing
-- OBS: Dette krever at du har en bruker i auth.users tabellen først
-- Du kan opprette en test-bruker via Supabase Dashboard eller signup

-- Legg til fake profil (kun hvis bruker eksisterer)
-- Erstatt 'your-user-uuid' med faktisk bruker-id fra auth.users
-- Eksempel profil (du må oppdatere UUID når du har en ekte bruker)

-- INSTRUKSJON FOR BRUK:
-- 1. Opprett en bruker via Supabase Auth (email: test@helsekort.no, passord: Test123!)
-- 2. Finn brukerens UUID i auth.users tabellen
-- 3. Erstatt 'BRUKER_UUID_HER' nedenfor med den faktiske UUID
-- 4. Kjør denne SQL

-- For testing, her er eksempeldata med placeholder UUID
-- Du MÅ erstatte denne med ekte UUID etter brukeropprettelse

DO $$
DECLARE
    test_user_id UUID;
    test_pregnancy_id UUID;
BEGIN
    -- Sjekk om det finnes en bruker, ellers hopp over
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;

    IF test_user_id IS NOT NULL THEN

        -- Sett inn profil hvis den ikke eksisterer
        INSERT INTO profiles (id, email, full_name, phone)
        VALUES (
            test_user_id,
            'test@helsekort.no',
            'Kari Nordmann',
            '+47 123 45 678'
        )
        ON CONFLICT (id) DO NOTHING;

        -- Opprett en aktiv graviditet
        INSERT INTO pregnancies (
            id,
            user_id,
            last_menstruation_date,
            expected_due_date,
            ultrasound_due_date,
            civil_status,
            education,
            occupation,
            workplace,
            country_background,
            language,
            interpreter_needed,
            gp_name,
            gp_phone,
            midwife_name,
            midwife_phone,
            is_first_pregnancy,
            previous_pregnancies_count,
            previous_births_count,
            diet_notes,
            takes_folic_acid,
            physical_activity,
            smoking,
            snus,
            alcohol,
            other_substances,
            is_active
        ) VALUES (
            uuid_generate_v4(),
            test_user_id,
            '2024-11-01',
            '2025-08-08',
            '2025-08-05',
            'Gift',
            'Høyere utdanning',
            'Sykepleier',
            'Oslo Universitetssykehus',
            'Norge',
            'Norsk',
            false,
            'Dr. Ole Hansen',
            '+47 22 11 22 33',
            'Jordmor Anne Larsen',
            '+47 22 33 44 55',
            false,
            1,
            1,
            'Spiser variert og sunt. Tar tran og folsyre daglig.',
            true,
            'Svømmer 2 ganger i uken, går daglige turer',
            false,
            false,
            false,
            null,
            true
        )
        RETURNING id INTO test_pregnancy_id;

        -- Tidligere graviditet
        INSERT INTO previous_pregnancies (
            pregnancy_id,
            year,
            birth_weight,
            gestational_weeks,
            gestational_days,
            breastfeeding_months,
            was_premature,
            had_preeclampsia,
            complications
        ) VALUES (
            test_pregnancy_id,
            2022,
            3450,
            39,
            4,
            10,
            false,
            false,
            'Ingen komplikasjoner. Normal vaginal fødsel.'
        );

        -- Medisinske forhold
        INSERT INTO medical_conditions (
            pregnancy_id,
            condition_name,
            description,
            requires_followup
        ) VALUES (
            test_pregnancy_id,
            'Astma',
            'Lett astma, bruker Ventoline ved behov. Godt kontrollert.',
            false
        );

        -- Første konsultasjon (uke 8)
        INSERT INTO checkups (
            pregnancy_id,
            checkup_date,
            gestational_weeks,
            gestational_days,
            checkup_type,
            location,
            performed_by,
            weight_kg,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            notes,
            next_appointment_date
        ) VALUES (
            test_pregnancy_id,
            '2024-12-27',
            8,
            0,
            'Første konsultasjon',
            'Fastlege',
            'Dr. Ole Hansen',
            68.5,
            115,
            75,
            'Første konsultasjon gjennomført. Informasjon om fosterdiagnostikk gitt. Henvisning til ultralyd sendt.',
            '2025-01-15'
        );

        -- Konsultasjon uke 12
        INSERT INTO checkups (
            pregnancy_id,
            checkup_date,
            gestational_weeks,
            gestational_days,
            checkup_type,
            location,
            performed_by,
            weight_kg,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            urine_protein,
            notes,
            next_appointment_date
        ) VALUES (
            test_pregnancy_id,
            '2025-01-24',
            12,
            3,
            'Rutinekontroll',
            'Jordmor',
            'Jordmor Anne Larsen',
            69.2,
            118,
            72,
            'Negativ',
            'Ultralyd gjennomført. Se ultralydrapport. Alt ser bra ut.',
            '2025-02-21'
        );

        -- Konsultasjon uke 18
        INSERT INTO checkups (
            pregnancy_id,
            checkup_date,
            gestational_weeks,
            gestational_days,
            checkup_type,
            location,
            performed_by,
            weight_kg,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            urine_protein,
            hemoglobin,
            fetal_heartbeat,
            fetal_heartbeat_rate,
            notes,
            next_appointment_date
        ) VALUES (
            test_pregnancy_id,
            '2025-03-07',
            18,
            2,
            'Rutinekontroll',
            'Jordmor',
            'Jordmor Anne Larsen',
            71.8,
            120,
            75,
            'Negativ',
            13.2,
            true,
            148,
            'Rutineultralyd gjennomført ved sykehus. Føler fosterbevegelser. Alt normalt.',
            '2025-04-04'
        );

        -- Konsultasjon uke 24
        INSERT INTO checkups (
            pregnancy_id,
            checkup_date,
            gestational_weeks,
            gestational_days,
            checkup_type,
            location,
            performed_by,
            weight_kg,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            symphysis_fundal_height_cm,
            urine_protein,
            fetal_heartbeat,
            fetal_heartbeat_rate,
            fetal_movements,
            notes,
            next_appointment_date
        ) VALUES (
            test_pregnancy_id,
            '2025-04-18',
            24,
            0,
            'Rutinekontroll',
            'Jordmor',
            'Jordmor Anne Larsen',
            74.5,
            122,
            78,
            24.0,
            'Negativ',
            true,
            152,
            'Aktive fosterbevegelser',
            'Symfyse-fundus mål starter. Veksten følger kurven bra.',
            '2025-05-16'
        );

        -- Ultralyd uke 12
        INSERT INTO ultrasounds (
            pregnancy_id,
            ultrasound_date,
            gestational_weeks,
            gestational_days,
            ultrasound_type,
            crown_rump_length_mm,
            nuchal_translucency_mm,
            placenta_location,
            amniotic_fluid_level,
            number_of_fetuses,
            findings,
            anomalies_detected,
            nipt_consent_given,
            performed_by,
            location
        ) VALUES (
            test_pregnancy_id,
            '2025-01-24',
            12,
            3,
            'Tidlig ultralyd (uke 11-13)',
            58.5,
            1.4,
            'Fremre vegg',
            'Normal',
            1,
            'Normal utvikling. Nakkefold innenfor normalområdet. Termin justert til 05.08.2025.',
            false,
            true,
            'Dr. Emma Berg',
            'Oslo Universitetssykehus'
        );

        -- Ultralyd uke 18
        INSERT INTO ultrasounds (
            pregnancy_id,
            ultrasound_date,
            gestational_weeks,
            gestational_days,
            ultrasound_type,
            biparietal_diameter_mm,
            head_circumference_mm,
            abdominal_circumference_mm,
            femur_length_mm,
            estimated_fetal_weight_g,
            placenta_location,
            amniotic_fluid_level,
            number_of_fetuses,
            findings,
            anomalies_detected,
            performed_by,
            location
        ) VALUES (
            test_pregnancy_id,
            '2025-03-07',
            18,
            2,
            'Rutine ultralyd (uke 17-19)',
            42.3,
            158.7,
            138.2,
            28.1,
            240,
            'Fremre vegg',
            'Normal',
            1,
            'Alle organer ser normale ut. Ingen tegn til misdannelser. Foster vokser som forventet.',
            false,
            'Dr. Emma Berg',
            'Oslo Universitetssykehus'
        );

        -- Blodprøver - Blodtype
        INSERT INTO blood_tests (
            pregnancy_id,
            test_date,
            test_type,
            blood_type,
            notes
        ) VALUES (
            test_pregnancy_id,
            '2024-12-27',
            'Blodtype',
            'A+',
            'Blodtype A positiv. Ingen RhD immunisering nødvendig.'
        );

        -- Blodprøver - Infeksjonsprøver
        INSERT INTO blood_tests (
            pregnancy_id,
            test_date,
            test_type,
            rubella_immune,
            hepatitis_b,
            hiv,
            syphilis,
            notes
        ) VALUES (
            test_pregnancy_id,
            '2024-12-27',
            'Infeksjonsprøver',
            true,
            'Negativ',
            'Negativ',
            'Negativ',
            'Alle infeksjonsprøver negative. Immun mot røde hunder.'
        );

        -- Blodprøver - Hemoglobin uke 12
        INSERT INTO blood_tests (
            pregnancy_id,
            test_date,
            test_type,
            hemoglobin_value,
            notes
        ) VALUES (
            test_pregnancy_id,
            '2025-01-24',
            'Hemoglobin',
            13.5,
            'Hemoglobin innenfor normalområdet.'
        );

        -- Blodprøver - Hemoglobin uke 18
        INSERT INTO blood_tests (
            pregnancy_id,
            test_date,
            test_type,
            hemoglobin_value,
            notes
        ) VALUES (
            test_pregnancy_id,
            '2025-03-07',
            'Hemoglobin',
            13.2,
            'Hemoglobin fortsatt bra, men noe lavere. Fortsett jerntilskudd.'
        );

        -- Påminnelser
        INSERT INTO reminders (
            pregnancy_id,
            reminder_date,
            reminder_type,
            title,
            description,
            location,
            is_completed
        ) VALUES
        (
            test_pregnancy_id,
            '2025-05-16',
            'Kontroll',
            'Kontroll uke 28',
            'Rutinekontroll hos jordmor',
            'Jordmormottak',
            false
        ),
        (
            test_pregnancy_id,
            '2025-06-06',
            'Kontroll',
            'Kontroll uke 32',
            'Rutinekontroll hos jordmor',
            'Jordmormottak',
            false
        ),
        (
            test_pregnancy_id,
            '2025-06-20',
            'Kontroll',
            'Kontroll uke 34',
            'Rutinekontroll hos jordmor',
            'Jordmormottak',
            false
        ),
        (
            test_pregnancy_id,
            '2025-07-04',
            'Kontroll',
            'Kontroll uke 36',
            'Rutinekontroll hos jordmor. Streptokokkprøve.',
            'Jordmormottak',
            false
        ),
        (
            test_pregnancy_id,
            '2025-07-18',
            'Kontroll',
            'Kontroll uke 38',
            'Rutinekontroll hos jordmor',
            'Jordmormottak',
            false
        ),
        (
            test_pregnancy_id,
            '2025-07-25',
            'Kontroll',
            'Kontroll uke 39',
            'Rutinekontroll hos jordmor',
            'Jordmormottak',
            false
        ),
        (
            test_pregnancy_id,
            '2025-08-01',
            'Kontroll',
            'Kontroll uke 40',
            'Kontroll rundt termin',
            'Jordmormottak',
            false
        );

        RAISE NOTICE 'Fake data inserted successfully for user_id: %', test_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please create a user first via Supabase Auth.';
    END IF;
END $$;
