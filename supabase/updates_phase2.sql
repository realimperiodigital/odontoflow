-- Add new columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS must_change_password boolean DEFAULT true;

-- Update RLS Policies
-- Enable RLS on profiles if not already (it should be)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see profiles in their clinic
DROP POLICY IF EXISTS "Users can view profiles in their clinic" ON profiles;
CREATE POLICY "Users can view profiles in their clinic"
ON profiles FOR SELECT
USING (
  clinic_id IN (
    SELECT clinic_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can update their own profile (optional, or specific fields)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Note: Service Role bypasses RLS, so the API will work for creation/edits regardless of these policies.
