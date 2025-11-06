import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function setupDatabase() {
  try {
    console.log('Starting database setup...')

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create_database_tables.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', {
        query: statement
      })

      if (error) {
        console.error('Error executing SQL:', error)
        console.error('Failed statement:', statement)
      }
    }

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Setup error:', error)
  }
}

setupDatabase()