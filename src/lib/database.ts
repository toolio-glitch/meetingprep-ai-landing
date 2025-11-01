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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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
    const { error } = await supabase.rpc('increment_briefs_used', { user_id: userId } as any)

    if (error) {
      console.error('Error incrementing brief usage:', error)
      return false
    }

    return true
  }

  static async canGenerateBrief(userId: string): Promise<{ canGenerate: boolean; usage: { used: number; limit: number; plan: string } }> {
    const subscription = await this.getUserSubscription(userId)
    
    if (!subscription) {
      return { 
        canGenerate: false, 
        usage: { used: 0, limit: 0, plan: 'none' } 
      }
    }

    const canGenerate = subscription.plan !== 'free' || subscription.briefs_used_this_month < subscription.briefs_limit

    return {
      canGenerate,
      usage: {
        used: subscription.briefs_used_this_month,
        limit: subscription.briefs_limit,
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
}
