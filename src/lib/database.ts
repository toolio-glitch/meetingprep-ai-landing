// Database service for MeetingPrep AI
import { createClient } from '@supabase/supabase-js'
import type { 
  Database, 
  Meeting, 
  MeetingInsert, 
  Brief, 
  BriefInsert, 
  UserSubscription,
  MeetingData 
} from './database.types'

// Lazy initialization to prevent build-time errors
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not set');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Service role client for admin operations (bypasses RLS)
function getSupabaseServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role key is not set');
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Export a getter function instead of direct client
export function getSupabase() {
  return getSupabaseClient();
}

// Meeting operations
export class MeetingService {
  static async createMeeting(userId: string, meetingData: MeetingData): Promise<Meeting | null> {
    const meetingInsert: MeetingInsert = {
      user_id: userId,
      title: meetingData.title,
      date: meetingData.date,
      time: meetingData.time,
      attendees: meetingData.attendees,
      company: meetingData.company || null,
      location: meetingData.location || null,
      description: meetingData.description || null,
      objectives: meetingData.objectives || null,
      context: meetingData.context || null,
      calendar_event_id: meetingData.calendar_event_id || null,
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('meetings')
      .insert(meetingInsert as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating meeting:', error)
      return null
    }

    return data
  }

  static async getMeeting(meetingId: string): Promise<Meeting | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single()

    if (error) {
      console.error('Error fetching meeting:', error)
      return null
    }

    return data
  }

  static async getUserMeetings(userId: string, limit = 10): Promise<Meeting[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user meetings:', error)
      return []
    }

    return data || []
  }

  static async findMeetingByCalendarId(userId: string, calendarEventId: string): Promise<Meeting | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .eq('calendar_event_id', calendarEventId)
      .single()

    if (error) {
      // Not found is expected for new meetings
      return null
    }

    return data
  }

  static async deleteMeeting(meetingId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase();
    // RLS will ensure user can only delete their own meetings
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting meeting:', error)
      return false
    }

    // Briefs are automatically deleted due to ON DELETE CASCADE
    return true
  }
}

// Brief operations
export class BriefService {
  static async createBrief(
    userId: string, 
    meetingId: string, 
    content: string, 
    aiModel = 'gpt-4o-mini',
    generationTimeMs?: number
  ): Promise<Brief | null> {
    const briefInsert: BriefInsert = {
      user_id: userId,
      meeting_id: meetingId,
      content,
      ai_model: aiModel,
      generation_time_ms: generationTimeMs || null,
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('briefs')
      .insert(briefInsert as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating brief:', error)
      return null
    }

    return data
  }

  static async getBrief(briefId: string): Promise<Brief | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', briefId)
      .single()

    if (error) {
      console.error('Error fetching brief:', error)
      return null
    }

    return data
  }

  static async getMeetingBrief(meetingId: string): Promise<Brief | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // No brief exists yet
      return null
    }

    return data
  }

  static async getUserBriefs(userId: string, limit = 10): Promise<Brief[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user briefs:', error)
      return []
    }

    return data || []
  }
}

// Subscription operations
export class SubscriptionService {
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    console.log('Querying subscription for userId:', userId)
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log('Subscription query result:', { data, error })

    if (error) {
      console.error('Error fetching user subscription:', error)
      return null
    }

