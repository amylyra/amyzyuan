import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export interface ChatSession {
  id: string
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'amy'
  content: string
  created_at: string
}

export async function createChatSession(): Promise<string | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({})
    .select('id')
    .single()

  if (error) {
    console.error('Error creating chat session:', error)
    return null
  }
  return data.id
}

export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'amy',
  content: string
): Promise<void> {
  if (!supabase) return

  const { error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, role, content })

  if (error) {
    console.error('Error saving chat message:', error)
  }
}
