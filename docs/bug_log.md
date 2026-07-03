# JanSaath QA Bug Log

## Active Testing Matrix
- [x] Text complaint submission via Gemini processing pipeline
- [x] Duplicate complaint merging via pgvector similarity search
- [x] 4-Week time-series forecasting via Meta Prophet loop
- [x] Budget analysis via scikit-learn Random Forest regressor

## Logged Issues
| Bug ID | Severity | Feature | Description | Status |
|---|---|---|---|---|
| BUG-001 | P1 | Database | Foreign key constraint crash on missing ward rows | FIXED (Added load_data.py seeder) |
| BUG-002 | P2 | Prophet | AttributeError: stan_backend initialization missing | FIXED (Reinstalled cmdstanpy) |
| BUG-003 | P2 | Websockets | ModuleNotFoundError: no module named websockets.asyncio | FIXED (Upgraded websockets library) |