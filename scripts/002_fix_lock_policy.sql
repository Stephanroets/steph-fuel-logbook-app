-- Drop the old restrictive update policy
drop policy if exists "Users can update their own unlocked fuel entries" on public.fuel_entries;

-- Create a new policy that allows users to update is_locked field
-- but restricts other updates to unlocked entries only
create policy "Users can update their own fuel entries"
  on public.fuel_entries for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and (
      -- Allow toggling is_locked regardless of current state
      (is_locked != (select is_locked from public.fuel_entries where id = fuel_entries.id)) or
      -- For other updates, entry must be unlocked
      (is_locked = false)
    )
  );
