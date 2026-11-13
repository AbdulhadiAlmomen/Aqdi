// Homepage markup. The message follows docs/WEBSITE_MESSAGE.md (v3): one office, three people
// (tenant, staff, manager). Copy is inline in both languages; CSS shows the one matching <html lang>.
// Mockups are drawn in HTML/CSS. Their motion plays once (class "play", added by home-script.js);
// without it, or with reduced motion, every mockup shows its finished state.
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { T } from "@/lib/i18n";

// One piece of text in both languages.
function L({ ar, en }: { ar: ReactNode; en: ReactNode }) {
  return (
    <>
      <span lang="ar">{ar}</span>
      <span lang="en">{en}</span>
    </>
  );
}

const LOGO_WAVES = (
  <svg viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="var(--palm)"></rect>
    <g className="waves" fill="none" stroke="#f5f3ec" strokeWidth="3.6" strokeLinecap="round">
      <path pathLength="1" d="M11 22 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
      <path pathLength="1" d="M11 33 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
      <path pathLength="1" d="M11 44 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0"></path>
    </g>
  </svg>
);

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5"></path>
  </svg>
);

const RECEIPT = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"></path>
    <path d="M9 8h6M9 12h6M9 16h3"></path>
  </svg>
);

const AC_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="8" rx="2"></rect>
    <path d="M7 10h10M8 16l-1 3M12 16v3M16 16l1 3"></path>
  </svg>
);

