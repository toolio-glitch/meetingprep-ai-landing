-- Reset demo user brief usage for testing
-- Run this in Supabase SQL Editor to reset the demo user's brief count

UPDATE user_subscriptions 
SET briefs_used_this_month = 0
WHERE user_id = 'demo-user-id';

-- If demo user doesn't exist, create them
INSERT INTO user_subscriptions (user_id, plan, briefs_limit, briefs_used_this_month)
VALUES ('demo-user-id', 'free', 5, 0)
ON CONFLICT (user_id) DO UPDATE SET briefs_used_this_month = 0;


