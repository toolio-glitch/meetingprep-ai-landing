// Script to view extension analytics
// Run with: node view-analytics.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function viewAnalytics() {
  console.log('📊 Extension Analytics Dashboard\n');
  console.log('='.repeat(80));

  try {
    // Get all analytics events
    const { data: events, error } = await supabase
      .from('extension_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching analytics:', error);
      return;
    }

    if (!events || events.length === 0) {
      console.log('\n⚠️  No analytics data yet. Make sure:');
      console.log('   1. You ran create-analytics-table.sql in Supabase');
      console.log('   2. The updated extension is installed and running');
      return;
    }

    // Count unique extension installations
    const uniqueInstalls = new Set(events.map(e => e.extension_id)).size;
    
    // Count events by type
    const eventCounts = {};
    events.forEach(e => {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
    });

    // Count unique users who completed each action
    const uniqueByEvent = {};
    ['popup_opened', 'signup_clicked', 'login_success', 'brief_generated'].forEach(eventType => {
      const extensionIds = new Set(
        events.filter(e => e.event_type === eventType).map(e => e.extension_id)
      );
      uniqueByEvent[eventType] = extensionIds.size;
    });

    console.log('\n📈 Conversion Funnel:\n');
    console.log(`   👥 Unique Extension Installs (opened popup): ${uniqueByEvent.popup_opened || 0}`);
    console.log(`   👆 Clicked "Sign Up": ${uniqueByEvent.signup_clicked || 0} (${uniqueByEvent.popup_opened ? Math.round(uniqueByEvent.signup_clicked / uniqueByEvent.popup_opened * 100) : 0}% conversion)`);
    console.log(`   ✅ Completed Login: ${uniqueByEvent.login_success || 0} (${uniqueByEvent.signup_clicked ? Math.round(uniqueByEvent.login_success / uniqueByEvent.signup_clicked * 100) : 0}% conversion)`);
    console.log(`   🎯 Generated Brief: ${uniqueByEvent.brief_generated || 0} (${uniqueByEvent.login_success ? Math.round(uniqueByEvent.brief_generated / uniqueByEvent.login_success * 100) : 0}% activation)`);

    console.log('\n📊 Event Counts:\n');
    Object.entries(eventCounts).forEach(([event, count]) => {
      console.log(`   ${event}: ${count}`);
    });

    console.log('\n🔍 Recent Events (Last 10):\n');
    events.slice(0, 10).forEach(e => {
      const date = new Date(e.created_at).toLocaleString();
      const user = e.user_email || 'anonymous';
      console.log(`   [${date}] ${e.event_type} - ${user}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 Insights:\n');
    
    // Calculate drop-offs
    const popupToSignup = uniqueByEvent.popup_opened - uniqueByEvent.signup_clicked;
    const signupToLogin = uniqueByEvent.signup_clicked - uniqueByEvent.login_success;
    const loginToBrief = uniqueByEvent.login_success - uniqueByEvent.brief_generated;

    if (popupToSignup > 0) {
      console.log(`   ⚠️  ${popupToSignup} users opened popup but didn't click signup`);
    }
    if (signupToLogin > 0) {
      console.log(`   ⚠️  ${signupToLogin} users clicked signup but didn't complete it`);
    }
    if (loginToBrief > 0) {
      console.log(`   ⚠️  ${loginToBrief} users logged in but haven't generated a brief yet`);
    }

    if (uniqueByEvent.popup_opened === 0) {
      console.log('   ℹ️  No data yet - install the updated extension to start tracking');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
viewAnalytics();

