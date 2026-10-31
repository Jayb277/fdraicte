import './style.css'

type FdrRecord = {
  id: string
  owner: string
  institution: string
  amount: number
  rate: string
  issueDate: string
  maturity: string
  status: 'Active' | 'Renewal due' | 'Flagged'
  score: number
  bankVerified: boolean
  docId: string
  phone: string
  branch: string
}

type DuplicateCase = {
  id: string
  match: number
  reasons: string[]
  action: 'Merge' | 'Escalate' | 'Manual review'
}

type AuditEntry = {
  time: string
  actor: string
  note: string
}

const records: FdrRecord[] = [
  {
    id: 'FDR-20481',
    owner: 'Ravindra Nair',
    institution: 'State Bank of India',
    amount: 5200000,
    rate: '6.85%',
    issueDate: '2021-04-18',
    maturity: '2026-12-04',
    status: 'Active',
    score: 82,
    bankVerified: true,
    docId: 'SBI-PT-20481-IND',
    phone: '+91 98765 43210',
    branch: 'Bengaluru HQ'
  },
  {
    id: 'FDR-19872',
    owner: 'Ananya Menon',
    institution: 'HDFC Bank',
    amount: 8400000,
    rate: '7.10%',
    issueDate: '2022-02-11',
    maturity: '2026-11-16',
    status: 'Renewal due',
    score: 68,
    bankVerified: true,
    docId: 'HDFC-REG-19872',
    phone: '+91 90000 12433',
    branch: 'Kochi South'
  },
  {
    id: 'FDR-18734',
    owner: 'Suhas Raman',
    institution: 'Canara Bank',
    amount: 3150000,
    rate: '6.52%',
    issueDate: '2020-09-07',
    maturity: '2026-10-22',
    status: 'Flagged',
    score: 76,
    bankVerified: false,
    docId: 'CB-4389-ALB',
    phone: '+91 98118 07651',
    branch: 'Pune Market'
  }
]

const duplicates: DuplicateCase[] = [
  {
    id: 'FDR-20481 / FDR-20482',
    match: 96,
    reasons: ['Same depositor name and phone fingerprint', 'Matching principal amount and maturity window', 'Renewal chain references same branch ledger'],
    action: 'Merge'
  },
  {
    id: 'FDR-18734 / FDR-18739',
    match: 91,
    reasons: ['OCR-normalized customer surname matches', 'Cross-matched FDR amount and bank seal code', 'Instrument status transition mirrors historical replacement'],
    action: 'Manual review'
  }
]

const auditHistory: AuditEntry[] = [
  { time: '2026-10-30 09:30', actor: 'Aarav S.', note: 'OCR extraction completed and bank field set locked.' },
  { time: '2026-10-29 13:12', actor: 'Bank adapter', note: 'Verification call returned match with signed e-statement.' },
  { time: '2026-10-28 18:47', actor: 'Priya R.', note: 'Duplicate review reopened due to branch ledger anomaly.' },
  { time: '2026-10-27 11:04', actor: 'Rohit J.', note: 'Renewal reminder scheduled for customer contact.' }
]

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)

