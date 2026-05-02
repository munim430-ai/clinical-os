# Clinical OS Content Import Contract

Clinical OS is built to provide GP Master-style clinical workflows and DIMS-style drug lookup while staying free and legally safe.

Do not import proprietary, subscription-only, scraped, or copied databases unless you have explicit rights to use and redistribute them.

## Supported content domains

- `dims`: drug brands, generics, manufacturers, dosage forms, indications, monographs
- `gp`: systems, conditions, symptoms, warning signs, protocol steps, exams, OSCE cards
- `er`: emergency drug dose tables
- `media`: ECG, CXR, protocol diagrams, clinical images
- `alerts`: outbreak notices, guideline updates, safety warnings

## Remote manifest shape

```json
{
  "id": "bd-drugs-2026-05",
  "module": "dims",
  "version": "2026.05.01",
  "checksum": "sha256:...",
  "sourceName": "Your licensed/public drug source",
  "sourceUrl": "https://your-domain.example/drugs.json",
  "notes": "Use only legal content.",
  "assets": [
    {
      "id": "ecg-stemi-anterior",
      "module": "gp",
      "entityType": "ecg",
      "entityId": "stemi",
      "title": "Anterior STEMI ECG pattern",
      "remoteUrl": "https://your-domain.example/media/ecg-stemi.png",
      "mimeType": "image/png",
      "checksum": "sha256:...",
      "sizeBytes": 123456
    }
  ],
  "alerts": [
    {
      "id": "dengue-alert-2026-05",
      "title": "Dengue update",
      "body": "Check current national guidance before treatment decisions.",
      "module": "gp",
      "severity": "warning",
      "sourceName": "DGHS or licensed source",
      "sourceUrl": "https://example.com"
    }
  ]
}
```

## CSV import targets

Recommended CSV files:

- `manufacturers.csv`: `id,name,slug`
- `dosage_forms.csv`: `id,name,slug`
- `drug_classes.csv`: `id,name,slug`
- `generics.csv`: `id,name,slug,drug_class_id,indication_text,pharmacology,dosage_description,administration_description,side_effects,contraindications,interactions,pregnancy_notes,pediatric_usage,overdose_effects,storage_conditions,precautions`
- `medicines.csv`: `id,brand_name,slug,type,dosage_form_id,generic_id,strength,manufacturer_id,package_container,package_size`
- `systems.csv`: `id,name,icon,color,order_index`
- `conditions.csv`: `id,name,system_id,overview,icd10_code,slug`
- `symptoms.csv`: `condition_id,text,is_warn_sign,category`
- `protocols.csv`: `condition_id,title,source,version,year`
- `protocol_steps.csv`: `protocol_id,step_number,heading,body,sub_steps_json,table_json,severity`
- `exam_steps.csv`: `condition_id,category,text,order_index`
- `osce_cards.csv`: `condition_id,question,answer,station_type`
- `er_drugs.csv`: `name,indication,dose_per_kg,max_dose_mg,route,concentration_mg_per_ml,dilution_notes,warning_note,is_paediatric_safe,order_index`

## Content policy for free DIMS replacement

Allowed:

- your own curated data
- public-domain data
- government or regulator datasets that permit reuse
- licensed datasets where redistribution is allowed
- content reviewed and authored by your medical reviewers

Not allowed:

- copied DIMS subscription text
- reverse-engineered proprietary app databases
- bypassed paywalled data
- screenshots or scraped content from protected apps
- copied GP Master proprietary protocol wording without permission

## App behavior

The app now stores:

- `content_versions` for installed data versions
- `sync_manifest` for future remote feeds
- `media_assets` for offline ECG/CXR/protocol image metadata
- `app_alerts` for outbreak and guideline notices
- `case_logs` in SQLite for anonymous future surveillance sync
