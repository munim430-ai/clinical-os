import type { doctorProfile } from "@/db/schema";
import { buildVerifyUrl } from "@/lib/qr";
import { qrcodegen } from "@/lib/qrcodegen";
import type { RxDiagnosis, RxMedicine, RxPatient } from "@/lib/rx-store";

type DoctorProfile = typeof doctorProfile.$inferSelect;

export interface RxHtmlInput {
  rxNumber: string;
  qrToken: string;
  createdAt: Date;
  doctor: DoctorProfile | null;
  patient: RxPatient;
  complaints: string[];
  examinations: string;
  investigations: string;
  diagnoses: RxDiagnosis[];
  medicines: RxMedicine[];
  advice: string[];
  followUpDate: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildQrSvg(value: string, size: number): string {
  const qr = qrcodegen.QrCode.encodeText(value, qrcodegen.QrCode.Ecc.MEDIUM);
  const quiet = 4;
  const dimension = qr.size + quiet * 2;
  let rects = "";
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) {
        rects += `<rect x="${x + quiet}" y="${
          y + quiet
        }" width="1" height="1" fill="#000"/>`;
      }
    }
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${dimension}" height="${dimension}" fill="#fff"/>${rects}</svg>`;
}

function sigLine(m: RxMedicine): string {
  return `${m.doseMorning}+${m.doseAfternoon}+${m.doseNight}`;
}

