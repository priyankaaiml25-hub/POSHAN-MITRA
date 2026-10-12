import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateGrowthStatus, Gender } from './utils/whoGrowthStandards.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Poshan Mitra database seeding...');

  // 1. Create Anganwadi Centre
  const centre = await prisma.centre.upsert({
    where: { code: 'AWC-BLR-014' },
    update: {},
    create: {
      name: 'Kaveri Anganwadi Centre #14',
      code: 'AWC-BLR-014',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pincode: '560001',
      contactPhone: '+91 80 2234 5678',
    },
  });
  console.log(`✅ Centre created/verified: ${centre.name}`);

  // 2. Create Users
  const workerHash = await bcrypt.hash('Poshan@123', 10);
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const parentHash = await bcrypt.hash('Parent@123', 10);

  const worker = await prisma.user.upsert({
    where: { email: 'worker@poshanmitra.in' },
    update: { passwordHash: workerHash },
    create: {
      email: 'worker@poshanmitra.in',
      passwordHash: workerHash,
      name: 'Sunita Devi (Anganwadi Worker)',
      role: 'WORKER',
      centreId: centre.id,
      phone: '+91 98765 43210',
      language: 'en',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@poshanmitra.in' },
    update: { passwordHash: adminHash },
    create: {
      email: 'admin@poshanmitra.in',
      passwordHash: adminHash,
      name: 'Dr. Rajesh Kumar (CDPO District Officer)',
      role: 'ADMIN',
      centreId: centre.id,
      phone: '+91 98111 22334',
      language: 'en',
    },
  });

  const parent = await prisma.user.upsert({
    where: { email: 'parent@poshanmitra.in' },
    update: { passwordHash: parentHash },
    create: {
      email: 'parent@poshanmitra.in',
      passwordHash: parentHash,
      name: 'Lakshmi M (Parent/Caregiver)',
      role: 'PARENT',
      centreId: centre.id,
      phone: '+91 99000 11223',
      language: 'kn',
    },
  });
  console.log(`✅ Users created: Worker (${worker.email}), Admin (${admin.email}), Parent (${parent.email})`);

  // 3. Create Pseudonymous Children Records
  const childrenData = [
    {
      ref: 'CH-BLR-001',
      dob: new Date('2023-04-15'), // ~3.5 years
      gender: 'MALE',
      guardian: 'Kavitha R',
      measurements: [
        { date: new Date('2026-04-10'), wt: 13.8, ht: 95.0 },
        { date: new Date('2026-07-15'), wt: 14.5, ht: 97.2 },
        { date: new Date('2026-10-05'), wt: 15.1, ht: 99.4 },
      ],
    },
    {
      ref: 'CH-BLR-002',
      dob: new Date('2024-02-10'), // ~2.5 years
      gender: 'FEMALE',
      guardian: 'Pooja S',
      measurements: [
        { date: new Date('2026-03-12'), wt: 11.2, ht: 87.0 },
        { date: new Date('2026-06-20'), wt: 12.0, ht: 90.1 },
        { date: new Date('2026-09-28'), wt: 12.7, ht: 92.5 },
      ],
    },
    {
      ref: 'CH-BLR-003',
      dob: new Date('2022-11-20'), // ~4 years
      gender: 'MALE',
      guardian: 'Ramesh N',
      measurements: [
        { date: new Date('2026-02-10'), wt: 14.8, ht: 99.0 },
        { date: new Date('2026-06-15'), wt: 15.5, ht: 102.0 },
        { date: new Date('2026-10-02'), wt: 16.2, ht: 104.5 },
      ],
    },
    {
      ref: 'CH-BLR-004', // Needs review (Moderate Underweight)
      dob: new Date('2024-11-05'), // ~2 years
      gender: 'FEMALE',
      guardian: 'Deepa K',
      measurements: [
        { date: new Date('2026-05-14'), wt: 8.8, ht: 80.5 },
        { date: new Date('2026-08-10'), wt: 9.1, ht: 82.0 },
        { date: new Date('2026-10-08'), wt: 9.2, ht: 83.2 },
      ],
    },
    {
      ref: 'CH-BLR-005',
      dob: new Date('2023-08-12'), // ~3 years
      gender: 'MALE',
      guardian: 'Suma B',
      measurements: [
        { date: new Date('2026-04-18'), wt: 13.0, ht: 92.0 },
        { date: new Date('2026-07-22'), wt: 13.7, ht: 94.5 },
        { date: new Date('2026-10-01'), wt: 14.2, ht: 96.8 },
      ],
    },
    {
      ref: 'CH-BLR-006',
      dob: new Date('2022-06-01'), // ~4.5 years
      gender: 'FEMALE',
      guardian: 'Asha M',
      measurements: [
        { date: new Date('2026-03-05'), wt: 15.5, ht: 101.5 },
        { date: new Date('2026-07-10'), wt: 16.4, ht: 104.2 },
        { date: new Date('2026-10-04'), wt: 17.1, ht: 106.8 },
      ],
    },
  ];

  for (const item of childrenData) {
    const child = await prisma.child.upsert({
      where: { referenceId: item.ref },
      update: {},
      create: {
        referenceId: item.ref,
        dateOfBirth: item.dob,
        gender: item.gender,
        guardianName: item.guardian,
        centreId: centre.id,
      },
    });

    // Seed measurements
    for (const m of item.measurements) {
      const interp = calculateGrowthStatus({
        dateOfBirth: item.dob,
        measurementDate: m.date,
        gender: item.gender as Gender,
        weightKg: m.wt,
        heightCm: m.ht,
      });

      const existingM = await prisma.growthMeasurement.findFirst({
        where: {
          childId: child.id,
          measurementDate: m.date,
        },
      });

      if (!existingM) {
        await prisma.growthMeasurement.create({
          data: {
            childId: child.id,
            measurementDate: m.date,
            weightKg: m.wt,
            heightCm: m.ht,
            waz: interp.waz,
            haz: interp.haz,
            whz: interp.whz,
            statusWaz: interp.statusWaz,
            statusHaz: interp.statusHaz,
            statusWhz: interp.statusWhz,
            needsReview: interp.needsReview,
            reviewNotes: interp.reviewReason || null,
            recordedBy: 'Sunita Devi (Worker)',
          },
        });
      }
    }
  }
  console.log(`✅ Seeded 6 pseudonymous children and longitudinal measurements`);

  // 4. Seed Follow-up Tasks
  const meeraChild = await prisma.child.findUnique({ where: { referenceId: 'CH-BLR-004' } });
  const rohanChild = await prisma.child.findUnique({ where: { referenceId: 'CH-BLR-003' } });

  const tasksData = [
    {
      title: 'Nutrition Counselling: Supplementary calorie & protein intake for CH-BLR-004',
      description: 'Review feeding frequency, introduce roasted peanut-ragi porridge, and verify iron syrup intake.',
      category: 'NUTRITION_COUNSELLING',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: new Date('2026-10-20'),
      childId: meeraChild?.id,
      workerId: worker.id,
    },
    {
      title: 'Monthly Growth Follow-up: Weight verification for CH-BLR-003',
      description: 'Scheduled anthropometric check at Anganwadi centre with calibrated infant scale.',
      category: 'GROWTH_MONITORING',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date('2026-10-25'),
      childId: rohanChild?.id,
      workerId: worker.id,
    },
    {
      title: 'Coordinate ANM Referral & Vitamin A dose for CH-BLR-004',
      description: 'Referred to primary health centre ANM for comprehensive pediatric health check.',
      category: 'ASHA_ANM_REFERRAL',
      priority: 'HIGH',
      status: 'COMPLETED',
      dueDate: new Date('2026-09-30'),
      childId: meeraChild?.id,
      workerId: worker.id,
      completedAt: new Date('2026-09-29'),
      completionNotes: 'ANM visit completed. Child received scheduled Vitamin A supplement and albendazole deworming.',
    },
    {
      title: 'Community Handwashing & Hygiene Demonstration Session',
      description: 'Demonstrate 6-step soap handwashing with children and mothers before morning snacks.',
      category: 'PARENT_EDUCATION',
      priority: 'LOW',
      status: 'COMPLETED',
      dueDate: new Date('2026-10-02'),
      workerId: worker.id,
      completedAt: new Date('2026-10-02'),
      completionNotes: 'Conducted interactive handwashing session with 14 mothers and children using Poshan Play rhyme.',
    },
    {
      title: 'Workshop: Budget Millets and Egg Inclusion in Daily Family Diet',
      description: 'Demonstrate ragi mudde preparation with drumstick leaf dal and cost breakdown.',
      category: 'PARENT_EDUCATION',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: new Date('2026-10-28'),
      workerId: worker.id,
    },
  ];

  for (const t of tasksData) {
    const exists = await prisma.followUpTask.findFirst({
      where: { title: t.title },
    });
    if (!exists) {
      await prisma.followUpTask.create({
        data: {
          title: t.title,
          description: t.description,
          category: t.category,
          priority: t.priority,
          status: t.status,
          dueDate: t.dueDate,
          childId: t.childId || null,
          centreId: centre.id,
          assignedWorkerId: t.workerId,
          completedAt: t.completedAt || null,
          completionNotes: t.completionNotes || null,
        },
      });
    }
  }
  console.log(`✅ Seeded 5 follow-up tasks`);

  // 5. Seed Nutrition Lessons
  const lessons = [
    {
      slug: 'energy-giving-foods',
      titleEn: 'Energy-Giving Foods: Fuel for Growing Children',
      titleHi: 'ऊर्जा देने वाले खाद्य पदार्थ: बढ़ते बच्चों का ईंधन',
      titleKn: 'ಶಕ್ತಿ ನೀಡುವ ಆಹಾರಗಳು: ಬೆಳೆಯುವ ಮಕ್ಕಳಿಗೆ ಇಂಧನ',
      category: 'ENERGY',
      readTimeMin: 5,
      summaryEn: 'Learn how millets like Ragi and Jowar, parboiled rice, and whole wheat give sustained stamina for active children.',
      summaryHi: 'जानें कि रागी, ज्वार, चावल और गेहूं कैसे सक्रिय बच्चों को निरंतर ताकत देते हैं।',
      summaryKn: 'ರಾಗಿ, ಜೋಳ, ಅಕ್ಕಿ ಮತ್ತು ಗೋಧಿ ಬೆಳೆಯುವ ಮಕ್ಕಳಿಗೆ ಹೇಗೆ ನಿರಂತರ ಶಕ್ತಿ ನೀಡುತ್ತವೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.',
      orderIndex: 1,
      contentJson: JSON.stringify({
        icon: 'Zap',
        sections: [
          {
            heading: 'Why Energy Foods Matter',
            text: 'Children between 3 to 6 years are extremely active. Carbohydrates and complex grains provide the glucose required for brain development, running, playing, and learning.',
          },
          {
            heading: 'The Magic of Indian Millets (Shree Anna)',
            text: 'Ragi (Finger Millet) and Jowar (Sorghum) release energy slowly throughout the day, preventing hunger crashes. Ragi contains 344mg of calcium per 100g, far superior to polished white rice.',
          },
        ],
        foodExamples: ['Ragi (Finger Millet)', 'Parboiled Rice', 'Whole Wheat Chapati', 'Jowar Roti', 'Poha (Flattened rice)'],
        practicalTip: 'Add 1 teaspoon of roasted peanut powder or sesame seeds to ragi porridge to boost both calories and good fats.',
        quiz: {
          question: 'Which Indian grain is exceptionally rich in both energy and natural calcium?',
          options: ['Ragi (Finger Millet)', 'Polished White Sugar', 'Refined Maida', 'Potato Chips'],
          correctIndex: 0,
          explanation: 'Ragi contains about 344mg calcium per 100g along with complex carbohydrates that nourish bones and muscles.',
        },
      }),
    },
    {
      slug: 'protein-powerhouses',
      titleEn: 'Protein Powerhouses: Building Strong Muscles and Organs',
      titleHi: 'प्रोटीन के स्रोत: मजबूत मांसपेशियों और अंगों का निर्माण',
      titleKn: 'ಪ್ರೋಟೀನ್ ಶಕ್ತಿ ಕೇಂದ್ರಗಳು: ಬಲವಾದ ಸ್ನಾಯುಗಳು ಮತ್ತು ಅಂಗಗಳನ್ನು ನಿರ್ಮಿಸುವುದು',
      category: 'PROTEIN',
      readTimeMin: 6,
      summaryEn: 'Discover affordable Indian proteins like Moong Dal, Chana, roasted peanuts, milk, and eggs.',
      summaryHi: 'मूंग दाल, चना, भुनी मूंगफली, दूध और अंडे जैसे किफायती भारतीय प्रोटीन के बारे में जानें।',
      summaryKn: 'ಹೆಸರುಬೇಳೆ, ಕಡಲೆ, ಹುರಿದ ಕಡಲೆಕಾಯಿ, ಹಾಲು ಮತ್ತು ಮೊಟ್ಟೆಗಳಂತಹ ಕೈಗೆಟುಕುವ ಪ್ರೋಟೀನ್‌ಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ.',
      orderIndex: 2,
      contentJson: JSON.stringify({
        icon: 'Dna',
        sections: [
          {
            heading: 'Proteins are the Body’s Building Blocks',
            text: 'Every muscle, enzyme, skin cell, and immune antibody requires amino acids. Without adequate protein, children may experience muscle wasting and frequent infections.',
          },
          {
            heading: 'Combining Grains and Pulses for Complete Protein',
            text: 'When a grain (like rice or roti) is eaten together with a pulse (like dal or rajma) in a 2:1 or 3:1 ratio, they provide all 9 essential amino acids just like animal protein.',
          },
        ],
        foodExamples: ['Moong Dal & Toor Dal', 'Hard-boiled Eggs', 'Roasted Peanuts', 'Sprouted Green Gram', 'Cow’s Milk & Curd'],
        practicalTip: 'Sprouting green gram (moong) increases Vitamin C and makes protein and iron 40% easier for children’s digestive systems to absorb.',
        quiz: {
          question: 'Why does traditional Khichdi (Rice + Moong Dal) form a complete protein meal?',
          options: ['Because it is spicy', 'Grains and lentils together provide all essential amino acids', 'Because it has no water', 'It only provides fat'],
          correctIndex: 1,
          explanation: 'Rice lacks lysine while dal lacks methionine; together, they complement each other to create complete protein.',
        },
      }),
    },
    {
      slug: 'vitamins-minerals-greens',
      titleEn: 'Vitamins & Minerals: The Protective Shield',
      titleHi: 'विटामिन और खनिज: सुरक्षा कवच',
      titleKn: 'ವಿಟಮಿನ್‌ಗಳು ಮತ್ತು ಖನಿಜಗಳು: ರಕ್ಷಣಾತ್ಮಕ ಕವಚ',
      category: 'MICRONUTRIENTS',
      readTimeMin: 5,
      summaryEn: 'How dark green leafy vegetables like Palak and Moringa, plus seasonal fruits, guard children against anaemia and illness.',
      summaryHi: 'पालक और सहजन जैसी हरी पत्तेदार सब्जियां और मौसमी फल बच्चों को एनीमिया और बीमारी से कैसे बचाते हैं।',
      summaryKn: 'ಪಾಲಕ್, ನುಗ್ಗೆ ಸೊಪ್ಪು ಮತ್ತು ಕಾಲೋಚಿತ ಹಣ್ಣುಗಳು ರಕ್ತಹೀನತೆ ಮತ್ತು ಕಾಯಿಲೆಗಳಿಂದ ಮಕ್ಕಳನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತವೆ.',
      orderIndex: 3,
      contentJson: JSON.stringify({
        icon: 'ShieldCheck',
        sections: [
          {
            heading: 'Protecting Sight and Blood Cells',
            text: 'Iron prevents childhood fatigue and cognitive slowing (anaemia). Vitamin A guards against night blindness and protects mucous linings against respiratory infections.',
          },
          {
            heading: 'Drumstick Leaves (Moringa): The Super Greens in Your Backyard',
            text: 'Moringa leaves grow easily in villages and towns across India. They contain 7x the Vitamin C of oranges and high bioavailable iron. Adding tender drumstick leaves to sambar is a zero-cost nutritional upgrade.',
          },
        ],
        foodExamples: ['Moringa (Drumstick) leaves', 'Palak (Spinach)', 'Guava & Papaya', 'Amla (Indian Gooseberry)', 'Carrot'],
        practicalTip: 'Always squeeze a few drops of fresh lemon on iron-rich foods (like spinach or dal). Vitamin C dramatically boosts plant iron absorption.',
        quiz: {
          question: 'What simple kitchen step increases iron absorption from green leafy vegetables?',
          options: ['Drinking tea immediately', 'Adding Vitamin C like fresh lemon juice', 'Overcooking for 2 hours', 'Throwing away the cooking water'],
          correctIndex: 1,
          explanation: 'Vitamin C (ascorbic acid) converts non-heme plant iron into a soluble form readily absorbed in the duodenum.',
        },
      }),
    },
    {
      slug: 'food-hygiene-handwashing',
      titleEn: 'Food Hygiene & 6-Step Handwashing',
      titleHi: 'खाद्य स्वच्छता और 6-चरणीय हाथ धोना',
      titleKn: 'ಆಹಾರ ನೈರ್ಮಲ್ಯ ಮತ್ತು 6-ಹಂತದ ಕೈ ತೊಳೆಯುವುದು',
      category: 'HYGIENE',
      readTimeMin: 4,
      summaryEn: 'Preventing diarrhoea and nutrient loss through soap handwashing and safe food storage.',
      summaryHi: 'साबुन से हाथ धोकर और सुरक्षित भोजन भंडारण से दस्त और पोषण की हानि को रोकना।',
      summaryKn: 'ಸಾಬೂನಿನಿಂದ ಕೈ ತೊಳೆಯುವುದು ಮತ್ತು ಸುರಕ್ಷಿತ ಆಹಾರ ಸಂಗ್ರಹಣೆಯ ಮೂಲಕ ಭೇದಿ ತಡೆಯಿರಿ.',
      orderIndex: 4,
      contentJson: JSON.stringify({
        icon: 'Sparkles',
        sections: [
          {
            heading: 'Good Nutrition Starts with Clean Hands',
            text: 'Even the most nutritious food loses its value if recurrent bouts of diarrhoea prevent nutrient absorption in the intestine. Handwashing with soap cuts diarrhoeal episodes by over 40%.',
          },
          {
            heading: 'The Critical Times to Wash',
            text: 'Before preparing food, before feeding a young child, before eating, and after using the toilet or cleaning a baby.',
          },
        ],
        foodExamples: ['Boiled/Filtered Water', 'Covered food vessels', 'Clean utensils'],
        practicalTip: 'Wash hands with soap and water for at least 20 seconds — sing a fun nursery rhyme or count to 20 with the child!',
        quiz: {
          question: 'How long should children and caregivers scrub hands with soap before meals?',
          options: ['2 seconds', 'At least 20 seconds', 'Only with water, no soap', 'Never before eating'],
          correctIndex: 1,
          explanation: 'Lathering palms, backs of hands, and between fingers for at least 20 seconds effectively breaks lipid virus envelopes and bacterial biofilms.',
        },
      }),
    },
    {
      slug: 'responsive-feeding-habits',
      titleEn: 'Responsive Feeding: Encouraging Cheerful Meals',
      titleHi: 'प्रतिक्रियाशील भोजन: खुशहाल खान-पान को बढ़ावा देना',
      titleKn: 'ಸ್ಪಂದಿಸುವ ಆಹಾರ ಪದ್ಧತಿ: ಮಕ್ಕಳಲ್ಲಿ ಪ್ರೀತಿಯಿಂದ ತಿನ್ನುವ ಅಭ್ಯಾಸ',
      category: 'FEEDING',
      readTimeMin: 5,
      summaryEn: 'Recognising hunger cues, avoiding forced feeding, and making meal times positive and nurturing.',
      summaryHi: 'भूख के संकेतों को पहचानना, जबरन खिलाने से बचना और भोजन के समय को सकारात्मक बनाना।',
      summaryKn: 'ಹಸಿವಿನ ಸೂಚನೆಗಳನ್ನು ಗುರುತಿಸುವುದು, ಬಲವಂತವಾಗಿ ತಿನ್ನಿಸುವುದನ್ನು ತಪ್ಪಿಸುವುದು.',
      orderIndex: 5,
      contentJson: JSON.stringify({
        icon: 'Heart',
        sections: [
          {
            heading: 'What is Responsive Feeding?',
            text: 'Responsive feeding means paying attention to the child’s signals of hunger (pointing to food, excitement) and fullness (turning head away, closing mouth) and feeding with love and patience.',
          },
          {
            heading: 'Avoid Screens and Force-Feeding',
            text: 'Mobile screens disconnect the child from feeling their stomach fullness. Force-feeding creates meal aversion. Encourage the child to touch, explore textures, and feed themselves with clean hands.',
          },
        ],
        foodExamples: ['Colorful plate with separate portions', 'Finger food like steamed carrot sticks', 'Small cup of curd'],
        practicalTip: 'Never rush meals. Young children take 20 to 30 minutes to chew and swallow safely.',
        quiz: {
          question: 'What is the recommended response when a toddler turns their head away indicating fullness?',
          options: ['Force 3 more spoonfuls', 'Shout at the child', 'Respect their signal, remove plate calmly, and offer healthy snack later', 'Put a mobile video on'],
          correctIndex: 2,
          explanation: 'Respecting satiety cues teaches healthy self-regulation and prevents eating anxieties and obesity in later life.',
        },
      }),
    },
  ];

  for (const l of lessons) {
    await prisma.nutritionLesson.upsert({
      where: { slug: l.slug },
      update: {
        titleEn: l.titleEn,
        titleHi: l.titleHi,
        titleKn: l.titleKn,
        summaryEn: l.summaryEn,
        summaryHi: l.summaryHi,
        summaryKn: l.summaryKn,
        contentJson: l.contentJson,
        orderIndex: l.orderIndex,
      },
      create: {
        slug: l.slug,
        titleEn: l.titleEn,
        titleHi: l.titleHi,
        titleKn: l.titleKn,
        category: l.category,
        readTimeMin: l.readTimeMin,
        summaryEn: l.summaryEn,
        summaryHi: l.summaryHi,
        summaryKn: l.summaryKn,
        contentJson: l.contentJson,
        orderIndex: l.orderIndex,
      },
    });
  }
  console.log(`✅ Seeded 5 primary nutrition lessons with rich multilingual content`);

  // 6. Seed Indian Food Items
  const foodItems = [
    {
      nameEn: 'Ragi (Finger Millet)',
      nameHi: 'रागी (मडुआ)',
      nameKn: 'ರಾಗಿ',
      category: 'GRAINS',
      energyKcal: 328,
      proteinG: 7.3,
      carbsG: 72.0,
      fatG: 1.3,
      ironMg: 3.9,
      calciumMg: 344.0,
      vitaminAMcg: 42.0,
      estimatedCostPer100g: 4.5,
      isLocal: true,
      season: 'All Season',
      allergens: null,
      benefitsEn: 'Unbeatable plant calcium (344mg/100g) for developing bones and teeth; slow-release low GI energy.',
      benefitsHi: 'हड्डियों और दांतों के लिए सर्वोत्तम कैल्शियम (344mg/100g); निरंतर ऊर्जा।',
      benefitsKn: 'ಮೂಳೆಗಳು ಮತ್ತು ಹಲ್ಲುಗಳ ಬೆಳವಣಿಗೆಗೆ ಅತ್ಯುತ್ತಮ ಕ್ಯಾಲ್ಸಿಯಂ (344mg/100g).',
      recipes: ['Ragi Mudde with Saaru', 'Ragi Malt with Jaggery', 'Ragi Roti with Onion & Cumin'],
    },
    {
      nameEn: 'Moong Dal (Split Yellow Lentil)',
      nameHi: 'मूंग दाल (धुली)',
      nameKn: 'ಹೆಸರುಬೇಳೆ',
      category: 'PULSES',
      energyKcal: 348,
      proteinG: 24.5,
      carbsG: 59.9,
      fatG: 1.2,
      ironMg: 4.4,
      calciumMg: 75.0,
      vitaminAMcg: 83.0,
      estimatedCostPer100g: 13.0,
      isLocal: true,
      season: 'All Season',
      allergens: null,
      benefitsEn: 'Highest digestibility among lentils; ideal for weaning toddlers and recovery diets.',
      benefitsHi: 'दालों में सबसे आसानी से पचने वाली; बच्चों और स्वास्थ्य सुधार के लिए सर्वोत्तम।',
      benefitsKn: 'ಸುಲಭವಾಗಿ ಜೀರ್ಣವಾಗುವ ಬೇಳೆ; ಚಿಕ್ಕ ಮಕ್ಕಳಿಗೆ ಅತ್ಯಂತ ಹಿತಕರ.',
      recipes: ['Moong Dal Khichdi', 'Sprouted Moong Kosambari', 'Moong Dal Payasa with Jaggery'],
    },
    {
      nameEn: 'Palak (Spinach)',
      nameHi: 'पालक',
      nameKn: 'ಪಾಲಕ್ ಸೊಪ್ಪು',
      category: 'VEGETABLES',
      energyKcal: 26,
      proteinG: 2.0,
      carbsG: 2.9,
      fatG: 0.7,
      ironMg: 3.2,
      calciumMg: 73.0,
      vitaminAMcg: 740.0,
      estimatedCostPer100g: 4.0,
      isLocal: true,
      season: 'Winter & Monsoons',
      allergens: null,
      benefitsEn: 'Packed with folate, iron, and beta-carotene for immune cells and red blood count.',
      benefitsHi: 'आयरन, फोलेट और बीटा-कैरोटीन से भरपूर जो हीमोग्लोबिन और प्रतिरक्षा बढ़ाते हैं।',
      benefitsKn: 'ಕಬ್ಬಿಣ, ಫೋಲೇಟ್ ಮತ್ತು ವಿಟಮಿನ್ ಎ ಸಮೃದ್ಧವಾಗಿದ್ದು ರಕ್ತಹೀನತೆ ತಡೆಯುತ್ತದೆ.',
      recipes: ['Palak Dal Stew', 'Palak Paratha', 'Palak Paneer/Tofu Mash'],
    },
    {
      nameEn: 'Moringa Leaves (Drumstick Leaves)',
      nameHi: 'सहजन की पत्तियां',
      nameKn: 'ನುಗ್ಗೆ ಸೊಪ್ಪು',
      category: 'VEGETABLES',
      energyKcal: 92,
      proteinG: 6.7,
      carbsG: 12.5,
      fatG: 1.7,
      ironMg: 28.2,
      calciumMg: 440.0,
      vitaminAMcg: 756.0,
      estimatedCostPer100g: 3.0,
      isLocal: true,
      season: 'All Season',
      allergens: null,
      benefitsEn: 'Superfood leaf available locally for free or minimal cost; exceptional iron (28mg/100g) and Vitamin A.',
      benefitsHi: 'स्थानीय सुपरफूड; अत्यधिक आयरन (28mg/100g) और विटामिन ए जो एनीमिया को जड़ से मिटाता है।',
      benefitsKn: 'ಸ್ಥಳೀಯ ಸೂಪರ್‌ಫುಡ್; ಅತ್ಯಧಿಕ ಕಬ್ಬಿಣ (28mg/100g) ಮತ್ತು ವಿಟಮಿನ್ ಎ ಹೊಂದಿದೆ.',
      recipes: ['Nugge Soppu Sambar', 'Drumstick Leaf Poriyal with Coconut', 'Moringa Leaf Chapati'],
    },
    {
      nameEn: 'Whole Egg',
      nameHi: 'अंडा',
      nameKn: 'ಕೋಳಿ ಮೊಟ್ಟೆ',
      category: 'PROTEIN_OTHER',
      energyKcal: 143,
      proteinG: 13.0,
      carbsG: 0.7,
      fatG: 9.5,
      ironMg: 1.8,
      calciumMg: 56.0,
      vitaminAMcg: 140.0,
      estimatedCostPer100g: 14.0,
      isLocal: true,
      season: 'All Season',
      allergens: 'Egg',
      benefitsEn: 'Gold standard complete protein with bioavailable choline for infant neural and brain growth.',
      benefitsHi: 'पूर्ण प्रोटीन और कोलीन से भरपूर जो मस्तिष्क और शारीरिक विकास को गति देता है।',
      benefitsKn: 'ಮಕ್ಕಳ ಮೆದುಳಿನ ಬೆಳವಣಿಗೆಗೆ ಕೋಲೀನ್ ಮತ್ತು ಸಂಪೂರ್ಣ ಪ್ರೋಟೀನ್ ನೀಡುತ್ತದೆ.',
      recipes: ['Boiled Egg Slices with Cumin', 'Egg Curry with Tomato Gravy', 'Egg Bhurji with Veggies'],
    },
    {
      nameEn: 'Fresh Curd (Dahi)',
      nameHi: 'ताजा दही',
      nameKn: 'ತಾಜಾ ಮೊಸರು',
      category: 'DAIRY',
      energyKcal: 60,
      proteinG: 3.1,
      carbsG: 4.0,
      fatG: 3.5,
      ironMg: 0.1,
      calciumMg: 120.0,
      vitaminAMcg: 30.0,
      estimatedCostPer100g: 6.5,
      isLocal: true,
      season: 'All Season',
      allergens: 'Dairy',
      benefitsEn: 'Natural live probiotics for gut microbiota health; easily absorbable bioavailable calcium.',
      benefitsHi: 'पेट के स्वास्थ्य के लिए प्राकृतिक प्रोबायोटिक्स और आसानी से पचने वाला कैल्शियम।',
      benefitsKn: 'ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಕರುಳಿನ ಆರೋಗ್ಯಕ್ಕೆ ನೈಸರ್ಗಿಕ ಪ್ರೋಬಯಾಟಿಕ್ಸ್ ಮತ್ತು ಕ್ಯಾಲ್ಸಿಯಂ.',
      recipes: ['Curd Rice with Pomegranate', 'Spiced Buttermilk (Chaas)', 'Fruit Curd Mash'],
    },
    {
      nameEn: 'Guava (Amrood)',
      nameHi: 'अमरूद',
      nameKn: 'ಸೀಬೆಹಣ್ಣು (ಪೇರಲ)',
      category: 'FRUITS',
      energyKcal: 51,
      proteinG: 1.0,
      carbsG: 11.2,
      fatG: 0.3,
      ironMg: 0.3,
      calciumMg: 18.0,
      vitaminAMcg: 31.0,
      estimatedCostPer100g: 4.0,
      isLocal: true,
      season: 'Winter & Monsoons',
      allergens: null,
      benefitsEn: 'Contains 4x the Vitamin C of oranges; high pectin dietary fiber prevents constipation.',
      benefitsHi: 'संतरे से 4 गुना अधिक विटामिन सी; फाइबर से भरपूर जो कब्ज से राहत देता है।',
      benefitsKn: 'ಕಿತ್ತಳೆಗಿಂತ 4 ಪಟ್ಟು ಹೆಚ್ಚು ವಿಟಮಿನ್ ಸಿ; ಮಲಬದ್ಧತೆ ನಿವಾರಣೆಗೆ ಅತ್ಯುತ್ತಮ.',
      recipes: ['Ripe Guava Slices with Rock Salt', 'Guava Fruit Chaat', 'Cooked Guava Puree'],
    },
    {
      nameEn: 'Roasted Peanuts (Groundnut)',
      nameHi: 'भुनी मूंगफली',
      nameKn: 'ಹುರಿದ ಕಡಲೆಕಾಯಿ',
      category: 'PULSES',
      energyKcal: 567,
      proteinG: 25.8,
      carbsG: 16.1,
      fatG: 49.2,
      ironMg: 2.8,
      calciumMg: 92.0,
      vitaminAMcg: 0.0,
      estimatedCostPer100g: 14.0,
      isLocal: true,
      season: 'All Season',
      allergens: 'Peanuts',
      benefitsEn: 'Affordable high-density energy and protein; monounsaturated fatty acids support neurological development.',
      benefitsHi: 'किफायती उच्च ऊर्जा और प्रोटीन; स्वस्थ वसा जो मस्तिष्क के लिए लाभकारी है।',
      benefitsKn: 'ಕೈಗೆಟುಕುವ ಬೆಲೆಯಲ್ಲಿ ಅತ್ಯಧಿಕ ಶಕ್ತಿ ಮತ್ತು ಪ್ರೋಟೀನ್; ಮೆದುಳಿಗೆ ಆರೋಗ್ಯಕರ ಕೊಬ್ಬು.',
      recipes: ['Peanut & Jaggery Chikki', 'Crushed Peanut Powder over Poha', 'Groundnut Chutney'],
    },
  ];

  for (const f of foodItems) {
    const existing = await prisma.foodItem.findFirst({ where: { nameEn: f.nameEn } });
    if (!existing) {
      await prisma.foodItem.create({
        data: {
          nameEn: f.nameEn,
          nameHi: f.nameHi,
          nameKn: f.nameKn,
          category: f.category,
          energyKcal: f.energyKcal,
          proteinG: f.proteinG,
          carbsG: f.carbsG,
          fatG: f.fatG,
          ironMg: f.ironMg,
          calciumMg: f.calciumMg,
          vitaminAMcg: f.vitaminAMcg,
          estimatedCostPer100g: f.estimatedCostPer100g,
          isLocal: f.isLocal,
          season: f.season,
          allergens: f.allergens,
          benefitsEn: f.benefitsEn,
          benefitsHi: f.benefitsHi,
          benefitsKn: f.benefitsKn,
          recipeSuggestionsJson: JSON.stringify(f.recipes),
        },
      });
    }
  }
  console.log(`✅ Seeded 8 staple Indian food records with micro/macronutrients and recipes`);

  console.log('\n🎉 Database seeding completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

