import fs from 'fs';
import path from 'path';

/**
 * Escapes characters that have special meaning in PDF literal strings.
 */
function escapePdfText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Generates a valid PDF 1.4 binary buffer.
 * Standard A4 size: 595.28 x 841.89 points.
 */
export function generatePdfBuffer({
  title = 'Gram Panchayat Official Document',
  subtitle = 'Citizen Service & Governance Document',
  category = 'Official Form',
  refNo = 'GP-DOC-' + Math.floor(100000 + Math.random() * 900000),
  date = new Date().toLocaleDateString('en-GB'),
  contentLines = [],
}) {
  // Build stream content
  let stream = '';

  // 1. Top Green Header Bar (Y: 760 to 842)
  stream += '0.06 0.35 0.24 rg\n';
  stream += '0 760 595.28 82 re f\n';

  // Header Text
  stream += '1 1 1 rg\n';
  stream += 'BT\n/F2 16 Tf\n50 812 Td\n(YEWLA GRAM PANCHAYAT - DIST. JALNA) Tj\nET\n';
  stream += 'BT\n/F1 10 Tf\n50 794 Td\n(GOVERNMENT OF MAHARASHTRA | CITIZEN SERVICE SYSTEM) Tj\nET\n';
  stream += 'BT\n/F1 9 Tf\n50 776 Td\n(GramSeva Digital Portal | Registration & Redressal Center) Tj\nET\n';

  // 2. Gold Accent Line
  stream += '0.85 0.47 0.02 rg\n';
  stream += '0 754 595.28 6 re f\n';

  // 3. Document Title Box (Y: 670 to 735)
  stream += '0.96 0.98 0.96 rg\n';
  stream += '40 670 515.28 65 re f\n';
  stream += '0.06 0.35 0.24 RG\n1.2 w\n';
  stream += '40 670 515.28 65 re S\n';

  stream += 'BT\n/F2 13 Tf\n0.06 0.35 0.24 rg\n55 712 Td\n(' + escapePdfText(title) + ') Tj\nET\n';
  stream += 'BT\n/F1 10 Tf\n0.35 0.35 0.35 rg\n55 692 Td\n(' + escapePdfText(subtitle) + ') Tj\nET\n';

  // 4. Metadata details (Ref No, Date, Category)
  stream += 'BT\n/F2 10 Tf\n0.15 0.15 0.15 rg\n50 642 Td\n(Reference / Form ID:) Tj\nET\n';
  stream += 'BT\n/F1 10 Tf\n0.2 0.4 0.3 rg\n170 642 Td\n(' + escapePdfText(refNo) + ') Tj\nET\n';

  stream += 'BT\n/F2 10 Tf\n0.15 0.15 0.15 rg\n360 642 Td\n(Issue Date:) Tj\nET\n';
  stream += 'BT\n/F1 10 Tf\n0.2 0.2 0.2 rg\n430 642 Td\n(' + escapePdfText(date) + ') Tj\nET\n';

  stream += 'BT\n/F2 10 Tf\n0.15 0.15 0.15 rg\n50 622 Td\n(Category / Type:) Tj\nET\n';
  stream += 'BT\n/F1 10 Tf\n0.2 0.2 0.2 rg\n170 622 Td\n(' + escapePdfText(category) + ') Tj\nET\n';

  stream += 'BT\n/F2 10 Tf\n0.15 0.15 0.15 rg\n360 622 Td\n(Authority:) Tj\nET\n';
  stream += 'BT\n/F1 10 Tf\n0.2 0.2 0.2 rg\n430 622 Td\n(Panchayat Executive) Tj\nET\n';

  // Horizontal divider
  stream += '0.8 0.8 0.8 RG\n1 w\n';
  stream += '40 605 m 555.28 605 l S\n';

  // 5. Body Content Box
  stream += '0.99 0.99 0.99 rg\n';
  stream += '40 220 515.28 370 re f\n';
  stream += '0.88 0.90 0.92 RG\n0.8 w\n';
  stream += '40 220 515.28 370 re S\n';

  // Section Header
  stream += 'BT\n/F2 11 Tf\n0.06 0.35 0.24 rg\n55 570 Td\n(DOCUMENT SPECIFICATIONS & APPLICATION INSTRUCTIONS:) Tj\nET\n';

  // Print content lines
  let currentY = 545;
  const defaultLines = [
    '1. Purpose: This official format is authorized by Yewla Gram Panchayat for public application.',
    '2. Eligibility: Open to all bonafide residents of Ward 1 to Ward 10, Yewla, Dist. Jalna.',
    '3. Mandatory Attachments: Valid Identity Proof (Aadhaar / Voter ID) and Property/Extract Copy.',
    '4. Submission: Submit the signed printout to Gram Panchayat Bhavan, Main Market Road, Yewla.',
    '5. Verification: Applications undergo inspection by designated Ward Officer & Gram Sevak.',
    '6. Resolution SLA: Typically processed and certified within 3 to 7 working days.',
    '7. Digital Tracking: Track real-time progress via GramSeva mobile app using the Reference ID.',
    '8. Notice: Any false representation is punishable under Maharashtra Village Panchayat Act 1958.',
  ];

  const linesToRender = contentLines.length > 0 ? contentLines : defaultLines;
  for (let i = 0; i < linesToRender.length && currentY > 240; i++) {
    const line = linesToRender[i];
    stream += 'BT\n/F1 9.5 Tf\n0.2 0.2 0.2 rg\n55 ' + currentY + ' Td\n(' + escapePdfText(line) + ') Tj\nET\n';
    currentY -= 24;
  }

  // 6. Seal Box on Left (Y: 105 to 195)
  stream += '0.95 0.97 0.95 rg\n';
  stream += '50 105 210 90 re f\n';
  stream += '0.06 0.35 0.24 RG\n1 w\n';
  stream += '50 105 210 90 re S\n';
  stream += 'BT\n/F2 9.5 Tf\n0.06 0.35 0.24 rg\n60 175 Td\n([OFFICIAL DIGITAL GP SEAL]) Tj\nET\n';
  stream += 'BT\n/F1 8.5 Tf\n0.25 0.25 0.25 rg\n60 158 Td\n(Gram Panchayat Office, Yewla) Tj\nET\n';
  stream += 'BT\n/F1 8.5 Tf\n0.25 0.25 0.25 rg\n60 142 Td\n(District Jalna, Maharashtra - 423401) Tj\nET\n';
  stream += 'BT\n/F1 8 Tf\n0.4 0.4 0.4 rg\n60 126 Td\n(Helpline: 7666718978 / 02559-222100) Tj\nET\n';

  // 7. Signature Box on Right (Y: 105 to 195)
  stream += '0.95 0.97 0.95 rg\n';
  stream += '335 105 210 90 re f\n';
  stream += '0.06 0.35 0.24 RG\n1 w\n';
  stream += '335 105 210 90 re S\n';
  stream += 'BT\n/F2 9.5 Tf\n0.06 0.35 0.24 rg\n345 175 Td\n(VERIFIED & AUTHORIZED) Tj\nET\n';
  stream += 'BT\n/F2 9.5 Tf\n0.15 0.15 0.15 rg\n345 158 Td\n(Yuvraj Jadhav) Tj\nET\n';
  stream += 'BT\n/F1 8.5 Tf\n0.3 0.3 0.3 rg\n345 142 Td\n(Gram Sevak & Panchayat Administrator) Tj\nET\n';
  stream += 'BT\n/F1 8 Tf\n0.4 0.4 0.4 rg\n345 126 Td\n(Yewla Gram Panchayat, Dist. Jalna) Tj\nET\n';

  // 8. Dark Footer (Y: 0 to 40)
  stream += '0.08 0.12 0.10 rg\n';
  stream += '0 0 595.28 40 re f\n';
  stream += '1 1 1 rg\n';
  stream += 'BT\n/F1 8 Tf\n50 16 Td\n(Official digital document generated by Yewla Gram Panchayat Citizen Service Platform.) Tj\nET\n';
  stream += 'BT\n/F1 8 Tf\n490 16 Td\n(Page 1 of 1) Tj\nET\n';

  const streamLength = Buffer.byteLength(stream, 'utf-8');

  // Build PDF Objects
  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n'
  );
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');
  objects.push(`6 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`);

  let header = '%PDF-1.4\n';
  let body = '';
  const offsets = [0]; // offset 0 is 0

  let currentOffset = Buffer.byteLength(header, 'utf-8');
  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset);
    body += objects[i];
    currentOffset += Buffer.byteLength(objects[i], 'utf-8');
  }

  const startXref = currentOffset;
  let xref = 'xref\n0 7\n0000000000 65535 f \n';
  for (let i = 1; i <= 6; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  return Buffer.from(header + body + xref + trailer, 'utf-8');
}

