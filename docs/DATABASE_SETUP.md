# Database Setup Instructions

## Step 1: Run the Initial Schema

1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the entire contents of `scripts/001_initial_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the script

This will create:
- `profiles` table for user information
- `vehicles` table for storing vehicle details
- `fuel_entries` table for fuel log entries
- All necessary indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-creating profiles and updating timestamps

## Step 2: Fix the Lock Policy

**IMPORTANT:** You must run this script to enable the lock/unlock functionality.

1. In the Supabase SQL Editor, click **New Query**
2. Copy the entire contents of `scripts/002_fix_lock_policy.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the script

This updates the RLS policy to allow users to toggle the `is_locked` field on their fuel entries.

## Verification

After running both scripts, verify the setup:

1. Go to **Table Editor** in Supabase
2. You should see three tables: `profiles`, `vehicles`, and `fuel_entries`
3. Go to **Authentication** > **Policies** to verify RLS policies are active

## Troubleshooting

### Lock button not working (403 Forbidden error)

If you see a 403 error when trying to lock/unlock entries:
1. Make sure you've run `scripts/002_fix_lock_policy.sql`
2. Check the browser console for detailed error messages
3. Verify the policy exists: Go to Table Editor > fuel_entries > Policies

### Cannot delete locked entries

This is expected behavior! The RLS policy prevents deletion of locked entries for data protection. To delete:
1. First unlock the entry using the lock button
2. Then the delete button will appear
3. Click delete to remove the entry

### Policy conflicts

If you see policy conflicts:
1. The scripts use `drop policy if exists` to safely replace policies
2. You can safely re-run the scripts multiple times
