import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const grammarTopics = [
  // ====== TENSES (2 topics) ======
  {
    category: 'tenses',
    title: 'Present Perfect vs Past Simple',
    explanation: 'The Present Perfect connects past actions to the present, while the Past Simple refers to completed actions at a specific time in the past. Use Present Perfect for experiences, recent actions, or ongoing situations. Use Past Simple for finished actions with a clear time reference.',
    examples: [
      'I have lived in London for 5 years. (still living there)',
      'I lived in Paris in 2015. (no longer living there)',
      'She has already finished her homework. (recently completed)',
      'We saw that movie last week. (specific past time)'
    ],
    mini_text: 'Sarah is a travel blogger. She has visited over 30 countries in her life. Last year, she went to Japan and stayed there for two months. She has never been to Australia, but she plans to go next year. Yesterday, she wrote a new blog post about her experiences. She has written more than 200 posts since she started her blog in 2018.',
    order_index: 1,
    quizzes: [
      {
        question: 'I _____ to London three times in my life.',
        type: 'mc',
        options: [
          { text: 'have been', is_correct: true },
          { text: 'was', is_correct: false },
          { text: 'am', is_correct: false },
          { text: 'have go', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'She _____ her keys yesterday and couldn\'t find them.',
        type: 'mc',
        options: [
          { text: 'has lost', is_correct: false },
          { text: 'lost', is_correct: true },
          { text: 'loses', is_correct: false },
          { text: 'is losing', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'They _____ each other since 2010.',
        type: 'mc',
        options: [
          { text: 'knew', is_correct: false },
          { text: 'have known', is_correct: true },
          { text: 'know', is_correct: false },
          { text: 'are knowing', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'tenses',
    title: 'Future Forms: Will vs Going To',
    explanation: 'Use "will" for spontaneous decisions, promises, predictions without evidence, and offers. Use "going to" for planned intentions, predictions based on present evidence, and decisions already made before speaking.',
    examples: [
      'I will help you with that. (spontaneous decision)',
      'I am going to visit my parents next week. (planned)',
      'Look at those clouds! It is going to rain. (evidence-based prediction)',
      'She will be 30 next year. (simple future fact)'
    ],
    mini_text: 'Tom is making plans for the weekend. He is going to meet his friends on Saturday because they arranged it last week. They are going to watch a football match together. Tom looks at the weather forecast - it is going to be sunny! Perfect for outdoor activities. During the match, Tom\'s phone rings. It\'s his mother. She needs help with her computer. "Don\'t worry, Mum. I will come over on Sunday and fix it for you," Tom promises.',
    order_index: 2,
    quizzes: [
      {
        question: 'A: "I don\'t have any money." B: "Don\'t worry, I _____ lend you some."',
        type: 'mc',
        options: [
          { text: 'will', is_correct: true },
          { text: 'am going to', is_correct: false },
          { text: 'going to', is_correct: false },
          { text: 'will to', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'Look at those dark clouds! It _____ storm soon.',
        type: 'mc',
        options: [
          { text: 'will', is_correct: false },
          { text: 'is going to', is_correct: true },
          { text: 'will to', is_correct: false },
          { text: 'goes to', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'We have already bought the tickets. We _____ fly to Spain next month.',
        type: 'mc',
        options: [
          { text: 'will', is_correct: false },
          { text: 'are going to', is_correct: true },
          { text: 'will going to', is_correct: false },
          { text: 'going', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== MODALS (2 topics) ======
  {
    category: 'modals',
    title: 'Must vs Have To',
    explanation: 'Both express obligation, but "must" comes from the speaker\'s authority or personal opinion, while "have to" refers to external rules or obligations. "Must not" expresses prohibition, while "don\'t have to" means no obligation.',
    examples: [
      'You must wear a seatbelt. (strong personal advice)',
      'I have to work on Saturdays. (external rule/company policy)',
      'You must not smoke here. (prohibition)',
      'You don\'t have to come if you\'re busy. (no obligation - optional)'
    ],
    mini_text: 'Emma is a doctor at a busy hospital. She has to work long shifts because that is hospital policy. All doctors must follow strict hygiene rules - they must wash their hands regularly and must wear protective equipment. However, doctors don\'t have to work on their birthdays if they request the day off in advance. Emma tells her patients: "You must not skip your medication" and "You must take this seriously." But she also reassures them: "You don\'t have to worry - you\'re in good hands."',
    order_index: 3,
    quizzes: [
      {
        question: 'You _____ drive without a license. It\'s illegal.',
        type: 'mc',
        options: [
          { text: 'must not', is_correct: true },
          { text: 'don\'t have to', is_correct: false },
          { text: 'must', is_correct: false },
          { text: 'have to', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'I _____ get up early tomorrow because it\'s Saturday.',
        type: 'mc',
        options: [
          { text: 'must not', is_correct: false },
          { text: 'don\'t have to', is_correct: true },
          { text: 'must', is_correct: false },
          { text: 'have', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'All students _____ wear a uniform at our school. It\'s a rule.',
        type: 'mc',
        options: [
          { text: 'must', is_correct: false },
          { text: 'have to', is_correct: true },
          { text: 'must to', is_correct: false },
          { text: 'don\'t have to', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'modals',
    title: 'Should vs Would',
    explanation: '"Should" gives advice or expresses expectation and obligation. "Would" is used for hypothetical situations, polite requests, past habits, and the conditional form.',
    examples: [
      'You should see a doctor. (advice)',
      'I would travel more if I had money. (hypothetical)',
      'Would you like some coffee? (polite offer)',
      'When I was young, I would play outside every day. (past habit)'
    ],
    mini_text: 'Maria is giving advice to her friend Jake. "You should apply for that job," she says. "You have all the qualifications they need." Jake responds: "I would apply, but I don\'t have enough experience." Maria continues: "You should update your resume and should practice for interviews. If I were you, I would definitely try." Jake thinks about it and asks: "Would you help me prepare?" Maria smiles: "Of course I would! You should believe in yourself more."',
    order_index: 4,
    quizzes: [
      {
        question: 'You look tired. You _____ get some rest.',
        type: 'mc',
        options: [
          { text: 'should', is_correct: true },
          { text: 'would', is_correct: false },
          { text: 'should to', is_correct: false },
          { text: 'would to', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'If I had more time, I _____ learn to play the guitar.',
        type: 'mc',
        options: [
          { text: 'should', is_correct: false },
          { text: 'would', is_correct: true },
          { text: 'will', is_correct: false },
          { text: 'could to', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: '_____ you mind opening the window?',
        type: 'mc',
        options: [
          { text: 'Should', is_correct: false },
          { text: 'Would', is_correct: true },
          { text: 'Will', is_correct: false },
          { text: 'Must', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== CONDITIONALS (2 topics) ======
  {
    category: 'conditionals',
    title: 'First vs Second Conditional',
    explanation: 'First Conditional (if + present, will + base verb) expresses real and possible future situations. Second Conditional (if + past simple, would + base verb) expresses hypothetical or unlikely present/future situations.',
    examples: [
      'If it rains tomorrow, I will stay home. (real possibility)',
      'If I won the lottery, I would buy a house. (hypothetical)',
      'If I were rich, I would travel the world. (use "were" for all persons)',
      'If you heat ice, it melts. (zero conditional - general truth)'
    ],
    mini_text: 'Alex is planning his future. He thinks: "If I pass my exams, I will go to university. If I don\'t pass, I will retake them next year." But he also has dreams: "If I were a millionaire, I would buy a yacht and would sail around the world. If I had superpowers, I would help people in need." His friend laughs: "If you keep dreaming, you won\'t study! If you study hard now, you will achieve your goals."',
    order_index: 5,
    quizzes: [
      {
        question: 'If it _____ sunny tomorrow, we will go to the beach.',
        type: 'mc',
        options: [
          { text: 'is', is_correct: true },
          { text: 'will be', is_correct: false },
          { text: 'would be', is_correct: false },
          { text: 'were', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'If I _____ you, I would apologize.',
        type: 'mc',
        options: [
          { text: 'am', is_correct: false },
          { text: 'was', is_correct: false },
          { text: 'were', is_correct: true },
          { text: 'will be', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'She _____ help you if you ask her.',
        type: 'mc',
        options: [
          { text: 'will', is_correct: true },
          { text: 'would', is_correct: false },
          { text: 'would be', is_correct: false },
          { text: 'can', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'conditionals',
    title: 'Third Conditional',
    explanation: 'The Third Conditional (if + past perfect, would have + past participle) expresses hypothetical situations in the past that did not happen. It\'s used for regrets, criticism, or imagining different past outcomes.',
    examples: [
      'If I had studied harder, I would have passed the exam. (regret)',
      'If she had left earlier, she would not have missed the train. (imagining different outcome)',
      'I would have helped you if I had known. (explaining why something didn\'t happen)',
      'If they had invited me, I would have gone to the party.'
    ],
    mini_text: 'Rachel is thinking about yesterday. "If I had woken up earlier, I wouldn\'t have been late for work. If I hadn\'t been late, my boss wouldn\'t have been angry. If the boss hadn\'t been angry, I would have had a better day." Her colleague says: "Don\'t worry! If you had told me you needed a ride, I would have picked you up. If we had left together, we both would have arrived on time. Next time, just call me!"',
    order_index: 6,
    quizzes: [
      {
        question: 'If I _____ about the meeting, I would have attended.',
        type: 'mc',
        options: [
          { text: 'knew', is_correct: false },
          { text: 'had known', is_correct: true },
          { text: 'have known', is_correct: false },
          { text: 'would know', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'She _____ the exam if she had studied more.',
        type: 'mc',
        options: [
          { text: 'would pass', is_correct: false },
          { text: 'would have passed', is_correct: true },
          { text: 'will have passed', is_correct: false },
          { text: 'had passed', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'If they _____ me, I would have helped them.',
        type: 'mc',
        options: [
          { text: 'asked', is_correct: false },
          { text: 'would ask', is_correct: false },
          { text: 'had asked', is_correct: true },
          { text: 'have asked', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== PASSIVE VOICE (2 topics) ======
  {
    category: 'passive_voice',
    title: 'Active vs Passive Voice',
    explanation: 'Passive voice emphasizes the action or receiver rather than the doer. Form: be + past participle. Use when the doer is unknown, unimportant, or obvious. Active voice is generally more direct and clearer.',
    examples: [
      'The book was written by Shakespeare. (passive - emphasizes the book)',
      'Shakespeare wrote the book. (active - emphasizes Shakespeare)',
      'The car is being repaired. (present continuous passive)',
      'English is spoken all over the world. (doer is obvious/unimportant)'
    ],
    mini_text: 'The Mona Lisa was painted by Leonardo da Vinci in the 16th century. It is displayed in the Louvre Museum in Paris, where it is viewed by millions of tourists every year. The painting was stolen in 1911 but was recovered two years later. Today, it is protected by bulletproof glass and is considered one of the most valuable paintings in the world. Special exhibitions are organized regularly, and the museum is visited by art lovers from around the globe.',
    order_index: 7,
    quizzes: [
      {
        question: 'The letter _____ yesterday.',
        type: 'mc',
        options: [
          { text: 'was sent', is_correct: true },
          { text: 'sent', is_correct: false },
          { text: 'is sent', is_correct: false },
          { text: 'has sent', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'English _____ in many countries.',
        type: 'mc',
        options: [
          { text: 'speaks', is_correct: false },
          { text: 'is spoken', is_correct: true },
          { text: 'is speaking', is_correct: false },
          { text: 'was speaking', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'The house _____ in 1995.',
        type: 'mc',
        options: [
          { text: 'built', is_correct: false },
          { text: 'is built', is_correct: false },
          { text: 'was built', is_correct: true },
          { text: 'has built', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'passive_voice',
    title: 'Passive with Modals',
    explanation: 'Modal verbs in passive voice follow the pattern: modal + be + past participle. Common in formal writing and when discussing rules, possibilities, or obligations without specifying who performs the action.',
    examples: [
      'The report must be submitted by Friday. (obligation)',
      'The problem can be solved easily. (possibility)',
      'This should be done immediately. (recommendation)',
      'The documents may be required later. (possibility)'
    ],
    mini_text: 'Company Rules: All employees must be informed about safety procedures. ID badges must be worn at all times. Visitors should be registered at the reception desk. Personal belongings can be stored in the lockers provided. Mobile phones should not be used during meetings. Reports must be completed by the end of each week. Any problems should be reported to management immediately. These rules must be followed to ensure a safe and productive workplace.',
    order_index: 8,
    quizzes: [
      {
        question: 'The work _____ finished by tomorrow.',
        type: 'mc',
        options: [
          { text: 'must', is_correct: false },
          { text: 'must be', is_correct: true },
          { text: 'must been', is_correct: false },
          { text: 'must to be', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'The door _____ locked at night.',
        type: 'mc',
        options: [
          { text: 'should', is_correct: false },
          { text: 'should be', is_correct: true },
          { text: 'should to be', is_correct: false },
          { text: 'should been', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'The problem _____ solved with more time.',
        type: 'mc',
        options: [
          { text: 'can', is_correct: false },
          { text: 'can be', is_correct: true },
          { text: 'can to be', is_correct: false },
          { text: 'can been', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== REPORTED SPEECH (2 topics) ======
  {
    category: 'reported-speech',
    title: 'Direct vs Indirect Speech',
    explanation: 'Reported speech (indirect speech) is used to tell someone what another person said without using their exact words. The tense usually shifts back one step, pronouns change, and time/place references may need adjustment.',
    examples: [
      'Direct: "I am tired." → Indirect: She said she was tired.',
      'Direct: "I will come tomorrow." → Indirect: He said he would come the next day.',
      'Direct: "I have finished my work." → Indirect: She said she had finished her work.',
      'Direct: "Where do you live?" → Indirect: He asked where I lived.'
    ],
    mini_text: 'Yesterday, I met my friend Sophie. She told me she was planning a trip to Italy. She said she had always wanted to visit Rome. Sophie mentioned that she would leave next month and would stay there for two weeks. She asked me if I wanted to join her. I replied that I couldn\'t go because I had to work. She said she understood and added that she would send me lots of photos. I told her I would miss her and asked her to have a great time.',
    order_index: 9,
    quizzes: [
      {
        question: 'Direct: "I am happy." Reported: She said she _____ happy.',
        type: 'mc',
        options: [
          { text: 'is', is_correct: false },
          { text: 'was', is_correct: true },
          { text: 'were', is_correct: false },
          { text: 'has been', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'Direct: "I will call you." Reported: He said he _____ call me.',
        type: 'mc',
        options: [
          { text: 'will', is_correct: false },
          { text: 'would', is_correct: true },
          { text: 'can', is_correct: false },
          { text: 'could', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'Direct: "Where do you work?" Reported: She asked me where I _____.',
        type: 'mc',
        options: [
          { text: 'work', is_correct: false },
          { text: 'worked', is_correct: true },
          { text: 'working', is_correct: false },
          { text: 'have worked', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'reported-speech',
    title: 'Reporting Questions and Commands',
    explanation: 'When reporting questions, use "asked" + question word + statement word order (no inversion). For yes/no questions, use "asked if/whether". For commands, use "told/asked + object + (not) to + infinitive".',
    examples: [
      'Direct: "Where are you going?" → He asked where I was going.',
      'Direct: "Do you like coffee?" → She asked if/whether I liked coffee.',
      'Direct: "Close the door." → He told me to close the door.',
      'Direct: "Don\'t be late." → She told me not to be late.'
    ],
    mini_text: 'At the office yesterday, my boss called me into her office. She asked me if I had finished the project. I told her I had almost completed it. She asked when I would submit it. I replied that I would finish it by the end of the day. She told me to double-check everything and asked me not to rush. She also asked whether I needed any help. I thanked her and said I was fine. She told me to come back if I had any problems.',
    order_index: 10,
    quizzes: [
      {
        question: 'Direct: "Can you help me?" Reported: He asked _____ help him.',
        type: 'mc',
        options: [
          { text: 'if I can', is_correct: false },
          { text: 'if I could', is_correct: true },
          { text: 'that I can', is_correct: false },
          { text: 'can I', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'Direct: "Please sit down." Reported: She asked me _____ down.',
        type: 'mc',
        options: [
          { text: 'sit', is_correct: false },
          { text: 'to sit', is_correct: true },
          { text: 'sitting', is_correct: false },
          { text: 'sat', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'Direct: "Don\'t touch that!" Reported: He told me _____ that.',
        type: 'mc',
        options: [
          { text: 'don\'t touch', is_correct: false },
          { text: 'not touch', is_correct: false },
          { text: 'not to touch', is_correct: true },
          { text: 'to not touch', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== ARTICLES (2 topics) ======
  {
    category: 'articles',
    title: 'A/An vs The',
    explanation: 'Use "a/an" for non-specific singular countable nouns (first mention or general). Use "the" for specific nouns (already mentioned, unique, or clear from context). "A" before consonant sounds, "an" before vowel sounds.',
    examples: [
      'I saw a dog in the park. The dog was very friendly. (first "a", then "the")',
      'She is a teacher. (general - any teacher)',
      'The sun rises in the east. (unique thing)',
      'Can you pass me the salt? (clear from context)'
    ],
    mini_text: 'Last week, I visited a museum in London. The museum was amazing! I saw an exhibition about ancient Egypt. The exhibition included artifacts from the pyramids. There was a mummy in a glass case. The mummy was over 3,000 years old. I also met an Egyptian guide who explained the history. The guide was very knowledgeable and friendly. After the tour, I bought a book from the museum shop. The book is now one of my favorites.',
    order_index: 11,
    quizzes: [
      {
        question: 'I need _____ pen. Do you have one?',
        type: 'mc',
        options: [
          { text: 'a', is_correct: true },
          { text: 'an', is_correct: false },
          { text: 'the', is_correct: false },
          { text: 'no article', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: '_____ moon orbits around the Earth.',
        type: 'mc',
        options: [
          { text: 'A', is_correct: false },
          { text: 'An', is_correct: false },
          { text: 'The', is_correct: true },
          { text: 'No article', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'She wants to be _____ engineer.',
        type: 'mc',
        options: [
          { text: 'a', is_correct: false },
          { text: 'an', is_correct: true },
          { text: 'the', is_correct: false },
          { text: 'no article', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'articles',
    title: 'Zero Article Usage',
    explanation: 'No article (zero article) is used with plural and uncountable nouns when speaking generally, with most proper nouns (names, countries, cities), meals, sports, languages, and academic subjects.',
    examples: [
      'I like coffee. (general, uncountable)',
      'Dogs are loyal animals. (general, plural)',
      'She speaks French. (language)',
      'He plays football. (sport)',
      'I study mathematics. (academic subject)'
    ],
    mini_text: 'My name is David and I live in London. I study medicine at university. I love science and enjoy learning about biology and chemistry. In my free time, I play tennis and go swimming. For breakfast, I usually have toast and coffee. I speak English and Spanish fluently. My favorite food is pizza, and I often eat it for dinner. On weekends, I visit museums and go to parks. Life in London is exciting and full of opportunities.',
    order_index: 12,
    quizzes: [
      {
        question: 'I have _____ breakfast at 8 AM every day.',
        type: 'mc',
        options: [
          { text: 'a', is_correct: false },
          { text: 'an', is_correct: false },
          { text: 'the', is_correct: false },
          { text: 'no article', is_correct: true }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'She speaks _____ Japanese very well.',
        type: 'mc',
        options: [
          { text: 'a', is_correct: false },
          { text: 'an', is_correct: false },
          { text: 'the', is_correct: false },
          { text: 'no article', is_correct: true }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: '_____ children need love and attention.',
        type: 'mc',
        options: [
          { text: 'A', is_correct: false },
          { text: 'An', is_correct: false },
          { text: 'The', is_correct: false },
          { text: 'No article', is_correct: true }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== PREPOSITIONS (2 topics) ======
  {
    category: 'prepositions',
    title: 'Time Prepositions: In, On, At',
    explanation: 'Use "at" for specific times, "on" for days and dates, "in" for months, years, centuries, and longer periods. These prepositions help specify when something happens.',
    examples: [
      'I wake up at 7 AM. (specific time)',
      'My birthday is on May 15th. (date)',
      'We met on Monday. (day)',
      'She was born in 1990. (year)',
      'I go swimming in the summer. (season)'
    ],
    mini_text: 'I have a busy schedule. I wake up at 6:30 AM every morning. I have a meeting on Monday at 10 AM. My vacation is in August, and I will travel to Spain. My flight leaves on August 15th at 9:00 PM. In the evening, I usually relax at home. On weekends, I visit my family. My sister\'s wedding is in June. The ceremony will be on June 20th at 2 PM. In the afternoon, there will be a reception. I was born in 1995, in the winter. Life is busy but exciting!',
    order_index: 13,
    quizzes: [
      {
        question: 'The meeting is _____ 3 PM.',
        type: 'mc',
        options: [
          { text: 'in', is_correct: false },
          { text: 'on', is_correct: false },
          { text: 'at', is_correct: true },
          { text: 'by', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'I was born _____ 1998.',
        type: 'mc',
        options: [
          { text: 'in', is_correct: true },
          { text: 'on', is_correct: false },
          { text: 'at', is_correct: false },
          { text: 'by', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'We have a party _____ Saturday.',
        type: 'mc',
        options: [
          { text: 'in', is_correct: false },
          { text: 'on', is_correct: true },
          { text: 'at', is_correct: false },
          { text: 'by', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'prepositions',
    title: 'Place Prepositions: In, On, At',
    explanation: 'Use "at" for specific points/locations, "on" for surfaces, and "in" for enclosed spaces. These help describe where something or someone is located.',
    examples: [
      'I am at the bus stop. (specific point)',
      'The book is on the table. (surface)',
      'She lives in London. (city/enclosed space)',
      'There\'s a picture on the wall. (surface)',
      'They are in the room. (enclosed space)'
    ],
    mini_text: 'Tom is at work right now. His office is in the city center, on the 5th floor of a tall building. His desk is in the corner of the room, and his computer is on his desk. There are some photos on the wall behind him. At lunchtime, he usually eats at a café nearby. The café is on Main Street, in a small building. In the evening, Tom goes home. He lives in an apartment on Park Avenue. At night, he relaxes on the sofa and watches TV.',
    order_index: 14,
    quizzes: [
      {
        question: 'The keys are _____ the table.',
        type: 'mc',
        options: [
          { text: 'in', is_correct: false },
          { text: 'on', is_correct: true },
          { text: 'at', is_correct: false },
          { text: 'by', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'She is waiting _____ the station.',
        type: 'mc',
        options: [
          { text: 'in', is_correct: false },
          { text: 'on', is_correct: false },
          { text: 'at', is_correct: true },
          { text: 'by', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'They live _____ New York.',
        type: 'mc',
        options: [
          { text: 'in', is_correct: true },
          { text: 'on', is_correct: false },
          { text: 'at', is_correct: false },
          { text: 'by', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== PHRASAL VERBS (2 topics) ======
  {
    category: 'phrasal-verbs',
    title: 'Common Phrasal Verbs with UP',
    explanation: 'Phrasal verbs with "up" often indicate completion, increase, or upward movement. The meaning can be literal or idiomatic. Many cannot be translated word-by-word.',
    examples: [
      'Wake up - to stop sleeping (I wake up at 7 AM.)',
      'Give up - to quit or stop trying (Don\'t give up!)',
      'Look up - to search for information (Look up the word in a dictionary.)',
      'Cheer up - to become happier (Cheer up! Things will get better.)',
      'Grow up - to become an adult (I grew up in London.)'
    ],
    mini_text: 'Every morning, I wake up at 6 AM. I get up immediately and start my day. Sometimes I feel tired and want to give up my morning routine, but I don\'t. I look up motivational quotes online to cheer me up. My children are growing up so fast - they used to be babies, and now they\'re teenagers! Yesterday, I had to pick up my daughter from school. On the way home, we stopped to fill up the car with gas. When we got home, I cleaned up the kitchen and then we all sat down for dinner.',
    order_index: 15,
    quizzes: [
      {
        question: 'I need to _____ this word in the dictionary.',
        type: 'mc',
        options: [
          { text: 'look up', is_correct: true },
          { text: 'look at', is_correct: false },
          { text: 'look for', is_correct: false },
          { text: 'look after', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'Don\'t _____ ! Keep trying!',
        type: 'mc',
        options: [
          { text: 'give in', is_correct: false },
          { text: 'give up', is_correct: true },
          { text: 'give away', is_correct: false },
          { text: 'give out', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'What time do you usually _____ in the morning?',
        type: 'mc',
        options: [
          { text: 'wake up', is_correct: true },
          { text: 'wake down', is_correct: false },
          { text: 'wake off', is_correct: false },
          { text: 'wake out', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'phrasal-verbs',
    title: 'Common Phrasal Verbs with OUT',
    explanation: 'Phrasal verbs with "out" often suggest movement away from something, completion, or discovery. They can be separable or inseparable depending on the specific verb.',
    examples: [
      'Find out - to discover information (I found out the truth.)',
      'Work out - to exercise or solve a problem (I work out at the gym.)',
      'Run out - to use all of something (We ran out of milk.)',
      'Figure out - to understand or solve (Can you figure out this puzzle?)',
      'Turn out - to result in a particular way (Everything turned out well.)'
    ],
    mini_text: 'Last week, I tried to figure out why my computer wasn\'t working. I looked online and found out that I needed to update the software. The solution turned out to be quite simple! Yesterday, I ran out of coffee, so I went to the store. While shopping, I ran into an old friend - what a surprise! We went out for lunch and talked for hours. She told me she works out every day at a new gym. She invited me to check it out. I think I\'ll try it out next week!',
    order_index: 16,
    quizzes: [
      {
        question: 'We _____ of sugar. Can you buy some?',
        type: 'mc',
        options: [
          { text: 'ran into', is_correct: false },
          { text: 'ran out', is_correct: true },
          { text: 'ran away', is_correct: false },
          { text: 'ran over', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'I need to _____ the answer to this problem.',
        type: 'mc',
        options: [
          { text: 'figure out', is_correct: true },
          { text: 'figure in', is_correct: false },
          { text: 'figure up', is_correct: false },
          { text: 'figure off', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'She _____ at the gym three times a week.',
        type: 'mc',
        options: [
          { text: 'works off', is_correct: false },
          { text: 'works in', is_correct: false },
          { text: 'works out', is_correct: true },
          { text: 'works up', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },

  // ====== TRICKY TOPICS (2 topics) ======
  {
    category: 'tricky-topics',
    title: 'Used To vs Be Used To vs Get Used To',
    explanation: '"Used to" describes past habits or states (no longer true). "Be used to" means be accustomed to something (followed by noun/-ing form). "Get used to" means become accustomed to something (process of adapting).',
    examples: [
      'I used to play tennis every weekend. (past habit - don\'t play anymore)',
      'I am used to waking up early. (accustomed - it\'s normal now)',
      'I am getting used to the cold weather. (becoming accustomed)',
      'She used to live in Paris. (past state - doesn\'t live there now)'
    ],
    mini_text: 'When I first moved to England, everything was different. I used to live in a warm country, so the cold weather was difficult. At first, I couldn\'t get used to the rain and grey skies. But after a few months, I got used to it. Now I am used to the British weather and it doesn\'t bother me anymore. I also used to drive on the right side of the road, but now I am used to driving on the left. It took time, but I eventually got used to the British lifestyle. I even got used to drinking tea every day!',
    order_index: 17,
    quizzes: [
      {
        question: 'I _____ smoke, but I quit five years ago.',
        type: 'mc',
        options: [
          { text: 'used to', is_correct: true },
          { text: 'am used to', is_correct: false },
          { text: 'get used to', is_correct: false },
          { text: 'was used to', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'She _____ living alone now. It\'s normal for her.',
        type: 'mc',
        options: [
          { text: 'used to', is_correct: false },
          { text: 'is used to', is_correct: true },
          { text: 'gets used to', is_correct: false },
          { text: 'using to', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'I am slowly _____ my new job.',
        type: 'mc',
        options: [
          { text: 'used to', is_correct: false },
          { text: 'am used to', is_correct: false },
          { text: 'getting used to', is_correct: true },
          { text: 'use to', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  },
  {
    category: 'tricky-topics',
    title: 'Make vs Do',
    explanation: 'Use "make" for creating, producing, or constructing something. Use "do" for activities, actions, or tasks (especially general ones). Many collocations must be memorized.',
    examples: [
      'Make a decision/mistake/noise/plan/promise/phone call',
      'Do homework/housework/exercise/a favor/business/research',
      'I need to make breakfast. (preparing food)',
      'Can you do me a favor? (performing an action)'
    ],
    mini_text: 'This morning, I had to make an important decision about my career. First, I made a list of pros and cons. Then I made some phone calls to ask for advice. My friend did me a favor and gave me good advice. After lunch, I did some research online. I made a few mistakes at first, but learned from them. In the evening, I did my homework and then did some exercise at the gym. Before bed, I made dinner and made plans for tomorrow. It was a productive day!',
    order_index: 18,
    quizzes: [
      {
        question: 'I need to _____ a phone call.',
        type: 'mc',
        options: [
          { text: 'make', is_correct: true },
          { text: 'do', is_correct: false },
          { text: 'take', is_correct: false },
          { text: 'have', is_correct: false }
        ],
        points: 10,
        order_index: 1
      },
      {
        question: 'Can you _____ me a favor?',
        type: 'mc',
        options: [
          { text: 'make', is_correct: false },
          { text: 'do', is_correct: true },
          { text: 'give', is_correct: false },
          { text: 'take', is_correct: false }
        ],
        points: 10,
        order_index: 2
      },
      {
        question: 'I have to _____ my homework tonight.',
        type: 'mc',
        options: [
          { text: 'make', is_correct: false },
          { text: 'do', is_correct: true },
          { text: 'work', is_correct: false },
          { text: 'take', is_correct: false }
        ],
        points: 10,
        order_index: 3
      }
    ]
  }
];


async function seedGrammarTopics() {
  console.log('Starting to seed grammar topics...')

  try {
    for (const topic of grammarTopics) {
      console.log(`\nProcessing: ${topic.title} (${topic.category})`)

      // Insert grammar topic
      const { data: insertedTopic, error: topicError } = await supabase
        .from('grammar_topics')
        .insert({
          category: topic.category,
          title: topic.title,
          explanation: topic.explanation,
          examples: topic.examples,
          mini_text: topic.mini_text,
          order_index: topic.order_index
        })
        .select()
        .single()

      if (topicError) {
        console.error(`Error inserting topic ${topic.title}:`, topicError)
        continue
      }

      console.log(`✓ Created topic: ${topic.title}`)
    }

    console.log('\n✅ All grammar topics seeded successfully!')
  } catch (error) {
    console.error('Error seeding grammar topics:', error)
    throw error
  }
}

// Run the seed function
seedGrammarTopics()
  .then(() => {
    console.log('Seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
