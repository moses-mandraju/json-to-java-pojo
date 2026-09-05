import { JsonValue } from '../types'

export function safeParseJson(text: string): { value?: JsonValue; error?: string } {
  try {
    const v = JSON.parse(text)
    return { value: v }
  } catch (e: any) {
    // try to extract position from message
    const msg = String(e.message || e)
    return { error: msg }
  }
}
