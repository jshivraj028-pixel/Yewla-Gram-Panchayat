import { User } from '../models/User.js';
import { Complaint } from '../models/Complaint.js';
import { ComplaintHistory } from '../models/ComplaintHistory.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { Notice } from '../models/Notice.js';
import { Scheme } from '../models/Scheme.js';
import { Event } from '../models/Event.js';
import { Project } from '../models/Project.js';
import { Document } from '../models/Document.js';
import { EmergencyContact } from '../models/EmergencyContact.js';
import { Gallery } from '../models/Gallery.js';
import { Notification } from '../models/Notification.js';

export const seedDatabase = async () => {
  console.log('[Seed] Seeding initial data for Yewla Gram Panchayat...');

  // 1. Admin
  const admin = await User.create({
    name: 'Yuvraj Jadhav',
    mobile: '7666718978',
    email: 'jshivraj028@gmail.com',
    password: 'Pass@123',
    role: 'admin',
    address: 'Gram Panchayat Administrative Bhavan, Yewla',
    wardNumber: 1,
    designation: 'Gram Sevak & Administrator',
    isActive: true,
  });

  // 2. Staff
  const staff1 = await User.create({
    name: 'Smt. Sunita Shinde',
    mobile: '9876543211',
    email: 'staff@yewlagp.in',
    password: 'StaffPassword123!',
    role: 'staff',
    address: 'Quarter No. 4, GP Campus, Yewla',
    wardNumber: 2,
    designation: 'Junior Engineer (Civil & Water)',
    isActive: true,
  });

  const staff2 = await User.create({
    name: 'Shri Manoj Pawar',
    mobile: '9876543212',
    email: 'manoj.pawar@yewlagp.in',
    password: 'StaffPassword123!',
    role: 'staff',
    address: 'Ward No. 3, Yewla',
    wardNumber: 3,
    designation: 'Sanitation & Health Inspector',
    isActive: true,
  });

  // 3. Citizens
  const citizen1 = await User.create({
    name: 'Ganesh Tukaram More',
    mobile: '9876543220',
    email: 'citizen@yewlagp.in',
    password: 'CitizenPassword123!',
    role: 'citizen',
    address: 'House No. 45, Shivaji Chowk, Ward 3, Yewla',
    wardNumber: 3,
    isActive: true,
  });

  const citizen2 = await User.create({
    name: 'Pooja Santosh Jadhav',
    mobile: '9876543221',
    email: 'pooja@yewlagp.in',
    password: 'CitizenPassword123!',
    role: 'citizen',
    address: 'Near ZP School, Station Road, Ward 4, Yewla',
    wardNumber: 4,
    isActive: true,
  });

  // Emergency Contacts
  await EmergencyContact.insertMany([
    {
      name: 'Yewla Police Station',
      marathiName: 'येवला पोलीस ठाणे',
      department: 'Police',
      phoneNumber: '02559-267233',
      altPhoneNumber: '112',
      address: 'Police Station Road, Yewla, Dist. Jalna',
      priorityOrder: 1,
    },
    {
      name: 'Government Rural Hospital & Ambulance',
      marathiName: 'शासकीय ग्रामीण रुग्णालय व रुग्णवाहिका',
      department: 'Ambulance',
      phoneNumber: '108',
      altPhoneNumber: '02559-267102',
      address: 'Hospital Road, Yewla',
      priorityOrder: 2,
    },
    {
      name: 'Yewla Fire Brigade Services',
      marathiName: 'अग्निशामक दल येवला',
      department: 'Fire Brigade',
      phoneNumber: '101',
      altPhoneNumber: '02559-268101',
      address: 'Fire Station, Main Road, Yewla',
      priorityOrder: 3,
    },
    {
      name: 'Gram Panchayat Citizen Helpline',
      marathiName: 'ग्रामपंचायत नागरिक तक्रार निवारण केंद्र',
      department: 'Gram Panchayat Office',
      phoneNumber: '02559-268001',
      altPhoneNumber: '7666718978',
      address: 'Gram Panchayat Bhavan, Yewla',
      priorityOrder: 4,
    },
    {
      name: 'MSEDCL Electricity Emergency Center',
      marathiName: 'महावितरण वीज पुरवठा तक्रार केंद्र',
      department: 'Electricity',
      phoneNumber: '1800-233-3435',
      altPhoneNumber: '1912',
      address: 'MSEDCL Substation, Yewla',
      priorityOrder: 5,
    },
    {
      name: 'Village Water Supply Operator',
      marathiName: 'गाव पाणीपुरवठा नियंत्रक कक्ष',
      department: 'Water Department',
      phoneNumber: '9822334455',
      altPhoneNumber: '02559-268002',
      address: 'Water Works, Water Tank Ground, Yewla',
      priorityOrder: 6,
    },
  ]);

  // Notices
  await Notice.insertMany([
    {
      title: 'Special Gram Sabha Meeting Notice regarding Village Budget 2026-27',
      marathiTitle: 'विशेष ग्रामसभा सूचना - ग्राम वार्षिक अंदाजपत्रक २०२६-२७ बाबत',
      description:
        'All respected villagers are hereby notified that a Special Gram Sabha will be held on 25th September at 11:00 AM in the Gram Panchayat Hall. Agenda items include approval of road development tenders, Jal Jeevan Mission review, and village welfare allocations.',
      marathiDescription:
        'सर्व ग्रामस्थांना कळविण्यात येते की येत्या २५ सप्टेंबर रोजी सकाळी ११:०० वाजता ग्रामपंचायत सभागृहात विशेष ग्रामसभेचे आयोजन करण्यात आले आहे. सर्व नागरिकांनी वेळेवर उपस्थित राहावे.',
      category: 'Gram Sabha',
      isPinned: true,
      isPublished: true,
      author: admin._id,
    },
    {
      title: 'Drinking Water Pipeline Maintenance & Schedule Update',
      marathiTitle: 'पिण्याच्या पाण्याच्या पाईपलाईन दुरुस्ती व वेळ वेळापत्रक',
      description:
        'Maintenance work on the main raw water valve from the storage dam will take place tomorrow. Water supply will be supplied from 7:00 AM to 9:00 AM only. Kindly store required water.',
      marathiDescription:
        'उद्या मुख्य जलवाहिनीची दुरुस्ती होणार असल्याने पाणीपुरवठा सकाळी ७ ते ९ या वेळेतच राहील. कृपया आवश्यक पाणी साठवून ठेवावे.',
      category: 'General',
      isPinned: false,
      isPublished: true,
      author: staff1._id,
    },
    {
      title: 'Subsidy Scheme for Solar Agricultural Pumps Announced',
      marathiTitle: 'शेतकऱ्यांसाठी सौर कृषी पंप अनुदानासाठी अर्ज सुरू',
      description:
        'Under Mukhyamantri Saur Krushi Pump Yojana, eligible farmers can apply for 90-95% subsidized solar pump sets. Visit the Gram Panchayat office with 7/12 extract and Aadhaar card before 30th September.',
      marathiDescription:
        'मुख्यमंत्री सौर कृषी पंप योजनेअंतर्गत ९०-९५% अनुदानावर सौर पंप उपलब्ध आहेत. इच्छुक शेतकऱ्यांनी ७/१२ उतारा व आधार कार्डसह संपर्क साधावा.',
      category: 'Agriculture',
      isPinned: true,
      isPublished: true,
      author: admin._id,
    },
    {
      title: 'Property Tax & Water Tax Early Bird 10% Rebate',
      marathiTitle: 'घरपट्टी व पाणीपट्टी वेळेवर भरणाऱ्यांसाठी १०% सवलत',
      description:
        'Pay your village property tax and water tax before 15th October to enjoy an automatic 10% rebate. Online receipt download available through GramSeva portal.',
      marathiDescription:
        '१५ ऑक्टोबरपूर्वी चालू वर्षाची घरपट्टी व पाणीपट्टी भरून १०% सवलतीचा लाभ घ्या. ऑनलाईन पावती उपलब्ध आहे.',
      category: 'Tax Notice',
      isPinned: false,
      isPublished: true,
      author: admin._id,
    },
  ]);

  // Schemes
  await Scheme.insertMany([
    {
      name: 'Pradhan Mantri Awas Yojana (Gramin)',
      marathiName: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
      category: 'Housing',
      description:
        'Financial assistance of Rs. 1,20,000 for construction of pucca houses for homeless rural households and families living in kutcha/dilapidated homes.',
      marathiDescription:
        'बेघर व कच्च्या घरात राहणाऱ्या ग्रामीण कुटुंबांना पक्के घर बांधण्यासाठी रु. १,२०,००० आर्थिक सहाय्य दिले जाते.',
      eligibility:
        'Rural families registered under SECC 2011 housing deprivation criteria, not owning a pucca house in India.',
      marathiEligibility: 'SECC यादीतील पात्र लाभार्थी व ज्यांच्याकडे पक्के घर नाही असे कुटुंब.',
      requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Bank Passbook', 'Land Possession Document (8-A)', 'Job Card'],
      applicationProcess: 'Apply online through Gram Panchayat counter with certified documents.',
      benefitAmount: 'Rs. 1,20,000 + 90 days MGNREGA wages',
      officialLink: 'https://pmayg.nic.in',
      isActive: true,
    },
    {
      name: 'Mukhyamantri Saur Krushi Pump Yojana',
      marathiName: 'मुख्यमंत्री सौर कृषी पंप योजना',
      category: 'Agriculture',
      description:
        'Provides solar powered water pump sets to farmers where conventional grid electricity is unavailable, with up to 95% government subsidy.',
      marathiDescription:
        'शेतकऱ्यांना सिंचनासाठी दिवसा वीज उपलब्ध व्हावी यासाठी ९० ते ९५% अनुदानावर सौर पंप संच दिले जातात.',
      eligibility: 'Farmers having assured water source and no conventional electric pump connection.',
      marathiEligibility: 'पाण्याचा निश्चित स्त्रोत असणारे व वीज जोडणी नसलेले शेतकरी.',
      requiredDocuments: ['7/12 Extract', '8-A Extract', 'Aadhaar Card', 'Caste Certificate (if applicable)', 'Bank Details'],
      applicationProcess: 'Submit application via MSEDCL solar portal or Gram Panchayat digital services desk.',
      benefitAmount: 'Up to 95% Subsidy on 3HP / 5HP / 7.5HP Solar Pumps',
      officialLink: 'https://www.mahadiscom.in/solar_MKSY',
      isActive: true,
    },
    {
      name: 'Sanjay Gandhi Niradhar Anudan Yojana',
      marathiName: 'संजय गांधी निराधार अनुदान योजना',
      category: 'Social Welfare',
      description:
        'Monthly financial pension grant for destitute persons, disabled individuals, widows, and vulnerable elderly persons with no family support.',
      marathiDescription:
        'निराधार व्यक्ती, अंध, अपंग, विधवा, घटस्फोटित महिलांना दरमहा आर्थिक पेन्शन स्वरुपात मदत दिली जाते.',
      eligibility: 'Family annual income under Rs. 21,000, age above 65 years or with qualifying disability/destitution.',
      marathiEligibility: 'वार्षिक उत्पन्न रु. २१,००० पेक्षा कमी असणारे निराधार नागरिक.',
      requiredDocuments: ['Age Proof', 'Income Certificate by Tahsildar', 'Disability Certificate (if applicable)', 'Ration Card'],
      applicationProcess: 'Submit through Setu / Tahsil office routed via Gram Panchayat.',
      benefitAmount: 'Rs. 1,500 per month',
      officialLink: 'https://sjsa.maharashtra.gov.in',
      isActive: true,
    },
    {
      name: 'Majhi Kanya Bhagyashree Yojana',
      marathiName: 'माझी कन्या भाग्यश्री योजना',
      category: 'Women & Child',
      description:
        'Encourages girl child education and welfare by investing Rs. 50,000 fixed deposit in the name of the newborn girl child upon family planning.',
      marathiDescription:
        'मुलींच्या शिक्षणाला व आरोग्याला प्रोत्साहन देण्यासाठी एका मुलीनंतर कुटुंब नियोजन करणाऱ्या कुटुंबास रु. ५०,००० मुदत ठेव.',
      eligibility: 'Permanent residents of Maharashtra having a girl child, family planning adopted.',
      marathiEligibility: 'महाराष्ट्रातील रहिवासी, एका मुलीवर कुटुंब नियोजन केलेले कुटुंब.',
      requiredDocuments: ['Birth Certificate of Child', 'Family Planning Certificate', 'Aadhaar Card of Parents'],
      benefitAmount: 'Rs. 50,000 fixed deposit payout with interest at age 18',
      officialLink: 'https://wcd.maharashtra.gov.in',
      isActive: true,
    },
  ]);

  // Events
  await Event.insertMany([
    {
      title: 'Bi-Annual General Gram Sabha — Village Development Review',
      marathiTitle: 'द्विवार्षिक सर्वसाधारण ग्रामसभा — गाव विकास आढावा',
      eventType: 'Gram Sabha',
      eventDate: new Date('2026-09-25T11:00:00Z'),
      time: '11:00 AM',
      location: 'Gram Panchayat Auditorium, Main Road, Yewla',
      description:
        'Open discussion on all underway developmental activities, street light maintenance, sanitation drive, and financial accounts approval.',
      marathiDescription: 'सर्व विकासकामे, पाणीपुरवठा, स्वच्छता मोहीम व जमाखर्च मंजुरीवर खुली चर्चा.',
      agenda: [
        'Verification of previous Gram Sabha meeting minutes',
        'Approval of Jal Jeevan Mission pipe laying work',
        'Selection of PMAY beneficiaries for Ward 2 & 4',
        'Open citizen grievance submission',
      ],
      status: 'Scheduled',
    },
    {
      title: 'Free Health Screening & Eye Cataract Checkup Camp',
      marathiTitle: 'मोफत सर्वोपचार व नेत्र तपासणी आरोग्य शिबीर',
      eventType: 'Medical Camp',
      eventDate: new Date('2026-10-02T09:00:00Z'),
      time: '09:00 AM to 03:00 PM',
      location: 'Zilla Parishad Primary School Hall, Yewla',
      description:
        'Organized jointly with District Civil Hospital Jalna. Free blood tests, BP/Sugar screening, and free spectacles distribution for seniors.',
      marathiDescription:
        'जिल्हा रुग्णालय जालना यांच्या संयुक्त विद्यमाने मोफत रक्त तपासणी, डोळ्यांची तपासणी व औषध वाटप.',
      agenda: ['General checkup', 'Eye checkup', 'Free medicine distribution', 'Ayushman Bharat card issuance'],
      status: 'Scheduled',
    },
  ]);

  // Projects
  await Project.insertMany([
    {
      name: 'Jal Jeevan Mission: Elevated Storage Reservoir & 24x7 Water Network',
      marathiName: 'जल जीवन मिशन: जलकुंभ व २४x७ नळ पाणीपुरवठा पाईपलाईन',
      category: 'Water Supply',
      description:
        'Construction of 2,50,000 litre capacity overhead water storage tank and 8.5 km underground distribution pipeline providing tap water connection to every household.',
      location: 'Wards 1 through 5, Yewla',
      wardNumber: 2,
      budget: 4850000,
      spent: 4120000,
      contractorName: 'M/s Sahyadri Infrastructure Pvt Ltd',
      startDate: new Date('2025-11-01'),
      expectedCompletionDate: new Date('2026-10-31'),
      status: 'In Progress',
      progressPercentage: 85,
      images: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop',
      ],
    },
    {
      name: 'Village Core Internal CC Concrete Roads & Paver Blocks',
      marathiName: 'गावठाण अंतर्गत काँक्रीट रस्ते व पेव्हर ब्लॉक काम',
      category: 'Road Construction',
      description:
        'Construction of heavy duty CC concrete road from Shivaji Chowk to Market Yard with side storm water drains.',
      location: 'Main Bazar Road to Station Link, Yewla',
      wardNumber: 3,
      budget: 2400000,
      spent: 1560000,
      contractorName: 'Patil Constructions, Jalna',
      startDate: new Date('2026-02-15'),
      expectedCompletionDate: new Date('2026-11-30'),
      status: 'In Progress',
      progressPercentage: 65,
      images: [
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop',
      ],
    },
    {
      name: 'High-Efficiency LED Solar Street Light Installation Phase 1',
      marathiName: 'हाय-मास्ट व सौर पथदिवे बसविणे टप्पा १',
      category: 'Solar Energy',
      description:
        'Installation of 120 automatic dusk-to-dawn solar street lights across all 5 wards for nighttime citizen safety.',
      location: 'Wards 1, 2, 3, 4, 5 Main Roads and Crossings',
      wardNumber: 1,
      budget: 1200000,
      spent: 1180000,
      contractorName: 'GreenTech Energy Solutions',
      startDate: new Date('2025-08-01'),
      expectedCompletionDate: new Date('2026-01-15'),
      actualCompletionDate: new Date('2026-01-10'),
      status: 'Completed',
      progressPercentage: 100,
      images: [
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop',
      ],
    },
  ]);

  // Documents
  await Document.insertMany([
    {
      title: 'Gram Panchayat Citizen Charter 2026 (नागरिक सनद)',
      marathiTitle: 'ग्रामपंचायत नागरिक सनद २०२६',
      category: 'Citizen Charter',
      fileUrl: '/uploads/citizen_charter_yewla.pdf',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      uploadedBy: admin._id,
    },
    {
      title: 'Birth and Death Registration Application Form No. 1',
      marathiTitle: 'जन्म आणि मृत्यू नोंदणी अर्ज नमुना १',
      category: 'Forms',
      fileUrl: '/uploads/birth_death_registration_form.pdf',
      fileSize: '450 KB',
      fileType: 'PDF',
      uploadedBy: admin._id,
    },
    {
      title: 'Water Tap Connection Application & NOC Format',
      marathiTitle: 'नळ जोडणी अर्ज व ना-हरकत प्रमाणपत्र नमुना',
      category: 'Forms',
      fileUrl: '/uploads/water_connection_form.pdf',
      fileSize: '520 KB',
      fileType: 'PDF',
      uploadedBy: admin._id,
    },
    {
      title: 'Approved Annual Village Budget Summary Report 2025-26',
      marathiTitle: 'मंजूर वार्षिक ग्राम विकास अंदाजपत्रक अहवाल २०२५-२६',
      category: 'Reports',
      fileUrl: '/uploads/annual_budget_report_2025_26.pdf',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      uploadedBy: admin._id,
    },
  ]);

  // Complaints
  const complaint1 = await Complaint.create({
    complaintId: 'GP-CMP-000001',
    citizen: citizen1._id,
    category: 'Road',
    title: 'Deep potholes on Station Road near Maruti Temple',
    description:
      'Large potholes have formed following heavy rainfall, causing difficulties for two-wheelers and school transport vans. Urgent repair or gravel filling needed.',
    location: 'Near Maruti Temple, Station Road, Ward 3',
    wardNumber: 3,
    status: 'In Progress',
    priority: 'High',
    assignedTo: staff1._id,
    adminRemarks: 'Assigned to Junior Engineer Sunita Shinde. Contractor instructed to fill potholes with asphalt.',
    photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop',
  });

  await ComplaintHistory.insertMany([
    {
      complaint: complaint1._id,
      complaintId: complaint1.complaintId,
      oldStatus: '',
      newStatus: 'Pending',
      changedBy: citizen1._id,
      changedByName: citizen1.name,
      changedByRole: 'citizen',
      remark: 'Complaint submitted by citizen.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      complaint: complaint1._id,
      complaintId: complaint1.complaintId,
      oldStatus: 'Pending',
      newStatus: 'Under Review',
      changedBy: admin._id,
      changedByName: admin.name,
      changedByRole: 'admin',
      remark: 'Reviewing site location and available repair materials.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      complaint: complaint1._id,
      complaintId: complaint1.complaintId,
      oldStatus: 'Under Review',
      newStatus: 'In Progress',
      changedBy: admin._id,
      changedByName: admin.name,
      changedByRole: 'admin',
      assignedToName: staff1.name,
      remark: 'Assigned to Junior Engineer Sunita Shinde. Work order given to local maintenance contractor.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const complaint2 = await Complaint.create({
    complaintId: 'GP-CMP-000002',
    citizen: citizen2._id,
    category: 'Street Light',
    title: 'Two street lights not functioning at ZP School lane',
    description: 'Street lights fixture #42 and #43 have stopped working for the past 4 days.',
    location: 'ZP School lane, Ward 4',
    wardNumber: 4,
    status: 'Resolved',
    priority: 'Medium',
    assignedTo: staff1._id,
    adminRemarks: 'LED driver and sensor replaced by electrical maintenance team. Lights tested successfully.',
    resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    photo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop',
  });

  await ComplaintHistory.insertMany([
    {
      complaint: complaint2._id,
      complaintId: complaint2.complaintId,
      oldStatus: '',
      newStatus: 'Pending',
      changedBy: citizen2._id,
      changedByName: citizen2.name,
      changedByRole: 'citizen',
      remark: 'Complaint submitted by citizen.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      complaint: complaint2._id,
      complaintId: complaint2.complaintId,
      oldStatus: 'Pending',
      newStatus: 'In Progress',
      changedBy: admin._id,
      changedByName: admin.name,
      changedByRole: 'admin',
      remark: 'Electrician dispatched to inspect pole fixtures.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      complaint: complaint2._id,
      complaintId: complaint2.complaintId,
      oldStatus: 'In Progress',
      newStatus: 'Resolved',
      changedBy: staff1._id,
      changedByName: staff1.name,
      changedByRole: 'staff',
      remark: 'LED driver replaced. Street lights are fully functional.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ]);

  const complaint3 = await Complaint.create({
    complaintId: 'GP-CMP-000003',
    citizen: citizen1._id,
    category: 'Water',
    title: 'Low pressure water supply in Ganesh Galli',
    description: 'Water pressure has been insufficient in the mornings for 3 consecutive days.',
    location: 'Ganesh Galli, Ward 3',
    wardNumber: 3,
    status: 'Pending',
    priority: 'Urgent',
    adminRemarks: '',
    photo: '',
  });

  await ComplaintHistory.create({
    complaint: complaint3._id,
    complaintId: complaint3.complaintId,
    oldStatus: '',
    newStatus: 'Pending',
    changedBy: citizen1._id,
    changedByName: citizen1.name,
    changedByRole: 'citizen',
    remark: 'Complaint submitted by citizen.',
  });

  // Service Requests
  await ServiceRequest.insertMany([
    {
      requestId: 'GP-REQ-000001',
      citizen: citizen1._id,
      requestType: 'Birth Certificate Verification',
      subject: 'Birth Certificate copy and verification for child Master Aarav More',
      details: 'Child was born in Yewla Rural Hospital on 14th March 2024. Need stamped endorsement for school admission.',
      status: 'Approved',
      processedBy: admin._id,
      remarks: 'Verification verified with Register Vol IV, Page 88. Verified and signed.',
      certificateUrl: '/uploads/verified_birth_record_sample.pdf',
    },
    {
      requestId: 'GP-REQ-000002',
      citizen: citizen2._id,
      requestType: 'Water Connection Permission',
      subject: 'Application for new 1/2 inch domestic drinking water connection',
      details: 'New house constructed at Ward 4. Requesting meter connection from main pipeline.',
      status: 'Under Review',
      processedBy: staff1._id,
      remarks: 'Site inspection scheduled for tomorrow by junior engineer.',
    },
  ]);

  // Gallery
  await Gallery.insertMany([
    {
      title: 'Tree Plantation Drive at Zilla Parishad Primary School',
      marathiTitle: 'जि. प. प्राथमिक शाळा वृक्षारोपण मोहीम',
      category: 'Event',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop',
      caption: 'Over 200 native saplings planted with school students and village elders.',
      eventDate: new Date('2026-07-15'),
    },
    {
      title: 'Inauguration of New Solar Powered Overhead Tank',
      marathiTitle: 'सौर ऊर्जेवर आधारित नवीन जलकुंभाचे लोकार्पण',
      category: 'Development',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop',
      caption: 'Providing 24-hour clean drinking water to over 450 families.',
      eventDate: new Date('2026-06-20'),
    },
    {
      title: 'Gram Sabha Deliberations and Citizen Interaction',
      marathiTitle: 'ग्रामसभा कामकाज व नागरिक संवाद',
      category: 'Gram Sabha',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop',
      caption: 'Villagers actively participating in planning local village amenities.',
      eventDate: new Date('2026-05-01'),
    },
  ]);

  // Notifications
  await Notification.insertMany([
    {
      recipient: citizen1._id,
      title: 'Complaint Update: GP-CMP-000001',
      marathiTitle: 'तक्रार अपडेट: GP-CMP-000001',
      message: 'Your complaint regarding Station Road potholes is now In Progress. Junior Engineer Sunita Shinde assigned.',
      marathiMessage: 'स्टेशन रोड खड्ड्यांविषयी तुमची तक्रार प्रगतीपथावर आहे.',
      type: 'Complaint',
      referenceId: 'GP-CMP-000001',
      isRead: false,
    },
    {
      recipient: citizen1._id,
      title: 'Service Request Approved',
      marathiTitle: 'सेवा अर्ज मंजूर',
      message: 'Your request GP-REQ-000001 for Birth Certificate Verification has been approved.',
      marathiMessage: 'जन्म प्रमाणपत्र पडताळणीचा अर्ज मंजूर करण्यात आला आहे.',
      type: 'Request',
      referenceId: 'GP-REQ-000001',
      isRead: true,
    },
    {
      recipient: null, // broadcast
      title: 'Special Gram Sabha Scheduled for 25th September',
      marathiTitle: '२५ सप्टेंबर रोजी विशेष ग्रामसभा आयोजित',
      message: 'Annual Budget review Gram Sabha will be held at 11 AM in Gram Panchayat Hall.',
      marathiMessage: 'वार्षिक अंदाजपत्रक आढावा ग्रामसभा सकाळी ११ वाजता ग्रामपंचायत सभागृहात होईल.',
      type: 'Notice',
      isRead: false,
    },
  ]);

  console.log('[Seed] Seeding completed successfully!');
};
