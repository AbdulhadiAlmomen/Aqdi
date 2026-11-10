// Builds the fake sample contracts: node samples/make-samples.mjs
// Everything in them is made up (people, IDs, phones, deeds, addresses). They follow the section
// order of an Ejar unified residential lease so the import can be tested and demoed without real
// tenant data. They carry a "sample, not a real contract" banner and no Ejar logo, seal or QR code.
// Two Arabic samples (as real Ejar contracts are filled in) and two English ones, so a reader who
// doesn't read Arabic can follow every value through the import.
// Writes public/samples/<name>.pdf (served by the site, printed by Google Chrome headless)
// and samples/expected/<name>.json (the right answers, used by tests and the mock reader).
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pdfDir = join(here, "..", "public", "samples");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SAMPLES = [
  {
    file: "sample-1", lang: "ar", contractNumber: "20512847396", sealedOn: "2026-03-08", start: "2026-03-15", end: "2027-03-14", sealedAt: "الرياض",
    lessor: { name: "خالد بن سعد المطيري", nationality: "سعودي", idType: "هوية وطنية", id: "1045718263", mobile: "0501234870" },
    tenant: { name: "محمد عبدالرحمن العتيبي", nationality: "سعودي", idType: "هوية وطنية", idTypeKey: "national_id", id: "1098234561", mobile: "0552147390", email: "—" },
    broker: { name: "مكتب النور العقاري", cr: "1010987654", phone: "0114567890" },
    deed: { number: "310118045672", date: "1441/07/12", issuer: "كتابة العدل الأولى بالرياض" },
    address: { city: "الرياض", district: "النرجس", street: "شارع الأمير سلطان بن فهد", building: "7421", postal: "13325", additional: "3104" },
    property: { type: "عمارة", use: "سكني عائلي", floors: "4", units: "12" },
    unit: { type: "شقة", number: "3", floor: "1", area: 145, rooms: "4", furnished: "غير مؤثثة", electric: "40091827", water: "77120345" },
    annualRent: 32000, cycle: { label: "نصف سنوي", key: "semi_annual", months: 6 }, deposit: 2000,
  },
  {
    file: "sample-2", lang: "ar", contractNumber: "20519930485", sealedOn: "2026-08-24", start: "2026-09-01", end: "2027-08-31", sealedAt: "الرياض",
    lessor: { name: "شركة الأفق للاستثمار العقاري", nationality: "—", idType: "سجل تجاري", id: "1010456789", mobile: "0114880022" },
    tenant: { name: "أحمد فاروق خان", nationality: "باكستاني", idType: "إقامة", idTypeKey: "iqama", id: "2134876590", mobile: "+966549021175", email: "a.khan.sample@example.test" },
    broker: { name: "مكتب النور العقاري", cr: "1010987654", phone: "0114567890" },
    deed: { number: "410229817305", date: "1443/02/03", issuer: "كتابة العدل الثانية بالرياض" },
    address: { city: "الرياض", district: "الملقا", street: "طريق أنس بن مالك", building: "2968", postal: "13524", additional: "7781" },
    property: { type: "عمارة", use: "سكني عائلي", floors: "3", units: "9" },
    unit: { type: "شقة", number: "12", floor: "3", area: 118.5, rooms: "3", furnished: "مؤثثة جزئيًا", electric: "40552019", water: "77984410" },
    annualRent: 28500, cycle: { label: "ربع سنوي", key: "quarterly", months: 3 }, deposit: 1500,
  },
  {
    file: "sample-en-1", lang: "en", contractNumber: "20517742018", sealedOn: "2026-04-20", start: "2026-05-01", end: "2027-04-30", sealedAt: "Riyadh",
    lessor: { name: "Faisal Nasser Al-Harbi", nationality: "Saudi", idType: "National ID", id: "1067345128", mobile: "0503318820" },
    tenant: { name: "Omar Khalid Al-Shamri", nationality: "Saudi", idType: "National ID", idTypeKey: "national_id", id: "1123456780", mobile: "0558812046", email: "omar.sample@example.test" },
    broker: { name: "Al Noor Real Estate Office", cr: "1010987654", phone: "0114567890" },
    deed: { number: "512340987611", date: "1442/04/18", issuer: "First Notary, Riyadh" },
    address: { city: "Riyadh", district: "Al Yasmin", street: "Abi Bakr As Siddiq Road", building: "8352", postal: "13325", additional: "4417" },
    property: { type: "Residential building", use: "Family residential", floors: "5", units: "15" },
    unit: { type: "Apartment", number: "7", floor: "2", area: 132, rooms: "3", furnished: "Unfurnished", electric: "40228815", water: "77340192" },
    annualRent: 36000, cycle: { label: "Semi-annual", key: "semi_annual", months: 6 }, deposit: 2500,
  },
  {
    file: "sample-en-2", lang: "en", contractNumber: "20518863307", sealedOn: "2026-06-25", start: "2026-07-01", end: "2027-06-30", sealedAt: "Riyadh",
    lessor: { name: "Horizon Real Estate Investment Co.", nationality: "—", idType: "Commercial Registration", id: "1010456789", mobile: "0114880022" },
    tenant: { name: "Rahul Menon", nationality: "Indian", idType: "Iqama", idTypeKey: "iqama", id: "2287613049", mobile: "+966561247730", email: "rahul.sample@example.test" },
    broker: { name: "Al Noor Real Estate Office", cr: "1010987654", phone: "0114567890" },
    deed: { number: "618720345902", date: "1444/09/02", issuer: "Second Notary, Riyadh" },
    address: { city: "Riyadh", district: "Al Malqa", street: "Anas Ibn Malik Road", building: "3071", postal: "13524", additional: "6629" },
    property: { type: "Residential building", use: "Family residential", floors: "4", units: "12" },
    unit: { type: "Apartment", number: "10", floor: "3", area: 104.5, rooms: "2", furnished: "Partly furnished", electric: "40719934", water: "77651208" },
    annualRent: 30000, cycle: { label: "Quarterly", key: "quarterly", months: 3 }, deposit: 1500,
  },
];

