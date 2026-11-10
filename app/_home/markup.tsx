// Homepage markup, ported from the original static index.html.
// Copy is still inline (both languages, CSS shows one); moving it to messages/ is a later step.
import type { CSSProperties } from "react";
import Link from "next/link";
import { T } from "@/lib/i18n";

export function HomeMarkup() {
  return (
    <>
      <nav id="nav">
        <div className="wrap">
          <a href="#" className="logo" aria-label="Aqdi">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <rect width="64" height="64" rx="14" fill="var(--palm)"></rect>
                <g className="waves" fill="none" stroke="#f5f3ec" strokeWidth="3.6" strokeLinecap="round">
                  <path pathLength="1" d="M11 22 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                  <path pathLength="1" d="M11 33 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                  <path pathLength="1" d="M11 44 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0"></path>
                </g>
              </svg>
            </span>
            {" "}
            <span lang="ar">عقدي</span>
            <span lang="en">Aqdi</span>
          </a>
          <div className="nav-links" id="nav-links">
            <span className="nav-pill" id="nav-pill" aria-hidden="true"></span>
            {" "}
            <a href="#how" data-nav="how">
              <span lang="ar">كيف يعمل</span>
              <span lang="en">How it works</span>
            </a>
            {" "}
            <a href="#tenants" data-nav="tenants">
              <span lang="ar">تجربة المستأجر</span>
              <span lang="en">For tenants</span>
            </a>
            {" "}
            <a href="#pricing" data-nav="pricing">
              <span lang="ar">الأسعار</span>
              <span lang="en">Pricing</span>
            </a>
            {" "}
            <a href="#faq" data-nav="faq">
              <span lang="ar">الأسئلة</span>
              <span lang="en">FAQ</span>
            </a>
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
                <span lang="ar">العقود والمدفوعات وطلبات الصيانة، في مكان واحد.</span>
                {" "}
                <span lang="en">Leases, payments and maintenance, all in one place.</span>
              </h1>
              <p className="lede">
                <span lang="ar">المكتب يرفع عقوده من منصة إيجار، وعقدي ينقل كل المعلومات خلال دقائق. والمستأجر يجد عقده، دفعاته وطلبات الصيانة في مكان واحد.</span>
                {" "}
                <span lang="en">Offices upload their Ejar contracts and Aqdi sets everything up in minutes. Tenants get one place to see their contract, pay rent and request repairs.</span>
              </p>
              <div className="cta-row">
                <a href="#how" className="btn btn-primary">
                  <span lang="ar">شاهد كيف يعمل</span>
                  <span lang="en">See how it works</span>
                  {" "}
                  <span className="arrow" aria-hidden="true">
                    <span lang="ar">←</span>
                    <span lang="en">→</span>
                  </span>
                </a>
                {" "}
                <a href="#pricing" className="btn btn-quiet">
                  <span lang="ar">الأسعار</span>
                  <span lang="en">Pricing</span>
                </a>
              </div>
              <div className="trust">
                <span>
                  <span lang="ar">مدى و Apple Pay و STC Pay</span>
                  <span lang="en">mada, Apple Pay, STC Pay</span>
                </span>
                {" "}
                <span>
                  <span lang="ar">تنبيهات عبر واتساب</span>
                  <span lang="en">WhatsApp reminders</span>
                </span>
                {" "}
                <span>
                  <span lang="ar">مجاني للمستأجرين</span>
                  <span lang="en">Free for tenants</span>
                </span>
              </div>
            </div>
            <div className="stage" id="hero-stage">
              <div className="arch" aria-hidden="true"></div>
              <div className="hero-chip" aria-hidden="true">
                <span className="chip-dot" id="chip-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                  </svg>
                </span>
                {" "}
                <span className="chip-text" id="chip-text"></span>
              </div>
              <div className="mock" aria-label="Example office dashboard">
                <div className="mock-head">
                  <div>
                    <div className="mock-title">
                      <span lang="ar">مكتب النور العقاري</span>
                      <span lang="en">Al Noor Real Estate</span>
                    </div>
                    <div className="mock-sub">
                      <span lang="ar">4 مباني · 62 وحدة</span>
                      <span lang="en">4 buildings · 62 units</span>
                    </div>
                  </div>
                  <div className="mock-sub" data-date="0"></div>
                </div>
                <div className="stats">
                  <div className="stat">
                    <b data-count="91" data-suffix="%">91%</b>
                    <span>
                      <span lang="ar">الإيجار المحصّل</span>
                      <span lang="en">Rent collected</span>
                    </span>
                  </div>
                  <div className="stat">
                    <b data-count="7">7</b>
                    <span>
                      <span lang="ar">عقود تنتهي خلال 60 يوماً</span>
                      <span lang="en">Leases ending in 60 days</span>
                    </span>
                  </div>
                  <div className="stat">
                    <b data-count="3">3</b>
                    <span>
                      <span lang="ar">طلبات صيانة مفتوحة</span>
                      <span lang="en">Open repairs</span>
                    </span>
                  </div>
                </div>
                <div className="rows">
                  <div className="row">
                    <div>
                      <span lang="ar">وحدة 12، مبنى أ</span>
                      <span lang="en">Unit 12, Building A</span>
                      {" "}
                      <small>
                        <span lang="ar">إيجار نصف سنوي · مستحق</span>
                        <span lang="en">Semi-annual rent · due</span>
                        {" "}
                        <span data-date="12"></span>
                      </small>
                    </div>
                    <span className="status s-paid">
                      <span lang="ar">مدفوع</span>
                      <span lang="en">Paid</span>
                    </span>
                  </div>
                  <div className="row">
                    <div>
                      <span lang="ar">وحدة 4، مبنى ج</span>
                      <span lang="en">Unit 4, Building C</span>
                      {" "}
                      <small>
                        <span lang="ar">المكيف لا يبرّد · بلاغ اليوم</span>
                        <span lang="en">AC not cooling · reported today</span>
                      </small>
                    </div>
                    <span className="status s-progress">
                      <span lang="ar">قيد التنفيذ</span>
                      <span lang="en">In progress</span>
                    </span>
                  </div>
                  <div className="row">
                    <div>
                      <span lang="ar">وحدة 9، مبنى ب</span>
                      <span lang="en">Unit 9, Building B</span>
                      {" "}
                      <small>
                        <span lang="ar">عقد سنوي · ينتهي</span>
                        <span lang="en">Annual lease · ends</span>
                        {" "}
                        <span data-date="21"></span>
                      </small>
                    </div>
                    <span className="status s-renew">
                      <span lang="ar">تجديد</span>
                      <span lang="en">Renew</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
        <section className="audience">
          <div className="wrap">
            <div className="audience-grid">
              <div className="audience-card" data-reveal="">
                <span className="glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"></path>
                    <path d="M15 10h4a1 1 0 0 1 1 1v10"></path>
                    <path d="M8 8h3M8 12h3M8 16h3"></path>
                    <path d="M2.5 21h19"></path>
                  </svg>
                </span>
                {" "}
                <span className="eyebrow">
                  <span lang="ar">للمكاتب</span>
                  <span lang="en">For offices</span>
                </span>
                <h3>
                  <span lang="ar">جهّز مكتبك خلال دقائق بدل أيام.</span>
                  <span lang="en">Set up in minutes, not days.</span>
                </h3>
                <ul className="rules">
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">ارفع ملفات عقودك من إيجار بصيغة PDF.</span>
                      <span lang="en">Upload your Ejar contract PDFs.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">يقرأ عقدي بالذكاء الاصطناعي بيانات كل مستأجر ووحدة، والتواريخ ومبلغ الإيجار.</span>
                      <span lang="en">AI reads every tenant, unit, date and rent amount.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">تؤكد أنت أي معلومة لم يتأكد منها.</span>
                      <span lang="en">You confirm anything it&apos;s unsure of.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">ثم تتابع الإيجار والتجديدات والصيانة لكل مبانيك من لوحة واحدة.</span>
                      <span lang="en">Then one dashboard for rent, renewals and repairs across all your buildings.</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="audience-card" data-reveal="">
                <span className="glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l9-7 9 7"></path>
                    <path d="M5 9.5V20h14V9.5"></path>
                    <path d="M10 20v-5h4v5"></path>
                  </svg>
                </span>
                {" "}
                <span className="eyebrow">
                  <span lang="ar">للمستأجرين</span>
                  <span lang="en">For tenants</span>
                </span>
                <h3>
                  <span lang="ar">كل ما يخص سكنك في مكان واحد.</span>
                  <span lang="en">Everything about your home in one place.</span>
                </h3>
                <ul className="rules">
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">اطّلع على عقدك وتاريخ التجديد.</span>
                      <span lang="en">See your contract and renewal date.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">ادفع إيجارك من جوالك.</span>
                      <span lang="en">Pay rent from your phone.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">أرسل طلب صيانة مع صورة للعطل.</span>
                      <span lang="en">Send a repair request with a photo.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <span lang="ar">تصلك التحديثات على واتساب.</span>
                      <span lang="en">Updates come on WhatsApp.</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* How the contract import works: the stage stays put while the steps scroll past it. */}
        <section id="how">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">كيف يعمل استيراد العقود؟</span>
                <span lang="en">How to import your contracts</span>
              </h2>
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
                    <span lang="ar">تظهر مبانيك ووحداتك وعقودك في لوحة واحدة، وتصل الدعوات لمستأجريك على واتساب.</span>
                    <span lang="en">Your buildings, units and leases appear in one dashboard, and your tenants get their invites on WhatsApp.</span>
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
        {/* What the tenant sees, on a phone. */}
        <section id="tenants" className="tinted">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">وهذا ما يراه المستأجر.</span>
                <span lang="en">And this is what your tenants see.</span>
              </h2>
              <p data-reveal="">
                <span lang="ar">بدون تطبيق وبدون كلمة مرور. كل شيء يبدأ برسالة واتساب.</span>
                <span lang="en">No app to download and no password. It all starts with a WhatsApp message.</span>
              </p>
            </div>
            <div className="story flip" data-story="">
              <div className="story-stage-wrap">
                <div className="stage-frame phone-frame">
                  <div className="phone">
                    <div className="screen" data-stage="" data-step="1" aria-hidden="true">
                      <span className="island"></span>
                      <div className="sbar">
                        <span>9:41</span>
                        <span>●●●</span>
                      </div>
                      <div className="ps ps-1">
                        <div className="wa-head">
                          <span className="avatar">
                            <svg viewBox="0 0 64 64">
                              <g fill="none" stroke="#f5f3ec" strokeWidth="5" strokeLinecap="round">
                                <path d="M11 22 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                                <path d="M11 33 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                                <path d="M11 44 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0"></path>
                              </g>
                            </svg>
                          </span>
                          {" "}
                          <span>
                            <b>
                              <span lang="ar">مكتب النور العقاري</span>
                              <span lang="en">Al Noor Real Estate</span>
                            </b>
                            <small>
                              <span lang="ar">حساب أعمال</span>
                              <span lang="en">Business account</span>
                            </small>
                          </span>
                        </div>
                        <div className="wa-body">
                          <span className="wa-day">
                            <span lang="ar">اليوم</span>
                            <span lang="en">Today</span>
                          </span>
                          {" "}
                          <span className="typing">
                            <i></i>
                            <i></i>
                            <i></i>
                          </span>
                          <div className="wa-msg">
                            <span lang="ar">مرحبًا محمد، أضافك مكتب النور العقاري إلى عقدي. اطّلع على عقدك وادفع إيجارك من هنا:</span>
                            <span lang="en">Hi Mohammed, Al Noor Real Estate has added you to Aqdi. See your contract and pay rent here:</span>
                            {" "}
                            <span className="link">aqdi.sa/i/7Kx2</span>
                            {" "}
                            <time>9:41</time>
                          </div>
                          <div className="wa-btn">
                            <span lang="ar">افتح عقدي</span>
                            <span lang="en">Open Aqdi</span>
                            <span className="tap"></span>
                          </div>
                        </div>
                      </div>
                      <div className="ps ps-2">
                        <div className="otp-wrap">
                          <span className="logo-mark">
                            <svg viewBox="0 0 64 64">
                              <rect width="64" height="64" rx="14" fill="var(--palm)"></rect>
                              <g fill="none" stroke="#f5f3ec" strokeWidth="3.6" strokeLinecap="round">
                                <path d="M11 22 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                                <path d="M11 33 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                                <path d="M11 44 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0"></path>
                              </g>
                            </svg>
                          </span>
                          <h4>
                            <span lang="ar">أدخل رمز التحقق</span>
                            <span lang="en">Enter your code</span>
                          </h4>
                          <p>
                            <span lang="ar">أرسلنا رمزًا من 6 أرقام إلى</span>
                            <span lang="en">We sent a 6-digit code to</span>
                            {" "}
                            <bdi dir="ltr">055 214 7390</bdi>
                          </p>
                          <div className="otp">
                            <i style={{ "--i": 0 } as CSSProperties}>
                              <span>4</span>
                            </i>
                            <i style={{ "--i": 1 } as CSSProperties}>
                              <span>8</span>
                            </i>
                            <i style={{ "--i": 2 } as CSSProperties}>
                              <span>2</span>
                            </i>
                            <i style={{ "--i": 3 } as CSSProperties}>
                              <span>9</span>
                            </i>
                            <i style={{ "--i": 4 } as CSSProperties}>
                              <span>1</span>
                            </i>
                            <i style={{ "--i": 5 } as CSSProperties}>
                              <span>5</span>
                            </i>
                          </div>
                          <div className="first-time">
                            <small>
                              <span lang="ar">أول دخول فقط</span>
                              <span lang="en">First time only</span>
                            </small>
                            <p>
                              <span lang="ar">آخر 4 أرقام من الهوية أو الإقامة</span>
                              <span lang="en">Last 4 digits of your ID or iqama</span>
                            </p>
                            <div className="otp">
                              <i style={{ "--i": 0 } as CSSProperties}>
                                <span>4</span>
                              </i>
                              <i style={{ "--i": 1 } as CSSProperties}>
                                <span>5</span>
                              </i>
                              <i style={{ "--i": 2 } as CSSProperties}>
                                <span>6</span>
                              </i>
                              <i style={{ "--i": 3 } as CSSProperties}>
                                <span>1</span>
                              </i>
                            </div>
                          </div>
                          <div className="in-ok">
                            <span className="tag green">
                              ✓
                              {" "}
                              <span lang="ar">تم الدخول</span>
                              <span lang="en">You&apos;re in</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ps ps-3">
                        <div className="portal">
                          <div className="portal-hi">
                            <b>
                              <span lang="ar">أهلًا محمد</span>
                              <span lang="en">Hi Mohammed</span>
                            </b>
                            <small>
                              <span lang="ar">وحدة 3، مبنى أ · مكتب النور العقاري</span>
                              <span lang="en">Unit 3, Bldg A · Al Noor Real Estate</span>
                            </small>
                          </div>
                          <div className="lease-card">
                            <div className="ring">
                              <svg viewBox="0 0 70 70">
                                <circle className="bg" cx="35" cy="35" r="29"></circle>
                                <circle className="fg" cx="35" cy="35" r="29" pathLength="100" id="days-ring"></circle>
                              </svg>
                              <b data-days-until="2027-03-14"></b>
                            </div>
                            <div>
                              <small>
                                <span lang="ar">يومًا على نهاية العقد</span>
                                <span lang="en">days left on your lease</span>
                              </small>
                              {" "}
                              <strong data-iso="2027-03-14"></strong>
                            </div>
                          </div>
                          <div className="pay-card">
                            <small>
                              <span lang="ar">الدفعة القادمة · الثانية من 2</span>
                              <span lang="en">Next payment · 2 of 2</span>
                            </small>
                            {" "}
                            <span className="amt" data-sar="16000"></span>
                            {" "}
                            <small>
                              <span lang="ar">تستحق</span>
                              <span lang="en">Due</span>
                              {" "}
                              <span data-date="10"></span>
                            </small>
                            {" "}
                            <span className="btn btn-primary">
                              <span lang="ar">ادفع الإيجار</span>
                              <span lang="en">Pay rent</span>
                            </span>
                          </div>
                        </div>
                        <div className="scrim"></div>
                        <div className="tray">
                          <div className="tray-head">
                            <b>
                              <span lang="ar">دفع الإيجار</span>
                              <span lang="en">Pay rent</span>
                            </b>
                            <span className="tray-x">✕</span>
                          </div>
                          <div className="method sel">
                            <span className="mk">mada</span>
                            <span lang="ar">مدى</span>
                            <span lang="en">mada</span>
                            <span className="radio"></span>
                          </div>
                          <div className="method">
                            <span className="mk">Pay</span>
                            Apple Pay
                            <span className="radio"></span>
                          </div>
                          <div className="method">
                            <span className="mk">stc</span>
                            STC Pay
                            <span className="radio"></span>
                          </div>
                          <div className="pay-btn morph">
                            <span className="m-a">
                              <span lang="ar">ادفع</span>
                              <span lang="en">Pay</span>
                              {" "}
                              <span data-sar="16000"></span>
                            </span>
                            {" "}
                            <span className="m-b">
                              ✓
                              {" "}
                              <span lang="ar">تم الدفع</span>
                              <span lang="en">Paid</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ps ps-4">
                        <div className="repair">
                          <div className="repair-top">
                            <span lang="ar">طلب صيانة</span>
                            <span lang="en">Repair request</span>
                          </div>
                          <div className="repair-card">
                            <span className="photo">
                              <svg viewBox="0 0 48 48" fill="none">
                                <rect x="5" y="12" width="38" height="16" rx="4" fill="#fff"></rect>
                                <path d="M10 23h28" stroke="#b9c4ca" strokeWidth="2" strokeLinecap="round"></path>
                                <path d="M14 33c0 3-2 3-2 6M24 33c0 3-2 3-2 6M34 33c0 3-2 3-2 6" stroke="#8aa0ad" strokeWidth="1.8" strokeLinecap="round"></path>
                                <circle cx="37" cy="17" r="1.6" fill="#a83f2a"></circle>
                              </svg>
                            </span>
                            <div>
                              <span className="tag">
                                <span lang="ar">تكييف</span>
                                <span lang="en">AC</span>
                              </span>
                              {" "}
                              <b>
                                <span lang="ar">المكيف لا يبرّد</span>
                                <span lang="en">AC not cooling</span>
                              </b>
                              {" "}
                              <small>
                                <span lang="ar">صورة مرفقة · وحدة 3</span>
                                <span lang="en">Photo attached · Unit 3</span>
                              </small>
                            </div>
                          </div>
                          <ul className="timeline">
                            <li style={{ "--i": 0 } as CSSProperties}>
                              <span className="td"></span>
                              <span>
                                <span lang="ar">تم الإرسال</span>
                                <span lang="en">Submitted</span>
                                <small>
                                  <span lang="ar">اليوم، 9:41</span>
                                  <span lang="en">Today, 9:41</span>
                                </small>
                              </span>
                            </li>
                            <li style={{ "--i": 1 } as CSSProperties}>
                              <span className="td"></span>
                              <span>
                                <span lang="ar">تم التعيين للفني</span>
                                <span lang="en">Assigned to technician</span>
                                <small>
                                  <span lang="ar">فني المبنى</span>
                                  <span lang="en">Building technician</span>
                                </small>
                              </span>
                            </li>
                            <li style={{ "--i": 2 } as CSSProperties}>
                              <span className="td"></span>
                              <span>
                                <span lang="ar">قيد التنفيذ</span>
                                <span lang="en">In progress</span>
                              </span>
                            </li>
                            <li style={{ "--i": 3 } as CSSProperties}>
                              <span className="td"></span>
                              <span>
                                <span lang="ar">تم الإصلاح</span>
                                <span lang="en">Fixed</span>
                                <small>
                                  <span lang="ar">مع صورة بعد الإصلاح</span>
                                  <span lang="en">With an after photo</span>
                                </small>
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="notif">
                          <span className="wa-ic">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.6A8 8 0 1 1 21 12z"></path>
                            </svg>
                          </span>
                          {" "}
                          <span>
                            <b>
                              <span lang="ar">مكتب النور العقاري</span>
                              <span lang="en">Al Noor Real Estate</span>
                            </b>
                            <span lang="ar">تم إصلاح المكيف في وحدتك.</span>
                            <span lang="en">The AC in your unit has been fixed.</span>
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
                    <span lang="ar">دعوة على واتساب</span>
                    <span lang="en">An invite on WhatsApp</span>
                  </h3>
                  <p>
                    <span lang="ar">بعد موافقة المكتب على العقود، يستلم كل مستأجر دعوة باسم المكتب على واتساب.</span>
                    <span lang="en">Once the office approves the leases, every tenant gets an invite on WhatsApp in the office&apos;s name.</span>
                  </p>
                </div>
                <div className="step" data-step="2">
                  <span className="step-num">2</span>
                  <h3>
                    <span lang="ar">دخول برمز، بدون كلمة مرور</span>
                    <span lang="en">Log in with a code, no password</span>
                  </h3>
                  <p>
                    <span lang="ar">يفتح المستأجر الرابط ويدخل برمز يصله في رسالة نصية. وفي أول دخول فقط، يؤكد آخر 4 أرقام من هويته أو إقامته.</span>
                    <span lang="en">The tenant opens the link and logs in with a code sent by SMS. The first time only, they confirm the last 4 digits of their ID or iqama.</span>
                  </p>
                </div>
                <div className="step" data-step="3">
                  <span className="step-num">3</span>
                  <h3>
                    <span lang="ar">العقد والدفع في مكان واحد</span>
                    <span lang="en">Contract and rent in one place</span>
                  </h3>
                  <p>
                    <span lang="ar">يرى عقده وكم يومًا بقي على نهايته، ويدفع إيجاره بمدى أو Apple Pay أو STC Pay.</span>
                    <span lang="en">They see their contract and how many days are left, and pay rent with mada, Apple Pay or STC Pay.</span>
                  </p>
                </div>
                <div className="step" data-step="4">
                  <span className="step-num">4</span>
                  <h3>
                    <span lang="ar">طلب صيانة مع صورة</span>
                    <span lang="en">Repairs with a photo</span>
                  </h3>
                  <p>
                    <span lang="ar">يرسل الطلب مع صورة للعطل، ويتابع حالته خطوة بخطوة حتى الإصلاح، مع تحديثات على واتساب.</span>
                    <span lang="en">They send a request with a photo and follow it step by step until it&apos;s fixed, with updates on WhatsApp.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="problem">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">إدارة الإيجار في السعودية تجاوزت مرحلة الجداول والدفاتر.</span>
                <span lang="en">Renting in Saudi has outgrown spreadsheets and notebooks.</span>
              </h2>
            </div>
            <div className="problem-grid">
              <div className="problem-card" data-reveal="">
                <span className="num">01</span>
                <h3>
                  <span lang="ar">المستأجر يبحث عن إجابات</span>
                  <span lang="en">Tenants are left searching for answers</span>
                </h3>
                <p>
                  <span lang="ar">متى ينتهي عقدي؟ كم المبلغ المتبقي؟ كل سؤال يتطلب لقاء أو مكالمة.</span>
                  <span lang="en">When does my contract end? How much do I still owe? Every question takes a visit or a call.</span>
                </p>
              </div>
              <div className="problem-card" data-reveal="">
                <span className="num">02</span>
                <h3>
                  <span lang="ar">صعوبة تتبّع طلبات الصيانة</span>
                  <span lang="en">Repair requests are hard to track</span>
                </h3>
                <p>
                  <span lang="ar">يبلّغ المستأجر عن عطل المكيف باتصال أو رسالة، ثم يصعب التأكد إن تم إصلاحه فعلاً.</span>
                  <span lang="en">A broken AC gets reported by a call or a text, and it&apos;s hard to confirm it was ever fixed.</span>
                </p>
              </div>
              <div className="problem-card" data-reveal="">
                <span className="num">03</span>
                <h3>
                  <span lang="ar">المتابعة موزّعة بين الدفاتر</span>
                  <span lang="en">Tracking is scattered across notebooks</span>
                </h3>
                <p>
                  <span lang="ar">من دفع؟ أي العقود على وشك الانتهاء؟ وأي الطلبات ما زالت مفتوحة؟ المعلومات موزّعة بين دفاتر وجداول مختلفة.</span>
                  <span lang="en">Who paid? Which leases are about to end? Which requests are still open? The answers are spread across different notebooks and spreadsheets.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="tinted">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">كل ما بين المكتب والمستأجر، في مكان واحد.</span>
                <span lang="en">Everything between the office and the tenant, in one place.</span>
              </h2>
              <p data-reveal="">
                <span lang="ar">يضيف المكتب مبانيه ووحداته ومستأجريه مرة واحدة، ثم يدير أعماله اليومية كلها من لوحة واحدة.</span>
                <span lang="en">The office adds its buildings, units and tenants once. From then on, the day-to-day runs from one dashboard.</span>
              </p>
            </div>
            <div className="features">
              <div className="feature" data-reveal="">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 3v5h5"></path>
                    <path d="M9 13h6M9 17h4"></path>
                  </svg>
                </div>
                <h3>
                  <span lang="ar">العقود والتجديد</span>
                  <span lang="en">Contracts and renewals</span>
                </h3>
                <p>
                  <span lang="ar">يطّلع المستأجر على عقده في أي وقت، ويتابع المكتب العقود القريبة من الانتهاء قبل 90 و60 و30 يومًا، ويرسل عرض التجديد من التطبيق.</span>
                  <span lang="en">Tenants see their contract anytime. Offices see leases ending in 90, 60 and 30 days and send renewal offers in the app.</span>
                </p>
              </div>
              <div className="feature" data-reveal="">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2.5" y="5" width="19" height="14" rx="2.5"></rect>
                    <path d="M2.5 10h19M6.5 15h4"></path>
                  </svg>
                </div>
                <h3>
                  <span lang="ar">دفع الإيجار</span>
                  <span lang="en">Rent payments</span>
                </h3>
                <p>
                  <span lang="ar">تصدر الفواتير تلقائيًا حسب جدول الدفع، سنويًا أو كل ستة أشهر أو كل ثلاثة أشهر أو شهريًا، والدفع بمدى و Apple Pay و STC Pay مع سجل واضح لكل دفعة.</span>
                  <span lang="en">Invoices generated yearly, every six months, quarterly or monthly, paid with mada, Apple Pay or STC Pay, with a clear record.</span>
                </p>
              </div>
              <div className="feature" data-reveal="">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"></path>
                  </svg>
                </div>
                <h3>
                  <span lang="ar">طلبات الصيانة</span>
                  <span lang="en">Maintenance requests</span>
                </h3>
                <p>
                  <span lang="ar">يرفع المستأجر الطلب مع صورة للعطل، ويصل مباشرة إلى فني المبنى. وبعد الإصلاح يرفق الفني صورة للعمل المنجز، فيكون كل شيء موثقًا وواضحًا للمكتب والمستأجر.</span>
                  <span lang="en">Tenants report the issue with a photo, and it goes straight to the building&apos;s technician. After the fix, the technician adds a photo of the finished work, so the office and the tenant can both see it&apos;s done.</span>
                </p>
              </div>
              <div className="feature" data-reveal="">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.6A8 8 0 1 1 21 12z"></path>
                  </svg>
                </div>
                <h3>
                  <span lang="ar">تنبيهات واتساب</span>
                  <span lang="en">WhatsApp reminders</span>
                </h3>
                <p>
                  <span lang="ar">تصل تذكيرات الإيجار والتجديد وتحديثات الصيانة على واتساب تلقائيًا، بدون مكالمات أو متابعة يدوية.</span>
                  <span lang="en">Rent and renewal reminders and repair updates go out on WhatsApp automatically, with no calls or manual follow-up.</span>
                </p>
              </div>
              <div className="feature" data-reveal="">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"></path>
                    <path d="M16 8a5 5 0 0 1 0 8"></path>
                  </svg>
                </div>
                <h3>
                  <span lang="ar">الإعلانات</span>
                  <span lang="en">Announcements</span>
                </h3>
                <p>
                  <span lang="ar">انقطاع ماء أو صيانة مصعد أو دوام رمضان؟ بلّغ مبنى واحد أو كل المباني.</span>
                  <span lang="en">Water cut, elevator service or Ramadan hours? Tell one building or all of them.</span>
                </p>
              </div>
              <div className="feature" data-reveal="">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21V10l9-6 9 6v11"></path>
                    <path d="M9 21v-6h6v6"></path>
                  </svg>
                </div>
                <h3>
                  <span lang="ar">لوحة المكتب</span>
                  <span lang="en">Office dashboard</span>
                </h3>
                <p>
                  <span lang="ar">نسبة الإشغال، والإيجار المحصّل مقابل المتوقع، والدفعات المتأخرة، والعقود القريبة من الانتهاء، وطلبات الصيانة المفتوحة، كلها في شاشة واحدة.</span>
                  <span lang="en">Occupancy, rent collected vs expected, late payers, leases ending and open repairs, at a glance.</span>
                </p>
              </div>
            </div>
            <div className="side-note" data-reveal="">
              <span aria-hidden="true">＋</span>
              {" "}
              <span>
                <strong>
                  <span lang="ar">خدمات قابلة للحجز.</span>
                  <span lang="en">Bookable services.</span>
                </strong>
                {" "}
                <span lang="ar">كما يمكن للمكتب عرض خدمات مثل التنظيف وصيانة المكيفات والنقل، ويحجزها أي شخص من رابط المكتب.</span>
                <span lang="en">Offices can also list services like cleaning, AC repair and moving that anyone can book through the office&apos;s link.</span>
              </span>
            </div>
          </div>
        </section>
        <section id="pricing">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">دفعة واحدة في السنة، حسب عدد وحداتك.</span>
                <span lang="en">One yearly payment, based on how many units you manage.</span>
              </h2>
              <p data-reveal="">
                <span lang="ar">يعتمد الاشتراك على عدد الوحدات في جميع مبانيك، المؤجرة والشاغرة، والدفع مرة واحدة في السنة، مثل عقود الإيجار.</span>
                <span lang="en">Priced on the total units across all your buildings, rented or vacant, and paid once a year, like the leases themselves.</span>
              </p>
            </div>
            <div className="pricing-grid">
              <div data-reveal="">
                <div className="brackets" id="brackets">
                  <div className="bracket">
                    <span>
                      <span lang="ar">أول 100 وحدة</span>
                      <span lang="en">First 100 units</span>
                      <span className="sub"></span>
                    </span>
                    <b>
                      <span lang="ar">50 ريال</span>
                      <span lang="en">50 SAR</span>
                    </b>
                  </div>
                  <div className="bracket">
                    <span>
                      <span lang="ar">من 101 إلى 300 وحدة</span>
                      <span lang="en">Units 101–300</span>
                      <span className="sub"></span>
                    </span>
                    <b>
                      <span lang="ar">40 ريال</span>
                      <span lang="en">40 SAR</span>
                    </b>
                  </div>
                  <div className="bracket">
                    <span>
                      <span lang="ar">أكثر من 300 وحدة</span>
                      <span lang="en">Above 300 units</span>
                      <span className="sub"></span>
                    </span>
                    <b>
                      <span lang="ar">30 ريال</span>
                      <span lang="en">30 SAR</span>
                    </b>
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
                      <strong>
                        <span lang="ar">بدون حد أدنى</span>
                        <span lang="en">No minimum</span>
                      </strong>
                      <span lang="ar">المكتب الذي يدير 3 وحدات يدفع عن 3 وحدات فقط.</span>
                      <span lang="en">An office with 3 units pays for 3 units.</span>
                    </span>
                  </li>
                  <li>
                    <span className="dot">✓</span>
                    <span>
                      <strong>
                        <span lang="ar">الوحدات الجديدة مجانًا حتى التجديد</span>
                        <span lang="en">New units free until renewal</span>
                      </strong>
                      <span lang="ar">أضف مباني ووحدات خلال السنة بدون تكلفة إضافية، وعند التجديد يكون الاشتراك حسب العدد الجديد.</span>
                      <span lang="en">Add buildings and units mid-year at no extra cost. At renewal you pay for your new total.</span>
                    </span>
                  </li>
                </ul>
                <div className="tenant-free">
                  <h3>
                    <span lang="ar">مجاني للمستأجر دائمًا</span>
                    <span lang="en">Tenants never pay</span>
                  </h3>
                  <p>
                    <span lang="ar">المستأجر لا يدفع أي رسوم لاستخدام عقدي.</span>
                    <span lang="en">Aqdi is always free for tenants.</span>
                  </p>
                </div>
              </div>
              <div className="calc" data-reveal="">
                <h3>
                  <span lang="ar">احسب اشتراكك السنوي</span>
                  <span lang="en">Calculate your yearly price</span>
                </h3>
                <p className="muted">
                  <span lang="ar">أدخل عدد الوحدات في مكتبك.</span>
                  <span lang="en">Enter how many units your office manages.</span>
                </p>
                <div className="field">
                  <label htmlFor="units-num">
                    <span lang="ar">عدد الوحدات</span>
                    <span lang="en">Number of units</span>
                  </label>
                  <div className="units-row">
                    <input type="range" id="units-range" min="1" max="600" defaultValue="1" aria-label="Units" />
                    <input type="number" id="units-num" min="1" max="100000" defaultValue="1" inputMode="numeric" required />
                  </div>
                </div>
                <div className="total">
                  <b id="total-price">—</b>
                  {" "}
                  <span>
                    <span lang="ar">في السنة</span>
                    <span lang="en">per year</span>
                  </span>
                </div>
                <p className="daily" id="daily"></p>
                <p className="pitch">
                  <span lang="ar">دفعة وحدة تغطي السنة كاملة: العقود، التحصيل، الصيانة والتجديدات. أرخص من موظف يلاحق كل هذا، ومنصتنا ما تطلع إجازة.</span>
                  <span lang="en">One payment covers the whole year: contracts, rent collection, maintenance and renewals. Cheaper than hiring someone to chase all of it, and our platform never takes a day off.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="tinted">
          <div className="wrap">
            <div className="section-head">
              <div className="rule"></div>
              <h2 data-split="">
                <span lang="ar">أسئلة شائعة</span>
                <span lang="en">Common questions</span>
              </h2>
            </div>
            <div className="faq-list" id="faq-list">
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">هل يدفع المستأجر أي رسوم؟</span>
                    <span lang="en">Do tenants pay anything?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">لا. عقدي مجاني للمستأجر دائمًا، والمكتب فقط يدفع الاشتراك السنوي حسب عدد وحداته.</span>
                      <span lang="en">No. Aqdi is always free for tenants. Only the office pays, once a year, based on its number of units.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">هل يحتاج المستأجر إلى تحميل تطبيق أو إنشاء كلمة مرور؟</span>
                    <span lang="en">Do tenants need an app or a password?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">لا. تصله دعوة على واتساب، يفتح الرابط ويدخل برمز يصله في رسالة نصية. ويمكنه إضافة عقدي إلى الشاشة الرئيسية في جواله مثل أي تطبيق.</span>
                      <span lang="en">No. They get a WhatsApp invite, open the link and log in with a code sent by SMS. They can add Aqdi to their home screen like any app.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">ماذا لو أخطأ عقدي في قراءة عقد؟</span>
                    <span lang="en">What if Aqdi misreads a contract?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">أي معلومة غير واضحة أو ناقصة تظهر مظللة لتراجعها، ولا نحفظ أي شيء قبل موافقتك.</span>
                      <span lang="en">Anything unclear or missing is highlighted for you to check, and nothing is saved until you approve it.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">بعض عقودي ليست على منصة إيجار، فهل يمكنني استخدام عقدي؟</span>
                    <span lang="en">Some of my contracts aren&apos;t on Ejar. Can I still use Aqdi?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">نعم. يمكنك رفع ملف Excel بقالب عربي جاهز، أو إضافة الوحدات والعقود يدويًا. ويمكنك البدء بمبنى واحد وإضافة الباقي لاحقًا.</span>
                      <span lang="en">Yes. Upload an Excel file using a ready Arabic template, or add units and leases by hand. You can start with one building and add the rest later.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">كيف تحمون بيانات المستأجرين؟</span>
                    <span lang="en">How is tenant data protected?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">نحفظ أرقام الهوية والإقامة بشكل مشفّر، ولا يظهر منها في التطبيق إلا آخر 4 أرقام، وفق نظام حماية البيانات الشخصية في المملكة.</span>
                      <span lang="en">ID and iqama numbers are stored encrypted, and only the last 4 digits ever show in the app, in line with Saudi Arabia&apos;s Personal Data Protection Law.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">كيف يدفع المستأجر الإيجار؟</span>
                    <span lang="en">How do tenants pay rent?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">بمدى أو Apple Pay أو STC Pay أو البطاقة، حسب جدول الدفع في عقده: سنويًا أو كل ستة أشهر أو كل ثلاثة أشهر أو شهريًا. ويمكن للمكتب تسجيل الدفع النقدي أو التحويل البنكي يدويًا.</span>
                      <span lang="en">With mada, Apple Pay, STC Pay or card, on the schedule in their lease: yearly, every six months, quarterly or monthly. The office can also record cash or bank transfers by hand.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">ماذا لو أضفت وحدات خلال السنة؟</span>
                    <span lang="en">What if I add units during the year?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">الوحدات الجديدة مجانية حتى موعد التجديد، وعند التجديد يكون الاشتراك حسب العدد الجديد.</span>
                      <span lang="en">New units are free until your renewal. At renewal you pay for your new total.</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="faq-item" data-reveal="">
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>
                    <span lang="ar">متى يمكنني البدء؟</span>
                    <span lang="en">When can I start?</span>
                  </span>
                  <span className="plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div>
                    <p>
                      <span lang="ar">عقدي قيد التطوير حاليًا. التسجيل للمكاتب يبدأ قريبًا، وأول المكاتب تحصل على تهيئة مجانية.</span>
                      <span lang="en">Aqdi is in development. Registration for offices opens soon, and the first offices get free onboarding.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="closing" id="closing">
          <div className="wrap">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <rect width="64" height="64" rx="14" fill="var(--palm)"></rect>
                <g className="waves" fill="none" stroke="#f5f3ec" strokeWidth="3.6" strokeLinecap="round">
                  <path pathLength="1" d="M11 22 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                  <path pathLength="1" d="M11 33 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0"></path>
                  <path pathLength="1" d="M11 44 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0"></path>
                </g>
              </svg>
            </span>
            <div className="section-head">
              <h2 data-split="">
                <span lang="ar">مكتبك بالكامل في شاشة واحدة.</span>
                <span lang="en">Run your office from one screen.</span>
              </h2>
              <p data-reveal="">
                <span lang="ar">عقدي قيد التطوير. أول المكاتب تحصل على تهيئة مجانية وتشاركنا في بناء المنتج.</span>
                <span lang="en">Aqdi is in development. Early offices get free onboarding and help shape the product.</span>
              </p>
            </div>
            <span className="soon" data-reveal="">
              <span className="pulse" aria-hidden="true"></span>
              <span lang="ar">التسجيل للمكاتب يبدأ قريبًا</span>
              <span lang="en">Early access opening soon</span>
            </span>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap">
          <div>
            <span lang="ar">أسسه وطوّره</span>
            <span lang="en">Founded and built by</span>
            {" "}
            <span className="founder">Abdulhadi Almomen</span>
          </div>
          <div>
            © 2026
            {" "}
            <span lang="ar">عقدي</span>
            <span lang="en">Aqdi</span>
          </div>
        </div>
      </footer>
    </>
  );
}
