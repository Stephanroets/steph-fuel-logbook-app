-- Create a function to toggle the lock state of a fuel entry
-- This bypasses the problematic RLS policy by using SECURITY DEFINER

create or replace function public.toggle_fuel_entry_lock(
  entry_id uuid,
  new_lock_state boolean
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row fuel_entries;
begin
  -- Check if the entry exists and belongs to the current user
  if not exists (
    select 1 from public.fuel_entries
    where id = entry_id and user_id = auth.uid()
  ) then
    raise exception 'Entry not found or you do not have permission to modify it';
  end if;

  -- Update the lock state
  update public.fuel_entries
  set 
    is_locked = new_lock_state,
    updated_at = now()
  where id = entry_id and user_id = auth.uid()
  returning * into result_row;

  -- Return the updated row as JSON
  return row_to_json(result_row);
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.toggle_fuel_entry_lock(uuid, boolean) to authenticated;

-- Add a comment explaining the function
comment on function public.toggle_fuel_entry_lock is 
  'Toggles the lock state of a fuel entry. Only the owner can toggle the lock state.';