// Umm al-Qura, the calendar Ejar uses.
function hijri(iso) {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(new Date(iso + "T00:00:00Z"));
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year").replace(/\D/g, "")}-${get("month")}-${get("day")}`;
}
const arabicDigits = (s) => s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
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

function html(s) {
  const en = s.lang === "en";
  const L = (ar, eng) => (en ? eng : ar);
  const dmy = (iso) => iso.split("-").reverse().join("/");
  const hijriPrinted = (iso) => (en ? `${dmy(hijri(iso))} AH` : `${arabicDigits(dmy(hijri(iso)))} هـ`);
  const gregPrinted = (iso) => (en ? `${dmy(iso)} AD` : `${dmy(iso)} م`);
  const both = (iso) => `${hijriPrinted(iso)} — ${gregPrinted(iso)}`;
  const sar = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2 }) + L(" ريال", " SAR");
  const ltr = (v) => `<span class="ltr">${v}</span>`;
  // Labels: the page's language first, the other one small underneath.
  const row = (ar, value, eng) => `<tr><th>${L(ar, eng)}<small>${L(eng, ar)}</small></th><td>${value}</td></tr>`;
  const section = (n, ar, eng, rows) => `<section><h2><span>${n}</span> ${L(ar, eng)} <em>${L(eng, ar)}</em></h2><table>${rows.join("")}</table></section>`;
  const a = s.address;
  const pays = schedule(s);

  const n = s.file.replace(/\D/g, "");
  return `<!doctype html><html lang="${s.lang}" dir="${en ? "ltr" : "rtl"}"><head><meta charset="utf-8">
<title>${L(`عقد إيجار تجريبي ${n} (ليس حقيقيًا)`, `Sample lease contract ${n} (not real)`)}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  body { font-family: ${en ? '"DM Sans", "Tajawal"' : '"Tajawal"'}, sans-serif; font-size: 10.5pt; color: #1d2a33; margin: 0; }
  .banner { border: 1.5px dashed #b23b2a; color: #b23b2a; text-align: center; padding: 6px; font-weight: 700; margin-bottom: 10px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #1f6f5b; padding-bottom: 8px; margin-bottom: 10px; }
  header h1 { margin: 0; font-size: 17pt; color: #1f6f5b; }
  header p { margin: 2px 0 0; color: #5b6b75; }
  header .no { text-align: end; font-size: 10pt; }
  section { margin-bottom: 9px; break-inside: avoid; }
  h2 { font-size: 11.5pt; margin: 0 0 4px; padding: 4px 8px; background: #e8f2ef; color: #1f6f5b; border-radius: 4px; }
  h2 span { display: inline-block; min-width: 18px; } h2 em { font-style: normal; font-weight: 400; color: #5b6b75; font-size: 9.5pt; margin-inline-start: 6px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d5dde1; padding: 4px 8px; text-align: start; vertical-align: top; }
  th { width: 38%; background: #f6f8f9; font-weight: 500; } th small { display: block; color: #7a8a94; font-weight: 400; font-size: 8.5pt; }
  .ltr { direction: ltr; unicode-bidi: isolate; display: inline-block; }
  .pays th { width: auto; text-align: center; } .pays td { text-align: center; }
  .terms { font-size: 9pt; color: #44525b; } .terms li { margin-bottom: 2px; }
  footer { margin-top: 10px; font-size: 8.5pt; color: #7a8a94; text-align: center; }
</style></head><body>
<div class="banner">${L("نموذج تجريبي لاختبار منصة عقدي — ليس عقدًا حقيقيًا · SAMPLE FOR TESTING — NOT A REAL CONTRACT", "SAMPLE FOR TESTING — NOT A REAL CONTRACT · نموذج تجريبي لاختبار منصة عقدي — ليس عقدًا حقيقيًا")}</div>
<header>
  <div><h1>${L("عقد إيجار موحد — سكني", "Unified Residential Lease Contract")}</h1><p>${L("Unified Residential Lease Contract", "عقد إيجار موحد — سكني")}</p></div>
  <div class="no">${L("رقم سجل العقد / Contract No.", "Contract No. / رقم سجل العقد")}<br><b class="ltr">${s.contractNumber}</b></div>
</header>
${section("1", "بيانات العقد", "Contract Data", [
  row("نوع العقد", L("جديد", "New"), "Contract Type"),
  row("رقم سجل العقد", ltr(s.contractNumber), "Contract No."),
  row("تاريخ إبرام العقد", both(s.sealedOn), "Contract Sealing Date"),
  row("تاريخ بداية مدة الإيجار", both(s.start), "Tenancy Start Date"),
  row("تاريخ نهاية مدة الإيجار", both(s.end), "Tenancy End Date"),
  row("مكان إبرام العقد", s.sealedAt, "Contract Sealing Location"),
])}
${section("2", "بيانات المؤجر", "Lessor Data", [
  row("الاسم", s.lessor.name, "Name"), row("الجنسية", s.lessor.nationality, "Nationality"),
  row("نوع الهوية", s.lessor.idType, "ID Type"), row("رقم الهوية", ltr(s.lessor.id), "ID No."),
  row("رقم الجوال", ltr(s.lessor.mobile), "Mobile No."),
])}
${section("3", "بيانات المستأجر", "Tenant Data", [
  row("الاسم", s.tenant.name, "Name"), row("الجنسية", s.tenant.nationality, "Nationality"),
  row("نوع الهوية", s.tenant.idType, "ID Type"), row("رقم الهوية", ltr(s.tenant.id), "ID No."),
  row("رقم الجوال", ltr(s.tenant.mobile), "Mobile No."),
  row("البريد الإلكتروني", ltr(s.tenant.email), "Email"),
])}
${section("4", "بيانات المنشأة العقارية (الوسيط)", "Brokerage Entity Data", [
  row("اسم المنشأة", s.broker.name, "Brokerage Entity Name"), row("رقم السجل التجاري", ltr(s.broker.cr), "CR No."),
  row("رقم الهاتف", ltr(s.broker.phone), "Phone No."),
])}
${section("5", "بيانات الصك", "Title Deed Data", [
  row("رقم الصك", ltr(s.deed.number), "Title Deed No."),
  row("تاريخ الإصدار", L(arabicDigits(s.deed.date) + " هـ", s.deed.date.split("/").reverse().join("/") + " AH"), "Issue Date"),
  row("جهة الإصدار", s.deed.issuer, "Issuer"),
])}
${section("6", "بيانات العقار", "Property Data", [
  row("العنوان الوطني", L(
    `${a.city}، حي ${a.district}، ${a.street}، رقم المبنى ${a.building}، الرمز البريدي ${a.postal}، الرقم الإضافي ${a.additional}`,
    `Building ${a.building}, ${a.street}, ${a.district} District, ${a.city} ${a.postal}, Additional No. ${a.additional}`,
  ), "National Address"),
  row("المدينة", a.city, "City"), row("الحي", a.district, "District"), row("الشارع", a.street, "Street"),
  row("رقم المبنى", ltr(a.building), "Building No."),
  row("الرمز البريدي", ltr(a.postal), "Postal Code"), row("الرقم الإضافي", ltr(a.additional), "Additional No."),
  row("نوع العقار", s.property.type, "Property Type"), row("استخدام العقار", s.property.use, "Property Usage"),
  row("عدد الطوابق", s.property.floors, "No. of Floors"), row("عدد الوحدات", s.property.units, "No. of Units"),
])}
${section("7", "بيانات الوحدة الإيجارية", "Rental Unit Data", [
  row("نوع الوحدة", s.unit.type, "Unit Type"), row("رقم الوحدة", ltr(s.unit.number), "Unit No."),
  row("رقم الطابق", ltr(s.unit.floor), "Floor No."), row("مساحة الوحدة (م²)", ltr(s.unit.area), "Unit Area (m²)"),
  row("عدد الغرف", s.unit.rooms, "No. of Rooms"), row("حالة التأثيث", s.unit.furnished, "Furnishing Status"),
  row("رقم عداد الكهرباء", ltr(s.unit.electric), "Electricity Meter No."), row("رقم عداد المياه", ltr(s.unit.water), "Water Meter No."),
])}
${section("8", "البيانات المالية", "Financial Data", [
  row("قيمة الإيجار السنوي", sar(s.annualRent), "Annual Rent"), row("دورية سداد الإيجار", s.cycle.label, "Rent Payment Cycle"),
  row("عدد دفعات الإيجار", String(pays.length), "No. of Rent Payments"), row("مبلغ الضمان", sar(s.deposit), "Security Deposit"),
  row("إجمالي قيمة العقد", sar(s.annualRent), "Total Contract Value"),
])}
<section><h2><span>9</span> ${L("جدول سداد الدفعات", "Rent Payments Schedule")} <em>${L("Rent Payments Schedule", "جدول سداد الدفعات")}</em></h2>
<table class="pays"><tr>
  <th>${L("رقم الدفعة", "No.")}<br><small>${L("No.", "رقم الدفعة")}</small></th>
  <th>${L("تاريخ الاستحقاق (هجري)", "Due Date (Hijri)")}<br><small>${L("Due Date (Hijri)", "تاريخ الاستحقاق (هجري)")}</small></th>
  <th>${L("تاريخ الاستحقاق (ميلادي)", "Due Date (Gregorian)")}<br><small>${L("Due Date (Gregorian)", "تاريخ الاستحقاق (ميلادي)")}</small></th>
  <th>${L("المبلغ", "Amount")}<br><small>${L("Amount", "المبلغ")}</small></th></tr>
${pays.map((p) => `<tr><td>${p.number}</td><td>${hijriPrinted(p.due)}</td><td>${gregPrinted(p.due)}</td><td>${sar(p.amount)}</td></tr>`).join("")}
</table></section>
<section class="terms"><h2><span>10</span> ${L("التزامات الطرفين (مختصرة)", "Obligations (summary)")} <em>${L("Obligations (summary)", "التزامات الطرفين (مختصرة)")}</em></h2>
<ol>${(en
    ? ["The tenant pays each rent payment on the due dates listed above.", "The lessor hands over the unit fit for use and carries out essential repairs.", "The tenant may not sublet the unit without the lessor's written consent."]
    : ["يلتزم المستأجر بسداد الدفعات في مواعيدها المذكورة أعلاه.", "يلتزم المؤجر بتسليم الوحدة صالحة للاستخدام وإجراء الإصلاحات الأساسية.", "لا يجوز للمستأجر التأجير من الباطن دون موافقة خطية من المؤجر."]
  ).map((t) => `<li>${t}</li>`).join("")}</ol></section>
<footer>${L("نموذج تجريبي أُنشئ لاختبار منصة عقدي. جميع الأسماء والأرقام وهمية. · Generated test sample; all names and numbers are made up.", "Generated test sample for Aqdi; all names and numbers are made up. · نموذج تجريبي، جميع الأسماء والأرقام وهمية.")}</footer>
</body></html>`;
}

mkdirSync(join(here, "expected"), { recursive: true });
mkdirSync(pdfDir, { recursive: true });
for (const s of SAMPLES) {
  const htmlPath = join(here, `${s.file}.tmp.html`);
  writeFileSync(htmlPath, html(s));
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=4000", `--print-to-pdf=${join(pdfDir, s.file + ".pdf")}`, "file://" + htmlPath], { stdio: "ignore" });
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
  console.log(`public/samples/${s.file}.pdf  (${s.lang}, ${expected.installments.length} payments, Hijri ${expected.startDateHijri} → ${expected.endDateHijri})`);
}
