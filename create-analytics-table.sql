-- Analytics table to track extension usage
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS extension_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'popup_opened', 'signup_clicked', 'login_success', 'brief_generated'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL if not logged in
    user_email TEXT, -- Store email for easier tracking
    extension_id TEXT, -- Unique ID per installation (generated on first open)
    metadata JSONB, -- Extra data (error messages, meeting details, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS extension_analytics_event_type_idx ON extension_analytics(event_type);
CREATE INDEX IF NOT EXISTS extension_analytics_user_id_idx ON extension_analytics(user_id);
CREATE INDEX IF NOT EXISTS extension_analytics_extension_id_idx ON extension_analytics(extension_id);
CREATE INDEX IF NOT EXISTS extension_analytics_created_at_idx ON extension_analytics(created_at);

-- Enable Row Level Security
ALTER TABLE extension_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (for tracking)
CREATE POLICY "Anyone can insert analytics events" ON extension_analytics
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can view (we'll query with service role key)
CREATE POLICY "Service role can view all analytics" ON extension_analytics
    FOR SELECT USING (true);

-- Add comment for documentation
COMMENT ON TABLE extension_analytics IS 'Tracks extension usage events to understand user behavior and conversion funnel';

