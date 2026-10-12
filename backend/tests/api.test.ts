import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Poshan Mitra Backend API Endpoints', () => {
  it('GET /api/health returns online status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.project).toBe('Poshan Mitra API');
  });

  it('GET /api/auth/demo-accounts returns fictional evaluation credentials', async () => {
    const res = await request(app).get('/api/auth/demo-accounts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    expect(res.body.data[0].email).toBe('worker@poshanmitra.in');
  });

  it('POST /api/auth/login succeeds with valid worker credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'worker@poshanmitra.in',
        password: 'Poshan@123',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('WORKER');
  });

  it('GET /api/lessons returns seeded nutrition lessons', async () => {
    const res = await request(app).get('/api/lessons');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/foods returns healthy food items', async () => {
    const res = await request(app).get('/api/foods');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/meal-planner/generate returns balanced meal plan and shopping list', async () => {
    const res = await request(app)
      .post('/api/meal-planner/generate')
      .send({
        budgetInr: 150,
        dietaryType: 'VEGETARIAN',
        familyMembers: 4,
        mealType: 'LUNCH',
        preferredGrain: 'RAGI',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.meals.length).toBeGreaterThan(0);
    expect(res.body.data.shoppingList.length).toBeGreaterThan(0);
  });

  it('Enforces server-side authorization: unauthenticated request to /api/children is blocked', async () => {
    const res = await request(app).get('/api/children');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

