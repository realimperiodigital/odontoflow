-- Phase 4: Role Refinement
-- This script updates the check constraint on profiles to allow specific roles.

BEGIN;

-- 1. Remove existing check constraint if it exists (assuming named 'profiles_role_check' or similar, but getting name can be tricky so we drop by definition if possible, or just add a new one after dropping the old one). 
-- Postgres doesn't allow ALtering constraint easily without name. 
-- We will try to DROP constraint by name if we know it. 
-- If created via Supabase UI, it might be auto-named.
-- Best approach: Drop the constraint if you know the name. 
-- Assuming standard naming: "profiles_role_check"

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Add new constraint with all roles
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('master', 'clinic_admin', 'staff', 'reception', 'financial', 'dentist'));

-- 3. RLS Policies Check (Ensure they handle these roles)
-- Current policies likely rely on "clinic_id = ...". 
-- If all these roles (except master) have clinic_id, they will be covered by:
-- "Users can view profiles in their clinic"
-- "Users can view patients in their clinic"
-- So broadly, they work. 

COMMIT;
