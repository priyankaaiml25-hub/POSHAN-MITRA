# POSHAN MITRA — 5-MINUTE COLLEGE JURY DEMONSTRATION GUIDE

This document provides a concise, high-impact demonstration sequence designed for college project vivas, evaluation juries, and symposiums.

---

## Pre-Demo Checklist (30 Seconds)
1. Ensure the application is running:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173`
2. Open `http://localhost:5173` in Google Chrome or Microsoft Edge.
3. Keep browser audio unmuted to showcase the Web Speech API Text-to-Speech (TTS).

---

## 5-Minute Demonstration Sequence

### Step 1: Problem & Mission Introduction (30 seconds)
- **What to say:**
  > *"Respected evaluators, India’s Anganwadi network serves over 8 crore young children, yet field workers face three critical bottlenecks: manual paper registers, lack of localized dietary planning tools within rural budgets, and language barriers. Poshan Mitra is an accessible, digital child welfare platform aligned with POSHAN Abhiyaan 2.0 that translates nutrition science into practical community action without requiring expensive external AI APIs."*
- **Action on screen:**
  - Show the landing page (`/`). Point out the **Daily Nutrition Tip** and click the **Audio (TTS)** button to demonstrate voice accessibility.

### Step 2: Language Switching (30 seconds)
- **What to say:**
  > *"A critical requirement for grassroots penetration is native language accessibility. Poshan Mitra provides full translation dictionaries across English, Hindi, and Kannada."*
- **Action on screen:**
  - In the top navigation bar, toggle the language selector from **English** to **हिन्दी (Hindi)** and **ಕನ್ನಡ (Kannada)**.
  - Notice that all headings, button labels, and nutrition guidelines update instantly and persist in `localStorage`. Switch back to English (or your preferred language) for the remainder of the presentation.

### Step 3: Worker Dashboard & Fictional Dataset Labeling (45 seconds)
- **What to say:**
  > *"We log into the Anganwadi Worker portal using our 1-click evaluation button for Sunita Devi. The dashboard immediately surfaces key operational indicators: 6 enrolled children, 2 flagged for anthropometric review, and active welfare follow-up tasks."*
- **Action on screen:**
  - Click **Worker Login** -> click the **1-Click Fast Login: Worker** button.
  - You are redirected to `/dashboard`.
  - Point out the **"Demo Mode: Fictional Data"** badge, demonstrating compliance with digital health evaluation ethics.

### Step 4: Signature Feature — Smart Local Budget Meal Planner (60 seconds)
- **What to say:**
  > *"One of our core innovations is the deterministic rule-based Meal Planner. Many rural families cannot afford expensive protein powders or exotic foods. Here, a mother or worker can enter their approximate budget in rupees, family members, and dietary preferences."*
- **Action on screen:**
  - Navigate to **Meal Planner** (`/meal-planner`).
  - Move the slider to **₹120** for a family of **4 members**, select **Vegetarian**, and click **Generate Balanced Meal Plan**.
  - Show the generated meal (e.g. *Traditional Ragi Mudde with Palak Saaru & Curd*).
  - Highlight:
    1. Food Group Balance coverage (Energy, Protein, Iron, Probiotics).
    2. Step-by-step cooking instructions.
    3. Itemized **Local Ingredient Shopping List** with quantities and estimated INR market prices.
    4. Click **Print Meal Plan** to show print-ready rendering.

### Step 5: Poshan Play — Joyful Preschool Learning (45 seconds)
- **What to say:**
  > *"For young children aged 3 to 6 years, lectures do not work. Poshan Play gamifies nutrition with large touch-friendly picture quizzes, sorting, and plate-building activities. No child registration or personal data is collected."*
