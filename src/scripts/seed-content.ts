import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1 Reading per Level with 3 Questions Each
const readingContentWithQuizzes = [
  // ====== A1 LEVEL ======
  {
    reading: {
      title: "My Daily Routine",
      level: "A1",
      content: `I wake up at 7 o'clock every morning. I brush my teeth and wash my face. Then I have breakfast with my family.\n\nI eat bread, cheese, and eggs. I drink orange juice. After breakfast, I go to school. School starts at 8:30.\n\nI come home at 3 PM. I do my homework and watch TV. I go to bed at 10 PM. This is my daily routine.`,
      audio_urls: ["https://your-cdn.com/audio/a1-daily-routine.mp3"],
      is_premium: false,
      order_index: 1,
    },
    quiz: {
      title: "My Daily Routine - Quiz",
      questions: [
        {
          question_type: "mc",
          question_text: "What time does the person wake up?",
          points: 10,
          order_index: 1,
          options: [
            { text: "6 o'clock", is_correct: false },
            { text: "7 o'clock", is_correct: true },
            { text: "8 o'clock", is_correct: false },
            { text: "9 o'clock", is_correct: false },
          ],
        },
        {
          question_type: "mc",
          question_text: "What does the person eat for breakfast?",
          points: 10,
          order_index: 2,
          options: [
            { text: "Bread, cheese, and eggs", is_correct: true },
            { text: "Rice and fish", is_correct: false },
            { text: "Pasta and salad", is_correct: false },
            { text: "Soup and bread", is_correct: false },
          ],
        },
        {
          question_type: "tf",
          question_text: "The person goes to bed at 10 PM.",
          points: 5,
          order_index: 3,
          options: [
            { text: "True", is_correct: true },
            { text: "False", is_correct: false },
          ],
        },
      ],
    },
  },

  // ====== A2 LEVEL ======
  {
    reading: {
      title: "A Weekend Trip",
      level: "A2",
      content: `Last weekend, my family and I went to the beach. We left early in the morning at 6 AM. The weather was perfect - sunny and warm.\n\nWhen we arrived, we found a nice spot near the water. My brother and I went swimming while our parents relaxed under an umbrella. The water was cool and refreshing.\n\nFor lunch, we had sandwiches and fruit. In the afternoon, we built a sandcastle together. It was really fun! We stayed until sunset and then drove home. Everyone was tired but happy.`,
      audio_urls: ["https://your-cdn.com/audio/a2-weekend-trip.mp3"],
      is_premium: false,
      order_index: 2,
    },
    quiz: {
      title: "A Weekend Trip - Quiz",
      questions: [
        {
          question_type: "mc",
          question_text: "Where did the family go?",
          points: 10,
          order_index: 1,
          options: [
            { text: "To the beach", is_correct: true },
            { text: "To the mountains", is_correct: false },
            { text: "To a museum", is_correct: false },
            { text: "To a park", is_correct: false },
          ],
        },
        {
          question_type: "tf",
          question_text: "The weather was rainy.",
          points: 5,
          order_index: 2,
          options: [
            { text: "True", is_correct: false },
            { text: "False", is_correct: true },
          ],
        },
        {
          question_type: "fb",
          question_text: "For lunch, they had sandwiches and _____.",
          points: 5,
          order_index: 3,
          options: [{ text: "fruit", is_correct: true }],
        },
      ],
    },
  },

  // ====== B1 LEVEL ======
  {
    reading: {
      title: "Remote Work Benefits",
      level: "B1",
      content: `Remote work has become increasingly popular in recent years. Many companies now allow their employees to work from home, which offers several advantages.\n\nFirst, remote work saves commuting time. Workers don't need to spend hours in traffic or crowded public transportation. This extra time can be used for personal activities or rest.\n\nSecond, it provides flexibility. Employees can create their own schedules and work during their most productive hours. They can also balance work with family responsibilities more easily.\n\nHowever, remote work also has challenges. Some people feel isolated and miss the social interaction of an office. Communication can be more difficult when teams are not physically together.`,
      audio_urls: ["https://your-cdn.com/audio/b1-remote-work.mp3"],
      is_premium: false,
      order_index: 3,
    },
    quiz: {
      title: "Remote Work Benefits - Quiz",
      questions: [
        {
          question_type: "mc",
          question_text: "What is the main advantage mentioned first?",
          points: 10,
          order_index: 1,
          options: [
            { text: "Saves commuting time", is_correct: true },
            { text: "Higher salary", is_correct: false },
            { text: "Better office space", is_correct: false },
            { text: "More vacation days", is_correct: false },
          ],
        },
        {
          question_type: "mc",
          question_text: "What challenge does remote work have?",
          points: 10,
          order_index: 2,
          options: [
            { text: "People feel isolated", is_correct: true },
            { text: "Lower pay", is_correct: false },
            { text: "Longer hours", is_correct: false },
            { text: "No technology", is_correct: false },
          ],
        },
        {
          question_type: "tf",
          question_text: "Remote work provides flexibility in scheduling.",
          points: 5,
          order_index: 3,
          options: [
            { text: "True", is_correct: true },
            { text: "False", is_correct: false },
          ],
        },
      ],
    },
  },

  // ====== B2 LEVEL ======
  {
    reading: {
      title: "The History of Coffee",
      level: "B2",
      content: `Coffee is one of the most consumed beverages in the world, but its origins trace back to ancient Ethiopia. According to legend, a goat herder named Kaldi discovered coffee when he noticed his goats became energetic after eating berries from a certain tree.\n\nThe cultivation of coffee began in Yemen in the 15th century. From there, it spread to the Middle East and eventually reached Europe in the 17th century. Initially, coffee was met with suspicion in Europe, with some calling it the "bitter invention of Satan." However, Pope Clement VIII blessed the drink, leading to its widespread acceptance.\n\nCoffee houses became important social hubs, particularly in England and France. They were places where people gathered to discuss politics, business, and literature. In fact, many historical revolutions and intellectual movements were born in coffee houses.\n\nToday, coffee is a global industry worth billions of dollars. Brazil is the largest producer, followed by Vietnam and Colombia. The way we consume coffee has evolved dramatically, from traditional Turkish coffee to modern espresso-based drinks.`,
      audio_urls: ["https://your-cdn.com/audio/b2-coffee-history.mp3"],
      is_premium: false,
      order_index: 4,
    },
    quiz: {
      title: "The History of Coffee - Quiz",
      questions: [
        {
          question_type: "mc",
          question_text: "Who is believed to have discovered coffee?",
          points: 10,
          order_index: 1,
          options: [
            { text: "A goat herder named Kaldi", is_correct: true },
            { text: "Pope Clement VIII", is_correct: false },
            { text: "A Turkish merchant", is_correct: false },
            { text: "A Brazilian farmer", is_correct: false },
          ],
        },
        {
          question_type: "mc",
          question_text: "Where did coffee cultivation first begin?",
          points: 10,
          order_index: 2,
          options: [
            { text: "Ethiopia", is_correct: false },
            { text: "Yemen", is_correct: true },
            { text: "Brazil", is_correct: false },
            { text: "Turkey", is_correct: false },
          ],
        },
        {
          question_type: "tf",
          question_text:
            "Coffee houses became places for social and intellectual gatherings.",
          points: 5,
          order_index: 3,
          options: [
            { text: "True", is_correct: true },
            { text: "False", is_correct: false },
          ],
        },
      ],
    },
  },

  // ====== C1 LEVEL ======
  {
    reading: {
      title: "The Philosophy of Minimalism",
      level: "C1",
      content: `In an era characterized by rampant consumerism and material excess, minimalism has emerged as both a lifestyle choice and a philosophical stance. At its core, minimalism advocates for intentional living - making deliberate choices about what we allow into our lives and focusing on what truly adds value.\n\nThe movement gained significant traction in the early 21st century, partly as a reaction to the 2008 financial crisis. People began questioning the notion that happiness could be purchased and accumulated. Minimalists argue that by reducing physical possessions, we create mental and emotional space for more meaningful pursuits.\n\nHowever, critics contend that minimalism is often a privilege of the wealthy. The ability to "live with less" presupposes that one has enough to begin with. Moreover, the aestheticized version of minimalism promoted on social media - pristine white spaces and carefully curated belongings - has become another form of conspicuous consumption, where people spend considerable money to achieve a "minimal" look.\n\nThe debate extends beyond personal choice to environmental implications. While reducing consumption appears environmentally beneficial, the frequent purging and replacing of items to maintain a minimal aesthetic can paradoxically increase waste. True minimalism, proponents argue, should focus on longevity and sustainability, not just aesthetic simplicity.\n\nUltimately, minimalism's value may lie not in adherence to any particular lifestyle prescription, but in its invitation to examine our relationship with material goods and consider what constitutes a meaningful life.`,
      audio_urls: ["https://your-cdn.com/audio/c1-minimalism.mp3"],
      is_premium: false,
      order_index: 5,
    },
    quiz: {
      title: "The Philosophy of Minimalism - Quiz",
      questions: [
        {
          question_type: "mc",
          question_text:
            "According to the text, what is minimalism fundamentally about?",
          points: 10,
          order_index: 1,
          options: [
            {
              text: "Making intentional choices about what adds value to life",
              is_correct: true,
            },
            { text: "Simply owning fewer possessions", is_correct: false },
            { text: "Following social media trends", is_correct: false },
            { text: "Saving money at all costs", is_correct: false },
          ],
        },
        {
          question_type: "mc",
          question_text:
            "What criticism of minimalism is mentioned in the text?",
          points: 10,
          order_index: 2,
          options: [
            {
              text: "It is often a privilege of the wealthy",
              is_correct: true,
            },
            { text: "It is too complicated", is_correct: false },
            { text: "It requires too much time", is_correct: false },
            { text: "It is unpopular", is_correct: false },
          ],
        },
        {
          question_type: "tf",
          question_text:
            "Frequent purging of items to maintain minimalism can paradoxically increase waste.",
          points: 5,
          order_index: 3,
          options: [
            { text: "True", is_correct: true },
            { text: "False", is_correct: false },
          ],
        },
      ],
    },
  },
];

