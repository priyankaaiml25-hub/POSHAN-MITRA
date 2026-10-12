import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const generatePlanSchema = z.object({
  budgetInr: z.number().min(20).max(1500),
  dietaryType: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'EGGITARIAN']),
  familyMembers: z.number().min(1).max(10),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'FULL_DAY']),
  preferredGrain: z.enum(['RAGI', 'RICE', 'WHEAT', 'JOWAR', 'ANY']).optional(),
  availableIngredients: z.array(z.string()).optional(),
});

interface MealTemplate {
  name: string;
  nameHi: string;
  nameKn: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  dietType: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'EGGITARIAN';
  grain: string;
  protein: string;
  vegetable: string;
  prepTimeMin: number;
  ingredients: Array<{ item: string; qtyPerPersonG: number; estimatedCostPer100g: number }>;
  instructions: string[];
  allergens?: string[];
  foodGroups: string[];
}

const MEAL_DATABASE: MealTemplate[] = [
  // Breakfasts
  {
    name: 'Ragi Malt Porridge with Roasted Peanuts',
    nameHi: 'रागी माल्ट दलिया भुनी हुई मूंगफली के साथ',
    nameKn: 'ಹುರಿದ ಕಡಲೆಕಾಯಿಯೊಂದಿಗೆ ರಾಗಿ ಅಂಬಲಿ',
    mealType: 'BREAKFAST',
    dietType: 'VEGETARIAN',
    grain: 'Ragi (Finger Millet)',
    protein: 'Peanuts / Milk',
    vegetable: 'None',
    prepTimeMin: 15,
    ingredients: [
      { item: 'Ragi Flour', qtyPerPersonG: 50, estimatedCostPer100g: 4.5 },
      { item: 'Milk / Buttermilk', qtyPerPersonG: 100, estimatedCostPer100g: 6.0 },
      { item: 'Roasted Peanuts', qtyPerPersonG: 20, estimatedCostPer100g: 14.0 },
      { item: 'Jaggery', qtyPerPersonG: 15, estimatedCostPer100g: 6.0 },
    ],
    instructions: [
      'Mix ragi flour in cold water without lumps.',
      'Bring 2 cups of water to boil, then gently stir in ragi slurry.',
      'Cook on low flame for 6-8 minutes until glossy.',
      'Add warm milk, a pinch of jaggery, and top with crushed roasted peanuts for iron & protein.',
    ],
    allergens: ['Peanuts', 'Dairy'],
    foodGroups: ['Energy-giving (Millets)', 'Protein-rich (Peanuts/Milk)', 'Micronutrients (Jaggery)'],
  },
  {
    name: 'Vegetable Poha with Green Peas & Lemon',
    nameHi: 'सब्जी पोहा हरी मटर और नींबू के साथ',
    nameKn: 'ತರಕಾರಿ ಅವಲಕ್ಕಿ ಹಸಿ ಬಟಾಣಿ ಮತ್ತು ನಿಂಬೆಹಣ್ಣಿನೊಂದಿಗೆ',
    mealType: 'BREAKFAST',
    dietType: 'VEGETARIAN',
    grain: 'Poha (Flattened Rice)',
    protein: 'Green Peas / Peanuts',
    vegetable: 'Onion, Carrot, Coriander',
    prepTimeMin: 20,
    ingredients: [
      { item: 'Poha', qtyPerPersonG: 60, estimatedCostPer100g: 5.0 },
      { item: 'Green Peas & Peanuts', qtyPerPersonG: 30, estimatedCostPer100g: 10.0 },
      { item: 'Carrot & Onion', qtyPerPersonG: 40, estimatedCostPer100g: 4.0 },
      { item: 'Oil & Mustard seeds', qtyPerPersonG: 10, estimatedCostPer100g: 15.0 },
    ],
    instructions: [
      'Rinse poha in water and drain completely.',
      'Heat oil with mustard seeds, curry leaves, and sauté onions, carrots, and peas.',
      'Add turmeric, salt, and mix in soft poha gently.',
      'Finish with fresh lemon juice to enhance iron absorption.',
    ],
    allergens: ['Peanuts'],
    foodGroups: ['Energy-giving (Rice flakes)', 'Proteins & Fiber (Peas/Peanuts)', 'Vitamin C (Lemon)'],
  },
  {
    name: 'Soft Idli with Drumstick Sambar & Mint Chutney',
    nameHi: 'मुलायम इडली सहजन सांभर और पुदीना चटनी के साथ',
    nameKn: 'ನುಗ್ಗೆಕಾಯಿ ಸಾಂಬಾರ್ ಮತ್ತು ಪುದೀನಾ ಚಟ್ನಿಯೊಂದಿಗೆ ಮೃದು ಇಡ್ಲಿ',
    mealType: 'BREAKFAST',
    dietType: 'VEGETARIAN',
    grain: 'Rice & Urad Dal',
    protein: 'Toor Dal',
    vegetable: 'Drumstick (Moringa), Tomato, Onion',
    prepTimeMin: 25,
    ingredients: [
      { item: 'Idli Batter (Rice + Urad)', qtyPerPersonG: 120, estimatedCostPer100g: 4.0 },
      { item: 'Toor Dal', qtyPerPersonG: 30, estimatedCostPer100g: 16.0 },
      { item: 'Drumstick & Tomatoes', qtyPerPersonG: 50, estimatedCostPer100g: 5.0 },
      { item: 'Mint & Coconut Chutney', qtyPerPersonG: 25, estimatedCostPer100g: 8.0 },
    ],
    instructions: [
      'Steam fermented idli batter in moulds for 10-12 minutes.',
      'Boil toor dal with drumstick pods, tomatoes, turmeric, and sambar spice.',
      'Tempering with mustard and curry leaves.',
      'Serve warm. Fermentation boosts gut health and B-vitamins for young children.',
    ],
    foodGroups: ['Energy-giving (Rice)', 'Protein (Toor & Urad dal)', 'Micronutrients (Moringa, Tomatoes)'],
  },

  // Lunches
  {
    name: 'Traditional Ragi Mudde with Palak Saaru & Curd',
    nameHi: 'पारंपरिक रागी मुड्डे पालक सार और दही के साथ',
    nameKn: 'ಸಾಂಪ್ರದಾಯಿಕ ರಾಗಿ ಮುದ್ದೆ ಪಾಲಕ್ ಸಾರು ಮತ್ತು ಮೊಸರು',
    mealType: 'LUNCH',
    dietType: 'VEGETARIAN',
    grain: 'Ragi (Finger Millet)',
    protein: 'Toor / Moong Dal',
    vegetable: 'Palak (Spinach), Tomato, Garlic',
    prepTimeMin: 30,
    ingredients: [
      { item: 'Ragi Flour', qtyPerPersonG: 80, estimatedCostPer100g: 4.5 },
      { item: 'Palak (Spinach)', qtyPerPersonG: 60, estimatedCostPer100g: 4.0 },
      { item: 'Toor / Moong Dal', qtyPerPersonG: 35, estimatedCostPer100g: 15.0 },
      { item: 'Fresh Curd', qtyPerPersonG: 50, estimatedCostPer100g: 6.5 },
    ],
    instructions: [
      'Boil water with a spoon of ragi slurry. Slowly add ragi flour and stir firmly with wooden pin.',
      'Steam for 5 minutes, turn out, and roll into smooth warm mudde balls.',
      'Cook dal with finely chopped spinach, garlic, tomatoes, and cumin.',
      'Serve with a bowl of homemade curd for gut microbiome and calcium.',
    ],
    allergens: ['Dairy'],
    foodGroups: ['Calcium & Iron powerhouse (Ragi)', 'Protein (Dal)', 'Vitamins A & Folate (Spinach)', 'Probiotics (Curd)'],
  },
  {
    name: 'Brown Rice with Moringa Leaf Moong Dal & Carrot Salad',
    nameHi: 'ब्राउन राइस सहजन पत्ती मूंग दाल और गाजर सलाद के साथ',
    nameKn: 'ನುಗ್ಗೆ ಸೊಪ್ಪು ಹೆಸರುಬೇಳೆ ಸಾರು ಮತ್ತು ಕ್ಯಾರೆಟ್ ಕೋಸಂಬರಿಯೊಂದಿಗೆ ಕೆಂಪಕ್ಕಿ ಅನ್ನ',
    mealType: 'LUNCH',
    dietType: 'VEGETARIAN',
    grain: 'Brown / Parboiled Rice',
    protein: 'Moong Dal (Yellow Lentil)',
    vegetable: 'Moringa (Drumstick leaves), Carrot',
    prepTimeMin: 25,
    ingredients: [
      { item: 'Parboiled Rice', qtyPerPersonG: 75, estimatedCostPer100g: 4.8 },
      { item: 'Moong Dal', qtyPerPersonG: 40, estimatedCostPer100g: 13.0 },
      { item: 'Fresh Moringa Leaves', qtyPerPersonG: 40, estimatedCostPer100g: 3.0 },
      { item: 'Grated Carrot & Lemon', qtyPerPersonG: 40, estimatedCostPer100g: 4.5 },
    ],
    instructions: [
      'Cook parboiled rice until tender.',
      'Wash fresh tender moringa leaves. Pressure cook moong dal with turmeric and garlic.',
      'Add moringa leaves to simmering dal for 5 minutes (avoids overcooking vitamins).',
      'Toss grated carrot with lemon juice and a pinch of salt.',
    ],
    foodGroups: ['Energy (Rice)', 'Easily digestible protein (Moong)', 'Iron & Vitamin A (Moringa leaves, Carrot)'],
  },
  {
    name: 'Rice, Boiled Egg Curry & Stir-fried Green Beans',
    nameHi: 'चावल, उबला अंडा करी और तली हुई हरी बीन्स',
    nameKn: 'ಅನ್ನ, ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ ಸಾರು ಮತ್ತು ಹುರಿದ ಬೀನ್ಸ್ ಪಲ್ಯ',
    mealType: 'LUNCH',
    dietType: 'EGGITARIAN',
    grain: 'Rice',
    protein: 'Whole Egg',
    vegetable: 'French Beans, Onion, Tomato',
    prepTimeMin: 25,
    ingredients: [
      { item: 'Rice', qtyPerPersonG: 75, estimatedCostPer100g: 4.5 },
      { item: 'Whole Egg (1 per person)', qtyPerPersonG: 55, estimatedCostPer100g: 14.0 },
      { item: 'Onion, Tomato Gravy', qtyPerPersonG: 50, estimatedCostPer100g: 4.0 },
      { item: 'French Beans', qtyPerPersonG: 40, estimatedCostPer100g: 6.0 },
    ],
    instructions: [
      'Hard boil eggs for 10 minutes and peel.',
      'Sauté onions, tomatoes, ginger-garlic, turmeric, and coriander powder in light oil.',
      'Simmer eggs in gravy so flavours infuse.',
      'Steam beans with mustard seeds and grated coconut for fiber.',
    ],
    allergens: ['Egg'],
    foodGroups: ['Complete protein & Choline (Egg)', 'Energy (Rice)', 'Fiber & Folate (Beans)'],
  },

  // Dinners
  {
    name: 'Nutritious Moong Dal & Mixed Vegetable Khichdi',
    nameHi: 'पौष्टिक मूंग दाल और मिश्रित सब्जी खिचड़ी',
    nameKn: 'ಪೌಷ್ಟಿಕ ಹೆಸರುಬೇಳೆ ಮತ್ತು ಮಿಶ್ರ ತರಕಾರಿ ಕಿಚಡಿ',
    mealType: 'DINNER',
    dietType: 'VEGETARIAN',
    grain: 'Rice',
    protein: 'Moong Dal (Yellow)',
    vegetable: 'Carrot, Pumpkin, Bottle Gourd, Peas',
    prepTimeMin: 25,
    ingredients: [
      { item: 'Rice & Moong Dal (1:1 ratio)', qtyPerPersonG: 80, estimatedCostPer100g: 8.0 },
      { item: 'Mixed Veg (Pumpkin + Carrot)', qtyPerPersonG: 60, estimatedCostPer100g: 3.5 },
      { item: 'Desi Ghee (1 tsp)', qtyPerPersonG: 5, estimatedCostPer100g: 65.0 },
      { item: 'Cumin & Turmeric', qtyPerPersonG: 5, estimatedCostPer100g: 20.0 },
    ],
    instructions: [
      'Rinse rice and split moong dal together.',
      'In a cooker, add cumin, turmeric, chopped pumpkin, carrots, and bottle gourd.',
      'Pressure cook with 3.5x water for a soft, easily digestible texture suitable for young children.',
      'Drizzle a teaspoon of ghee on top for essential fatty acids and calorie density.',
    ],
    allergens: ['Dairy (Ghee)'],
    foodGroups: ['Balanced Energy & Protein', 'Beta-carotene (Pumpkin/Carrot)', 'Healthy Lipids (Ghee)'],
  },
  {
    name: 'Jowar Roti with Methi Chana Dal & Buttermilk',
    nameHi: 'ज्वार रोटी मेथी चना दाल और छाछ के साथ',
    nameKn: 'ಮೆಂತೆ ಕಡಲೆಬೇಳೆ ಮತ್ತು ಮಜ್ಜಿಗೆಯೊಂದಿಗೆ ಜೋಳದ ರೊಟ್ಟಿ',
    mealType: 'DINNER',
    dietType: 'VEGETARIAN',
    grain: 'Jowar (Sorghum)',
    protein: 'Chana Dal (Bengal gram)',
    vegetable: 'Methi (Fenugreek leaves), Garlic',
    prepTimeMin: 30,
    ingredients: [
      { item: 'Jowar Flour', qtyPerPersonG: 70, estimatedCostPer100g: 5.0 },
      { item: 'Chana Dal', qtyPerPersonG: 35, estimatedCostPer100g: 13.0 },
      { item: 'Fresh Methi Leaves', qtyPerPersonG: 40, estimatedCostPer100g: 4.0 },
      { item: 'Spiced Buttermilk', qtyPerPersonG: 120, estimatedCostPer100g: 3.0 },
    ],
    instructions: [
      'Knead jowar flour with warm water and pat into thin rotis on iron tawa.',
      'Cook chana dal with cleaned fresh fenugreek (methi) leaves, garlic, and cumin.',
      'Serve with a tall glass of fresh buttermilk with roasted cumin powder.',
    ],
    allergens: ['Dairy'],
    foodGroups: ['Gluten-free fiber (Jowar)', 'Sustained protein (Chana dal)', 'Minerals (Methi)', 'Hydration (Buttermilk)'],
  },
];

