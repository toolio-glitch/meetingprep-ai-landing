-- Fix the signup trigger to handle RLS properly
-- Run this in Supabase SQL Editor

-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_subscription();

-- Create a better function that handles RLS and errors
CREATE OR REPLACE FUNCTION create_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- Use SECURITY DEFINER and disable RLS temporarily for this insert
    -- This allows the trigger to create the subscription even though auth.uid() is null
    INSERT INTO user_subscriptions (user_id, plan, briefs_limit)
    VALUES (NEW.id, 'free', 5)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail signup
    RAISE WARNING 'Failed to create subscription for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_subscription();

-- Update RLS policy to allow the trigger function to insert
-- The SECURITY DEFINER function runs with the function owner's privileges
DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;
CREATE POLICY "Users can insert own subscription" ON user_subscriptions
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id OR 
        -- Allow the trigger function to insert (when auth.uid() is null)
        current_setting('role') = 'service_role'
    );

