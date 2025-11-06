import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// dotenv.config({ path: '.env.local' })
const supabase = createClient(
  "https://rwxfbjmwslyixslwsjdz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3eGZiam13c2x5aXhzbHdzamR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkyMDYxMSwiZXhwIjoyMDc3NDk2NjExfQ.plfuHASNl3MhdR2FifelB2wRsSxDaYQbg3Z_EEDL9KU"
)

// Reading Content with Quiz Data
const readingContentWithQuizzes = [
  {
    reading: {
      title: 'My Daily Routine',
      level: 'A1',
      content: `I wake up at 7 o'clock every morning. I brush my teeth and wash my face. Then I have breakfast with my family.\n\nI eat bread, cheese, and eggs. I drink orange juice. After breakfast, I go to school. School starts at 8:30.\n\nI come home at 3 PM. I do my homework and watch TV. I go to bed at 10 PM. This is my daily routine.`,
      audio_urls: ['https://your-cdn.com/audio/a1-daily-routine-1.mp3'],
      is_premium: false,
      order_index: 1,
    },
    quiz: {
      title: 'My Daily Routine - Comprehension Quiz',
      difficulty_level: 'beginner',
      word_count: 78,
      questions: [
        {
          question_type: 'mc',
          question_text: 'What time does the person wake up?',
          points: 10,
          order_index: 1,
          options: [
            { text: '6 o\'clock', is_correct: false },
            { text: '7 o\'clock', is_correct: true },
            { text: '8 o\'clock', is_correct: false },
            { text: '9 o\'clock', is_correct: false }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'What does the person eat for breakfast?',
          points: 10,
          order_index: 2,
          options: [
            { text: 'Bread, cheese, and eggs', is_correct: true },
            { text: 'Rice and fish', is_correct: false },
            { text: 'Pasta and salad', is_correct: false },
            { text: 'Soup and bread', is_correct: false }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'School starts at 9 o\'clock.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'The person comes home at _____ PM.',
          points: 5,
          order_index: 4,
          options: [
            { text: '3', is_correct: true },
            { text: 'three', is_correct: true }
          ]
        }
      ]
    }
  },
  {
    reading: {
      title: 'At the Supermarket',
      level: 'A1',
      content: `Today I go to the supermarket. I need to buy food for the week.\n\nI buy apples, bananas, and oranges. I also buy milk, bread, and eggs. The vegetables are fresh and cheap.\n\nI pay at the cashier. The total is 50 lira. I take my bags and go home. Shopping is easy!`,
      audio_urls: ['https://your-cdn.com/audio/a1-supermarket.mp3'],
      is_premium: false,
      order_index: 2,
    },
    quiz: {
      title: 'At the Supermarket - Comprehension Quiz',
      difficulty_level: 'beginner',
      word_count: 62,
      questions: [
        {
          question_type: 'mc',
          question_text: 'What fruits does the person buy?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'Apples, bananas, and oranges', is_correct: true },
            { text: 'Grapes, melons, and kiwis', is_correct: false },
            { text: 'Strawberries and blueberries', is_correct: false },
            { text: 'Pears and peaches', is_correct: false }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'The vegetables are expensive.',
          points: 5,
          order_index: 2,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'The total cost is _____ lira.',
          points: 5,
          order_index: 3,
          options: [
            { text: '50', is_correct: true },
            { text: 'fifty', is_correct: true }
          ]
        }
      ]
    }
  },
  {
    reading: {
      title: 'A Weekend Trip',
      level: 'A2',
      content: `Last weekend, my family and I went to the beach. We left early in the morning at 6 AM. The weather was perfect - sunny and warm.\n\nWhen we arrived, we found a nice spot near the water. My brother and I went swimming while our parents relaxed under an umbrella. The water was cool and refreshing.\n\nFor lunch, we had sandwiches and fruit. In the afternoon, we built a sandcastle together. It was really fun! We stayed until sunset and then drove home. Everyone was tired but happy.`,
      audio_urls: ['https://your-cdn.com/audio/a2-weekend-trip.mp3'],
      is_premium: false,
      order_index: 3,
    },
    quiz: {
      title: 'A Weekend Trip - Comprehension Quiz',
      difficulty_level: 'elementary',
      word_count: 108,
      questions: [
        {
          question_type: 'mc',
          question_text: 'Where did the family go?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'To the beach', is_correct: true },
            { text: 'To the mountains', is_correct: false },
            { text: 'To a museum', is_correct: false },
            { text: 'To a park', is_correct: false }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'What time did they leave?',
          points: 10,
          order_index: 2,
          options: [
            { text: '5 AM', is_correct: false },
            { text: '6 AM', is_correct: true },
            { text: '7 AM', is_correct: false },
            { text: '8 AM', is_correct: false }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'The weather was rainy.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'For lunch, they had sandwiches and _____.',
          points: 5,
          order_index: 4,
          options: [
            { text: 'fruit', is_correct: true }
          ]
        }
      ]
    }
  },
  {
    reading: {
      title: 'Remote Work Benefits',
      level: 'B1',
      content: `Remote work has become increasingly popular in recent years. Many companies now allow their employees to work from home, which offers several advantages.\n\nFirst, remote work saves commuting time. Workers don't need to spend hours in traffic or crowded public transportation. This extra time can be used for personal activities or rest.\n\nSecond, it provides flexibility. Employees can create their own schedules and work during their most productive hours. They can also balance work with family responsibilities more easily.\n\nHowever, remote work also has challenges. Some people feel isolated and miss the social interaction of an office. Communication can be more difficult when teams are not physically together. Despite these drawbacks, many workers prefer the remote work lifestyle.`,
      audio_urls: ['https://your-cdn.com/audio/b1-remote-work.mp3'],
      is_premium: true,
      order_index: 4,
    },
    quiz: {
      title: 'Remote Work Benefits - Comprehension Quiz',
      difficulty_level: 'intermediate',
      word_count: 132,
      questions: [
        {
          question_type: 'mc',
          question_text: 'What is the main advantage of remote work mentioned first?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'Saves commuting time', is_correct: true },
            { text: 'Higher salary', is_correct: false },
            { text: 'Better office space', is_correct: false },
            { text: 'More vacation days', is_correct: false }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'According to the text, remote work provides:',
          points: 10,
          order_index: 2,
          options: [
            { text: 'Flexibility in scheduling', is_correct: true },
            { text: 'Free transportation', is_correct: false },
            { text: 'Better equipment', is_correct: false },
            { text: 'More sick days', is_correct: false }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'Remote work has only advantages and no challenges.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'Some people feel _____ when working remotely.',
          points: 5,
          order_index: 4,
          options: [
            { text: 'isolated', is_correct: true }
          ]
        }
      ]
    }
  },
  {
    reading: {
      title: 'The History of Coffee',
      level: 'B2',
      content: `Coffee is one of the most consumed beverages in the world, but its origins trace back to ancient Ethiopia. According to legend, a goat herder named Kaldi discovered coffee when he noticed his goats became energetic after eating berries from a certain tree.\n\nThe cultivation of coffee began in Yemen in the 15th century. From there, it spread to the Middle East and eventually reached Europe in the 17th century. Initially, coffee was met with suspicion in Europe, with some calling it the "bitter invention of Satan." However, Pope Clement VIII blessed the drink, leading to its widespread acceptance.\n\nCoffee houses became important social hubs, particularly in England and France. They were places where people gathered to discuss politics, business, and literature. In fact, many historical revolutions and intellectual movements were born in coffee houses.\n\nToday, coffee is a global industry worth billions of dollars. Brazil is the largest producer, followed by Vietnam and Colombia. The way we consume coffee has evolved dramatically, from traditional Turkish coffee to modern espresso-based drinks.`,
      audio_urls: ['https://your-cdn.com/audio/b2-coffee-history.mp3'],
      is_premium: true,
      order_index: 5,
    },
    quiz: {
      title: 'The History of Coffee - Comprehension Quiz',
      difficulty_level: 'upper-intermediate',
      word_count: 187,
      questions: [
        {
          question_type: 'mc',
          question_text: 'Who is believed to have discovered coffee?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'A goat herder named Kaldi', is_correct: true },
            { text: 'Pope Clement VIII', is_correct: false },
            { text: 'A Turkish merchant', is_correct: false },
            { text: 'A Brazilian farmer', is_correct: false }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'Where did coffee cultivation first begin?',
          points: 10,
          order_index: 2,
          options: [
            { text: 'Ethiopia', is_correct: false },
            { text: 'Yemen', is_correct: true },
            { text: 'Brazil', is_correct: false },
            { text: 'Turkey', is_correct: false }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'Coffee was immediately accepted when it reached Europe.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'Coffee houses became important social _____ in Europe.',
          points: 5,
          order_index: 4,
          options: [
            { text: 'hubs', is_correct: true }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'Which country is currently the largest coffee producer?',
          points: 10,
          order_index: 5,
          options: [
            { text: 'Brazil', is_correct: true },
            { text: 'Vietnam', is_correct: false },
            { text: 'Colombia', is_correct: false },
            { text: 'Ethiopia', is_correct: false }
          ]
        }
      ]
    }
  }
]

// Grammar Topics with Quizzes
const grammarTopicsWithQuizzes = [
  {
    grammar: {
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
    quiz: {
      title: 'Present Simple - Practice Quiz',
      difficulty_level: 'beginner',
      word_count: 50,
      questions: [
        {
          question_type: 'mc',
          question_text: 'Choose the correct form: She _____ to school every day.',
          points: 10,
          order_index: 1,
          options: [
            { text: 'go', is_correct: false },
            { text: 'goes', is_correct: true },
            { text: 'going', is_correct: false },
            { text: 'gone', is_correct: false }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'The sun _____ (rise) in the east.',
          points: 5,
          order_index: 2,
          options: [
            { text: 'rises', is_correct: true }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'We add -s to all verbs in present simple.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        }
      ]
    }
  },
  {
    grammar: {
      category: 'tricky_topics',
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
      order_index: 2,
    },
    quiz: {
      title: 'Much vs Many - Practice Quiz',
      difficulty_level: 'elementary',
      word_count: 60,
      questions: [
        {
          question_type: 'mc',
          question_text: 'How _____ time do you need?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'much', is_correct: true },
            { text: 'many', is_correct: false }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'There aren\'t _____ students in class today.',
          points: 10,
          order_index: 2,
          options: [
            { text: 'much', is_correct: false },
            { text: 'many', is_correct: true }
          ]
        },
        {
          question_type: 'tf',
          question_text: '"Much" is used with countable nouns.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        }
      ]
    }
  }
]

// Listening Content with Quizzes
const listeningContentWithQuizzes = [
  {
    listening: {
      title: 'Weather Forecast',
      level: 'A2',
      description: 'Listen to a simple weather forecast',
      audio_urls: ['https://your-cdn.com/audio/a2-weather.mp3'],
      duration_seconds: 90,
      transcript: `Good morning! Here is today's weather forecast.\n\nIt will be sunny in the morning with temperatures around 20 degrees. In the afternoon, some clouds will appear, but it will stay dry.\n\nTomorrow, we expect rain in the morning. Please take an umbrella if you go out. Temperatures will be cooler, around 15 degrees.\n\nHave a great day!`,
      is_premium: false,
      order_index: 1,
    },
    quiz: {
      title: 'Weather Forecast - Listening Quiz',
      difficulty_level: 'elementary',
      word_count: 65,
      questions: [
        {
          question_type: 'mc',
          question_text: 'What will the weather be like in the morning?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'Sunny', is_correct: true },
            { text: 'Rainy', is_correct: false },
            { text: 'Cloudy', is_correct: false },
            { text: 'Snowy', is_correct: false }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'The temperature will be around _____ degrees in the morning.',
          points: 5,
          order_index: 2,
          options: [
            { text: '20', is_correct: true },
            { text: 'twenty', is_correct: true }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'It will rain tomorrow morning.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'True', is_correct: true },
            { text: 'False', is_correct: false }
          ]
        }
      ]
    }
  },
  {
    listening: {
      title: 'Restaurant Conversation',
      level: 'B1',
      description: 'Listen to a conversation at a restaurant',
      audio_urls: ['https://your-cdn.com/audio/b1-restaurant.mp3'],
      duration_seconds: 120,
      transcript: `Waiter: Good evening! Welcome to Luigi's. Do you have a reservation?\n\nCustomer: Yes, we have a table for two under the name Smith.\n\nWaiter: Perfect! Right this way, please. Here's your table by the window. Can I get you something to drink?\n\nCustomer: I'll have a glass of red wine, please. And water for the table.\n\nWaiter: Excellent choice. Are you ready to order, or would you like a few more minutes?\n\nCustomer: We're ready. I'll have the pasta carbonara, and my wife will have the grilled salmon.\n\nWaiter: Great! The salmon comes with vegetables and rice. Is that okay?\n\nCustomer: Yes, that's perfect. Thank you!`,
      is_premium: false,
      order_index: 2,
    },
    quiz: {
      title: 'Restaurant Conversation - Listening Quiz',
      difficulty_level: 'intermediate',
      word_count: 112,
      questions: [
        {
          question_type: 'mc',
          question_text: 'What is the name on the reservation?',
          points: 10,
          order_index: 1,
          options: [
            { text: 'Smith', is_correct: true },
            { text: 'Luigi', is_correct: false },
            { text: 'Johnson', is_correct: false },
            { text: 'Brown', is_correct: false }
          ]
        },
        {
          question_type: 'mc',
          question_text: 'What does the customer order to drink?',
          points: 10,
          order_index: 2,
          options: [
            { text: 'Red wine and water', is_correct: true },
            { text: 'White wine', is_correct: false },
            { text: 'Beer', is_correct: false },
            { text: 'Juice', is_correct: false }
          ]
        },
        {
          question_type: 'fb',
          question_text: 'The customer orders pasta _____ for their meal.',
          points: 5,
          order_index: 3,
          options: [
            { text: 'carbonara', is_correct: true }
          ]
        },
        {
          question_type: 'tf',
          question_text: 'The salmon comes with vegetables and potatoes.',
          points: 5,
          order_index: 4,
          options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true }
          ]
        }
      ]
    }
  }
]

async function seedAllContent() {
  try {
    console.log('Starting complete content seed...')

    // ====== READING CONTENT ======
    console.log('\n=== Seeding Reading Content ===')
    for (const item of readingContentWithQuizzes) {
      // Insert reading content
      const { data: reading, error: readingError } = await supabase
        .from('reading_content')
        .insert(item.reading)
        .select()
        .single()

      if (readingError) {
        console.error(`Error inserting reading "${item.reading.title}":`, readingError)
        continue
      }

      console.log(`✓ Reading inserted: ${reading.title}`)

      // Insert quiz content
      const { data: quizContent, error: quizError } = await supabase
        .from('quiz_content')
        .insert({
          content_type: 'reading',
          content_id: reading.id,
          title: item.quiz.title,
          difficulty_level: item.quiz.difficulty_level,
          word_count: item.quiz.word_count,
        })
        .select()
        .single()

      if (quizError) {
        console.error(`Error inserting quiz for "${item.reading.title}":`, quizError)
        continue
      }

      // Insert questions and options
      for (const questionData of item.quiz.questions) {
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
          console.error(`Error inserting question:`, questionError)
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
          console.error(`Error inserting options:`, optionsError)
        }
      }

      // Link quiz to reading
      await supabase
        .from('reading_content')
        .update({ quiz_content_id: quizContent.id })
        .eq('id', reading.id)

      console.log(`✓ Quiz linked: ${quizContent.title} (${item.quiz.questions.length} questions)`)
    }

    // ====== GRAMMAR TOPICS ======
    console.log('\n=== Seeding Grammar Topics ===')
    for (const item of grammarTopicsWithQuizzes) {
      // Insert grammar topic
      const { data: grammar, error: grammarError } = await supabase
        .from('grammar_topics')
        .insert(item.grammar)
        .select()
        .single()

      if (grammarError) {
        console.error(`Error inserting grammar "${item.grammar.title}":`, grammarError)
        continue
      }

      console.log(`✓ Grammar inserted: ${grammar.title}`)

      // Insert quiz content
      const { data: quizContent, error: quizError } = await supabase
        .from('quiz_content')
        .insert({
          content_type: 'grammar',
          content_id: grammar.id,
          title: item.quiz.title,
          difficulty_level: item.quiz.difficulty_level,
          word_count: item.quiz.word_count,
        })
        .select()
        .single()

      if (quizError) {
        console.error(`Error inserting quiz for "${item.grammar.title}":`, quizError)
        continue
      }

      // Insert questions and options
      for (const questionData of item.quiz.questions) {
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
          console.error(`Error inserting question:`, questionError)
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
          console.error(`Error inserting options:`, optionsError)
        }
      }

      // Link quiz to grammar
      await supabase
        .from('grammar_topics')
        .update({ quiz_content_id: quizContent.id })
        .eq('id', grammar.id)

      console.log(`✓ Quiz linked: ${quizContent.title} (${item.quiz.questions.length} questions)`)
    }

    // ====== LISTENING CONTENT ======
    console.log('\n=== Seeding Listening Content ===')
    for (const item of listeningContentWithQuizzes) {
      // Insert listening content
      const { data: listening, error: listeningError } = await supabase
        .from('listening_content')
        .insert(item.listening)
        .select()
        .single()

      if (listeningError) {
        console.error(`Error inserting listening "${item.listening.title}":`, listeningError)
        continue
      }

      console.log(`✓ Listening inserted: ${listening.title}`)

      // Insert quiz content
      const { data: quizContent, error: quizError } = await supabase
        .from('quiz_content')
        .insert({
          content_type: 'listening',
          content_id: listening.id,
          title: item.quiz.title,
          difficulty_level: item.quiz.difficulty_level,
          word_count: item.quiz.word_count,
        })
        .select()
        .single()

      if (quizError) {
        console.error(`Error inserting quiz for "${item.listening.title}":`, quizError)
        continue
      }

      // Insert questions and options
      for (const questionData of item.quiz.questions) {
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
          console.error(`Error inserting question:`, questionError)
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
          console.error(`Error inserting options:`, optionsError)
        }
      }

      // Link quiz to listening
      await supabase
        .from('listening_content')
        .update({ quiz_content_id: quizContent.id })
        .eq('id', listening.id)

      console.log(`✓ Quiz linked: ${quizContent.title} (${item.quiz.questions.length} questions)`)
    }
  }
  catch (error) {
    console.error('Seed error:', error) 
  }

}
console.log('\nContent seeding completed successfully!')

