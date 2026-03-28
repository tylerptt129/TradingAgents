# PawPal — App Store Listing

## App Name
PawPal - Pet Care Tracker

## Subtitle
Health, Meals & Memories for Pets

## Category
Lifestyle

## Price
Free (with $1.99 Premium In-App Purchase)

## Description
Keep your furry family happy and healthy with PawPal — the all-in-one pet care tracker that makes being a great pet parent easy and fun!

**YOUR PET'S LIFE, ALL IN ONE PLACE**
Track feeding schedules, vet visits, medications, vaccinations, weight, and daily moods. PawPal keeps everything organized so you never miss a thing.

**FEATURES**
- Add pets with profiles, photos, and custom theme colors
- Quick care actions — tap to log feedings, walks, playtime, and baths
- Vet appointment tracker with reminders and overdue alerts
- Daily mood logging (happy, playful, sleepy, hungry, sick, anxious)
- Pet journal — write about your pet's day with mood and activity tags
- Care streak counter to keep you motivated
- 19 achievement badges to unlock (common to legendary!)
- Beautiful warm-cream themed interface

**PREMIUM ($1.99 ONE-TIME)**
- Unlimited pet profiles (free: 1 pet)
- Medication tracking with dosage & frequency
- Vaccination records with expiry alerts
- Weight history with visual charts
- Unlimited journal entries & photos
- Vet visit cost tracker
- Export health records
- All achievement badges
- Custom feeding schedules

No subscriptions. No ads. Pay once, yours forever.

## Keywords
pet, dog, cat, health, tracker, vet, medication, feeding, journal, care, animal, puppy, kitten, vaccination, weight

## Privacy Policy URL
https://pawpal.app/privacy (to be created)

## Support URL
https://pawpal.app/support (to be created)

---

## App Store Screenshots Needed
1. Home Dashboard with pet selector and quick actions
2. Add Pet screen with pet type picker
3. Health tab showing vet appointments
4. Journal with mood entries and activities
5. Badges/Achievements screen
6. Premium upgrade screen

## App Review Notes
- All data stored locally on device using AsyncStorage
- In-App Purchase: com.pawpal.premium ($1.99 non-consumable)
- Camera/photos used only for pet photos
- No third-party analytics or tracking
- No account creation required

## Age Rating
4+ (no objectionable content)

## Pre-Release Checklist
- [ ] Replace YOUR_APPLE_ID in eas.json
- [ ] Replace YOUR_ASC_APP_ID in eas.json
- [ ] Replace YOUR_TEAM_ID in eas.json
- [ ] Replace YOUR_EAS_PROJECT_ID in app.json
- [ ] Replace YOUR_REVENUECAT_IOS_API_KEY in src/services/purchases.ts
- [ ] Create app icon (1024x1024) — paw print on warm background
- [ ] Create splash screen image
- [ ] Set up product in App Store Connect (com.pawpal.premium, $1.99)
- [ ] Set up RevenueCat project
- [ ] Create privacy policy page
- [ ] Take screenshots on iPhone 15 Pro Max
- [ ] Run: npx eas build --platform ios --profile production
- [ ] Run: npx eas submit --platform ios
