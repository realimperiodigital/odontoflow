-- Phase 5: Dashboard Expansion
-- 1. Update Patients Table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS cpf text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS number text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS email text;

-- 2. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id uuid REFERENCES clinics(id) NOT NULL,
    dentist_id uuid REFERENCES profiles(user_id), -- Assigned dentist
    patient_id uuid REFERENCES patients(id) NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    status text CHECK (status IN ('confirmed', 'pending', 'missed', 'rescheduled')) DEFAULT 'pending',
    room text,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- 3. RLS for Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clinic isolation for appointments" ON appointments;
CREATE POLICY "Clinic isolation for appointments" ON appointments
    USING (clinic_id IN (SELECT clinic_id FROM profiles WHERE user_id = auth.uid()))
    WITH CHECK (clinic_id IN (SELECT clinic_id FROM profiles WHERE user_id = auth.uid()));

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_date ON appointments(clinic_id, start_time);
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);
