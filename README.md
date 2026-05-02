# Clinical OS

Offline-first clinical reference app for Bangladeshi doctors.

Clinical OS combines:

- clinical workflows: systems, conditions, symptoms, warning signs, protocols, examination steps, lab interpretation, and OSCE cards
- drug lookup: brands, generics, manufacturers, dosage forms, strengths, packages, pharmacology, interactions, precautions, pregnancy notes, and more
- ER panic mode: weight-based emergency drug dose support
- anonymous case logging: local-first disease surveillance without patient-identifying data
- free content infrastructure: import owned, public, or licensed datasets without locking doctors behind subscriptions

## Stack

- Expo 54
- React Native 0.81
- Expo Router
- Expo SQLite
- Drizzle ORM
- NativeWind
- MMKV for lightweight preferences

## Content model

Clinical OS is designed to stay free while respecting content rights.

Use only:

- original curated medical content
- public-domain content
- government or regulator datasets that permit reuse
- licensed datasets with redistribution rights
- medical-reviewer-approved summaries

Do not import copied subscription databases, scraped proprietary app content, or reverse-engineered protected datasets.

See `docs/content-import.md` for the import contract.

## Development

```shell
bun install
bun run dev:android
```

## Database

The local database is `clinical_os.db` and is managed through Expo SQLite and Drizzle migrations.

Core modules:

- drug data
- clinical protocol data
- ER drug dose data
- anonymous case logs
- content version registry
- remote sync manifest
- offline media asset registry
- app alerts

## Disclaimer

Clinical OS is for clinical reference only. All content must be reviewed by qualified medical professionals before clinical application.