export function buildRxHtml(input: RxHtmlInput): string {
  const {
    rxNumber,
    qrToken,
    createdAt,
    doctor,
    patient,
    complaints,
    examinations,
    investigations,
    diagnoses,
    medicines,
    advice,
    followUpDate,
  } = input;

  const verifyUrl = buildVerifyUrl(qrToken);
  const qrSvg = buildQrSvg(verifyUrl, 80);

  const doctorName = doctor?.name?.trim()
    ? `Dr. ${escapeHtml(doctor.name)}`
    : "Dr. ______________";
  const qualifications = doctor?.qualifications
    ? escapeHtml(doctor.qualifications)
    : "";
  const specialtyLine = [
    doctor?.specialty,
    doctor?.bmdcReg ? `BM&DC Reg: ${doctor.bmdcReg}` : null,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" &middot; ");
  const chamberLine = [
    doctor?.chamberLine1,
    doctor?.chamberLine2,
    doctor?.phone,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" &middot; ");

  const vitalsBits = [
    patient.bp ? `BP: ${escapeHtml(patient.bp)}` : null,
    patient.pulse ? `Pulse: ${escapeHtml(patient.pulse)}` : null,
    patient.temperature
      ? `Temp: ${escapeHtml(patient.temperature)}&deg;F`
      : null,
    patient.weight ? `Wt: ${escapeHtml(patient.weight)} kg` : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: 148mm 210mm; margin: 10mm; }
  body { font-family: Georgia, serif; font-size: 13px; color: #111; margin: 0; }
  .heading { font-family: Arial, sans-serif; font-weight: bold; }
  .header { display: flex; align-items: flex-start; gap: 12px; }
  .logo { width: 52px; height: 52px; border-radius: 8px; background: #eee; flex-shrink: 0; }
  .doctor-name { font-size: 18px; }
  .meta { color: #555; font-size: 11px; margin-top: 2px; }
  hr.thick { border: none; border-top: 2px solid #222; margin: 10px 0; }
  hr.thin { border: none; border-top: 1px solid #ccc; margin: 8px 0; }
  .row { display: flex; justify-content: space-between; font-size: 12px; }
  .section-title { font-family: Arial, sans-serif; font-weight: bold; font-size: 12px; margin: 10px 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  ul { margin: 2px 0; padding-left: 18px; }
  .rx-symbol { font-size: 26px; font-style: italic; font-family: Georgia, serif; }
  .medicine { margin: 8px 0; }
  .medicine .name { font-weight: bold; }
  .medicine .sig { color: #333; font-size: 12px; margin-left: 14px; }
  .footer { text-align: center; font-size: 10px; color: #999; margin-top: 14px; }
  .qr-block { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
  .sign-block { text-align: right; margin-top: 24px; font-size: 12px; }
  .sign-line { border-top: 1px solid #444; width: 160px; margin-left: auto; margin-top: 30px; }
  .allergy { color: #B00020; font-weight: bold; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo"></div>
    <div>
      <div class="doctor-name heading">${doctorName}</div>
      ${qualifications ? `<div class="meta">${qualifications}</div>` : ""}
      ${specialtyLine ? `<div class="meta">${specialtyLine}</div>` : ""}
      ${chamberLine ? `<div class="meta">${chamberLine}</div>` : ""}
    </div>
  </div>
  <hr class="thick" />
  <div class="row">
    <span>Rx#: ${escapeHtml(rxNumber)}</span>
    <span>Date: ${formatDate(createdAt)}</span>
  </div>
  <hr class="thin" />
  <div class="row">
    <span>Patient: ${escapeHtml(patient.name || "-")}${
      patient.age ? `, ${escapeHtml(patient.age)}` : ""
    }${patient.gender ? ` ${escapeHtml(patient.gender)}` : ""}</span>
  </div>
  ${
    vitalsBits.length
      ? `<div class="meta">${vitalsBits.join(" &middot; ")}</div>`
      : ""
  }
  <div class="meta ${patient.allergies ? "allergy" : ""}">Allergy: ${
    patient.allergies ? escapeHtml(patient.allergies) : "None reported"
  }</div>
  <hr class="thick" />

  ${
    complaints.length
      ? `<div class="section-title">Chief Complaints</div><ul>${complaints
          .map((c) => `<li>${escapeHtml(c)}</li>`)
          .join("")}</ul>`
      : ""
  }
  ${
    examinations
      ? `<div class="section-title">On Examination</div><ul>${examinations
          .split("\n")
          .filter(Boolean)
          .map((l) => `<li>${escapeHtml(l)}</li>`)
          .join("")}</ul>`
      : ""
  }
  ${
    investigations
      ? `<div class="section-title">Investigations</div><ul>${investigations
          .split("\n")
          .filter(Boolean)
          .map((l) => `<li>${escapeHtml(l)}</li>`)
          .join("")}</ul>`
      : ""
  }
  ${
    diagnoses.length
      ? `<div class="section-title">Diagnosis</div><ul>${diagnoses
          .map(
            (d) =>
              `<li>${escapeHtml(d.label)}${
                d.icd10 ? ` (${escapeHtml(d.icd10)})` : ""
              }</li>`,
          )
          .join("")}</ul>`
      : ""
  }

  <hr class="thick" />
  <div class="rx-symbol">&#8478;</div>
  ${medicines
    .map(
      (m, i) => `
    <div class="medicine">
      <div class="name">${i + 1}. ${escapeHtml(m.brandName)}${
        m.strength ? ` ${escapeHtml(m.strength)}` : ""
      }${
        m.genericName
          ? ` <span style="font-weight:normal;color:#555;">(${escapeHtml(
              m.genericName,
            )})</span>`
          : ""
      }</div>
      <div class="sig">${sigLine(m)}, ${escapeHtml(m.timing)}, ${escapeHtml(
        m.duration,
      )}${m.quantity ? ` &middot; Qty: ${m.quantity}` : ""}</div>
    </div>`,
    )
    .join("")}
  <hr class="thick" />

  ${
    advice.length
      ? `<div class="section-title">Advice</div><ul>${advice
          .map((a) => `<li>${escapeHtml(a)}</li>`)
          .join("")}</ul>`
      : ""
  }

  ${
    followUpDate
      ? `<hr class="thin" /><div class="meta">Follow-up: ${escapeHtml(
          followUpDate,
        )}</div>`
      : ""
  }

  <div class="qr-block">
    ${qrSvg}
    <div class="meta">Scan to verify at<br/>clinical-os-eta.vercel.app/verify</div>
  </div>

  <div class="sign-block">
    <div class="sign-line"></div>
    <div>${doctorName}</div>
  </div>

  <hr class="thick" />
  <div class="footer">Made by Munim @ Keystone</div>
</body>
</html>`;
}
