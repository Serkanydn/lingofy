import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Sample Reading Content
const readingContent = [
  // A1 Level
  {
    title: 'My Daily Routine',
    level: 'A1',
    content: `I wake up at 7 o'clock every morning. I brush my teeth and wash my face. Then I have breakfast with my family.\n\nI eat bread, cheese, and eggs. I drink orange juice. After breakfast, I go to school. School starts at 8:30.\n\nI come home at 3 PM. I do my homework and watch TV. I go to bed at 10 PM. This is my daily routine.`,
    audio_urls: ['https://your-cdn.com/audio/a1-daily-routine-1.mp3', 'https://your-cdn.com/audio/a1-daily-routine-2.mp3'],
    is_premium: false,
    order_index: 1,
  },
  {
    title: 'At the Supermarket',
    level: 'A1',
    content: `Today I go to the supermarket. I need to buy food for the week.\n\nI buy apples, bananas, and oranges. I also buy milk, bread, and eggs. The vegetables are fresh and cheap.\n\nI pay at the cashier. The total is 50 lira. I take my bags and go home. Shopping is easy!`,
    audio_urls: ['https://your-cdn.com/audio/a1-supermarket.mp3'],
    is_premium: false,
    order_index: 2,
  },
  // Add more A1 content (10 free, 20 premium)
  
  // B1 Level
  {
    title: 'Remote Work Benefits',
    level: 'B1',
    content: `Remote work has become increasingly popular in recent years. Many companies now allow their employees to work from home, which offers several advantages.\n\nFirst, remote work saves commuting time. Workers don't need to spend hours in traffic or crowded public transportation. This extra time can be used for personal activities or rest.\n\nSecond, it provides flexibility. Employees can create their own schedules and work during their most productive hours. They can also balance work with family responsibilities more easily.\n\nHowever, remote work also has challenges. Some people feel isolated and miss the social interaction of an office. Communication can be more difficult when teams are not physically together.`,
    audio_urls: ['https://your-cdn.com/audio/b1-remote-work.mp3'],
    is_premium: true,
    order_index: 15,
  },
]

// Sample Quiz Questions
const quizQuestions = [
  {
    questions_type: 'reading',
    quiz_content_id: null, // Will be set after content insertion
    question_text: 'What time does the person wake up?',
    options: ['6 o\'clock', '7 o\'clock', '8 o\'clock', '9 o\'clock'],
    correct_answer: 1,
    explanation: 'The text states "I wake up at 7 o\'clock every morning."',
    order_index: 1,
  },
  {
    questions_type: 'reading',
    quiz_content_id: null,
    question_text: 'What does the person eat for breakfast?',
    options: ['Bread, cheese, and eggs', 'Rice and fish', 'Pasta and salad', 'Soup and bread'],
    correct_answer: 0,
    explanation: 'The text mentions "I eat bread, cheese, and eggs."',
    order_index: 2,
  },
]

// Sample Grammar Topics
const grammarTopics = [
  {
    category: 'tenses',
    title: 'Present Simple',
    explanation: 'We use the present simple to talk about habits, routines, and general truths. For positive sentences with he/she/it, we add -s or -es to the verb.',
    examples: [
      'I work in an office every day.',
      'She speaks three languages fluently.',
      'The sun rises in the east.',
      'Water boils at 100 degrees Celsius.',
      'They don\'t like spicy food.',
      'Does he play tennis on weekends?',
    ],
    mini_text: 'My brother works as a teacher. He teaches English at a high school. Every morning, he wakes up at 6 AM and prepares his lessons. He loves his job because he enjoys helping students learn. His students like him very much.',
    order_index: 1,
  },
  {
    category: 'tricky-topics',
    title: 'Much vs Many',
    explanation: 'Use "much" with uncountable nouns (things you cannot count individually). Use "many" with countable nouns (things you can count). In questions and negatives, both are common. In positive sentences, we often use "a lot of" instead.',
    examples: [
      'How much water do you drink daily?',
      'How many books do you read per month?',
      'There isn\'t much time left.',
      'There aren\'t many people here today.',
      'I don\'t have much money right now.',
      'She doesn\'t have many friends in this city.',
    ],
    mini_text: 'When I go shopping, I always think carefully. I don\'t have much money, so I can\'t buy many things. I usually buy much rice and pasta because they are cheap. I don\'t buy many snacks because they are expensive. How much do you spend on groceries?',
    order_index: 1,
  },
]

