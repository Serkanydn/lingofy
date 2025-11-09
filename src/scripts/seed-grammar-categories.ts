import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GRAMMAR_CATEGORIES = [
  {
    name: "Tenses",
    slug: "tenses",
    description: "Learn all English tenses from present simple to perfect continuous",
    icon: "⏰",
    color: "#3b82f6",
    order_index: 1,
    is_active: true,
  },
  {
    name: "Modal Verbs",
    slug: "modals",
    description: "Master modal verbs like can, could, should, would, must",
    icon: "💭",
    color: "#8b5cf6",
    order_index: 2,
    is_active: true,
  },
  {
    name: "Conditionals",
    slug: "conditionals",
    description: "Understand zero, first, second and third conditionals",
    icon: "🤔",
    color: "#ec4899",
    order_index: 3,
    is_active: true,
  },
  {
    name: "Passive Voice",
    slug: "passive-voice",
    description: "Learn how to form and use passive voice correctly",
    icon: "🔄",
    color: "#14b8a6",
    order_index: 4,
    is_active: true,
  },
  {
    name: "Reported Speech",
    slug: "reported-speech",
    description: "Convert direct speech to reported speech properly",
    icon: "💬",
    color: "#f59e0b",
    order_index: 5,
    is_active: true,
  },
  {
    name: "Articles",
    slug: "articles",
    description: "Master the use of a, an, and the",
    icon: "📝",
    color: "#10b981",
    order_index: 6,
    is_active: true,
  },
  {
    name: "Prepositions",
    slug: "prepositions",
    description: "Learn common prepositions and their usage",
    icon: "📍",
    color: "#ef4444",
    order_index: 7,
    is_active: true,
  },
  {
    name: "Phrasal Verbs",
    slug: "phrasal-verbs",
    description: "Study commonly used phrasal verbs and their meanings",
    icon: "🔤",
    color: "#6366f1",
    order_index: 8,
    is_active: true,
  },
  {
    name: "Tricky Topics",
    slug: "tricky-topics",
    description: "Master challenging grammar topics and common mistakes",
    icon: "🎯",
    color: "#f97316",
    order_index: 9,
    is_active: true,
  },
];

async function seedGrammarCategories() {
  try {
    console.log("🌱 Starting to seed grammar categories...");

    // Check if categories already exist
    const { data: existing, error: checkError } = await supabase
      .from("grammar_categories")
      .select("slug");

    if (checkError) {
      console.error("❌ Error checking existing categories:", checkError);
      throw checkError;
    }

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing categories. Skipping seed...`);
      console.log("   To re-seed, delete existing categories first.");
      return;
    }

    // Insert categories
    const { data, error } = await supabase
      .from("grammar_categories")
      .insert(GRAMMAR_CATEGORIES)
      .select();

    if (error) {
      console.error("❌ Error inserting categories:", error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} grammar categories!`);
    
    // Display seeded categories
    data?.forEach((cat) => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });

    // Get the category map for updating grammar topics
    const categoryMap = new Map(data?.map(cat => [cat.slug, cat.id]));

    // Update existing grammar topics to link with categories
    console.log("\n🔗 Updating grammar topics with category links...");
    
    const { data: topics, error: topicsError } = await supabase
      .from("grammar_topics")
      .select("id, category");

    if (topicsError) {
      console.error("❌ Error fetching topics:", topicsError);
      throw topicsError;
    }

    if (topics && topics.length > 0) {
      const updates = [];
      
      for (const topic of topics) {
        const categoryId = categoryMap.get(topic.category);
        if (categoryId) {
          updates.push(
            supabase
              .from("grammar_topics")
              .update({ category_id: categoryId })
              .eq("id", topic.id)
          );
        }
      }

      await Promise.all(updates);
      console.log(`✅ Updated ${updates.length} grammar topics with category links!`);
    } else {
      console.log("   No grammar topics found to update.");
    }

    console.log("\n🎉 Grammar categories seed completed successfully!");
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    process.exit(1);
  }
}

// Run the seed
seedGrammarCategories();
