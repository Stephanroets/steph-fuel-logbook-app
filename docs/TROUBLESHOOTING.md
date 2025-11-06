# Troubleshooting Guide

## Lock Function Not Working

If you're experiencing issues with the lock function (entries can still be deleted after locking), follow these steps:

### 1. Verify Database Policies

Run this query in Supabase SQL Editor to check your current policies:

\`\`\`sql
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'fuel_entries';
\`\`\`

You should see these policies:
- **DELETE policy**: Should include `is_locked = false` in the `qual` column
- **UPDATE policy**: Should allow updating `is_locked` field

### 2. Re-apply the Lock Policy Fix

If the policies are incorrect, run the `002_fix_lock_policy.sql` script again:

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `scripts/002_fix_lock_policy.sql`
3. Paste and execute

### 3. Check Browser Console

Open your browser's developer console (F12) and look for `[v0]` log messages when:
- Locking an entry
- Attempting to delete an entry

The logs will show:
- Current lock state
- Database update results
- Any errors from Supabase

### 4. Verify Lock State in Database

Run this query to check the actual lock state in your database:

\`\`\`sql
SELECT id, entry_date, odometer_reading, is_locked
FROM fuel_entries
ORDER BY entry_date DESC;
\`\`\`

If `is_locked` is `false` even after locking, the UPDATE policy may not be working correctly.

### 5. Clear Browser Cache

Sometimes the UI can show stale data. Try:
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Log out and log back in

### 6. Common Issues

**Issue**: Lock button doesn't change state
- **Cause**: UPDATE policy not applied
- **Fix**: Run `002_fix_lock_policy.sql`

**Issue**: Can delete locked entries
- **Cause**: DELETE policy not checking lock state
- **Fix**: Verify DELETE policy includes `is_locked = false` condition

**Issue**: Error: "policy violation"
- **Cause**: RLS policies are too restrictive
- **Fix**: Check that policies use `auth.uid() = user_id`

## Need More Help?

Check the browser console for `[v0]` debug logs that show exactly what's happening during lock/delete operations.
