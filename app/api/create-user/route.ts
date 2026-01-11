import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { createClient } from '@supabase/supabase-js';

// Initializes a client to verify the caller's session (standard user)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Authentication of the requester
        // We need to check if the requester is logged in and is a 'clinic_admin' or 'master'
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const supabase = createClient(supabaseUrl, supabaseAnon);
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get requester's profile to check role and clinic_id
        // We use supabaseAdmin here to be sure we can read profiles, but RLS should allow reading own profile.
        // Using admin for safety to ensure we get the data.
        const { data: requesterProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role, clinic_id')
            .eq('user_id', user.id)
            .single();

        if (profileError || !requesterProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
        }

        const { role: requesterRole, clinic_id: requesterClinicId } = requesterProfile;

        // Only master or clinic_admin can create users
        if (requesterRole !== 'master' && requesterRole !== 'clinic_admin') {
            return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }

        // 3. Parse Request Body
        const body = await req.json();
        const {
            name,
            email,
            department,
            job_title,
            phone,
            role,
            birth_date,
            // Optional: override clinic_id (only for master?) 
            // For clinic_admin, MUST use requesterClinicId
            target_clinic_id
        } = body;

        // Validation
        if (!email || !role || !name) {
            return NextResponse.json({ error: 'Missing required fields (email, role, name)' }, { status: 400 });
        }

        // Determine target clinic
        let finalClinicId = requesterClinicId;
        if (requesterRole === 'master' && target_clinic_id) {
            finalClinicId = target_clinic_id;
        }

        if (!finalClinicId && requesterRole !== 'master') {
            // Master creating a master user? Maybe. But typical flow is creating clinic staff.
            return NextResponse.json({ error: 'Clinic ID context missing' }, { status: 400 });
        }

        // 4. Create User in Supabase Auth (using Service Role)
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // simple random pass

        const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { full_name: name }
        });

        if (createError) {
            return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        if (!createdUser.user) {
            return NextResponse.json({ error: 'User creation failed unexpectedly' }, { status: 500 });
        }

        // 5. Create Profile
        // The trigger might have created a profile already? 
        // In Phase 1.1 we created a trigger "Ao criar uma clínica...".
        // Wait, the Phase 1.1 trigger was: "Ao criar um usuário... criar automaticamente um profile".
        // If that trigger exists and is active, it will create a profile. We need to UPDATE it with the details.
        // IF the trigger creates it with default 'admin', we need to fix it.

        // Let's assume the trigger exists. We will upsert/update the profile.
        const { error: profileUpdateError } = await supabaseAdmin
            .from('profiles')
            .update({
                clinic_id: finalClinicId,
                role: role, // 'reception', 'financial', 'dentist', 'staff'
                full_name: name,
                department,
                job_title,
                phone,
                birth_date: birth_date || null,
                must_change_password: true
            })
            .eq('user_id', createdUser.user.id);

        // If update fails (maybe record doesn't exist if trigger didn't run?), we try insert.
        if (profileUpdateError) {
            // Try insert if update failed (though likely it failed due to schema/logic, but let's try upsert logic)
            // Actually, best to UPSERT.
            const { error: upsertError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    user_id: createdUser.user.id,
                    clinic_id: finalClinicId,
                    role: role,
                    full_name: name,
                    department,
                    job_title,
                    phone,
                    birth_date: birth_date || null,
                    must_change_password: true
                });

            if (upsertError) {
                // Rollback user creation? Hard to do perfectly, but good hygiene.
                await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id);
                return NextResponse.json({ error: 'Failed to create profile: ' + upsertError.message }, { status: 500 });
            }
        }

        // 6. Return Success + Temp Password
        return NextResponse.json({
            success: true,
            temp_password: tempPassword,
            user_id: createdUser.user.id
        });

    } catch (err: any) {
        console.error('API create-user error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
