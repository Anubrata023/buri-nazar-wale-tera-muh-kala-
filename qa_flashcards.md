# JanSaath Q&A Flashcards

## COST & FREE-STACK QUESTIONS (NEW for v3.0)

### Q: What does this cost to run?
**A:** Effectively Rs 0/month at hackathon and early-pilot scale. Every component except IVR phone minutes runs on a genuinely free tier - Google AI Studio, Supabase, Firebase Spark, Render, OpenStreetMap. IVR uses Twilio's free trial credit during the pilot phase.

### Q: Doesn't free tier mean it can't scale?
**A:** No. Google AI Studio's free tier covers ~1,500 requests/day, which is roughly one mid-size constituency's daily complaint volume. As a real deployment grows, the same code runs unchanged on Google AI Studio's modest pay-as-you-go pricing - no re-architecture needed.

### Q: Why didn't you use Vertex AI / Vertex AI Agent Builder?
**A:** Vertex AI is the enterprise, billed version of the same Gemini model available for free through Google AI Studio. For a constituency-scale pilot, the free tier is sufficient, and choosing it means we built and understand our own LangGraph agent orchestration rather than depending on a paid no-code tool.

### Q: Why Supabase instead of Google Cloud SQL?
**A:** Cloud SQL has no permanent free tier and bills hourly for the database instance even when idle. Supabase offers the same PostgreSQL engine, with pgvector pre-installed, on a genuinely free tier - ideal for a pilot of this scale.

### Q: Why OpenStreetMap instead of Google Maps?
**A:** Google Maps Platform requires a billing account attached even to generate a free-tier API key, which is real friction for first-time student deployers. OpenStreetMap with Leaflet.js gives the same heatmap and pin functionality with zero billing setup.

### Q: Is your forecasting model as good as BigQuery ML?
**A:** Prophet, the open-source library we used, is widely used in industry for exactly this kind of seasonal time-series forecasting. For our data scale, it performs comparably to BigQuery ML's ARIMA_PLUS, at zero cost.

### Q: What happens when you outgrow the free tiers?
**A:** Each free component has a direct upgrade path with no re-architecture: Google AI Studio → Vertex AI (same model, same code), Supabase free → Supabase Pro (same Postgres), Render free → Render paid (same deployment). The free-tier choice was about removing the adoption barrier for a first pilot.

---

## ORIGINAL QUESTIONS (from v2.0 Bible)

### Q: How do you prevent fake or spam complaints?
**A:** Firebase Phone OTP = every complaint tied to a real phone number. Rate limit: 5 complaints per number per day. Gemini flags implausible complaints. OpenStreetMap verification for priority issues.

### Q: What happens if Gemini gives wrong priority?
**A:** The formula has 4 inputs - Gemini provides only one (Severity). The other three (Census density, cost estimate, satellite confirmation) are objective, non-AI data. A wrong Gemini severity is moderated by the other inputs.

### Q: How is this different from CPGRAMS?
**A:** CPGRAMS is English-only, requires internet, gives a ticket number with no AI, no clustering, no prioritisation, no public transparency. JanSaath works via voice call in 22 languages, merges duplicates, computes a data-backed priority, and publishes everything publicly.

### Q: How do you handle citizen privacy?
**A:** Phone numbers stored encrypted in Firebase (never exposed publicly). Complaint content anonymised on public dashboard (no names). India's DPDP Act 2023 compliance: explicit OTP consent at submission. Data deleted within 90 days of resolution.

### Q: Can MPs manipulate the scores?
**A:** No. The four formula inputs come from: Gemini (auditable), Census (public), Prophet forecasts (reproducible), OpenStreetMap (independent). Weights are configurable but every weight change is logged with timestamp and admin ID.

### Q: How quickly can this be deployed for a real MP?
**A:** Frontend: Firebase Hosting deploys in minutes. Backend: Render deploy takes 10 minutes. Database: Supabase setup takes 30 minutes. Twilio number: available instantly. Realistic onboarding: a real MP's office could be live within 1 week.

### Q: Why Google's stack specifically?
**A:** Three reasons: (1) Recommended and supported with credits for this hackathon. (2) Google's AI (Gemini) is most advanced for Indian languages. (3) The free tier of Google AI Studio makes it accessible to any MP's office.

### Q: What if the MP ignores high-priority issues?
**A:** The Public Transparency Dashboard shows unresolved Priority 8+ issues publicly. If an MP ignores a satellite-verified water crisis for 30+ days, it appears as a red flag on their public score card.

### Q: How do you handle seasonal issues like monsoon complaints?
**A:** The Prophet model has seasonal decomposition built in. It learns annual patterns: more water/flooding complaints in June-September, more fog-related electricity complaints in December-January. Predictions account for seasonality automatically.
