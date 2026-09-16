class VillageModel {
  final String id;
  final String nameEn;
  final String nameMr;
  final String talukaEn;
  final String talukaMr;
  final String districtEn;
  final String districtMr;
  final String wards;
  final int population;
  final int households;
  final String literacyRate;
  final String occupationEn;
  final String occupationMr;
  final String descriptionEn;
  final String descriptionMr;
  final List<String> facilitiesEn;
  final List<String> facilitiesMr;
  final List<String> highlightsEn;
  final List<String> highlightsMr;
  final String sarpanchContact;

  const VillageModel({
    required this.id,
    required this.nameEn,
    required this.nameMr,
    required this.talukaEn,
    required this.talukaMr,
    required this.districtEn,
    required this.districtMr,
    required this.wards,
    required this.population,
    required this.households,
    required this.literacyRate,
    required this.occupationEn,
    required this.occupationMr,
    required this.descriptionEn,
    required this.descriptionMr,
    required this.facilitiesEn,
    required this.facilitiesMr,
    required this.highlightsEn,
    required this.highlightsMr,
    this.sarpanchContact = '02482-245678',
  });

  String get cardTitleEn => nameEn.split(' ')[0];
  String get cardSubtitleEn {
    final parts = nameEn.split(' ');
    return parts.length > 1 ? parts.sublist(1).join(' ') : '';
  }

  String get cardTitleMr => nameMr.split(' ')[0];
  String get cardSubtitleMr {
    final parts = nameMr.split(' ');
    return parts.length > 1 ? parts.sublist(1).join(' ') : '';
  }

  static const List<VillageModel> sampleVillages = [
    VillageModel(
      id: 'devli_partur_1',
      nameEn: 'Devli Partur 1',
      nameMr: 'देवळी परतूर १',
      talukaEn: 'Ghansawangi',
      talukaMr: 'घनसावंगी',
      districtEn: 'Jalna',
      districtMr: 'जालना',
      wards: 'Ward No. 1, 2',
      population: 1850,
      households: 320,
      literacyRate: '78.5%',
      occupationEn: 'Agriculture, Cotton & Soybean Farming, Dairy',
      occupationMr: 'शेती, कापूस व सोयाबीन पीक, दुग्ध व्यवसाय',
      descriptionEn:
          'Devli Partur 1 is a vibrant agricultural hamlet in Yewla Gram Panchayat jurisdiction with strong community bonding, clean paved roads, and dedicated water supply schemes.',
      descriptionMr:
          'देवळी परतूर १ ही येवला ग्रामपंचायतीच्या कार्यक्षेत्रातील एक प्रगतिशील वस्ती आहे. येथे सिमेंट कॉंक्रीट रस्ते, शुद्ध पिण्याच्या पाण्याचे नळ व सक्रिय शेतकरी बांधव आहेत.',
      facilitiesEn: [
        'Z.P. Primary School with Digital Classroom',
        'Anganwadi Kendra No. 1',
        'Overhead Water Storage Tank (JJM)',
        'Solar Street Lighting in all alleys',
        'Underground Drainage System',
      ],
      facilitiesMr: [
        'जि. प. प्राथमिक डिजिटल शाळा',
        'अंगणवाडी केंद्र क्र. १',
        'जल जीवन मिशन अंतर्गत पाण्याची टाकी',
        'सर्व गल्ल्यांमध्ये सौर पथदिवे',
        'भूमिगत सांडपाणी गटार व्यवस्था',
      ],
      highlightsEn: [
        'Historic Shri Hanuman Mandir & Annual Fair',
        'Drip Irrigation Village Community Project',
        'Active Mahila Bachat Gat & Self-Help Group',
      ],
      highlightsMr: [
        'ऐतिहासिक श्री हनुमान मंदिर व वार्षिक यात्रा',
        'ठिबक सिंचन शेतकरी समूह प्रकल्प',
        'सक्रिय महिला बचत गट व गृहउद्योग',
      ],
    ),
    VillageModel(
      id: 'devli_partur_2',
      nameEn: 'Devli Partur 2',
      nameMr: 'देवळी परतूर २',
      talukaEn: 'Ghansawangi',
      talukaMr: 'घनसावंगी',
      districtEn: 'Jalna',
      districtMr: 'जालना',
      wards: 'Ward No. 3, 4',
      population: 1620,
      households: 280,
      literacyRate: '76.2%',
      occupationEn: 'Farming, Horticulture, Organic Jowar & Pulses',
      occupationMr: 'शेती, फलोत्पादन, सेंद्रिय ज्वारी व कडधान्य',
      descriptionEn:
          'Devli Partur 2 is known for its peaceful rural setting, flourishing pomegranate and fruit orchards, and proactive youth development initiatives.',
      descriptionMr:
          'देवळी परतूर २ हे समृद्ध फळबागा, शांत निसर्गरम्य परिसर आणि सुसंस्कृत ग्रामस्थांसाठी ओळखले जाते. येथे ग्रामस्वच्छता अभियानात उत्कृष्ट कामगिरी केली आहे.',
      facilitiesEn: [
        'Primary Healthcare Sub-Center (Arogya Kendra)',
        'Anganwadi Kendra No. 2',
        'Community Hall (Samaj Mandir)',
        'Clean RO Drinking Water ATM',
        'Gram Panchayat Sub-Information Kiosk',
      ],
      facilitiesMr: [
        'प्राथमिक आरोग्य उपकेंद्र',
        'अंगणवाडी केंद्र क्र. २',
        'सार्वजनिक समाज मंदिर सभागृह',
        'शुद्ध आरओ वॉटर एटीएम केंद्र',
        'ग्रामपंचायत माहिती व सेवा केंद्र',
      ],
      highlightsEn: [
        'Shri Vitthal Rukmini Mandir Bhajani Mandal',
        'Award-winning Sant Gadge Baba Cleanliness Ward',
        'Modern Farm Equipment Custom Hiring Center',
      ],
      highlightsMr: [
        'श्री विठ्ठल रुक्मिणी मंदिर व भजनी मंडळ',
        'संत गाडगेबाबा ग्रामस्वच्छता सन्मान प्रभाग',
        'शेतकरी अवजारे बँक व भाडेतत्त्व सुविधा',
      ],
    ),
    VillageModel(
      id: 'devli_ambad',
      nameEn: 'Devli Ambad',
      nameMr: 'देवळी अंबड',
      talukaEn: 'Ghansawangi',
      talukaMr: 'घनसावंगी',
      districtEn: 'Jalna',
      districtMr: 'जालना',
      wards: 'Ward No. 5, 6',
      population: 2100,
      households: 390,
      literacyRate: '81.0%',
      occupationEn: 'Agri-Business, Trade, Dairy Co-operative',
      occupationMr: 'कृषी व्यापार, लहान व्यवसाय, सहकारी दूध डेअरी',
      descriptionEn:
          'Devli Ambad is situated in Ghansawangi taluka with active market connectivity, advanced dairy collection centers, and high literacy.',
      descriptionMr:
          'देवळी अंबड हे घनसावंगी तालुक्यातील मध्यवर्ती केंद्र असून येथे कृषी मालाची बाजारपेठ, दूध शीतकरण केंद्र आणि दर्जेदार शैक्षणिक सुविधा उपलब्ध आहेत.',
      facilitiesEn: [
        'High School & Secondary Vidyalaya',
        'Milk Collection & Chilling Center',
        'Veterinary Care & First-Aid Center',
        'Percolation Tank for Ground Water Recharge',
        'Open Gymnasium & Sports Ground for Youth',
      ],
      facilitiesMr: [
        'माध्यमिक विद्यालय व हायस्कूल',
        'सहकारी दूध संकलन केंद्र',
        'पशुवैद्यकीय प्रथमोपचार केंद्र',
        'पाझर तलाव व जलसंधारण बंधारे',
        'खुली व्यायामशाळा व क्रीडांगण',
      ],
      highlightsEn: [
        'Ancient Shri Mahadev Mandir',
        'Inter-village Road Connectivity (PMGSY)',
        'Solar Water Pumping Community Project',
      ],
      highlightsMr: [
        'पुरातन श्री महादेव मंदिर व शिवरात्री उत्सव',
        'पक्का डांबरी जोडरस्ता (पंतप्रधान ग्रामसडक)',
        'सौर ऊर्जा कृषी पंप सामुदायिक प्रकल्प',
      ],
    ),
    VillageModel(
      id: 'yewla',
      nameEn: 'Yewla',
      nameMr: 'येवला',
      talukaEn: 'Ghansawangi',
      talukaMr: 'घनसावंगी',
      districtEn: 'Jalna',
      districtMr: 'जालना',
      wards: 'Ward No. 7, 8, 9, 10',
      population: 3450,
      households: 650,
      literacyRate: '83.4%',
      occupationEn: 'Administration, Commerce, Modern Agriculture, Services',
      occupationMr: 'ग्राम प्रशासन, व्यापार, आधुनिक शेती व सेवा क्षेत्र',
      descriptionEn:
          'Yewla is the headquarters of the Gram Panchayat with the main administrative secretariat, central market square, public library, and modern civic infrastructure.',
      descriptionMr:
          'येवला हे ग्रामपंचायतीचे मध्यवर्ती मुख्यालय आहे. येथे मुख्य ग्रामपंचायत सचिवालय, आठवडे बाजार, सार्वजनिक वाचनालय, बँक सेवा आणि नागरी सुविधा उपलब्ध आहेत.',
      facilitiesEn: [
        'Gram Panchayat Main Secretariat & E-Seva Kendra',
        'Primary Health Center (PHC)',
        'Government Co-operative Society & Fair Price Shop',
        'Public Library & Free Reading Room',
        'Solid & Wet Waste Segregation Unit',
      ],
      facilitiesMr: [
        'ग्रामपंचायत मुख्य सचिवालय व आपले सरकार ई-सेवा केंद्र',
        'प्राथमिक आरोग्य केंद्र (PHC)',
        'विविध कार्यकारी सेवा सहकारी संस्था व रास्त भाव धान्य दुकान',
        'सार्वजनिक वाचनालय व अभ्यासीका',
        'घनकचरा व ओला कचरा व्यवस्थापन प्रकल्प',
      ],
      highlightsEn: [
        'Historic Shri Siddheshwar Mandir & Grand Rathotsav',
        'Weekly Wednesday Market (Aathwade Bazaar)',
        'Gram Panchayat Solar Rooftop Clean Energy Hub',
      ],
      highlightsMr: [
        'प्राचीन श्री सिद्धेश्वर मंदिर व भव्य रथोत्सव',
        'पारंपरिक बुधवारचा आठवडे बाजार',
        'सौर ऊर्जा स्वयंपूर्ण ग्रामपंचायत कार्यालय',
      ],
    ),
  ];
}
