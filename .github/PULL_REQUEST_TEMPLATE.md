# 🚀 Pull Request

## Summary  
Briefly describe what this PR does.  
> e.g. Added daily cola tracking and separated original vs zero logic.

---

## Changes  
- Added `amount` field to `Cola` model  
- Created `/api/cola` and `/api/cola/daily` endpoints  
- Linked intake to user  
- Updated Prisma schema + migration

---

## Why  
- Track daily cola intake in DB  
- Prepare for health insights & future JWT auth

---

## Test Steps  
```bash
npm run dev
POST /api/cola { userId, amount }
GET  /api/cola/daily?userId=1&date=YYYY-MM-DD
