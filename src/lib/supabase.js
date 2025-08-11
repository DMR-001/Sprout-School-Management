import { createClient } from '@supabase/supabase-js'

// Use environment variables for production security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kfbfyzveqidxnmbetvan.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYmZ5enZlcWlkeG5tYmV0dmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4OTk1MTcsImV4cCI6MjA3MDQ3NTUxN30.8PJRos9IrjL9wFQWGWe8Q98MsN0TDC_hhOc2VMwTcmU'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  STUDENTS: 'students', 
  TEACHERS: 'teachers',
  FEE_PAYMENTS: 'fee_payments',
  ATTENDANCE: 'attendance',
  GRADES: 'grades'
}