    return data
  }

  static async incrementBriefUsage(userId: string): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase.rpc('increment_briefs_used', { user_id: userId } as any)

    if (error) {
      console.error('Error incrementing brief usage:', error)
      return false
    }

    return true
  }

  static async canGenerateBrief(userId: string): Promise<{ canGenerate: boolean; usage: { used: number; limit: number; plan: string } }> {
    let subscription = await this.getUserSubscription(userId)
    
    // Auto-create free subscription if one doesn't exist (handles edge cases)
    if (!subscription) {
      console.log('No subscription found for user, creating free subscription...')
      try {
        // Use service role client to bypass RLS for admin operations
        const supabaseAdmin = getSupabaseServiceRoleClient()
        const { data, error } = await supabaseAdmin
          .from('user_subscriptions')
          .insert({
            user_id: userId,
            plan: 'free',
            briefs_limit: 20, // Increased for launch/testing
            briefs_used_this_month: 0,
            status: 'active'
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error creating subscription:', error)
          // Still allow generation if subscription creation fails (for launch)
          return {
            canGenerate: true,
            usage: { used: 0, limit: 20, plan: 'free' }
          }
        }
        
        subscription = data
        console.log('Free subscription created:', subscription)
      } catch (err) {
        console.error('Exception creating subscription:', err)
        // Still allow generation if subscription creation fails (for launch)
        return {
          canGenerate: true,
          usage: { used: 0, limit: 20, plan: 'free' }
        }
      }
    }

    // For launch: temporarily increase limit if user is at free tier limit
    let effectiveLimit = subscription.briefs_limit
    if (subscription.plan === 'free' && subscription.briefs_limit < 20) {
      // Update limit to 20 for existing free users
      try {
        const supabaseAdmin = getSupabaseServiceRoleClient()
        await supabaseAdmin
          .from('user_subscriptions')
          .update({ briefs_limit: 20 })
          .eq('user_id', userId)
        effectiveLimit = 20
        subscription.briefs_limit = 20
        console.log('Updated user limit to 20 for launch')
      } catch (err) {
        console.error('Error updating limit:', err)
      }
    }

    // TEMPORARY FOR LAUNCH: Allow briefs even if limit exceeded
    // TODO: Remove this after launch and restore proper limit checking
    const canGenerate = subscription.plan !== 'free' || subscription.briefs_used_this_month < effectiveLimit || true

    // If user is at limit but we're allowing it, reset their usage to 0 for fresh start
    if (subscription.plan === 'free' && subscription.briefs_used_this_month >= effectiveLimit && effectiveLimit < 20) {
      try {
        const supabaseAdmin = getSupabaseServiceRoleClient()
        await supabaseAdmin
          .from('user_subscriptions')
          .update({ 
            briefs_limit: 20,
            briefs_used_this_month: 0 
          })
          .eq('user_id', userId)
        subscription.briefs_limit = 20
        subscription.briefs_used_this_month = 0
        effectiveLimit = 20
        console.log('Reset user usage and limit for launch')
      } catch (err) {
        console.error('Error resetting usage:', err)
      }
    }

    console.log('Subscription check:', {
      userId,
      plan: subscription.plan,
      used: subscription.briefs_used_this_month,
      limit: effectiveLimit,
      canGenerate
    })

    return {
      canGenerate: true, // Always allow for launch
      usage: {
        used: subscription.briefs_used_this_month,
        limit: effectiveLimit,
        plan: subscription.plan
      }
    }
  }
}

// Combined operations
export class MeetingPrepService {
  static async createMeetingWithBrief(
    userId: string, 
    meetingData: MeetingData, 
    briefContent: string,
    generationTimeMs?: number
  ): Promise<{ meeting: Meeting; brief: Brief } | null> {
    // Check if user can generate brief
    const { canGenerate } = await SubscriptionService.canGenerateBrief(userId)
    if (!canGenerate) {
      throw new Error('Brief limit exceeded. Please upgrade your plan.')
    }

    // Create meeting
    const meeting = await MeetingService.createMeeting(userId, meetingData)
    if (!meeting) {
      throw new Error('Failed to create meeting')
    }

    // Create brief
    const brief = await BriefService.createBrief(userId, meeting.id, briefContent, 'gpt-4o-mini', generationTimeMs)
    if (!brief) {
      throw new Error('Failed to create brief')
    }

    // Increment usage
    await SubscriptionService.incrementBriefUsage(userId)

    return { meeting, brief }
  }

  static async getMeetingWithBrief(meetingId: string): Promise<{ meeting: Meeting; brief: Brief | null } | null> {
    const meeting = await MeetingService.getMeeting(meetingId)
    if (!meeting) return null

    const brief = await BriefService.getMeetingBrief(meetingId)
    
    return { meeting, brief }
  }

  static async getUserMeetingsWithBriefs(userId: string, limit = 50): Promise<Array<{ meeting: Meeting; brief: Brief | null }>> {
    const supabase = getSupabase();
    
    // Fetch meetings with their briefs using a join
    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        briefs (
          id,
          content,
          created_at,
          ai_model,
          generation_time_ms
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching meetings with briefs:', error)
      return []
    }

    if (!data) return []

    // Transform the data to match our expected format
    return data.map((meeting: any) => ({
      meeting: meeting as Meeting,
      brief: Array.isArray(meeting.briefs) && meeting.briefs.length > 0 
        ? meeting.briefs[0] as Brief 
        : null
    }))
  }
}