const formatDate = (value: string): string =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand-block">
        <div class="brand-mark">F</div>
        <div>
          <p class="eyebrow">AICTE & bank assurance</p>
          <h1>FDR-Sentinel</h1>
        </div>
      </div>

      <nav class="nav">
        <a class="nav-item active" href="#overview">Overview</a>
        <a class="nav-item" href="#ingestion">Ingestion</a>
        <a class="nav-item" href="#passport">Digital passport</a>
        <a class="nav-item" href="#duplicates">Duplicates</a>
        <a class="nav-item" href="#maturity">Maturity</a>
        <a class="nav-item" href="#audit">Audit</a>
      </nav>

      <div class="status-panel">
        <span class="pill success">System healthy</span>
        <p>15 live FDR portfolios</p>
        <p>3 flagged for review</p>
      </div>
    </aside>

    <main class="main-panel">
      <header class="topbar" id="overview">
        <div>
          <p class="eyebrow">Lifecycle assurance workspace</p>
          <h2>Financial deposit review dashboard</h2>
        </div>
        <div class="topbar-actions">
          <button class="ghost-button">Export</button>
          <button class="primary-button">Open review queue</button>
        </div>
      </header>

      <section class="summary-grid">
        <article class="stat-card accent">
          <span class="kicker">Portfolio value</span>
          <strong>₹1.84 Cr</strong>
          <small>+8.2% vs last month</small>
        </article>
        <article class="stat-card">
          <span class="kicker">Verified</span>
          <strong>12/15</strong>
          <small>80% matched to bank ledger</small>
        </article>
        <article class="stat-card">
          <span class="kicker">Renewal due</span>
          <strong>04</strong>
          <small>2 within 30 days</small>
        </article>
        <article class="stat-card warning">
          <span class="kicker">Risk flags</span>
          <strong>03</strong>
          <small>2 duplicates, 1 anomaly</small>
        </article>
      </section>

      <section class="panel intake-panel" id="ingestion">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Intake layer</p>
            <h3>PDF upload and OCR</h3>
          </div>
          <span class="pill neutral">OCR confidence 96%</span>
        </div>

        <div class="intake-grid">
          <div class="upload-box">
            <label class="upload-area" for="file-upload">
              <input id="file-upload" type="file" accept=".pdf,image/*" />
              <div class="upload-icon">⇪</div>
              <strong>Drop or upload FDR PDF</strong>
              <small>Institution-issued document, OCR, evidence capture</small>
            </label>
            <div class="upload-meta">
              <div>
                <span class="meta-label">Source file</span>
                <strong id="file-name">FDR-20481_issued_2026.pdf</strong>
              </div>
              <div>
                <span class="meta-label">Status</span>
                <strong class="success-text">Ready for verification</strong>
              </div>
            </div>
          </div>

          <div class="ocr-box">
            <div class="ocr-header">
              <span>Extracted fields</span>
              <button class="link-button">Run OCR</button>
            </div>
            <div class="ocr-grid">
              <div><span>Depositor</span><strong>Ravindra Nair</strong></div>
              <div><span>FDR No.</span><strong>FDR-20481</strong></div>
              <div><span>Amount</span><strong>₹52,00,000</strong></div>
              <div><span>Issue date</span><strong>18 Apr 2021</strong></div>
              <div><span>Maturity</span><strong>04 Dec 2026</strong></div>
              <div><span>Bank seal</span><strong>Verified</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <div class="panel" id="passport">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Source-linked record</p>
              <h3>Digital FDR passport</h3>
            </div>
            <button class="link-button">View audit trail</button>
          </div>

          <div class="record-list" id="record-list"></div>

          <div class="passport-card">
            <div class="passport-head">
              <div>
                <span class="meta-label">Record ID</span>
                <h4 id="passport-id">FDR-20481</h4>
              </div>
              <span id="passport-status" class="pill success">Active</span>
            </div>

            <div class="passport-grid">
              <div><span>Owner</span><strong id="passport-owner">Ravindra Nair</strong></div>
              <div><span>Institution</span><strong id="passport-bank">State Bank of India</strong></div>
              <div><span>Principal</span><strong id="passport-amount">₹52,00,000</strong></div>
              <div><span>Interest rate</span><strong id="passport-rate">6.85%</strong></div>
              <div><span>Issue date</span><strong id="passport-issue">18 Apr 2021</strong></div>
              <div><span>Maturity</span><strong id="passport-maturity">04 Dec 2026</strong></div>
              <div><span>Phone</span><strong id="passport-phone">+91 98765 43210</strong></div>
              <div><span>Branch</span><strong id="passport-branch">Bengaluru HQ</strong></div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Evidence assurance</p>
              <h3>Bank verification</h3>
            </div>
            <span class="pill success">Verified by live mock API</span>
          </div>

          <div class="verification-grid">
            <div class="evidence-card">
              <h4>Institution declaration</h4>
              <ul>
                <li>Depositor name: <strong>Ravindra Nair</strong></li>
                <li>Principal: <strong>₹52,00,000</strong></li>
                <li>Issue date: <strong>18 Apr 2021</strong></li>
                <li>Bank seal ref: <strong>SBI-PT-20481-IND</strong></li>
              </ul>
            </div>
            <div class="evidence-card highlighted">
              <h4>Bank ledger match</h4>
              <ul>
                <li>Ledger ID: <strong>121440998</strong></li>
                <li>Account status: <strong>Active</strong></li>
                <li>Recorded maturity: <strong>04 Dec 2026</strong></li>
                <li>Verified by: <strong>Bank API / signed statement</strong></li>
              </ul>
            </div>
          </div>

          <div class="verification-footer">
            <div class="score-row">
              <span>Evidence score</span>
              <strong>96/100</strong>
            </div>
            <div class="progress-bar"><span style="width: 96%"></span></div>
          </div>
        </div>
      </section>

      <section class="panel" id="duplicates">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Graphed anomaly review</p>
            <h3>Duplicate detection with explainable matching</h3>
          </div>
          <span class="pill warning">2 candidate duplicates</span>
        </div>

        <div class="duplicate-list" id="duplicate-list"></div>
      </section>

      <section class="timeline-grid" id="maturity">
        <div class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Temporal workflow</p>
              <h3>Maturity and renewal monitoring</h3>
            </div>
          </div>

          <div class="timeline-box">
            <div class="timeline-item">
              <span class="timeline-dot success"></span>
              <div>
                <strong>Issued</strong>
                <small>18 Apr 2021</small>
              </div>
            </div>
            <div class="timeline-item">
              <span class="timeline-dot warning"></span>
              <div>
                <strong>Renewal reminder</strong>
                <small>Due in 12 days</small>
              </div>
            </div>
            <div class="timeline-item">
              <span class="timeline-dot danger"></span>
              <div>
                <strong>Auto-rollover review</strong>
                <small>If no action by 30 Nov 2026</small>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Policy engine</p>
              <h3>Renewal watchlist</h3>
            </div>
          </div>

          <div class="renewal-list">
            <div class="renewal-item">
              <div>
                <strong>HDFC Bank</strong>
                <small>FDR-19872 • 7.10%</small>
              </div>
              <span class="pill warning">3 days left</span>
            </div>
            <div class="renewal-item">
              <div>
                <strong>Canara Bank</strong>
                <small>FDR-18734 • Flagged</small>
              </div>
              <span class="pill danger">Manual check</span>
            </div>
            <div class="renewal-item">
              <div>
                <strong>ICICI Bank</strong>
                <small>FDR-22106 • 6.90%</small>
              </div>
              <span class="pill success">On track</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel" id="audit">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Regulatory trace</p>
            <h3>Audit history</h3>
          </div>
          <button class="link-button">Export ledger</button>
        </div>

        <div class="audit-list" id="audit-list"></div>
      </section>
    </main>
  </div>