- **Action on screen:**
  - Open **Poshan Play** (`/poshan-play`).
  - In the **Picture Quiz**, answer the question *"Which fresh fruit gives us lots of Vitamin C?"* by clicking **Sweet Guava (Amrood) 🍈**.
  - The system plays an encouraging voice cheer (*"Wonderful! You earned a shiny star!"*) and increments the star scoreboard.
  - Switch to the **Build Rainbow Plate** tab and tap Ragi Mudde, Dal, Palak, and Curd into the thali.

### Step 6: Validated WHO 2006 Child Growth Monitoring (60 seconds)
- **What to say:**
  > *"Now we examine our clinical safety module: Child Growth Monitoring. We adhere strictly to responsible digital health principles: children are pseudonymized (`CH-BLR-001`), and calculations strictly implement official WHO Child Growth Standards (2006) for Weight-for-Age (WAZ), Height-for-Age (HAZ), and Weight-for-Height (WHZ)."*
- **Action on screen:**
  - Navigate to **Growth Monitoring** (`/growth-monitoring`).
  - Select child **`CH-BLR-004`**.
  - Notice the **⚠️ Prioritize Anganwadi Review** flag: WAZ is -2.4 SD (*Moderate Underweight*).
  - Point out the clear educational reason explanation and the disclaimer that it is a screening referral indicator, not a clinical diagnosis.
  - Show the **Recharts Longitudinal Growth Curves** plotting historical measurements over time.
  - Click **Record New Measurement**, enter a sample measurement (e.g., Weight: `9.4 kg`, Height: `84.0 cm`), and click **Save & Calculate** to show real-time database update.

### Step 7: Welfare Follow-Up Tracker (30 seconds)
- **What to say:**
  > *"Identifying a growth deficit is useless without action. The platform bridges the gap to the field worker through structured follow-up tasks."*
- **Action on screen:**
  - Navigate to **Welfare Follow-Ups** (`/follow-ups`).
  - View the task: *"Nutrition Counselling: Supplementary calorie & protein intake for CH-BLR-004"*.
  - Click **Complete** on a pending task, enter resolution notes (*"Mother introduced sprouted moong and peanut powder"*), and resolve it.
  - The task status immediately updates to completed.

### Step 8: Community Impact & Aggregate CSV Export (30 seconds)
- **What to say:**
  > *"Administrators and CDPO supervisors require aggregate activity reports without exposing identifiable child records."*
- **Action on screen:**
  - Navigate to **Impact Reports** (`/impact-reports`).
  - Show the KPI summary, monthly workload bar chart, and WHO screening pie chart.
  - Click **Export Aggregate CSV** to show instant CSV file generation.

### Step 9: Conclusion & Ethical Limitations (30 seconds)
- **What to say:**
  > *"In summary, Poshan Mitra is complete, responsive, tested with 15 passing automated test suites, and ready for pilot deployment. In accordance with ethical digital health standards, it serves as a decision-support and educational tool, reinforcing rather than replacing our frontline health heroes: Anganwadi workers, ASHAs, and ANMs. Thank you! We welcome your questions."*

---

## Frequently Asked Jury Questions & Model Answers

**Q1: How are the WHO growth percentiles calculated?**
*Answer:* We implemented the official WHO 2006 Child Growth Standards median and standard deviation reference tables stratified by age in months and sex. The engine computes $Z = \frac{X - \text{Median}}{\text{SD}}$ for WAZ, HAZ, and WHZ. When any metric falls below $-2$ SD, it alerts the worker to schedule counselling or ANM referral.

**Q2: Does the system use paid external AI APIs?**
*Answer:* No. The meal planner and screening engines are deterministic, rule-based, and run entirely locally. This guarantees zero recurring API subscription costs, reliable offline performance, and complete data privacy for Anganwadi centres.

**Q3: How is child data protected?**
*Answer:* All child records are strictly pseudonymized using codes such as `CH-BLR-001`. No real names, Aadhaar numbers, or biometric data are stored. Passwords are encrypted with bcryptjs, and all API endpoints enforce server-side JWT authentication and role-based access control (RBAC).