/**
 * Ensures that all default seeded documents exist as real PDF files in uploads directory.
 */
export function ensureDefaultPdfsExist(uploadsDir) {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const defaultFiles = [
    {
      fileName: 'citizen_charter_yewla.pdf',
      title: 'Gram Panchayat Citizen Charter 2026 (नागरिक सनद)',
      subtitle: 'Public Services, Timeline, Rights & Grievance Guidelines',
      category: 'Citizen Charter',
      refNo: 'GP-YEW-CC-2026',
      contentLines: [
        '1. Purpose: Setting standards of accountable governance for Yewla Gram Panchayat citizens.',
        '2. Birth & Death Certificates: Delivered within 3 working days upon verified hospital/home intimation.',
        '3. Water Supply Redressal: Pipeline leaks and drinking water breakdowns addressed within 24 hours.',
        '4. Street Lighting Redressal: Defective street lights and pole repairs addressed within 48 hours.',
        '5. Property Extract (8-A / 7-12): Extract computation and verified copies issued within 2 working days.',
        '6. Gram Sabha Meetings: Minimum 4 regular sabhas and special sabhas conducted yearly with public notice.',
        '7. Right to Information (RTI): Responded strictly within statutory 30 days window by Public Info Officer.',
        '8. Grievance Redressal: Every submitted complaint is assigned an officer and audited transparently.',
      ],
    },
    {
      fileName: 'birth_death_registration_form.pdf',
      title: 'Birth and Death Registration Application Form No. 1',
      subtitle: 'Official Prescribed Format under Registration of Births & Deaths Act',
      category: 'Forms',
      refNo: 'GP-YEW-BDR-01',
      contentLines: [
        '1. Full Name of the Child / Deceased Person (in English & Marathi).',
        '2. Date and Precise Time of Occurrence of Event (Birth or Demise).',
        '3. Exact Place of Event: Residence address or Hospital/Clinic Name & Ward.',
        '4. Permanent Address of Parents / Next of Kin in Yewla Gram Panchayat.',
        '5. Father / Husband / Guardian Name and Contact Mobile Number.',
        '6. Supporting Documents Required: Hospital Discharge Summary / Cremation Receipt & Aadhaar Copy.',
        '7. Mandatory: Event must be registered within 21 days of occurrence without late fee penalty.',
        '8. Verification: Verified by Anganwadi Sevika / Rural Health Worker prior to certificate issuance.',
      ],
    },
    {
      fileName: 'water_connection_form.pdf',
      title: 'Water Tap Connection Application & NOC Format',
      subtitle: 'Piped Drinking Water Connection Application (Jal Jeevan Mission)',
      category: 'Forms',
      refNo: 'GP-YEW-WTR-NOC',
      contentLines: [
        '1. Applicant Full Name, Household Assessment Number, and Ward Number.',
        '2. Complete Residential Address and Location Coordinates/Landmark.',
        '3. Type of Connection Requested: Domestic (घरगुती) / Commercial (व्यावसायिक).',
        '4. Diameter of Connection: 1/2 Inch standard domestic connection.',
        '5. Property Tax Clearance: Applicant must have paid updated property tax extract up to current year.',
        '6. Plumbing Feasibility: Junior Engineer will inspect underground distribution pipeline proximity.',
        '7. Connection Fees: To be deposited at Gram Panchayat counter against computerized receipt.',
        '8. Agreement: Applicant commits not to use booster pump directly on connection line.',
      ],
    },
    {
      fileName: 'annual_budget_report_2025_26.pdf',
      title: 'Approved Annual Village Budget Summary Report 2025-26',
      subtitle: 'Financial Allocation, Revenue Estimates & Infrastructure Works (ग्राम विकास अंदाजपत्रक)',
      category: 'Reports',
      refNo: 'GP-YEW-BUDGET-2526',
      contentLines: [
        '1. Total Sanctioned GP Development Budget: INR 1,48,50,000/- (One Crore Forty-Eight Lakhs).',
        '2. Drinking Water Supply & Jal Jeevan Maintenance: INR 48,50,000/- (32.6% allocation).',
        '3. Village Concrete Roads & Drain Gutters: INR 35,00,000/- (23.5% allocation).',
        '4. Village Sanitation, Solid Waste & Solar Street Lighting: INR 22,00,000/- (14.8% allocation).',
        '5. Health, Anganwadi & Primary School Infrastructure: INR 18,00,000/- (12.1% allocation).',
        '6. Women & Child Development (Mahila & Bal Kalyan 10% fund): INR 14,85,000/-.',
        '7. SC/ST & Backward Class Upliftment Fund (20% statutory allocation): INR 29,70,000/-.',
        '8. Audit Resolution: Approved unanimously in Special Gram Sabha dated 26th January 2025.',
      ],
    },
  ];

  for (const doc of defaultFiles) {
    const filePath = path.join(uploadsDir, doc.fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`[PDF] Generating real PDF for ${doc.fileName}...`);
      const buffer = generatePdfBuffer(doc);
      fs.writeFileSync(filePath, buffer);
    }
  }
}

// Automatically ensure PDFs are generated for both possible working directories
try {
  ensureDefaultPdfsExist(path.resolve('uploads'));
  ensureDefaultPdfsExist(path.resolve('backend/uploads'));
} catch (e) {
  // ignore
}
