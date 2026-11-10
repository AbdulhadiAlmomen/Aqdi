// Builds the fake sample contracts in this folder: node samples/make-samples.mjs
// Everything in them is made up (people, IDs, phones, deeds, addresses). They follow the section
// order of an Ejar unified residential lease so the import can be tested and demoed without real
// tenant data. They carry a "sample, not a real contract" banner and no Ejar logo, seal or QR code.
// Writes sample-N.pdf (printed by Google Chrome, headless) and expected/sample-N.json (the right answers).
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SAMPLES = [
  {
    file: "sample-1",
    contractNumber: "20512847396",
    sealedOn: "2026-03-08",
    start: "2026-03-15",
    end: "2027-03-14",
    lessor: { name: "خالد بن سعد المطيري", nationality: "سعودي", idType: "هوية وطنية", id: "1045718263", mobile: "0501234870" },
    tenant: { name: "محمد عبدالرحمن العتيبي", nationality: "سعودي", nationalityEn: "Saudi", idType: "هوية وطنية", idTypeKey: "national_id", id: "1098234561", mobile: "0552147390", email: "—" },
    broker: { name: "مكتب النور العقاري", cr: "1010987654", phone: "0114567890" },
    deed: { number: "310118045672", date: "1441/07/12", issuer: "كتابة العدل الأولى بالرياض" },
    address: { city: "الرياض", district: "النرجس", street: "شارع الأمير سلطان بن فهد", building: "7421", postal: "13325", additional: "3104" },
    property: { type: "عمارة", use: "سكني عائلي", floors: "4", units: "12" },
    unit: { type: "شقة", number: "3", floor: "1", area: 145, rooms: "4", furnished: "غير مؤثثة", electric: "40091827", water: "77120345" },
    annualRent: 32000,
    cycle: { ar: "نصف سنوي", key: "semi_annual", months: 6 },
    deposit: 2000,
  },
  {
    file: "sample-2",
    contractNumber: "20519930485",
    sealedOn: "2026-08-24",
    start: "2026-09-01",
    end: "2027-08-31",
    lessor: { name: "شركة الأفق للاستثمار العقاري", nationality: "—", idType: "سجل تجاري", id: "1010456789", mobile: "0114880022" },
    tenant: { name: "أحمد فاروق خان", nationality: "باكستاني", nationalityEn: "Pakistani", idType: "إقامة", idTypeKey: "iqama", id: "2134876590", mobile: "+966549021175", email: "a.khan.sample@example.test" },
    broker: { name: "مكتب النور العقاري", cr: "1010987654", phone: "0114567890" },
    deed: { number: "410229817305", date: "1443/02/03", issuer: "كتابة العدل الثانية بالرياض" },
    address: { city: "الرياض", district: "الملقا", street: "طريق أنس بن مالك", building: "2968", postal: "13524", additional: "7781" },
    property: { type: "عمارة", use: "سكني عائلي", floors: "3", units: "9" },
    unit: { type: "شقة", number: "12", floor: "3", area: 118.5, rooms: "3", furnished: "مؤثثة جزئيًا", electric: "40552019", water: "77984410" },
    annualRent: 28500,
    cycle: { ar: "ربع سنوي", key: "quarterly", months: 3 },
    deposit: 1500,
  },
];

// Umm al-Qura, the calendar Ejar uses. Western digits here; the PDF shows Hijri in Arabic digits.
function hijri(iso) {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(new Date(iso + "T00:00:00Z"));
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year").replace(/\D/g, "")}-${get("month")}-${get("day")}`;
}
const arabicDigits = (s) => s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
const hijriPrinted = (iso) => arabicDigits(hijri(iso).split("-").reverse().join("/")) + " هـ";
const gregPrinted = (iso) => iso.split("-").reverse().join("/") + " م";
const sar = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ريال";
function addMonths(iso, m) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + m);
  return d.toISOString().slice(0, 10);
}

function schedule(s) {
  const count = 12 / s.cycle.months;
  const amount = s.annualRent / count;
  return Array.from({ length: count }, (_, i) => ({ number: i + 1, due: addMonths(s.start, i * s.cycle.months), amount }));
}

const row = (ar, value, en) => `<tr><th>${ar}<small>${en}</small></th><td>${value}</td></tr>`;
const section = (n, ar, en, rows) => `<section><h2><span>${n}</span> ${ar} <em>${en}</em></h2><table>${rows.join("")}</table></section>`;

