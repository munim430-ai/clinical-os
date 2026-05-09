// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_quick_psynapse.sql';
import m0001 from './0001_seed_drugs.sql';
import m0002 from './0002_seed_clinical.sql';
import m0003 from './0003_content_sync.sql';
import m0004 from './0004_seed_bd_medicine.sql';
import m0005 from './0005_seed_gp_master_interpretation.sql';
import m0006 from './0003_seed_lab_values.sql';
import m0007 from './0004_seed_ecg_patterns.sql';
import m0008 from './0005_seed_cxr_findings.sql';
import m0009 from './0006_seed_dengue_protocol.sql';
import m0010 from './0007_seed_typhoid_protocol.sql';
import m0011 from './0008_seed_malaria_protocol.sql';
import m0012 from './0009_add_drug_pricing.sql';
import m0013 from './0010_seed_quiz_questions.sql';
import m0014 from './0011_seed_osce_cases.sql';
import m0015 from './0012_link_conditions_to_drugs.sql';
import m0016 from './0013_gp_master_rx.sql';
import m0017 from './0014_conditions_chunk1.sql';
import m0018 from './0015_conditions_chunk2.sql';
import m0019 from './0016_conditions_chunk3.sql';
import m0020 from './0017_conditions_chunk4.sql';
import m0021 from './0018_conditions_chunk5.sql';
import m0022 from './0019_conditions_chunk6.sql';
import m0023 from './0020_conditions_chunk7.sql';
import m0024 from './0021_conditions_chunk8.sql';
import m0025 from './0022_dengue_sprint_a.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
    m0006,
    m0007,
    m0008,
    m0009,
    m0010,
    m0011,
    m0012,
    m0013,
    m0014,
    m0015,
    m0016,
    m0017,
    m0018,
    m0019,
    m0020,
    m0021,
    m0022,
    m0023,
    m0024,
    m0025,
  },
};