export async function generateMealPlan(req: Request, res: Response): Promise<void> {
  try {
    const parsed = generatePlanSchema.parse(req.body);

    const { budgetInr, dietaryType, familyMembers, mealType, preferredGrain } = parsed;

    // Filter candidate meals by dietary type
    let eligibleMeals = MEAL_DATABASE.filter((m) => {
      if (dietaryType === 'VEGETARIAN') return m.dietType === 'VEGETARIAN';
      if (dietaryType === 'EGGITARIAN') return m.dietType === 'VEGETARIAN' || m.dietType === 'EGGITARIAN';
      return true; // NON_VEGETARIAN allows all
    });

    if (mealType !== 'FULL_DAY') {
      eligibleMeals = eligibleMeals.filter((m) => m.mealType === mealType);
    }

    if (preferredGrain && preferredGrain !== 'ANY') {
      const matchGrain = eligibleMeals.filter((m) =>
        m.grain.toUpperCase().includes(preferredGrain)
      );
      if (matchGrain.length > 0) eligibleMeals = matchGrain;
    }

    // Select meals for the plan
    let selectedMeals: MealTemplate[] = [];
    if (mealType === 'FULL_DAY') {
      const bf = eligibleMeals.find((m) => m.mealType === 'BREAKFAST') || MEAL_DATABASE[0];
      const ln = eligibleMeals.find((m) => m.mealType === 'LUNCH') || MEAL_DATABASE[3];
      const dn = eligibleMeals.find((m) => m.mealType === 'DINNER') || MEAL_DATABASE[6];
      selectedMeals = [bf, ln, dn];
    } else {
      selectedMeals = [eligibleMeals[0] || MEAL_DATABASE[0]];
    }

    // Compute costs and shopping list
    const shoppingListMap: Record<string, { qtyG: number; estimatedCostInr: number }> = {};
    let totalPlanCostInr = 0;

    selectedMeals.forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        const totalQtyG = ing.qtyPerPersonG * familyMembers;
        const costForQty = (totalQtyG / 100) * ing.estimatedCostPer100g;
        totalPlanCostInr += costForQty;

        if (!shoppingListMap[ing.item]) {
          shoppingListMap[ing.item] = { qtyG: 0, estimatedCostInr: 0 };
        }
        shoppingListMap[ing.item].qtyG += totalQtyG;
        shoppingListMap[ing.item].estimatedCostInr += costForQty;
      });
    });

    const shoppingList = Object.entries(shoppingListMap).map(([item, data]) => ({
      item,
      quantityFormatted: data.qtyG >= 1000 ? `${(data.qtyG / 1000).toFixed(2)} kg` : `${Math.round(data.qtyG)} g`,
      estimatedCostInr: Math.round(data.estimatedCostInr * 10) / 10,
    }));

    const finalEstimatedCost = Math.round(totalPlanCostInr);
    const isWithinBudget = finalEstimatedCost <= budgetInr;

    // Collect all allergens
    const allAllergens = Array.from(
      new Set(selectedMeals.flatMap((m) => m.allergens || []))
    );

    res.json({
      success: true,
      data: {
        title: `${familyMembers}-Person ${mealType.replace('_', ' ')} Smart Plan`,
        familyMembers,
        budgetInr,
        estimatedCostInr: finalEstimatedCost,
        isWithinBudget,
        budgetDifferenceInr: Math.abs(budgetInr - finalEstimatedCost),
        dietaryType,
        meals: selectedMeals,
        shoppingList,
        allergens: allAllergens,
        nutritionalBalanceSummary: [
          'Carbohydrates & Energy from traditional millets and parboiled grains',
          'Complete plant/animal protein from lentils, dairy, and whole eggs',
          'Essential Micronutrients: Iron, Calcium, Beta-carotene & Vitamin C from local greens and vegetables',
          'Healthy fats for brain development from peanuts, milk fat, and ghee',
        ],
        disclaimer:
          'Prices are estimated regional market averages (INR) for educational budgeting. Actual local prices may vary by season and district. This is a community guidance tool, not an individual clinical therapeutic prescription.',
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Meal plan error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate meal plan' });
  }
}

