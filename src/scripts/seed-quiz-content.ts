import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sampleQuizData = {
  title: "The Water Cycle",
  content_type: "reading",
  difficulty_level: "beginner",
  word_count: 85,
  questions: [
    {
      question_type: "mc",
      question_text: "What causes water to evaporate?",
      points: 10,
      order_index: 1,
      options: [
        { text: "Heat from the sun", is_correct: true },
        { text: "Wind from the ocean", is_correct: false },
        { text: "Cold temperatures", is_correct: false },
        { text: "Moonlight", is_correct: false }
      ]
    },
    {
      question_type: "fb",
      question_text: "Water vapor rises into the atmosphere where it cools and condenses into _____.",
      points: 5,
      order_index: 2,
      options: [
        { text: "clouds", is_correct: true },
        { text: "cloud", is_correct: true }
      ]
    },
    {
      question_type: "tf",
      question_text: "The water cycle is a one-time process that eventually stops.",
      points: 5,
      order_index: 3,
      options: [
        { text: "True", is_correct: false },
        { text: "False", is_correct: true }
      ]
    },
    {
      question_type: "mc",
      question_text: "Which of the following is NOT a form of precipitation?",
      points: 10,
      order_index: 4,
      options: [
        { text: "Rain", is_correct: false },
        { text: "Snow", is_correct: false },
        { text: "Evaporation", is_correct: true },
        { text: "Hail", is_correct: false }
      ]
    }
  ]
}

async function seedQuizContent() {
  try {
    console.log('Starting quiz content seed...')

    // First, get a reading content to link to
    const { data: readingContent } = await supabase
      .from('reading_content')
      .select('id')
      .limit(1)
      .single()

    if (!readingContent) {
      console.error('No reading content found. Please seed reading content first.')
      return
    }

    // Insert quiz content
    const { data: quizContent, error: quizError } = await supabase
      .from('quiz_content')
      .insert({
        content_type: sampleQuizData.content_type,
        content_id: readingContent.id,
        title: sampleQuizData.title,
        difficulty_level: sampleQuizData.difficulty_level,
        word_count: sampleQuizData.word_count,
      })
      .select()
      .single()

    if (quizError) {
      console.error('Error inserting quiz content:', quizError)
      return
    }

    console.log('Quiz content inserted:', quizContent.id)

    // Insert questions and options
    for (const questionData of sampleQuizData.questions) {
      const { data: question, error: questionError } = await supabase
        .from('quiz_questions')
        .insert({
          quiz_content_id: quizContent.id,
          question_type: questionData.question_type,
          question_text: questionData.question_text,
          points: questionData.points,
          order_index: questionData.order_index,
        })
        .select()
        .single()

      if (questionError) {
        console.error('Error inserting question:', questionError)
        continue
      }

      // Insert options
      const optionsToInsert = questionData.options.map(opt => ({
        question_id: question.id,
        text: opt.text,
        is_correct: opt.is_correct,
      }))

      const { error: optionsError } = await supabase
        .from('quiz_options')
        .insert(optionsToInsert)

      if (optionsError) {
        console.error('Error inserting options:', optionsError)
      } else {
        console.log(`Question inserted with ${optionsToInsert.length} options`)
      }
    }

    // Link quiz to reading content
    await supabase
      .from('reading_content')
      .update({ quiz_content_id: quizContent.id })
      .eq('id', readingContent.id)

    console.log('Quiz content seed completed successfully!')
  } catch (error) {
    console.error('Seed error:', error)
  }
}

seedQuizContent()