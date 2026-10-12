import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export async function listFoods(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, localOnly } = req.query;

    const whereClause: any = {};
    if (category && category !== 'ALL') {
      whereClause.category = String(category);
    }
    if (localOnly === 'true') {
      whereClause.isLocal = true;
    }

    let foods = await prisma.foodItem.findMany({
      where: whereClause,
      orderBy: { nameEn: 'asc' },
    });

    if (search) {
      const q = String(search).toLowerCase();
      foods = foods.filter(
        (f) =>
          f.nameEn.toLowerCase().includes(q) ||
          f.nameHi.toLowerCase().includes(q) ||
          f.nameKn.toLowerCase().includes(q)
      );
    }

    const processed = foods.map((f) => {
      let recipes = [];
      try {
        if (f.recipeSuggestionsJson) recipes = JSON.parse(f.recipeSuggestionsJson);
      } catch {
        recipes = [];
      }
      return {
        ...f,
        recipeSuggestions: recipes,
      };
    });

    res.json({ success: true, count: processed.length, data: processed });
  } catch (error) {
    console.error('List foods error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve food items' });
  }
}

export async function getFoodById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    const food = await prisma.foodItem.findUnique({ where: { id } });
    if (!food) {
      res.status(404).json({ success: false, error: 'Food item not found' });
      return;
    }

    let recipes = [];
    try {
      if (food.recipeSuggestionsJson) recipes = JSON.parse(food.recipeSuggestionsJson);
    } catch {
      recipes = [];
    }

    res.json({
      success: true,
      data: {
        ...food,
        recipeSuggestions: recipes,
      },
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve food details' });
  }
}