function html(s) {
  const pays = schedule(s);
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  body { font-family: "Tajawal", sans-serif; font-size: 10.5pt; color: #1d2a33; margin: 0; }
  .banner { border: 1.5px dashed #b23b2a; color: #b23b2a; text-align: center; padding: 6px; font-weight: 700; margin-bottom: 10px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #1f6f5b; padding-bottom: 8px; margin-bottom: 10px; }
  header h1 { margin: 0; font-size: 17pt; color: #1f6f5b; }
  header p { margin: 2px 0 0; color: #5b6b75; }
  header .no { text-align: left; font-size: 10pt; }
  section { margin-bottom: 9px; break-inside: avoid; }
  h2 { font-size: 11.5pt; margin: 0 0 4px; padding: 4px 8px; background: #e8f2ef; color: #1f6f5b; border-radius: 4px; }
  h2 span { display: inline-block; min-width: 18px; } h2 em { font-style: normal; font-weight: 400; color: #5b6b75; font-size: 9.5pt; margin-inline-start: 6px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d5dde1; padding: 4px 8px; text-align: right; vertical-align: top; }
  th { width: 38%; background: #f6f8f9; font-weight: 500; } th small { display: block; color: #7a8a94; font-weight: 400; font-size: 8.5pt; direction: ltr; text-align: right; }
  td { direction: rtl; }
  .ltr { direction: ltr; unicode-bidi: isolate; display: inline-block; }
  .pays th { width: auto; text-align: center; } .pays td { text-align: center; }
  .terms { font-size: 9pt; color: #44525b; } .terms li { margin-bottom: 2px; }
  footer { margin-top: 10px; font-size: 8.5pt; color: #7a8a94; text-align: center; }
</style></head><body>
<div class="banner">نموذج تجريبي لاختبار منصة عقدي — ليس عقدًا حقيقيًا · SAMPLE FOR TESTING — NOT A REAL CONTRACT</div>
<header>
  <div><h1>عقد إيجار موحد — سكني</h1><p>Unified Residential Lease Contract</p></div>
  <div class="no">رقم سجل العقد / Contract No.<br><b class="ltr">${s.contractNumber}</b></div>
</header>
${section("1", "بيانات العقد", "Contract Data", [
  row("نوع العقد", "جديد", "Contract Type"),
  row("رقم سجل العقد", `<span class="ltr">${s.contractNumber}</span>`, "Contract No."),
  row("تاريخ إبرام العقد", `${hijriPrinted(s.sealedOn)} — ${gregPrinted(s.sealedOn)}`, "Contract Sealing Date"),
  row("تاريخ بداية مدة الإيجار", `${hijriPrinted(s.start)} — ${gregPrinted(s.start)}`, "Tenancy Start Date"),
  row("تاريخ نهاية مدة الإيجار", `${hijriPrinted(s.end)} — ${gregPrinted(s.end)}`, "Tenancy End Date"),
  row("مكان إبرام العقد", "الرياض", "Contract Sealing Location"),
])}
${section("2", "بيانات المؤجر", "Lessor Data", [
  row("الاسم", s.lessor.name, "Name"), row("الجنسية", s.lessor.nationality, "Nationality"),
  row("نوع الهوية", s.lessor.idType, "ID Type"), row("رقم الهوية", `<span class="ltr">${s.lessor.id}</span>`, "ID No."),
  row("رقم الجوال", `<span class="ltr">${s.lessor.mobile}</span>`, "Mobile No."),
])}
${section("3", "بيانات المستأجر", "Tenant Data", [
  row("الاسم", s.tenant.name, "Name"), row("الجنسية", s.tenant.nationality, "Nationality"),
  row("نوع الهوية", s.tenant.idType, "ID Type"), row("رقم الهوية", `<span class="ltr">${s.tenant.id}</span>`, "ID No."),
  row("رقم الجوال", `<span class="ltr">${s.tenant.mobile}</span>`, "Mobile No."),
  row("البريد الإلكتروني", `<span class="ltr">${s.tenant.email}</span>`, "Email"),
])}
${section("4", "بيانات المنشأة العقارية (الوسيط)", "Brokerage Entity Data", [
  row("اسم المنشأة", s.broker.name, "Brokerage Entity Name"), row("رقم السجل التجاري", `<span class="ltr">${s.broker.cr}</span>`, "CR No."),
  row("رقم الهاتف", `<span class="ltr">${s.broker.phone}</span>`, "Phone No."),
])}
${section("5", "بيانات الصك", "Title Deed Data", [
  row("رقم الصك", `<span class="ltr">${s.deed.number}</span>`, "Title Deed No."),
  row("تاريخ الإصدار", arabicDigits(s.deed.date) + " هـ", "Issue Date"), row("جهة الإصدار", s.deed.issuer, "Issuer"),
])}
${section("6", "بيانات العقار", "Property Data", [
  row("العنوان الوطني", `${s.address.city}، حي ${s.address.district}، ${s.address.street}، رقم المبنى ${s.address.building}، الرمز البريدي ${s.address.postal}، الرقم الإضافي ${s.address.additional}`, "National Address"),
  row("المدينة", s.address.city, "City"), row("الحي", s.address.district, "District"),
  row("رقم المبنى", `<span class="ltr">${s.address.building}</span>`, "Building No."),
  row("الرمز البريدي", `<span class="ltr">${s.address.postal}</span>`, "Postal Code"), row("الرقم الإضافي", `<span class="ltr">${s.address.additional}</span>`, "Additional No."),
  row("نوع العقار", s.property.type, "Property Type"), row("استخدام العقار", s.property.use, "Property Usage"),
  row("عدد الطوابق", s.property.floors, "No. of Floors"), row("عدد الوحدات", s.property.units, "No. of Units"),
])}
${section("7", "بيانات الوحدة الإيجارية", "Rental Unit Data", [
  row("نوع الوحدة", s.unit.type, "Unit Type"), row("رقم الوحدة", `<span class="ltr">${s.unit.number}</span>`, "Unit No."),
  row("رقم الطابق", `<span class="ltr">${s.unit.floor}</span>`, "Floor No."), row("مساحة الوحدة (م²)", `<span class="ltr">${s.unit.area}</span>`, "Unit Area (m²)"),
  row("عدد الغرف", s.unit.rooms, "No. of Rooms"), row("حالة التأثيث", s.unit.furnished, "Furnishing Status"),
  row("رقم عداد الكهرباء", `<span class="ltr">${s.unit.electric}</span>`, "Electricity Meter No."), row("رقم عداد المياه", `<span class="ltr">${s.unit.water}</span>`, "Water Meter No."),
])}
${section("8", "البيانات المالية", "Financial Data", [
  row("قيمة الإيجار السنوي", sar(s.annualRent), "Annual Rent"), row("دورية سداد الإيجار", s.cycle.ar, "Rent Payment Cycle"),
  row("عدد دفعات الإيجار", String(pays.length), "No. of Rent Payments"), row("مبلغ الضمان", sar(s.deposit), "Security Deposit"),
  row("إجمالي قيمة العقد", sar(s.annualRent), "Total Contract Value"),
])}
<section><h2><span>9</span> جدول سداد الدفعات <em>Rent Payments Schedule</em></h2>
<table class="pays"><tr><th>رقم الدفعة<br><small>No.</small></th><th>تاريخ الاستحقاق (هجري)<br><small>Due Date (Hijri)</small></th><th>تاريخ الاستحقاق (ميلادي)<br><small>Due Date (Gregorian)</small></th><th>المبلغ<br><small>Amount</small></th></tr>
${pays.map((p) => `<tr><td>${p.number}</td><td>${hijriPrinted(p.due)}</td><td>${gregPrinted(p.due)}</td><td>${sar(p.amount)}</td></tr>`).join("")}
</table></section>
<section class="terms"><h2><span>10</span> التزامات الطرفين (مختصرة) <em>Obligations (summary)</em></h2>
<ol><li>يلتزم المستأجر بسداد الدفعات في مواعيدها المذكورة أعلاه.</li><li>يلتزم المؤجر بتسليم الوحدة صالحة للاستخدام وإجراء الإصلاحات الأساسية.</li><li>لا يجوز للمستأجر التأجير من الباطن دون موافقة خطية من المؤجر.</li></ol></section>
<footer>نموذج تجريبي أُنشئ لاختبار منصة عقدي. جميع الأسماء والأرقام وهمية. · Generated test sample; all names and numbers are made up.</footer>
</body></html>`;
}

mkdirSync(join(here, "expected"), { recursive: true });
for (const s of SAMPLES) {
  const htmlPath = join(here, `${s.file}.tmp.html`);
  writeFileSync(htmlPath, html(s));
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=4000", `--print-to-pdf=${join(here, s.file + ".pdf")}`, "file://" + htmlPath], { stdio: "ignore" });
  if (!process.env.KEEP_HTML) rmSync(htmlPath);
  const expected = {
    contractNumber: s.contractNumber,
    startDateGregorian: s.start, startDateHijri: hijri(s.start),
    endDateGregorian: s.end, endDateHijri: hijri(s.end),
    tenantName: s.tenant.name, tenantNationality: s.tenant.nationality, tenantIdType: s.tenant.idTypeKey,
    tenantIdNumber: s.tenant.id, tenantMobile: s.tenant.mobile,
    propertyCity: s.address.city, propertyDistrict: s.address.district, propertyStreet: s.address.street,
    buildingNumber: s.address.building, postalCode: s.address.postal, additionalNumber: s.address.additional, deedNumber: s.deed.number,
    unitNumber: s.unit.number, unitType: s.unit.type, unitFloor: s.unit.floor, unitArea: s.unit.area,
    annualRent: s.annualRent, paymentCycle: s.cycle.key,
    installments: schedule(s).map((p) => ({ number: p.number, dueDateGregorian: p.due, dueDateHijri: hijri(p.due), amount: p.amount })),
  };
  writeFileSync(join(here, "expected", `${s.file}.json`), JSON.stringify(expected, null, 2) + "\n");
  console.log(`${s.file}.pdf  (${expected.installments.length} payments, Hijri ${expected.startDateHijri} → ${expected.endDateHijri})`);
}
