# Importing Bangladesh Medicine Data

Clinical OS can consume CSV exports produced by `ahmedshahriar/bd-medicine-scraper` and convert them into a Drizzle SQLite seed migration.

The scraper project is Apache-2.0 licensed, but the exported data source and redistribution rights must still be reviewed before bundling the generated SQL in a public/free app.

## Source repository

- Repository: `ahmedshahriar/bd-medicine-scraper`
- Expected exports from its README:
  - `medicine.csv`
  - `manufacturer.csv`
  - `indication.csv`
  - `generic.csv`
  - `drug class.csv`
  - `dosage form.csv`

## Generate a Clinical OS seed migration

Place the exported CSV files in a local directory, for example:

```text
./data/bd-medicine-scraper/
  medicine.csv
  manufacturer.csv
  indication.csv
  generic.csv
  drug class.csv
  dosage form.csv
```

Then run:

```shell
bun run import:bd-medicine-scraper ./data/bd-medicine-scraper ./db/migrations/0004_seed_bd_medicine_scraper.sql
```

The script maps source CSV columns into Clinical OS tables:

| Source model | Clinical OS table |
| --- | --- |
| Manufacturer | `manufacturers` |
| DosageForm | `dosage_forms` |
| DrugClass | `drug_classes` |
| Indication | `indications` |
| Generic | `generics`, `generic_indications` |
| Medicine | `medicines` |

## After generation

Review the generated SQL, then register it manually in:

- `db/migrations/migrations.js`
- `db/migrations/meta/_journal.json`

This is manual on purpose because a full medicine dataset may create a very large migration file.

## Source-to-target field mapping

### Medicine

- `brand_id` → `medicines.id`
- `brand_name` → `medicines.brand_name`
- `type` → `medicines.type`
- `dosage_form` → `dosage_forms.name` and `medicines.dosage_form_id`
- `generic_id` or `generic_name` → `medicines.generic_id`
- `strength` → `medicines.strength`
- `manufacturer_id` or `manufacturer_name` → `medicines.manufacturer_id`
- `package_container` → `medicines.package_container`
- `pack_size_info` → `medicines.package_size`

### Generic

- `generic_id` → `generics.id`
- `generic_name` → `generics.name`
- `monograph_link` → `generics.monograph_link`
- `drug_class_id` or `drug_class_name` → `generics.drug_class_id`
- `indication_id` or `indication_name` → `generic_indications`
- `indication_description` → `generics.indication_text`
- `pharmacology_description` → `generics.pharmacology`
- `dosage_description` → `generics.dosage_description`
- `administration_description` → `generics.administration_description`
- `interaction_description` → `generics.interactions`
- `contraindications_description` → `generics.contraindications`
- `side_effects_description` → `generics.side_effects`
- `pregnancy_and_lactation_description` → `generics.pregnancy_notes`
- `precautions_description` → `generics.precautions`
- `pediatric_usage_description` → `generics.pediatric_usage`
- `overdose_effects_description` → `generics.overdose_effects`
- `storage_conditions_description` → `generics.storage_conditions`

## License and medical review checklist

Before shipping the generated database:

- confirm the scraper code license and dataset license
- retain required attribution
- confirm data source terms permit redistribution inside a public/free app
- verify pricing and monograph data freshness
- have a licensed physician/pharmacist review clinical text
- add a visible medical disclaimer inside the app