// Sample Listening Content
const listeningContent = [
  {
    title: 'Weather Forecast',
    level: 'A2',
    description: 'Listen to a simple weather forecast',
    audio_urls: ['https://your-cdn.com/audio/a2-weather.mp3'],
    duration_seconds: 90,
    transcript: `Good morning! Here is today's weather forecast.\n\nIt will be sunny in the morning with temperatures around 20 degrees. In the afternoon, some clouds will appear, but it will stay dry.\n\nTomorrow, we expect rain in the morning. Please take an umbrella if you go out. Temperatures will be cooler, around 15 degrees.\n\nHave a great day!`,
    is_premium: false,
    order_index: 1,
  },
]

async function seedContent() {
  try {
    console.log('Starting content seed...')

    // Insert Reading Content
    console.log('Inserting reading content...')
    const { data: readingData, error: readingError } = await supabase
      .from('reading_content')
      .insert(readingContent)
      .select()

    if (readingError) {
      console.error('Error inserting reading content:', readingError)
      if (readingError.code === 'PGRST204') {
        console.error('Schema error - Please ensure the reading_content table exists with correct columns')
        console.error('Required columns: title (text), level (text), content (text), audio_urls (text[]), is_premium (boolean), order_index (integer)')
      }
      return
    }

    console.log(`Inserted ${readingData.length} reading items`)

    // Insert Quiz Questions for readings
    if (readingData.length > 0) {
      console.log('Inserting quiz questions...')
      
      // Create questions for each reading content
      const allQuestions = readingData.flatMap((reading, readingIndex) => {
        // For the first reading, use the sample questions
        if (readingIndex === 0) {
          return quizQuestions.map(q => ({
            ...q,
            quiz_content_id: reading.id,
          }))
        }
        
        // For other readings, generate basic comprehension questions
        const basicQuestions = [
          {
            questions_type: 'reading' as const,
            quiz_content_id: reading.id,
            question_text: `What is this text about?`,
            options: [`The main topic is ${reading.title.toLowerCase()}`, 'Shopping', 'Weather', 'Travel'],
            correct_answer: 0,
            explanation: `The text discusses ${reading.title.toLowerCase()}.`,
            order_index: 1,
          }
        ]
        
        return basicQuestions
      })

      const { error: quizError } = await supabase
        .from('quiz_questions')
        .insert(allQuestions)

      if (quizError) {
        console.error('Error inserting quiz questions:', quizError)
        // Check if it's a schema error and log more details
        if (quizError.code === 'PGRST204') {
          console.error('Schema error - Please ensure the quiz_questions table exists with correct columns')
          console.error('Required columns: quiz_content_id (uuid), questions_type (text), question_text (text), options (text[]), correct_answer (integer), explanation (text), order_index (integer)')
        }
      } else {
        console.log(`Inserted ${allQuestions.length} quiz questions`)
      }
    }

    // Insert Grammar Topics
    console.log('Inserting grammar topics...')
    const { data: grammarData, error: grammarError } = await supabase
      .from('grammar_topics')
      .insert(grammarTopics)
      .select()

    if (grammarError) {
      console.error('Error inserting grammar topics:', grammarError)
      if (grammarError.code === 'PGRST204') {
        console.error('Schema error - Please ensure the grammar_topics table exists with correct columns')
        console.error('Required columns: category (text), title (text), explanation (text), examples (text[]), mini_text (text), order_index (integer)')
      }
    } else {
      console.log(`Inserted ${grammarData.length} grammar topics`)
    }

    // Insert Listening Content
    console.log('Inserting listening content...')
    const { data: listeningData, error: listeningError } = await supabase
      .from('listening_content')
      .insert(listeningContent)
      .select()

    if (listeningError) {
      console.error('Error inserting listening content:', listeningError)
      if (listeningError.code === 'PGRST204') {
        console.error('Schema error - Please ensure the listening_content table exists with correct columns')
        console.error('Required columns: title (text), level (text), description (text), audio_urls (text[]), duration_seconds (integer), transcript (text), is_premium (boolean), order_index (integer)')
      }
    } else {
      console.log(`Inserted ${listeningData.length} listening items`)
    }

    console.log('Content seed completed successfully!')
  } catch (error) {
    console.error('Seed error:', error)
  }
}

seedContent()