`

const recordList = document.querySelector<HTMLDivElement>('#record-list')
const duplicateList = document.querySelector<HTMLDivElement>('#duplicate-list')
const auditList = document.querySelector<HTMLDivElement>('#audit-list')
const fileUpload = document.querySelector<HTMLInputElement>('#file-upload')
const fileName = document.querySelector<HTMLElement>('#file-name')

const updatePassport = (index: number): void => {
  const record = records[index]

  const passportId = document.querySelector<HTMLElement>('#passport-id')
  const passportStatus = document.querySelector<HTMLElement>('#passport-status')
  const passportOwner = document.querySelector<HTMLElement>('#passport-owner')
  const passportBank = document.querySelector<HTMLElement>('#passport-bank')
  const passportAmount = document.querySelector<HTMLElement>('#passport-amount')
  const passportRate = document.querySelector<HTMLElement>('#passport-rate')
  const passportIssue = document.querySelector<HTMLElement>('#passport-issue')
  const passportMaturity = document.querySelector<HTMLElement>('#passport-maturity')
  const passportPhone = document.querySelector<HTMLElement>('#passport-phone')
  const passportBranch = document.querySelector<HTMLElement>('#passport-branch')

  if (!passportId || !passportStatus || !passportOwner || !passportBank || !passportAmount || !passportRate || !passportIssue || !passportMaturity || !passportPhone || !passportBranch) {
    return
  }

  passportId.textContent = record.id
  passportStatus.textContent = record.status
  passportStatus.className = `pill ${record.status === 'Active' ? 'success' : record.status === 'Renewal due' ? 'warning' : 'danger'}`
  passportOwner.textContent = record.owner
  passportBank.textContent = record.institution
  passportAmount.textContent = formatCurrency(record.amount)
  passportRate.textContent = record.rate
  passportIssue.textContent = formatDate(record.issueDate)
  passportMaturity.textContent = formatDate(record.maturity)
  passportPhone.textContent = record.phone
  passportBranch.textContent = record.branch
}

const renderRecordList = (): void => {
  if (!recordList) {
    return
  }

  recordList.innerHTML = records
    .map(
      (record, index) => `
        <button class="record-item ${index === 0 ? 'active' : ''}" data-index="${index}" type="button">
          <div>
            <span class="record-label">${record.id}</span>
            <strong>${record.owner}</strong>
          </div>
          <div class="record-meta">
            <span>${record.institution}</span>
            <span>${record.status}</span>
          </div>
        </button>
      `
    )
    .join('')

  recordList.querySelectorAll<HTMLButtonElement>('.record-item').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index)
      recordList.querySelectorAll('.record-item').forEach((item) => item.classList.remove('active'))
      button.classList.add('active')
      updatePassport(index)
    })
  })
}

const renderDuplicates = (): void => {
  if (!duplicateList) {
    return
  }

  duplicateList.innerHTML = duplicates
    .map(
      (item) => `
        <div class="duplicate-card">
          <div class="duplicate-head">
            <div>
              <span class="meta-label">Candidate pair</span>
              <strong>${item.id}</strong>
            </div>
            <span class="pill ${item.action === 'Merge' ? 'success' : item.action === 'Escalate' ? 'danger' : 'warning'}">${item.action}</span>
          </div>
          <div class="match-line">
            <span>Match score</span>
            <strong>${item.match}%</strong>
          </div>
          <ul>
            ${item.reasons.map((reason) => `<li>${reason}</li>`).join('')}
          </ul>
        </div>
      `
    )
    .join('')
}

const renderAudit = (): void => {
  if (!auditList) {
    return
  }

  auditList.innerHTML = auditHistory
    .map(
      (entry) => `
        <div class="audit-item">
          <div class="audit-time">${entry.time}</div>
          <div class="audit-content">
            <strong>${entry.actor}</strong>
            <p>${entry.note}</p>
          </div>
        </div>
      `
    )
    .join('')
}

const handleUpload = (event: Event): void => {
  const input = event.currentTarget as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  if (fileName) {
    fileName.textContent = file.name
  }

  const scanned = {
    depositor: 'Ravindra Nair',
    amount: '₹52,00,000',
    issueDate: '18 Apr 2021',
    maturity: '04 Dec 2026',
    branch: 'Bengaluru HQ',
    bankCode: 'SBI-PT-20481-IND'
  }

  const ocrNodes = document.querySelectorAll<HTMLElement>('.ocr-grid strong')
  if (ocrNodes.length >= 6) {
    ocrNodes[0].textContent = scanned.depositor
    ocrNodes[1].textContent = 'FDR-20481'
    ocrNodes[2].textContent = scanned.amount
    ocrNodes[3].textContent = scanned.issueDate
    ocrNodes[4].textContent = scanned.maturity
    ocrNodes[5].textContent = 'Verified'
  }

  const statusText = document.querySelector<HTMLElement>('.success-text')
  if (statusText) {
    statusText.textContent = 'OCR processed · bank match pending'
  }
}

if (fileUpload) {
  fileUpload.addEventListener('change', handleUpload)
}

renderRecordList()
updatePassport(0)
renderDuplicates()
renderAudit()