export function HomeMarkup() {
  return (
    <>
      <nav id="nav">
        <div className="wrap">
          <a href="#" className="logo" aria-label="Aqdi">
            <span className="logo-mark" aria-hidden="true">{LOGO_WAVES}</span>
            {" "}
            <L ar="عقدي" en="Aqdi" />
          </a>
          <div className="nav-links" id="nav-links">
            <span className="nav-pill" id="nav-pill" aria-hidden="true"></span>
            <a href="#import" data-nav="import"><L ar="الاستيراد" en="Import" /></a>
            <a href="#tenants" data-nav="tenants"><L ar="المستأجرون" en="Tenants" /></a>
            <a href="#team" data-nav="team"><L ar="الفريق" en="Team" /></a>
            <a href="#owner" data-nav="owner"><L ar="المدير" en="Manager" /></a>
            <a href="#pricing" data-nav="pricing"><L ar="الأسعار" en="Pricing" /></a>
          </div>
          <div className="nav-actions">
            <button className="btn btn-quiet" id="lang-toggle" type="button">
              <span lang="ar">English</span>
              <span lang="en">العربية</span>
            </button>
            <Link href="/login" className="btn btn-text nav-login">
              <T k="nav.login" />
            </Link>
            <Link href="/signup" className="btn btn-primary">
              <T k="nav.start" />
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <div className="wrap">
          <header className="hero">
            <div>
              <h1 data-split="">
                <span lang="ar">المستأجر، الموظف، والمدير… في مكان واحد.</span>
                {" "}
                <span lang="en">Tenant, staff and manager, in one place.</span>
              </h1>
              <p className="lede">
                <L
                  ar="تواصل، صيانة، مهام، وتكاليف، كل شي واضح ومسجّل. ارفع عقود إيجار، وعقدي يتكفّل بالباقي."
                  en="Communication, maintenance, tasks and costs, everything clear and logged. Upload your Ejar contracts, and Aqdi takes care of the rest."
                />
              </p>
              <div className="cta-row">
                <Link href="/signup" className="btn btn-primary">
                  <L ar="ابدأ الآن" en="Start now" />
                  {" "}
                  <span className="arrow" aria-hidden="true">
                    <L ar="←" en="→" />
                  </span>
                </Link>
                <Link href="/login" className="btn btn-quiet">
                  <L ar="تسجيل الدخول" en="Log in" />
                </Link>
              </div>
            </div>

            {/* One maintenance job, seen by all three people: the tenant sends it, the employee does it,
                the manager sees the cost logged. */}
            <div className="stage hv" id="hero-stage" role="img" aria-label="A tenant's repair request on a phone, the same job on an employee's task list, and the manager's dashboard with the cost logged">
              <div className="arch" aria-hidden="true"></div>
              <div className="hv-grid" aria-hidden="true">
                <div className="hv-tenant">
                  <span className="hv-label"><L ar="المستأجر" en="Tenant" /></span>
                  <div className="hv-phone">
                    <div className="hv-screen">
                      <div className="hv-app">
                        <b><L ar="مكتب النور العقاري" en="Al Noor Real Estate" /></b>
                        <small><L ar="وحدة 4، مبنى ج" en="Unit 4, Building C" /></small>
                      </div>
                      <p className="hv-screen-title"><L ar="طلب صيانة" en="Repair request" /></p>
                      <div className="hv-req">
                        <span className="hv-ic">{AC_ICON}</span>
                        <b><L ar="المكيف لا يبرّد" en="AC not cooling" /></b>
                        <span className="hv-photo"><i></i></span>
                        <small><L ar="صورة مرفقة" en="Photo attached" /></small>
                      </div>
                      <div className="hv-send">
                        <span className="hv-send-a"><L ar="إرسال الطلب" en="Send request" /></span>
                        <span className="hv-send-b">{CHECK}<L ar="تم الإرسال" en="Sent" /></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hv-side">
                  <div className="hv-card hv-staff">
                    <span className="hv-label"><L ar="الموظف" en="Staff" /></span>
                    <div className="hv-head">
                      <b><L ar="مهامي اليوم" en="My tasks today" /></b>
                      <small><L ar="فيصل · فني صيانة" en="Faisal · technician" /></small>
                    </div>
                    <ul className="hv-tasks">
                      <li className="hv-job">
                        <span>
                          <L ar="المكيف، وحدة 4، مبنى ج" en="AC, Unit 4, Building C" />
                          <small><L ar="طلب من المستأجر" en="Tenant request" /></small>
                        </span>
                        <span className="hv-st">
                          <i className="st-new"><L ar="جديد" en="New" /></i>
                          <i className="st-prog"><L ar="قيد التنفيذ" en="In progress" /></i>
                          <i className="st-done">{CHECK}<L ar="تم" en="Done" /></i>
                        </span>
                      </li>
                      <li>
                        <span><L ar="فحص وحدة 7، مبنى أ" en="Inspection, Unit 7, Building A" /></span>
                        <span className="pill pill-wait"><L ar="اليوم" en="Today" /></span>
                      </li>
                    </ul>
                  </div>
                  <div className="hv-card hv-dash">
                    <span className="hv-label"><L ar="المدير" en="Manager" /></span>
                    <div className="hv-head">
                      <b><L ar="مكتب النور العقاري" en="Al Noor Real Estate" /></b>
                      <small data-date="0"></small>
                    </div>
                    <div className="hv-stats">
                      <div>
                        <b data-sar="186500"></b>
                        <small><L ar="الإيجار المتوقع هذا الشهر" en="Expected rent this month" /></small>
                      </div>
                      <div>
                        <b>4</b>
                        <small><L ar="مهام مفتوحة" en="Open tasks" /></small>
                      </div>
                    </div>
                    <div className="hv-cost">
                      <span className="hv-ic">{RECEIPT}</span>
                      <span>
                        <L ar="تكلفة مسجّلة: صيانة المكيف، وحدة 4" en="Cost logged: AC repair, Unit 4" />
                        <small><L ar="فيصل · إيصال مرفق" en="Faisal · receipt attached" /></small>
                      </span>
                      <b data-sar="350"></b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
        {/* 1. Ready in minutes: AI Ejar import (the graded AI feature, kept prominent). */}
        <section id="import">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">جاهز خلال دقائق</span>
                {" "}
                <span lang="en">Ready in minutes</span>
              </h2>
              <p data-reveal="">
                <L
                  ar="ارفع عقودك من إيجار، والذكاء الاصطناعي يجهّز المباني والوحدات والمستأجرين وتواريخ العقود، وأنت تراجع أي معلومة لم يتأكد منها."
                  en="Upload your Ejar contracts. AI sets up buildings, units, tenants and contract dates, and you review anything it isn&apos;t sure about."
                />
              </p>
            </div>
            <div className="story" data-story="">
              <div className="story-stage-wrap">
                <div className="stage-frame">
                  <div className="stage-card" data-stage="" data-step="1" aria-hidden="true">
                    <div className="scene scene-1">
                      <div className="scene-title">
                        <b>
                          <span lang="ar">رفع العقود</span>
                          <span lang="en">Upload contracts</span>
                        </b>
                      </div>
                      <div className="up-drop">
                        <span className="up-ic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 16V4M6.5 9.5 12 4l5.5 5.5"></path>
                            <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"></path>
                          </svg>
                        </span>
                        {" "}
                        <span>
                          <span lang="ar">اسحب ملفات PDF من منصة إيجار هنا، أو اخترها من جهازك.</span>
                          <span lang="en">Drop your Ejar PDFs here, or choose them from your computer.</span>
                        </span>
                      </div>
                      <div className="files">
                        <div className="file" style={{ "--i": 0 } as CSSProperties}>
                          <span className="fi">PDF</span>
                          <span className="fname">
                            ejar-contract-1042.pdf
                            <span className="bar">
                              <i></i>
                            </span>
                          </span>
                          <span className="ok">✓</span>
                        </div>
                        <div className="file" style={{ "--i": 1 } as CSSProperties}>
                          <span className="fi">PDF</span>
                          <span className="fname">
                            ejar-contract-1043.pdf
                            <span className="bar">
                              <i></i>
                            </span>
                          </span>
                          <span className="ok">✓</span>
                        </div>
                        <div className="file" style={{ "--i": 2 } as CSSProperties}>
                          <span className="fi">PDF</span>
                          <span className="fname">
                            ejar-contract-1057.pdf
                            <span className="bar">
                              <i></i>
                            </span>
                          </span>
                          <span className="ok">✓</span>
                        </div>
                        <div className="file" style={{ "--i": 3 } as CSSProperties}>
                          <span className="fi">PDF</span>
                          <span className="fname">
                            ejar-contract-1061.pdf
                            <span className="bar">
                              <i></i>
                            </span>
                          </span>
                          <span className="ok">✓</span>
                        </div>
                      </div>
                      <div className="up-done">
                        <span className="tag green">
                          ✓
                          {" "}
                          <span lang="ar">تم رفع 4 عقود</span>
                          <span lang="en">4 contracts uploaded</span>
                        </span>
                      </div>
                    </div>
                    <div className="scene scene-2">
                      <div className="scene-title">
                        <b>
                          <span lang="ar">قراءة العقود</span>
                          <span lang="en">Reading contracts</span>
                        </b>
                        {" "}
                        <span className="tag">
                          <span lang="ar">جارٍ القراءة</span>
                          <span lang="en">Reading</span>
                          <span className="dots-anim">
                            <i></i>
                            <i></i>
                            <i></i>
                          </span>
                        </span>
                      </div>
                      <div className="read">
                        <div className="doc">
                          <b>
                            <span lang="ar">عقد إيجار سكني</span>
                            <span lang="en">Residential lease</span>
                          </b>
                          {" "}
                          <span className="ln m"></span>
                          <span className="ln s"></span>
                          {" "}
                          <span className="sec"></span>
                          <span className="ln"></span>
                          <span className="ln m"></span>
                          <span className="ln s"></span>
                          {" "}
                          <span className="sec"></span>
                          <span className="ln"></span>
                          <span className="ln s"></span>
                          <span className="ln m"></span>
                          <span className="ln"></span>
                          {" "}
                          <span className="sec"></span>
                          <span className="ln m"></span>
                          <span className="ln s"></span>
                          {" "}
                          <span className="scan"></span>
                        </div>
                        <div className="fields">
                          <div className="fld" style={{ "--i": 0 } as CSSProperties}>
                            <span>
                              <span lang="ar">المستأجر</span>
                              <span lang="en">Tenant</span>
                            </span>
                            <b>
                              <span lang="ar">محمد العتيبي</span>
                              <span lang="en">Mohammed Alotaibi</span>
                            </b>
                          </div>
                          <div className="fld" style={{ "--i": 1 } as CSSProperties}>
                            <span>
                              <span lang="ar">الهوية / الإقامة</span>
                              <span lang="en">National ID / Iqama</span>
                            </span>
                            <b>
                              <bdi dir="ltr">••••••4561</bdi>
                            </b>
                          </div>
                          <div className="fld" style={{ "--i": 2 } as CSSProperties}>
                            <span>
                              <span lang="ar">الجوال</span>
                              <span lang="en">Phone</span>
                            </span>
                            <b>
                              <bdi dir="ltr">055 214 7390</bdi>
                            </b>
                          </div>
                          <div className="fld" style={{ "--i": 3 } as CSSProperties}>
                            <span>
                              <span lang="ar">الوحدة</span>
                              <span lang="en">Unit</span>
                            </span>
                            <b>
                              <span lang="ar">وحدة 3، مبنى أ</span>
                              <span lang="en">Unit 3, Bldg A</span>
                            </b>
                          </div>
                          <div className="fld" style={{ "--i": 4 } as CSSProperties}>
                            <span>
                              <span lang="ar">نهاية العقد</span>
                              <span lang="en">Lease ends</span>
                            </span>
                            <b data-iso="2027-03-14"></b>
                          </div>
                          <div className="fld" style={{ "--i": 5 } as CSSProperties}>
                            <span>
                              <span lang="ar">الإيجار السنوي</span>
                              <span lang="en">Yearly rent</span>
                            </span>
                            <b data-sar="32000"></b>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="scene scene-3">
                      <div className="rv-top">
                        <div>
                          <div className="mock-title">
                            <span lang="ar">مراجعة العقود المستوردة</span>
                            <span lang="en">Review imported leases</span>
                          </div>
                          <div className="mock-sub morph">
                            <span className="m-a">
                              <span lang="ar">4 عقود · حقل واحد يحتاج تأكيدك</span>
                              <span lang="en">4 leases · 1 field needs your check</span>
                            </span>
                            {" "}
                            <span className="m-b">
                              <span lang="ar">4 عقود · كل الحقول مؤكدة</span>
                              <span lang="en">4 leases · all fields confirmed</span>
                            </span>
                          </div>
                        </div>
                        <span className="btn btn-primary fake-btn">
                          <span lang="ar">تأكيد وحفظ</span>
                          <span lang="en">Confirm and save</span>
                        </span>
                      </div>
                      <div className="rvt">
                        <div className="r h">
                          <span>
                            <span lang="ar">المستأجر</span>
                            <span lang="en">Tenant</span>
                          </span>
                          {" "}
                          <span>
                            <span lang="ar">الهوية / الإقامة</span>
                            <span lang="en">National ID / Iqama</span>
                          </span>
                          {" "}
                          <span>
                            <span lang="ar">الجوال</span>
                            <span lang="en">Phone</span>
                          </span>
                          {" "}
                          <span>
                            <span lang="ar">نهاية العقد</span>
                            <span lang="en">Lease ends</span>
                          </span>
                          {" "}
                          <span>
                            <span lang="ar">الإيجار السنوي</span>
                            <span lang="en">Yearly rent</span>
                          </span>
                        </div>
                        <div className="r" style={{ "--i": 0 } as CSSProperties}>
                          <span className="c-name">
                            <span lang="ar">محمد العتيبي</span>
                            <span lang="en">Mohammed Alotaibi</span>
                            <small>
                              <span lang="ar">وحدة 3، مبنى أ</span>
                              <span lang="en">Unit 3, Bldg A</span>
                            </small>
                          </span>
                          {" "}
                          <span className="c-id">
                            <bdi dir="ltr">••••••4561</bdi>
                          </span>
                          {" "}
                          <span className="c-ph">
                            <bdi dir="ltr">055 214 7390</bdi>
                          </span>
                          {" "}
                          <span className="c-end" data-iso="2027-03-14"></span>
                          {" "}
                          <span className="c-rent" data-sar="32000"></span>
                        </div>
                        <div className="r" style={{ "--i": 1 } as CSSProperties}>
                          <span className="c-name">
                            <span lang="ar">سارة القحطاني</span>
                            <span lang="en">Sara Alqahtani</span>
                            <small>
                              <span lang="ar">وحدة 7، مبنى أ</span>
                              <span lang="en">Unit 7, Bldg A</span>
                            </small>
                          </span>
                          {" "}
                          <span className="c-id">
                            <bdi dir="ltr">••••••7380</bdi>
                          </span>
                          {" "}
                          <span className="c-ph">
                            <bdi dir="ltr">050 381 6624</bdi>
                          </span>
                          {" "}
                          <span className="c-end" data-iso="2027-06-30"></span>
                          {" "}
                          <span className="c-rent" data-sar="28500"></span>
                        </div>
                        <div className="r" style={{ "--i": 2 } as CSSProperties}>
                          <span className="c-name">
                            <span lang="ar">فهد الدوسري</span>
                            <span lang="en">Fahad Aldosari</span>
                            <small>
                              <span lang="ar">وحدة 12، مبنى ب</span>
                              <span lang="en">Unit 12, Bldg B</span>
                            </small>
                          </span>
                          {" "}
                          <span className="c-id">
                            <bdi dir="ltr">••••••6590</bdi>
                          </span>
                          {" "}
                          <span className="c-ph">
                            <bdi dir="ltr">054 902 1175</bdi>
                          </span>
                          {" "}
                          <span className="c-end" data-iso="2027-01-09"></span>
                          {" "}
                          <span className="c-rent">
                            <span className="confirm">
                              <span data-sar="24000"></span>
                              <small className="morph">
                                <span className="m-a">
                                  <span lang="ar">يرجى التأكيد</span>
                                  <span lang="en">Please confirm</span>
                                </span>
                                <span className="m-b">
                                  <span lang="ar">تم التأكيد ✓</span>
                                  <span lang="en">Confirmed ✓</span>
                                </span>
                              </small>
                              <span className="ripple"></span>
                              <span className="cursor">
                                <svg viewBox="0 0 24 24">
                                  <path d="M5 3l14 8-6 1.5L10 19z" fill="#26201d" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"></path>
                                </svg>
                              </span>
                            </span>
                          </span>
                        </div>
                        <div className="r" style={{ "--i": 3 } as CSSProperties}>
                          <span className="c-name">
                            <span lang="ar">نورة الشهري</span>
                            <span lang="en">Noura Alshehri</span>
                            <small>
                              <span lang="ar">وحدة 2، مبنى ج</span>
                              <span lang="en">Unit 2, Bldg C</span>
                            </small>
                          </span>
                          {" "}
                          <span className="c-id">
                            <bdi dir="ltr">••••••8764</bdi>
                          </span>
                          {" "}
                          <span className="c-ph">
                            <bdi dir="ltr">056 447 2038</bdi>
                          </span>
                          {" "}
                          <span className="c-end" data-iso="2027-09-21"></span>
                          {" "}
                          <span className="c-rent" data-sar="30000"></span>
                        </div>
                      </div>
                    </div>
                    <div className="scene scene-4">
                      <div className="live-head">
                        <svg className="big-check" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r="26"></circle>
                          <path pathLength="1" d="M16 27l7 7 13-15"></path>
                        </svg>
                        <div>
                          <b>
                            <span lang="ar">مكتبك جاهز</span>
                            <span lang="en">Your office is ready</span>
                          </b>
                          {" "}
                          <span className="mock-sub">
                            <span lang="ar">3 مباني · 4 وحدات · 4 عقود</span>
                            <span lang="en">3 buildings · 4 units · 4 leases</span>
                          </span>
                        </div>
                      </div>
                      <div className="invites">
                        <div className="inv" style={{ "--i": 0 } as CSSProperties}>
                          <span className="avatar">
                            <span lang="ar">م</span>
                            <span lang="en">M</span>
                          </span>
                          <span className="who">
                            <span lang="ar">محمد العتيبي</span>
                            <span lang="en">Mohammed Alotaibi</span>
                            <small>
                              <bdi dir="ltr">055 214 7390</bdi>
                            </small>
                          </span>
                          <span className="ticks">
                            <svg viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 6.5l3.5 3.5L11 2.5M7.5 10l.5.5L16 2.5"></path>
                            </svg>
                            <span lang="ar">أُرسلت الدعوة</span>
                            <span lang="en">Invite sent</span>
                          </span>
                        </div>
                        <div className="inv" style={{ "--i": 1 } as CSSProperties}>
                          <span className="avatar">
                            <span lang="ar">س</span>
                            <span lang="en">S</span>
                          </span>
                          <span className="who">
                            <span lang="ar">سارة القحطاني</span>
                            <span lang="en">Sara Alqahtani</span>
                            <small>
                              <bdi dir="ltr">050 381 6624</bdi>
                            </small>
                          </span>
                          <span className="ticks">
                            <svg viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 6.5l3.5 3.5L11 2.5M7.5 10l.5.5L16 2.5"></path>
                            </svg>
                            <span lang="ar">أُرسلت الدعوة</span>
                            <span lang="en">Invite sent</span>
                          </span>
                        </div>
                        <div className="inv" style={{ "--i": 2 } as CSSProperties}>
                          <span className="avatar">
                            <span lang="ar">ف</span>
                            <span lang="en">F</span>
                          </span>
                          <span className="who">
                            <span lang="ar">فهد الدوسري</span>
                            <span lang="en">Fahad Aldosari</span>
                            <small>
                              <bdi dir="ltr">054 902 1175</bdi>
                            </small>
                          </span>
                          <span className="ticks">
                            <svg viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 6.5l3.5 3.5L11 2.5M7.5 10l.5.5L16 2.5"></path>
                            </svg>
                            <span lang="ar">أُرسلت الدعوة</span>
                            <span lang="en">Invite sent</span>
                          </span>
                        </div>
                        <div className="inv" style={{ "--i": 3 } as CSSProperties}>
                          <span className="avatar">
                            <span lang="ar">ن</span>
                            <span lang="en">N</span>
                          </span>
                          <span className="who">
                            <span lang="ar">نورة الشهري</span>
                            <span lang="en">Noura Alshehri</span>
                            <small>
                              <bdi dir="ltr">056 447 2038</bdi>
                            </small>
                          </span>
                          <span className="ticks">
                            <svg viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 6.5l3.5 3.5L11 2.5M7.5 10l.5.5L16 2.5"></path>
                            </svg>
                            <span lang="ar">أُرسلت الدعوة</span>
                            <span lang="en">Invite sent</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="stage-dots" aria-hidden="true">
                  <i className="on"></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
              <div className="story-steps">
                <span className="rail" aria-hidden="true">
                  <span className="rail-fill"></span>
                </span>
                <div className="step active" data-step="1">
                  <span className="step-num">1</span>
                  <h3>
                    <span lang="ar">ارفع عقودك</span>
                    <span lang="en">Upload your contracts</span>
                  </h3>
                  <p>
                    <span lang="ar">اسحب ملفات عقودك من منصة إيجار دفعة واحدة، سواء كانت عقدًا واحدًا أو مئات العقود.</span>
                    <span lang="en">Drag in your Ejar contract PDFs all at once, whether it&apos;s one or a few hundred.</span>
                  </p>
                </div>
                <div className="step" data-step="2">
                  <span className="step-num">2</span>
                  <h3>
                    <span lang="ar">عقدي يقرأ كل عقد</span>
                    <span lang="en">Aqdi reads every contract</span>
                  </h3>
                  <p>
                    <span lang="ar">يستخرج اسم المستأجر وهويته وجواله، والوحدة والتواريخ ومبلغ الإيجار، ويرتّبها حسب المبنى والوحدة.</span>
                    <span lang="en">It pulls out the tenant&apos;s name, ID and phone, plus the unit, dates and rent, and sorts everything by building and unit.</span>
                  </p>
                </div>
                <div className="step" data-step="3">
                  <span className="step-num">3</span>
                  <h3>
                    <span lang="ar">أنت تؤكد</span>
                    <span lang="en">You confirm</span>
                  </h3>
                  <p>
                    <span lang="ar">أي معلومة لم يتأكد منها عقدي تظهر مظللة. تراجعها وتوافق، ولا نحفظ أي شيء قبل موافقتك.</span>
                    <span lang="en">Anything Aqdi isn&apos;t sure of is highlighted. You check it and approve, and nothing is saved until you do.</span>
                  </p>
                </div>
                <div className="step" data-step="4">
                  <span className="step-num">4</span>
                  <h3>
                    <span lang="ar">مكتبك جاهز</span>
                    <span lang="en">Your office is ready</span>
                  </h3>
                  <p>
                    <span lang="ar">تظهر مبانيك ووحداتك وعقودك في لوحة واحدة، ويصبح مكتبك جاهزًا لفريقك ومستأجريك.</span>
                    <span lang="en">Your buildings, units and leases appear in one dashboard, ready for your team and your tenants.</span>
                  </p>
                </div>
              </div>
            </div>
            <p className="import-note" data-reveal="">
              <span lang="ar">
                إدخال 150 عقدًا يدويًا يأخذ أيامًا.
                {" "}
                <strong>مع عقدي، يكفي رفعها مرة واحدة.</strong>
              </span>
              <span lang="en">
                Moving 150 leases by hand takes days.
                {" "}
                <strong>With Aqdi it takes one upload.</strong>
              </span>
            </p>
          </div>
        </section>
        {/* 2. Your tenants */}
        <section id="tenants" className="tinted">
          <div className="wrap person">
            <div className="person-text">
              <span className="eyebrow"><L ar="مستأجروك" en="Your tenants" /></span>
              <h2 data-split="">
                <span lang="ar">هل تصل لكل مستأجر؟ وهل من السهل أن تعلن عن صيانة أو فحص أو دوام رمضان؟</span>
                {" "}
                <span lang="en">Are you reaching every tenant? Is it easy to announce maintenance, inspections or Ramadan hours?</span>
              </h2>
              <p className="answer" data-reveal="">
                <L
                  ar="إعلان واحد يصل لمبنى واحد أو لكل المباني. والمستأجر يرسل طلباته وشكاويه، ويقيّم المكتب ويجيب على استبيانات قصيرة، فيسمعه المكتب."
                  en="One announcement reaches a building or all buildings. Tenants send requests and complaints, rate the office and answer short surveys, so the office hears them."
                />
              </p>
              <p className="aside" data-reveal="">
                <L ar="وأيضًا: قوائم انتظار للمواقف ولتنازل العقود." en="Also: waitlists for parking and lease takeover." />
              </p>
            </div>
            <div className="mk mk-announce" data-play="" data-reveal="" aria-hidden="true">
              <div className="mk-head">
                <b><L ar="إعلان جديد" en="New announcement" /></b>
              </div>
              <div className="mk-to">
                <span className="mk-to-label"><L ar="إلى" en="To" /></span>
                <span className="chip chip-on"><L ar="مبنى أ" en="Building A" /></span>
                <span className="chip"><L ar="كل المباني" en="All buildings" /></span>
              </div>
              <div className="mk-msg">
                <L
                  ar="صيانة خزان المياه يوم الخميس من 10 صباحًا إلى 12 ظهرًا. نعتذر عن الإزعاج."
                  en="Water tank maintenance on Thursday, 10 am to 12 pm. Sorry for the inconvenience."
                />
              </div>
              <div className="mk-sendrow">
                <span className="mk-btn">
                  <span className="mk-btn-a"><L ar="إرسال" en="Send" /></span>
                  <span className="mk-btn-b">{CHECK}<L ar="تم الإرسال" en="Sent" /></span>
                </span>
                <span className="mk-reach"><L ar="وصل إلى 24 مستأجرًا في مبنى أ" en="Reached 24 tenants in Building A" /></span>
              </div>
              <ul className="mk-units">
                {["101", "102", "103", "201", "202", "203", "301", "302"].map((u, i) => (
                  <li key={u} style={{ "--i": i } as CSSProperties}>
                    {u}
                    {CHECK}
                  </li>
                ))}
              </ul>
              <div className="mk-reply">
                <span className="mk-avatar">S</span>
                <span>
                  <L ar="سارة، وحدة 202" en="Sara, Unit 202" />
                  <small><L ar="قيّمت المكتب ★★★★★ · شكرًا على التنبيه" en="Rated the office ★★★★★ · Thanks for the notice" /></small>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Your team */}
        <section id="team">
          <div className="wrap">
            <div className="person-text person-wide">
              <span className="eyebrow"><L ar="فريقك" en="Your team" /></span>
              <h2 data-split="">
                <span lang="ar">من يعمل على ماذا؟ ومن وافق على هذا الشراء؟</span>
                {" "}
                <span lang="en">Who&apos;s doing what? Who approved this purchase?</span>
              </h2>
              <p className="answer" data-reveal="">
                <L
                  ar="كل طلب صيانة يمر بنفس المسار: الطلب، الموظف المسؤول، الحالة، التكلفة، والنتيجة مع الصور. والمهام تنتقل من المالك إلى المدير إلى الموظف وبين الأقسام، على تقويم يراه الجميع. والمشتريات الكبيرة تذهب للمالك أو المدير للموافقة، ويسجّلها عقدي مباشرة."
                  en="Every maintenance request follows the same path: request, assigned employee, status, cost and result with photos. Tasks go from owner to manager to employee and between departments, on a calendar everyone sees. Big purchases go to the owner or manager for approval and are logged right away."
                />
              </p>
            </div>
            <div className="team-grid">
              {/* A maintenance job moving from request to done. */}
              <div className="mk mk-job" data-play="" data-reveal="" aria-hidden="true">
                <div className="mk-head">
                  <b><L ar="طلب صيانة: المكيف، وحدة 4" en="Repair: AC, Unit 4" /></b>
                  <span className="mk-state">
                    <i className="st-prog"><L ar="قيد التنفيذ" en="In progress" /></i>
                    <i className="st-done">{CHECK}<L ar="تم" en="Done" /></i>
                  </span>
                </div>
                <ol className="track">
                  <li style={{ "--i": 0 } as CSSProperties}>
                    <b><L ar="الطلب" en="Request" /></b>
                    <small><L ar="من المستأجر، مع صورة" en="From the tenant, with a photo" /></small>
                  </li>
                  <li style={{ "--i": 1 } as CSSProperties}>
                    <b><L ar="الموظف المسؤول" en="Assigned to" /></b>
                    <small><L ar="فيصل، فني صيانة" en="Faisal, technician" /></small>
                  </li>
                  <li style={{ "--i": 2 } as CSSProperties}>
                    <b><L ar="الحالة" en="Status" /></b>
                    <small><L ar="بدأ العمل" en="Work started" /></small>
                  </li>
                  <li style={{ "--i": 3 } as CSSProperties}>
                    <b><L ar="التكلفة" en="Cost" /></b>
                    <small><span data-sar="350"></span> · <L ar="إيصال مرفق" en="receipt attached" /></small>
                  </li>
                  <li style={{ "--i": 4 } as CSSProperties}>
                    <b><L ar="النتيجة" en="Result" /></b>
                    <small><L ar="تم الإصلاح، مع صورة قبل وبعد" en="Fixed, with before and after photos" /></small>
                    <span className="track-photos"><i></i><i className="after"></i></span>
                  </li>
                </ol>
              </div>

              {/* A shared calendar, with a purchase waiting for approval. */}
              <div className="mk mk-cal" data-play="" data-reveal="" aria-hidden="true">
                <div className="mk-head">
                  <b><L ar="تقويم الفريق · هذا الأسبوع" en="Team calendar · this week" /></b>
                  <small data-date="0"></small>
                </div>
                <div className="cal">
                  {[
                    { ar: "الأحد", en: "Sun", items: [{ ar: "فحص وحدة 7", en: "Inspect Unit 7", who: "k" }] },
                    { ar: "الإثنين", en: "Mon", items: [{ ar: "المكيف، وحدة 4", en: "AC, Unit 4", who: "f" }] },
                    { ar: "الثلاثاء", en: "Tue", items: [{ ar: "تجديد عقد وحدة 9", en: "Renew Unit 9", who: "s" }, { ar: "نظافة مبنى أ", en: "Clean Bldg A", who: "f" }] },
                    { ar: "الأربعاء", en: "Wed", items: [] },
                    { ar: "الخميس", en: "Thu", items: [{ ar: "صيانة خزان المياه", en: "Water tank", who: "k" }] },
                  ].map((d) => (
                    <div key={d.en} className="cal-day">
                      <span className="cal-name"><L ar={d.ar} en={d.en} /></span>
                      {d.items.map((it) => (
                        <span key={it.en} className={`cal-ev who-${it.who}`}><L ar={it.ar} en={it.en} /></span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="cal-legend">
                  <span className="who-k"><L ar="خالد · مدير المباني" en="Khalid · buildings manager" /></span>
                  <span className="who-f"><L ar="فيصل · الصيانة" en="Faisal · maintenance" /></span>
                  <span className="who-s"><L ar="سارة · العقود" en="Sara · contracts" /></span>
                </div>
                <div className="approval">
                  <div className="approval-top">
                    <span className="approval-tag"><L ar="طلب موافقة" en="Approval request" /></span>
                    <b data-sar="2400"></b>
                  </div>
                  <p>
                    <L ar="شراء مكيف جديد لوحدة 9" en="New AC for Unit 9" />
                    <small><L ar="من خالد، مدير المباني" en="From Khalid, buildings manager" /></small>
                  </p>
                  <div className="approval-actions">
                    <span className="approval-ask">
                      <span className="mk-btn"><L ar="موافقة" en="Approve" /></span>
                      <span className="mk-btn mk-btn-quiet"><L ar="رفض" en="Decline" /></span>
                    </span>
                    <span className="approval-done">{CHECK}<L ar="وافق المالك، وسجّلها عقدي في التكاليف" en="Approved by the owner · logged in costs" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. You (owner or manager) */}
        <section id="owner" className="tinted">
          <div className="wrap person">
            <div className="person-text">
              <span className="eyebrow"><L ar="أنت، المالك أو المدير" en="You, the owner or manager" /></span>
              <h2 data-split="">
                <span lang="ar">كم موقعًا ومحادثة تفتح لتعرف وضع مكتبك؟</span>
                {" "}
                <span lang="en">How many websites and chats do you open to know where you stand?</span>
              </h2>
              <p className="answer" data-reveal="">
                <L
                  ar="كل تكلفة مسجّلة مع إيصالها: الصيانة والمشتريات والاشتراكات. والإيجار المتوقع لكل شهر يحسبه عقدي تلقائيًا من العقود التي رفعتها."
                  en="Every cost (maintenance, purchases, subscriptions) logged with its receipt. Expected rent each month is calculated automatically from the contracts you uploaded."
                />
              </p>
              <ul className="insights" data-reveal="">
                <li><L ar="الإيجار مقارنة بالمباني والأحياء القريبة" en="Rent compared with nearby buildings and neighborhoods" /></li>
                <li><L ar="أشياء تتعطل باستمرار وتحتاج استبدال" en="Things that keep breaking and need replacing" /></li>
                <li><L ar="المصروفات لكل ربع سنة" en="Spending per quarter" /></li>
                <li><L ar="شكاوى المستأجرين" en="Tenant complaints" /></li>
                <li><L ar="مدة إنجاز المهام" en="How long tasks take" /></li>
              </ul>
            </div>
            <div className="mk mk-costs" data-play="" data-reveal="" aria-hidden="true">
              <div className="mk-head">
                <b><L ar="التكاليف · هذا الشهر" en="Costs · this month" /></b>
                <small data-date="0"></small>
              </div>
              <ul className="costs">
                <li style={{ "--i": 0 } as CSSProperties}>
                  <span className="hv-ic">{RECEIPT}</span>
                  <span><L ar="صيانة المكيف، وحدة 4" en="AC repair, Unit 4" /><small><L ar="صيانة · إيصال" en="Maintenance · receipt" /></small></span>
                  <b data-sar="350"></b>
                </li>
                <li style={{ "--i": 1 } as CSSProperties}>
                  <span className="hv-ic">{RECEIPT}</span>
                  <span><L ar="مكيف جديد، وحدة 9" en="New AC, Unit 9" /><small><L ar="شراء · وافق المالك · إيصال" en="Purchase · approved by owner · receipt" /></small></span>
                  <b data-sar="2400"></b>
                </li>
                <li style={{ "--i": 2 } as CSSProperties}>
                  <span className="hv-ic">{RECEIPT}</span>
                  <span><L ar="نظافة المباني" en="Building cleaning" /><small><L ar="اشتراك شهري · إيصال" en="Monthly subscription · receipt" /></small></span>
                  <b data-sar="1200"></b>
                </li>
              </ul>
              <div className="costs-total">
                <span><L ar="مجموع التكاليف" en="Total costs" /></span>
                <b data-sar="3950"></b>
              </div>
              <div className="expected">
                <span><L ar="الإيجار المتوقع هذا الشهر" en="Expected rent this month" /></span>
                <b data-sar="186500"></b>
                <small><L ar="محسوب من 58 عقدًا مرفوعًا. حالة الدفع في منصة إيجار." en="Calculated from 58 uploaded contracts. Payment status lives in Ejar." /></small>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Works alongside Ejar */}
        <section id="ejar" className="ejar">
          <div className="wrap">
            <div className="ejar-card" data-reveal="">
              <div>
                <h2 data-split="">
                  <span lang="ar">يعمل جنبًا إلى جنب مع إيجار</span>
                  {" "}
                  <span lang="en">Works alongside Ejar</span>
                </h2>
                <p>
                  <L
                    ar="العقود ودفع الإيجار تبقى في منصة إيجار. وعقدي يعطي المستأجر والموظف رابطًا يوصلهم إليها بلمسة واحدة."
                    en="Contracts and rent payments stay in Ejar. Aqdi gives tenants and staff a one-tap link to it."
                  />
                </p>
              </div>
              <div className="ejar-mock" aria-hidden="true">
                <span className="ejar-row">
                  <b><L ar="عقد وحدة 4، مبنى ج" en="Lease, Unit 4, Building C" /></b>
                  <small><L ar="العقد والدفع في منصة إيجار" en="Contract and payments are in Ejar" /></small>
                </span>
                <span className="mk-btn ejar-btn">
                  <L ar="فتح إيجار" en="Open Ejar" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing */}
        <section id="pricing">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">دفعة واحدة في السنة، حسب عدد وحداتك.</span>
                {" "}
                <span lang="en">One yearly payment, based on how many units you manage.</span>
              </h2>
              <p className="price-plain" data-reveal="">
                <L ar="50 ريال لكل وحدة في السنة" en="50 SAR per unit per year" />
              </p>
            </div>
            <div className="pricing-grid">
              <div data-reveal="">
                <div className="brackets" id="brackets">
                  <div className="bracket">
                    <span>
                      <L ar="أول 100 وحدة" en="First 100 units" />
                      <span className="sub"></span>
                    </span>
                    <b><L ar="50 ريال" en="50 SAR" /></b>
                  </div>
                  <div className="bracket">
                    <span>
                      <L ar="من 101 إلى 300 وحدة" en="Units 101–300" />
                      <span className="sub"></span>
                    </span>
                    <b><L ar="40 ريال" en="40 SAR" /></b>
                  </div>
                  <div className="bracket">
                    <span>
                      <L ar="أكثر من 300 وحدة" en="Above 300 units" />
                      <span className="sub"></span>
                    </span>
                    <b><L ar="30 ريال" en="30 SAR" /></b>
                  </div>
                  <p className="bracket-note">
                    <span lang="ar">
                      السعر للوحدة في السنة، وكل سعر ينطبق فقط على الوحدات في نطاقه.
                      <br />
                      مثال: 150 وحدة تكلّف 7,000 ريال، أول 100 وحدة بـ 50 ريال والـ 50 الباقية بـ 40 ريال.
                    </span>
                    <span lang="en">
                      Price per unit, per year. Each rate applies only to the units in its range.
                      <br />
                      Example: 150 units cost 7,000 SAR, the first 100 at 50 SAR and the other 50 at 40 SAR.
                    </span>
                  </p>
                </div>
                <ul className="rules">
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <strong><L ar="بدون حد أدنى" en="No minimum" /></strong>
                      <L ar="المكتب الذي يدير 3 وحدات يدفع عن 3 وحدات فقط." en="An office with 3 units pays for 3 units." />
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <strong><L ar="كل المزايا مشمولة" en="All features included" /></strong>
                      <L ar="نفس المنصة لكل المكاتب، بدون باقات أو إضافات." en="Every office gets the whole platform, with no tiers or add-ons." />
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <strong><L ar="الأسعار لا تشمل ضريبة القيمة المضافة" en="Prices exclude VAT" /></strong>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="calc" data-reveal="">
                <h3><L ar="احسب اشتراكك السنوي" en="Calculate your yearly price" /></h3>
                <p className="muted"><L ar="كم وحدة يدير مكتبك؟" en="How many units does your office manage?" /></p>
                <div className="field">
                  <label htmlFor="units-num"><L ar="عدد الوحدات" en="Number of units" /></label>
                  <div className="stepper">
                    <button type="button" className="step-btn" id="units-minus" aria-label="−1">−</button>
                    <input type="number" id="units-num" min="1" max="100000" defaultValue="1" inputMode="numeric" autoComplete="off" required />
                    <button type="button" className="step-btn" id="units-plus" aria-label="+1">+</button>
                  </div>
                  <input type="range" id="units-range" min="1" max="500" defaultValue="1" aria-label="Units" autoComplete="off" />
                </div>
                <div className="total">
                  <b id="total-price">—</b>
                  <span><L ar="في السنة" en="per year" /></span>
                </div>
                <p className="daily" id="daily"></p>
                <p className="pitch">
                  <L
                    ar="دفعة واحدة تغطي السنة كاملة، وكل المزايا مشمولة. أرخص من موظف يلاحق كل هذا، ومنصتنا ما تطلع إجازة."
                    en="One payment covers the whole year, with every feature included. Cheaper than hiring someone to chase all of it, and our platform never takes a day off."
                  />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Start now */}
        <section className="closing" id="closing">
          <div className="wrap">
            <span className="logo-mark" aria-hidden="true">{LOGO_WAVES}</span>
            <div className="section-head">
              <h2 data-split="">
                <span lang="ar">ابدأ الآن</span>
                {" "}
                <span lang="en">Start now</span>
              </h2>
              <p data-reveal="">
                <L
                  ar="أنشئ حساب مكتبك وارفع أول عقودك من إيجار. خلال دقائق يكون مكتبك جاهزًا لفريقك ومستأجريك."
                  en="Create your office account and upload your first Ejar contracts. In minutes, your office is ready for your team and your tenants."
                />
              </p>
            </div>
            <div className="cta-row cta-center" data-reveal="">
              <Link href="/signup" className="btn btn-primary">
                <L ar="ابدأ الآن" en="Start now" />
              </Link>
              <Link href="/login" className="btn btn-quiet">
                <L ar="تسجيل الدخول" en="Log in" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap">
          <div>
            <L ar="أسسه وطوّره" en="Founded and built by" />
            {" "}
            <span className="founder">Abdulhadi Almomen</span>
          </div>
          <div>
            © 2026
            {" "}
            <L ar="عقدي" en="Aqdi" />
          </div>
        </div>
      </footer>
    </>
  );
}
