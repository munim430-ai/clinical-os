-- Chest X-ray findings with detailed descriptions
BEGIN TRANSACTION;

-- Normal Chest X-ray
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Normal Chest X-ray', 'Clear lung fields, normal heart size, no mediastinal widening', null);

-- Airspace Opacities
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Consolidation', 'Homogeneous opacity obscuring vascular markings, air bronchograms may be present', 'pneumonia'),
('Air Bronchograms', 'Air-filled bronchi visible as radiolucent tubular structures against opaque background', 'pneumonia'),
('Alveolar Opacities', 'Fluffy, ill-defined opacities typically in dependent lung zones', 'pneumonia'),
('Ground Glass Opacity', 'Hazy increased lung opacity without obscuration of underlying vessels', null),
('Reticular Pattern', 'Fine linear opacities creating a net-like pattern', null),
('Nodular Pattern', 'Multiple small rounded opacities 2-30mm in diameter', null),
('Miliary Pattern', 'Numerous tiny 1-2mm nodules throughout lung fields', null);

-- Pleural Abnormalities
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Pleural Effusion', 'Blunting of costophrenic angle, meniscus sign, fluid level', null),
('Loculated Effusion', 'Circumscribed fluid collection not free-flowing', null),
('Empyema', 'Pleural fluid with thickened enhancing pleura, possible air-fluid levels', null),
('Pleural Thickening', 'Focal or diffuse pleural opacity, may be calcified', null),
('Pleural Plaque', 'Focal pleural thickening, often calcified, seen in asbestos exposure', null),
('Pneumothorax', 'Absence of lung markings peripherally, visible visceral pleural line', null),
('Tension Pneumothorax', 'Large pneumothorax with mediastinal shift away from affected side', null),
('Hydropneumothorax', 'Air-fluid level in pleural space', null);

-- Cardiac Abnormalities
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Cardiomegaly', 'Cardiothoracic ratio > 50% on PA film', null),
('Left Ventricular Enlargement', 'Boot-shaped heart, left heart border prominent', null),
('Right Ventricular Enlargement', 'Enlarged right heart border, loss of retrosternal space', null),
('Left Atrial Enlargement', 'Double density, elevation of left main bronchus', null),
('Pericardial Effusion', 'Water bottle heart configuration, globular cardiac silhouette', null),
('Pulmonary Edema', 'Bat wing distribution, Kerley B lines, pleural effusions', null),
('Pulmonary Venous Hypertension', 'Upper lobe venous redistribution, cephalization', null);

-- Mediastinal Abnormalities
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Mediastinal Widening', 'Mediastinal width > 8 cm on PA film', null),
('Mediastinal Mass', 'Discrete soft tissue density in mediastinum', null),
('Superior Vena Cava Syndrome', 'Widened mediastinum, pleural effusions', null),
('Aortic Aneurysm', 'Widened mediastinum, aortic knob enlargement', null),
('Mediastinal Emphysema', 'Air in mediastinum, continuous diaphragm sign', null);

-- Lung Parenchyma - Specific Conditions
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Tuberculosis Primary Complex', 'Ghon focus (parenchymal opacity) with lymphadenopathy', null),
('Tuberculosis Reactivation', 'Cavitary lesions in upper lobes, fibrotic changes', null),
('Lung Abscess', 'Thick-walled cavitary lesion with air-fluid level', null),
('Bronchiectasis', 'Tram tracks, ring shadows, signet ring appearance', null),
('Bronchiolitis', 'Peribronchial thickening, mucus plugging', null),
('Pulmonary Embolism', 'Often normal, may show Hampton hump, Westermark sign', null),
('ARDS', 'Diffuse alveolar opacities, air bronchograms, bilateral infiltrates', null);

-- Interstitial Lung Disease
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Idiopathic Pulmonary Fibrosis', 'Basal reticular pattern, honeycombing, reduced lung volumes', null),
('Sarcoidosis', 'Hilar lymphadenopathy, perihilar infiltrates, nodular opacities', null),
('Silicosis', 'Eggshell calcification, upper lobe fibrosis, progressive massive fibrosis', null),
('Asbestosis', 'Lower zone fibrosis, pleural plaques, calcified diaphragmatic pleura', null),
('Kerley B Lines', 'Horizontal lines 1-2cm long extending to pleura', null),
('Honeycombing', 'Cystic spaces 3-10mm with thick walls, basal predominance', null);