async function seedSimpleContent() {
  try {
    console.log("Starting simple seed (1 text per level)...\n");

    // ====== READING CONTENT ======
    console.log("=== Seeding Reading Content ===");
    for (const item of readingContentWithQuizzes) {
      // Insert reading content
      const { data: reading, error: readingError } = await supabase
        .from("reading_content")
        .insert(item.reading)
        .select()
        .single();

      if (readingError) {
        console.error(
          `Error inserting reading "${item.reading.title}":`,
          readingError
        );
        continue;
      }

      console.log(`✓ Reading inserted: ${reading.title} (${reading.level})`);

      // Insert quiz content
      const { data: quizContent, error: quizError } = await supabase
        .from("quiz_content")
        .insert({
          content_id: reading.id,
          title: item.quiz.title,
        })
        .select()
        .single();

      if (quizError) {
        console.error(
          `Error inserting quiz for "${item.reading.title}":`,
          quizError
        );
        continue;
      }

      // Insert questions and options
      for (const questionData of item.quiz.questions) {
        const { data: question, error: questionError } = await supabase
          .from("quiz_questions")
          .insert({
            quiz_content_id: quizContent.id,
            question_text: questionData.question_text,
            points: questionData.points,
            order_index: questionData.order_index,
          })
          .select()
          .single();

        if (questionError) {
          console.error(`Error inserting question:`, questionError);
          continue;
        }

        // Insert options
        const optionsToInsert = questionData.options.map((opt) => ({
          question_id: question.id,
          text: opt.text,
          is_correct: opt.is_correct,
        }));

        const { error: optionsError } = await supabase
          .from("quiz_options")
          .insert(optionsToInsert);

        if (optionsError) {
          console.error(`Error inserting options:`, optionsError);
        }
      }

      // Link quiz to reading
      await supabase
        .from("reading_content")
        .update({ quiz_content_id: quizContent.id })
        .eq("id", reading.id);

      console.log(`  ✓ Quiz linked: ${item.quiz.questions.length} questions`);
      console.log(
        `  ✓ Level: ${reading.level} | Premium: ${reading.is_premium}\n`
      );
    }

    console.log("=== SEED COMPLETED SUCCESSFULLY ===");
    console.log(`Total Reading Content: ${readingContentWithQuizzes.length}`);
    console.log("Levels covered: A1, A2, B1, B2, C1");
    console.log("Questions per text: 3");
  } catch (error) {
    console.error("Fatal seed error:", error);
  }
}

seedSimpleContent();
