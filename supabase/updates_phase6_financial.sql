-- Phase 6: Financial Module
-- 1. Create Financial Transactions Table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id uuid REFERENCES clinics(id) NOT NULL,
    description text NOT NULL,
    amount numeric(12, 2) NOT NULL,
    type text CHECK (type IN ('income', 'expense')) NOT NULL,
    category text, -- e.g., 'Consultation', 'Rent', 'Lab', 'Equipment'
    status text CHECK (status IN ('paid', 'pending', 'overdue')) DEFAULT 'pending',
    due_date date,
    payment_date date,
    patient_id uuid REFERENCES patients(id), -- Optional: Link income to patient
    dentist_id uuid REFERENCES profiles(user_id), -- Optional: Link income to dentist for production report
    created_at timestamptz DEFAULT now()
);

-- 2. RLS for Financials
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clinic isolation for financials" ON financial_transactions;
CREATE POLICY "Clinic isolation for financials" ON financial_transactions
    USING (clinic_id IN (SELECT clinic_id FROM profiles WHERE user_id = auth.uid()))
    WITH CHECK (clinic_id IN (SELECT clinic_id FROM profiles WHERE user_id = auth.uid()));

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_finance_clinic_type ON financial_transactions(clinic_id, type);
CREATE INDEX IF NOT EXISTS idx_finance_date ON financial_transactions(clinic_id, due_date);
CREATE INDEX IF NOT EXISTS idx_finance_dentist ON financial_transactions(dentist_id);
