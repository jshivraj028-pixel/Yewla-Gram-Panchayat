enum AppLanguage { en, mr }

class AppLocale {
  static AppLanguage currentLanguage = AppLanguage.en;

  static final Map<String, Map<AppLanguage, String>> _strings = {
    // General
    'appName': {AppLanguage.en: 'GramSeva', AppLanguage.mr: 'ग्रामसेवा'},
    'appSubtitle': {
      AppLanguage.en: 'Yewla Gram Panchayat Citizen Portal',
      AppLanguage.mr: 'येवला ग्रामपंचायत नागरिक सेवा पोर्टल',
    },
    'skip': {AppLanguage.en: 'Skip', AppLanguage.mr: 'वगळा'},
    'next': {AppLanguage.en: 'Next', AppLanguage.mr: 'पुढे'},
    'getStarted': {AppLanguage.en: 'Get Started', AppLanguage.mr: 'सुरू करा'},
    'submit': {AppLanguage.en: 'Submit', AppLanguage.mr: 'सादर करा'},
    'cancel': {AppLanguage.en: 'Cancel', AppLanguage.mr: 'रद्द करा'},
    'save': {AppLanguage.en: 'Save', AppLanguage.mr: 'जतन करा'},
    'search': {AppLanguage.en: 'Search...', AppLanguage.mr: 'शोधा...'},
    'all': {AppLanguage.en: 'All', AppLanguage.mr: 'सर्व'},
    'loading': {AppLanguage.en: 'Loading...', AppLanguage.mr: 'लोड होत आहे...'},
    'error': {AppLanguage.en: 'Error', AppLanguage.mr: 'त्रुटी'},
    'success': {AppLanguage.en: 'Success', AppLanguage.mr: 'यशस्वी'},
    'viewAll': {AppLanguage.en: 'View All', AppLanguage.mr: 'सर्व पहा'},

    // Auth
    'login': {AppLanguage.en: 'Citizen Login', AppLanguage.mr: 'नागरिक लॉगिन'},
    'loginSubtitle': {
      AppLanguage.en: 'Sign in to access Gram Panchayat citizen services',
      AppLanguage.mr: 'ग्रामपंचायत नागरिक सेवांसाठी लॉगिन करा',
    },
    'register': {AppLanguage.en: 'Register as Citizen', AppLanguage.mr: 'नवीन नागरिक नोंदणी'},
    'registerSubtitle': {
      AppLanguage.en: 'Create your account to submit complaints & track services',
      AppLanguage.mr: 'तक्रारी व दाखल्यांसाठी तुमचे खाते तयार करा',
    },
    'mobileOrEmail': {AppLanguage.en: 'Mobile Number or Email', AppLanguage.mr: 'मोबाईल क्रमांक किंवा ईमेल'},
    'fullName': {AppLanguage.en: 'Full Name', AppLanguage.mr: 'पूर्ण नाव'},
    'mobileNumber': {AppLanguage.en: '10-digit Mobile Number', AppLanguage.mr: '१० अंकी मोबाईल क्रमांक'},
    'emailAddress': {AppLanguage.en: 'Email Address (Optional)', AppLanguage.mr: 'ईमेल पत्ता (ऐच्छिक)'},
    'password': {AppLanguage.en: 'Password', AppLanguage.mr: 'पासवर्ड'},
    'confirmPassword': {AppLanguage.en: 'Confirm Password', AppLanguage.mr: 'पासवर्डची खात्री करा'},
    'wardNumber': {AppLanguage.en: 'Ward Number', AppLanguage.mr: 'प्रभाग / वॉर्ड क्रमांक'},
    'residentialAddress': {AppLanguage.en: 'Residential Address', AppLanguage.mr: 'राहण्याचा पत्ता'},
    'dontHaveAccount': {AppLanguage.en: "Don't have an account? Register", AppLanguage.mr: 'खाते नाही? नोंदणी करा'},
    'alreadyHaveAccount': {AppLanguage.en: 'Already registered? Login', AppLanguage.mr: 'आधीच खाते आहे? लॉगिन करा'},
    'logout': {AppLanguage.en: 'Logout', AppLanguage.mr: 'लॉगआउट'},

    // Home
    'home': {AppLanguage.en: 'Home', AppLanguage.mr: 'मुख्य'},
    'welcome': {AppLanguage.en: 'Welcome,', AppLanguage.mr: 'स्वागत आहे,'},
    'quickServices': {AppLanguage.en: 'Citizen Services', AppLanguage.mr: 'नागरिक सेवा'},
    'urgentNotices': {AppLanguage.en: 'Important Notices', AppLanguage.mr: 'महत्वाच्या सूचना'},
    'upcomingGramSabha': {AppLanguage.en: 'Upcoming Gram Sabha', AppLanguage.mr: 'आगामी ग्रामसभा'},
    'latestDevelopment': {AppLanguage.en: 'Development Projects', AppLanguage.mr: 'गाव विकासकामे'},
    'emergencyContacts': {AppLanguage.en: 'Emergency Contacts', AppLanguage.mr: 'आपत्कालीन संपर्क'},

    // Services
    'complaints': {AppLanguage.en: 'Complaints', AppLanguage.mr: 'तक्रारी'},
    'requests': {AppLanguage.en: 'Certificates', AppLanguage.mr: 'दाखले'},
    'notices': {AppLanguage.en: 'Notices', AppLanguage.mr: 'सूचना'},
    'schemes': {AppLanguage.en: 'Schemes', AppLanguage.mr: 'योजना'},
    'events': {AppLanguage.en: 'Gram Sabha', AppLanguage.mr: 'ग्रामसभा'},
    'projects': {AppLanguage.en: 'Projects', AppLanguage.mr: 'विकासकामे'},
    'documents': {AppLanguage.en: 'Documents', AppLanguage.mr: 'कागदपत्रे'},
    'emergency': {AppLanguage.en: 'Emergency', AppLanguage.mr: 'आपत्कालीन'},
    'gallery': {AppLanguage.en: 'Gallery', AppLanguage.mr: 'छायाचित्रे'},

    // Complaints
    'newComplaint': {AppLanguage.en: 'Register Complaint', AppLanguage.mr: 'नवीन तक्रार नोंदवा'},
    'myComplaints': {AppLanguage.en: 'My Complaints', AppLanguage.mr: 'माझ्या तक्रारी'},
    'allComplaints': {AppLanguage.en: 'All Complaints', AppLanguage.mr: 'सर्व तक्रारी'},
    'communityComplaints': {AppLanguage.en: 'Village Grievances', AppLanguage.mr: 'गावातील तक्रारी'},
    'likes': {AppLanguage.en: 'Likes', AppLanguage.mr: 'लाईक्स'},
    'comments': {AppLanguage.en: 'Comments', AppLanguage.mr: 'कमेंट्स'},
    'writeComment': {AppLanguage.en: 'Write a comment...', AppLanguage.mr: 'तुमची प्रतिक्रिया लिहा...'},
    'post': {AppLanguage.en: 'Post', AppLanguage.mr: 'पाठवा'},
    'reportedBy': {AppLanguage.en: 'Reported by', AppLanguage.mr: 'तक्रारदार'},
    'complaintCategory': {AppLanguage.en: 'Complaint Category', AppLanguage.mr: 'तक्रारीचा प्रकार'},
    'complaintTitle': {AppLanguage.en: 'Subject / Title', AppLanguage.mr: 'तक्रारीचा विषय'},
    'complaintDescription': {AppLanguage.en: 'Detailed Description', AppLanguage.mr: 'तक्रारीचा सविस्तर तपशील'},
    'locationDescription': {AppLanguage.en: 'Exact Location / Landmark', AppLanguage.mr: 'अचूक ठिकाण / लँडमार्क'},
    'attachPhoto': {AppLanguage.en: 'Attach Photo (Optional)', AppLanguage.mr: 'फोटो जोडा (ऐच्छिक)'},
    'statusTimeline': {AppLanguage.en: 'Tracking Timeline', AppLanguage.mr: 'तक्रार निवारण प्रगती'},
    'assignedOfficer': {AppLanguage.en: 'Assigned Officer', AppLanguage.mr: 'नियुक्त अधिकारी'},
    'adminRemarks': {AppLanguage.en: 'Official Remarks', AppLanguage.mr: 'ग्रामपंचायत शेरा'},

    // Statuses
    'Pending': {AppLanguage.en: 'Pending', AppLanguage.mr: 'प्रलंबित'},
    'Under Review': {AppLanguage.en: 'Under Review', AppLanguage.mr: 'तपासणी सुरू'},
    'Assigned': {AppLanguage.en: 'Assigned', AppLanguage.mr: 'अधिकारी नियुक्त'},
    'In Progress': {AppLanguage.en: 'In Progress', AppLanguage.mr: 'कामात प्रगती'},
    'Resolved': {AppLanguage.en: 'Resolved', AppLanguage.mr: 'निवारण पूर्ण'},
    'Rejected': {AppLanguage.en: 'Rejected', AppLanguage.mr: 'नाकारले'},

    // Categories
    'Road': {AppLanguage.en: 'Road & Paving', AppLanguage.mr: 'रस्ते व पेव्हर ब्लॉक'},
    'Water': {AppLanguage.en: 'Drinking Water', AppLanguage.mr: 'पिण्याचे पाणी'},
    'Street Light': {AppLanguage.en: 'Street Lights', AppLanguage.mr: 'पथदिवे'},
    'Drainage': {AppLanguage.en: 'Drainage & Gutter', AppLanguage.mr: 'सांडपाणी व गटार'},
    'Garbage': {AppLanguage.en: 'Garbage & Waste', AppLanguage.mr: 'कचरा व्यवस्थापन'},
    'Sanitation': {AppLanguage.en: 'Sanitation & Cleanliness', AppLanguage.mr: 'स्वच्छता व निर्जंतुकीकरण'},
    'Electricity': {AppLanguage.en: 'Electricity', AppLanguage.mr: 'वीज पुरवठा'},
    'Public Property': {AppLanguage.en: 'Public Property', AppLanguage.mr: 'सार्वजनिक मालमत्ता'},
    'Other': {AppLanguage.en: 'Other Problem', AppLanguage.mr: 'इतर समस्या'},

    // Profile
    'profile': {AppLanguage.en: 'Profile', AppLanguage.mr: 'प्रोफाइल'},
    'editProfile': {AppLanguage.en: 'Edit Profile', AppLanguage.mr: 'प्रोफाइल बदला'},
    'changePassword': {AppLanguage.en: 'Change Password', AppLanguage.mr: 'पासवर्ड बदला'},
    'switchLanguage': {AppLanguage.en: 'मराठी मध्ये बदला', AppLanguage.mr: 'Switch to English'},
    'contactHelpdesk': {AppLanguage.en: 'Panchayat Helpdesk', AppLanguage.mr: 'ग्रामपंचायत मदत कक्ष'},
  };

  static String t(String key) {
    if (_strings.containsKey(key)) {
      return _strings[key]![currentLanguage] ?? key;
    }
    return key;
  }
}