-- Neoplastic Findings
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Pulmonary Nodule', 'Well-circumscribed opacity < 3cm, may be solitary', null),
('Lung Mass', 'Opacity > 3cm, irregular margins, may have spiculation', null),
('Pancoast Tumor', 'Apical mass, possible rib destruction, Horner syndrome', null),
('Solitary Pulmonary Nodule', 'Single well-defined nodule, needs characterization', null),
('Multiple Pulmonary Nodules', 'Numerous nodules, consider metastases', null),
('Cavitary Mass', 'Mass with central lucency, thick or thin walls', null);

-- Post-Surgical and Trauma
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Post-Op Changes', 'Surgical clips, wires, changes specific to procedure', null),
('Rib Fractures', 'Discontinuity in rib cortex, may have callus formation', null),
('Flail Chest', 'Multiple rib fractures with paradoxical wall motion', null),
('Clavicle Fracture', 'Discontinuity in clavicle, may be displaced', null),
('Sternal Fracture', 'Often difficult to see, may need lateral view', null),
('Subcutaneous Emphysema', 'Air in soft tissues, lucencies in chest wall', null);

-- Vascular Abnormalities
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Pulmonary Artery Enlargement', 'Prominent pulmonary artery segment, > 16mm', null),
('Aortic Dissection', 'Widened mediastinum, double aortic knob', null),
('Pulmonary AV Malformation', 'Round or serpiginous mass with feeding vessels', null),
('Scimitar Sign', 'Curved vascular shadow draining to IVC, anomalous pulmonary vein', null);

-- Diaphragmatic Abnormalities
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Elevated Hemidiaphragm', 'Unilateral diaphragmatic elevation > 2cm above normal', null),
('Eventration', 'Elevated diaphragm with intact contour, congenital', null),
('Diaphragmatic Hernia', 'Bowel gas in chest, loss of diaphragmatic contour', null),
('Diaphragmatic Paralysis', 'Elevated diaphragm with paradoxical movement', null),
('Subphrenic Abscess', 'Elevated diaphragm with air-fluid level below', null);

-- Bone and Chest Wall
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Scoliosis', 'Lateral curvature of spine, vertebral rotation', null),
('Kyphosis', 'Excessive anterior curvature of thoracic spine', null),
('Osteolytic Lesions', 'Bone destruction, punched-out lesions', null),
('Osteoblastic Lesions', 'Bone formation, sclerosis, blastic metastases', null),
('Osteopenia', 'Decreased bone density, prominent trabeculae', null),
('Hyperostosis', 'Increased bone density, cortical thickening', null);

-- Foreign Bodies and Iatrogenic
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Endotracheal Tube', 'Radioopaque tube, tip 3-5cm above carina', null),
('Central Venous Catheter', 'Radioopaque line, tip in SVC/RA junction', null),
('Nasogastric Tube', 'Radioopaque tube, tip below diaphragm, avoiding lung', null),
('Chest Tube', 'Radioopaque tube, tip in pleural space', null),
('Pacemaker', 'Generator in soft tissues, leads in heart chambers', null),
('ICD Device', 'Similar to pacemaker with larger generator', null),
('Foreign Body', 'Radioopaque object in airway or esophagus', null);

-- Pediatric Specific
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Neonatal Respiratory Distress', 'Ground glass appearance, air bronchograms, low volume', null),
('Bronchopulmonary Dysplasia', 'Coarse reticular pattern, hyperinflation', null),
('Meconium Aspiration', 'Patchy opacities, hyperinflation, pneumothorax risk', null),
('Transient Tachypnea', 'Pleural effusions, fluid in fissures, cardiomegaly', null);

-- Positional and Technical
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('AP vs PA Projection', 'Magnification of heart on AP film, better assessment on PA', null),
('Inspiration Adequacy', '6 anterior ribs visible above diaphragm', null),
('Rotation Assessment', 'Equal distance from spinous processes to medial clavicles', null),
('Penetration Assessment', 'Vertebral bodies visible through heart', null);

-- Emergency Findings
INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
('Free Air Under Diaphragm', 'Lucency under diaphragm, indicates perforation', null),
('Widened Mediastinum', 'Emergency - consider aortic dissection, trauma', null),
('Large Pneumothorax', 'Emergency - need chest tube if > 20% or symptomatic', null),
('Tension Pneumothorax', 'Emergency - mediastinal shift, tracheal deviation', null),
('Massive Hemorrhage', 'White-out hemithorax, mediastinal shift', null);

COMMIT;
