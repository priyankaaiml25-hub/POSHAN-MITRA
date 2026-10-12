# PROJECT REPORT: POSHAN MITRA
### Smart Diet, Nutrition Awareness and Child Welfare Platform for Anganwadi Centres in India
**Department of Computer Science & Engineering / Information Technology**  
*Academic Project Evaluation & Pilot Prototype Documentation*

---

## 1. ABSTRACT
Malnutrition and micronutrient deficiencies remain pressing public health challenges in rural and peri-urban India. While frontline Anganwadi workers (AWWs) under the Integrated Child Development Services (ICDS) conduct growth monitoring and supplementary feeding, they often rely on manual registers and lack tools to provide localized, affordable dietary advice. **Poshan Mitra** is an accessible, multilingual, and offline-friendly digital health platform designed to assist Anganwadi workers, caregivers, and preschool children.

The system features:
1. A **deterministic rule-based meal planner** that optimizes food group balance (millets, pulses, greens, dairy) against user-specified budgets in Indian Rupees (₹).
2. A **scientifically validated WHO Child Growth Monitoring (2006 Standards) engine** calculating exact Weight-for-Age (WAZ), Height-for-Age (HAZ), and Weight-for-Height (WHZ) Z-scores to flag children needing review.
3. Multilingual educational modules in **English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ)** with Web Speech API Text-to-Speech (TTS).
4. Preschool gamification (**Poshan Play**) engaging children aged 3–6 years without personal data collection.
5. Server-side role-based access control (RBAC), audit logging, and aggregate administrative reporting.

---

## 2. PROBLEM DEFINITION & MOTIVATION
Despite the availability of nutritious, inexpensive native Indian grains such as Ragi, Jowar, and drumstick (moringa) leaves, many families suffer from "hidden hunger" due to lack of practical dietary guidance. Furthermore:
- Anthropometric measurements recorded on physical growth cards are susceptible to calculation errors.
- Nutrition educational material is seldom accessible in native vernacular scripts with voice narration.
- Workers struggle to track follow-up tasks when a child is flagged for moderate or severe underweight.

---

## 3. PROPOSED SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------------------------+
|                                  USER CLIENT                                      |
|    Browser PWA (React 19 + TypeScript + Tailwind CSS + Lucide + Recharts)         |
|  - Web Speech API TTS  - Multilingual (EN/HI/KN)  - Offline Service Worker Cache  |
+-----------------------------------------+-----------------------------------------+
                                          |
                        HTTP / REST (Proxy: /api/*)
                                          |
+-----------------------------------------v-----------------------------------------+
|                                EXPRESS BACKEND                                    |
|   Node.js 24 + TypeScript + Helmet + CORS + Zod Validation + JWT Authentication   |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | Auth & RBAC Guard  |   | WHO 2006 Calculation  |   | Rule-Based Meal Engine |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | Task Controller    |   | Child Record Manager  |   | Report Aggregator      |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                      Prisma ORM
                                          |
+-----------------------------------------v-----------------------------------------+
|                                  DATABASE TIER                                    |
|       SQLite (Default zero-config dev.db) / PostgreSQL (Production ready)         |
|  Tables: User, Centre, Child, GrowthMeasurement, FollowUpTask, FoodItem, AuditLog |
+-----------------------------------------------------------------------------------+
```

---

## 4. SCIENTIFIC VALIDATION: WHO CHILD GROWTH STANDARDS (2006)
Rather than applying arbitrary thresholds (such as "weight under 10 kg means malnourished"), Poshan Mitra implements the official mathematical method documented by the World Health Organization:

### Calculation Formula
For a child of age $t$ months and gender $g$:
$$\text{WAZ} = \frac{\text{Weight} - M_{\text{WAZ}}(t, g)}{\text{SD}_{\text{WAZ}}(t, g)}$$
$$\text{HAZ} = \frac{\text{Height} - M_{\text{HAZ}}(t, g)}{\text{SD}_{\text{HAZ}}(t, g)}$$
$$\text{WHZ} = \frac{\text{Weight} - M_{\text{WHZ}}(\text{Height}, g)}{\text{SD}_{\text{WHZ}}(\text{Height}, g)}$$

Where $M$ is the reference median and $\text{SD}$ is one standard deviation from the WHO 2006 reference population.

### Classification Categories:
- **WAZ < -3 SD:** Severe Underweight (Priority review flagged)
- **-3 SD <= WAZ < -2 SD:** Moderate Underweight (Review flagged)
- **-2 SD <= WAZ <= +2 SD:** Normal Growth Pattern
- **WHZ < -3 SD:** Severe Wasting (Immediate ANM referral flagged)
- **WHZ < -2 SD:** Moderate Wasting (Counselling flagged)

---

## 5. DATABASE SCHEMA DESIGN
The relational schema comprises:
- **`Centre`:** Stores Anganwadi location, code (`AWC-BLR-014`), district, and state.
- **`User`:** Stores workers and CDPO administrators with bcrypt-hashed passwords and roles (`ADMIN`, `WORKER`, `PARENT`).
- **`Child`:** Pseudonymous reference IDs (`CH-BLR-001`), date of birth, gender, and guardian relation.
- **`GrowthMeasurement`:** Stores longitudinal weight, height, computed WAZ/HAZ/WHZ scores, `needsReview` boolean, and audit timestamps.
- **`FollowUpTask`:** Tracks welfare tasks categorized into Nutrition Counselling, Growth Monitoring, Parent Education, and ANM Referrals.
- **`NutritionLesson`:** Stores 10 lessons with structured content in English, Hindi, and Kannada.
- **`FoodItem`:** 25 staple Indian foods with macronutrients, micronutrients (iron, calcium, Vitamin A), and costs per 100g.
- **`AuditLog`:** Logs sensitive operations (e.g. child creation, measurement entries, task resolution).

---

## 6. EXPERIMENTAL TEST RESULTS
Automated test suites were executed using Vitest:
- **WHO Growth Standards Engine:** 5 unit tests validating age interpolation, normal trajectory, moderate underweight classification, severe wasting flags, and rejection of impossible physiological inputs.
- **API Integration Tests:** 7 tests verifying endpoint health, demo account metadata, authenticated JWT login, RBAC protection on child endpoints, and meal plan generation.
- **Frontend Translations:** 3 tests ensuring 100% dictionary key parity across English, Hindi, and Kannada.
- **Result:** **15 out of 15 tests passed successfully (100% test pass rate).**

---

## 7. ETHICAL PRINCIPLES & LIMITATIONS
1. **Decision Support, Not Medical Diagnosis:** Poshan Mitra assists Anganwadi workers in prioritizing outreach. It does not replace medical officers, pediatricians, or ANMs.
2. **Data Minimization:** No biometric or photographic identifiers of children are collected.
3. **Price Estimates:** Market rates are calibrated regional baseline averages and subject to local market fluctuations.

---

## 8. FUTURE SCOPE
- Integration with government National Health Stack / Poshan Tracker APIs via secure OAuth2.
- Bluetooth Low Energy (BLE) pairing with digital infant hanging spring balances and infantometers.
- Expansion to additional regional languages (Tamil, Telugu, Marathi, Bengali).

