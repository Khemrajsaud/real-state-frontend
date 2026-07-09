
export const translateCategory = (categoryId: string | undefined, lang: 'np' | 'en') => {
  const map: Record<string, { np: string, en: string }> = {
    'cat-house': { np: 'घर', en: 'House' },
    'cat-apartment': { np: 'अपार्टमेन्ट', en: 'Apartment' },
    'cat-land': { np: 'जग्गा', en: 'Land' },
    'cat-commercial': { np: 'व्यावसायिक', en: 'Commercial' },
    'cat-flats': { np: 'फ्ल्याट', en: 'Flats' },
    'cat-office': { np: 'कार्यालय', en: 'Office' },
    'cat-shop': { np: 'पसल', en: 'Shop' },
  }
  const id = categoryId?.toLowerCase() || ''
  return map[id]?.[lang] || categoryId
}

export const translateStatus = (statusId: string | undefined, lang: 'np' | 'en') => {
  const map: Record<string, { np: string, en: string }> = {
    'status-sale': { np: 'बिक्रीका लागि', en: 'For Sale' },
    'status-rent': { np: 'भाडाका लागि', en: 'For Rent' },
    'status-available': { np: 'उपलब्ध', en: 'Available' },
    'status-construction': { np: 'निर्माणाधीन', en: 'Under Construction' },
    'status-sold': { np: 'बिक्री भएको', en: 'Sold' },
  }
  const id = statusId?.toLowerCase() || ''
  return map[id]?.[lang] || statusId
}

export const translateAmenity = (amenityName: string, lang: 'np' | 'en') => {
  const map: Record<string, { np: string, en: string }> = {
    'Parking': { np: 'पार्किङ', en: 'Parking' },
    'Water supply': { np: 'खानेपानी', en: 'Water supply' },
    'Road access': { np: 'सडक पहुँच', en: 'Road access' },
    'Balcony': { np: 'बार्दली (Balcony)', en: 'Balcony' },
    'Security': { np: 'सुरक्षा', en: 'Security' },
    'Market nearby': { np: 'नजिकै बजार', en: 'Market nearby' },
    'Garden': { np: 'बगैंचा', en: 'Garden' },
    'Swimming Pool': { np: 'स्विमिङ पूल', en: 'Swimming Pool' },
    'Gym': { np: 'जिम (Gym)', en: 'Gym' },
    'Garage': { np: 'ग्यारेज', en: 'Garage' },
    'Elevator': { np: 'लिफ्ट (Elevator)', en: 'Elevator' },
    'Clear boundary': { np: 'स्पष्ट सिमाना', en: 'Clear boundary' },
    'Main road': { np: 'मुख्य सडक', en: 'Main road' },
    'Peaceful area': { np: 'शान्त वातावरण', en: 'Peaceful area' },
  }
  return map[amenityName]?.[lang] || amenityName
}

export const translatePropertyTitle = (title: string | undefined, lang: 'np' | 'en') => {
  if (!title) return ''
  const map: Record<string, { np: string, en: string }> = {
    'धनगढी नजिक आधुनिक पारिवारिक घर': {
      np: 'धनगढी नजिक आधुनिक पारिवारिक घर',
      en: 'Modern Family House near Dhangadhi',
    },
    'बजार नजिक सुविधायुक्त अपार्टमेन्ट': {
      np: 'बजार नजिक सुविधायुक्त अपार्टमेन्ट',
      en: 'Convenient Apartment near Market',
    },
    'मुख्य सडकसँग जोडिएको जग्गा': {
      np: 'मुख्य सडकसँग जोडिएको जग्गा',
      en: 'Land Connected to Main Road',
    },
    'व्यावसायिक प्रयोजनका लागि स्पेस': {
      np: 'व्यावसायिक प्रयोजनका लागि स्पेस',
      en: 'Commercial Space for Rent',
    },
    'बगैंचासहित शान्त बंगला': {
      np: 'बगैंचासहित शान्त बंगला',
      en: 'Peaceful Bungalow with Garden',
    },
    'धनगढी हसनपुरमा आकर्षक घडेरी बिक्रीमा': {
      np: 'धनगढी हसनपुरमा आकर्षक घडेरी बिक्रीमा',
      en: 'Attractive Plot for Sale in Hasanpur, Dhangadhi',
    },
    'सुन्दर पश्चिम चोकमा २.५ तल्लाको घर': {
      np: 'सुन्दर पश्चिम चोकमा २.५ तल्लाको घर',
      en: '2.5 Storey House at Sundar Paschim Chowk',
    },
    'मुख्य बजारमा व्यावसायिक सटर भाडामा': {
      np: 'मुख्य बजारमा व्यावसायिक सटर भाडामा',
      en: 'Commercial Shutters for Rent in Main Market',
    },
    'शान्त वातावरणमा नयाँ मोडर्न अपार्टमेन्ट': {
      np: 'शान्त वातावरणमा नयाँ मोडर्न अपार्टमेन्ट',
      en: 'New Modern Apartment in Peaceful Area',
    },
    'टीकापुर राजमार्गमा व्यावसायिक जग्गा': {
      np: 'टीकापुर राजमार्गमा व्यावसायिक जग्गा',
      en: 'Commercial Land on Tikapur Highway',
    },
    'लम्कीचुहामा सस्तो जग्गा बिक्रीमा': {
      np: 'लम्कीचुहामा सस्तो जग्गा बिक्रीमा',
      en: 'Affordable Land for Sale in Lamkichuha',
    },
    'धनगढी उपमहानगरमा कर्नर प्लट': {
      np: 'धनगढी उपमहानगरमा कर्नर प्लट',
      en: 'Corner Plot in Dhangadhi Sub-Metropolitan',
    },
    'नयाँ बनेको ३ तल्लाको आवासीय घर': {
      np: 'नयाँ बनेको ३ तल्लाको आवासीय घर',
      en: 'Newly Built 3-Storey Residential House',
    },
    'कृष्णपुरमा आकर्षक कृषि जग्गा': {
      np: 'कृष्णपुरमा आकर्षक कृषि जग्गा',
      en: 'Attractive Agricultural Land in Krishnapur',
    },
    'महेन्द्रनगरमा फ्ल्याट भाडामा': {
      np: 'महेन्द्रनगरमा फ्ल्याट भाडामा',
      en: 'Flat for Rent in Mahendranagar',
    },
  }
  return map[title.trim()]?.[lang] || title
}

export const translatePropertyDesc = (desc: string | undefined, lang: 'np' | 'en') => {
  if (!desc) return ''
  const map: Record<string, { np: string, en: string }> = {
    'खुला बसोबास क्षेत्र, पार्किङ र शान्त वातावरण भएको घर। परिवारका लागि उपयुक्त, सुरक्षित र सहज पहुँच भएको सम्पत्ति।': {
      np: 'खुला बसोबास क्षेत्र, पार्किङ र शान्त वातावरण भएको घर। परिवारका लागि उपयुक्त, सुरक्षित र सहज पहुँच भएको सम्पत्ति।',
      en: 'Spacious family house with parking and quiet environment. Safe, secure, and easily accessible.',
    },
    'बजार, विद्यालय र यातायात नजिक रहेको सजिलो अपार्टमेन्ट। पहिलो पटक घर खोज्ने ग्राहकका लागि व्यवहारिक विकल्प।': {
      np: 'बजार, विद्यालय र यातायात नजिक रहेको सजिलो अपार्टमेन्ट। पहिलो पटक घर खोज्ने ग्राहकका लागि व्यवहारिक विकल्प।',
      en: 'Cozy apartment close to market, school, and transport. An ideal choice for first-time buyers.',
    },
    'सफा सिमाना र सडक पहुँच भएको प्लट। घर निर्माण वा दीर्घकालीन लगानीका लागि उपयुक्त।': {
      np: 'सफा सिमाना र सडक पहुँच भएको प्लट। घर निर्माण वा दीर्घकालीन लगानीका लागि उपयुक्त।',
      en: 'Plot with clear boundary and direct road access. Suitable for home construction or long-term investment.',
    },
    'चल्तीको सडकमा रहेको ग्राउन्ड-फ्लोर स्पेस। अफिस, सानो पसल, कन्सल्टेन्सी वा शो-रूमका लागि उपयुक्त।': {
      np: 'चल्तीको सडकमा रहेको ग्राउन्ड-फ्लोर स्पेस। अफिस, सानो पसल, कन्सल्टेन्सी वा शो-रूमका लागि उपयुक्त।',
      en: 'Ground-floor commercial space located on a busy road. Suitable for office, shop, consultancy, or showroom.',
    },
    'बाहिरी खुला ठाउँ, प्राकृतिक उज्यालो र शान्त छिमेक भएको आरामदायी बंगला।': {
      np: 'बाहिरी खुला ठाउँ, प्राकृतिक उज्यालो र शान्त छिमेक भएको आरामदायी बंगला।',
      en: 'Cozy bungalow featuring spacious outdoors, natural lighting, and a peaceful neighborhood.',
    },
    'आवासीय वा व्यावसायिक प्रयोजनका लागि उपयुक्त आकर्षक घडेरी। सडक पहुँच र शान्त वातावरण।': {
      np: 'आवासीय वा व्यावसायिक प्रयोजनका लागि उपयुक्त आकर्षक घडेरी। सडक पहुँच र शान्त वातावरण।',
      en: 'Attractive land suitable for residential or commercial use. Road access and peaceful environment.',
    },
    'शान्त आवासीय क्षेत्रमा निर्माण गरिएको आधुनिक बुट्टेदार घर। बस्न र भाडामा दिन दुवैका लागि उपयुक्त।': {
      np: 'शान्त आवासीय क्षेत्रमा निर्माण गरिएको आधुनिक बुट्टेदार घर। बस्न र भाडामा दिन दुवैका लागि उपयुक्त।',
      en: 'Modern house built in a quiet residential area. Perfect for self-occupancy or rental income.',
    },
    'भीडभाड हुने व्यापारिक केन्द्रमा अवस्थित सटर। व्यापार व्यवसायका लागि अत्यन्त उपयुक्त ठाउँ।': {
      np: 'भीडभाड हुने व्यापारिक केन्द्रमा अवस्थित सटर। व्यापार व्यवसायका लागि अत्यन्त उपयुक्त ठाउँ।',
      en: 'Shutters located in a busy commercial hub. Perfect location for businesses and shops.',
    },
    'सबै आधुनिक सुविधाहरू भएको आरामदायक अपार्टमेन्ट। सुरक्षा र शान्तिको पूर्ण प्रत्याभूति।': {
      np: 'सबै आधुनिक सुविधाहरू भएको आरामदायक अपार्टमेन्ट। सुरक्षा र शान्तिको पूर्ण प्रत्याभूति।',
      en: 'Comfortable apartment with all modern amenities. Complete security and peaceful lifestyle.',
    },
    'मुख्य राजमार्गसँग जोडिएको व्यावसायिक प्रयोजनका लागि उत्तम जग्गा। पेट्रोल पम्प, होटल वा गोदामका लागि उपयुक्त।': {
      np: 'मुख्य राजमार्गसँग जोडिएको व्यावसायिक प्रयोजनका लागि उत्तम जग्गा। पेट्रोल पम्प, होटल वा गोदामका लागि उपयुक्त।',
      en: 'Prime commercial land connected to the main highway. Ideal for petrol pump, hotel, or warehouse.',
    },
    'कृषियोग्य तथा आवासीय दुवै प्रयोजनका लागि उपयुक्त जग्गा। शान्त वातावरण र पानीको सुविधा।': {
      np: 'कृषियोग्य तथा आवासीय दुवै प्रयोजनका लागि उपयुक्त जग्गा। शान्त वातावरण र पानीको सुविधा।',
      en: 'Land suitable for both agricultural and residential use. Peaceful environment with water supply.',
    },
    'दुई तर्फबाट सडक पहुँच भएको कर्नर प्लट। घर बनाउन वा लगानीका लागि प्रिमियम लोकेसन।': {
      np: 'दुई तर्फबाट सडक पहुँच भएको कर्नर प्लट। घर बनाउन वा लगानीका लागि प्रिमियम लोकेसन।',
      en: 'Corner plot with road access from two sides. Premium location for building or investment.',
    },
    'पूर्ण रूपमा सक्किएको ३ तल्लाको घर। प्रत्येक तल्लामा बाथरुम, किचन र बैठक कोठा। तुरुन्तै बस्न मिल्ने।': {
      np: 'पूर्ण रूपमा सक्किएको ३ तल्लाको घर। प्रत्येक तल्लामा बाथरुम, किचन र बैठक कोठा। तुरुन्तै बस्न मिल्ने।',
      en: 'Fully finished 3-storey house. Each floor has bathroom, kitchen, and living room. Ready to move in.',
    },
    'सिँचाइ सुविधा भएको उपजाऊ कृषि जग्गा। खेती तथा पशुपालनका लागि उत्तम अवसर।': {
      np: 'सिँचाइ सुविधा भएको उपजाऊ कृषि जग्गा। खेती तथा पशुपालनका लागि उत्तम अवसर।',
      en: 'Fertile agricultural land with irrigation facility. Excellent opportunity for farming and livestock.',
    },
    'सबै सुविधायुक्त फ्ल्याट भाडामा उपलब्ध। विद्यार्थी, कर्मचारी तथा सानो परिवारका लागि उपयुक्त।': {
      np: 'सबै सुविधायुक्त फ्ल्याट भाडामा उपलब्ध। विद्यार्थी, कर्मचारी तथा सानो परिवारका लागि उपयुक्त।',
      en: 'Fully furnished flat available for rent. Suitable for students, employees, and small families.',
    },
  }
  return map[desc.trim()]?.[lang] || desc
}

export const translateAddress = (address: string | undefined, lang: 'np' | 'en') => {
  if (!address) return ''
  const map: Record<string, { np: string, en: string }> = {
    'धनगढी-७, मनेरा': { np: 'धनगढी-७, मनेरा', en: 'Dhangadhi-7, Manera' },
    'पहलमानपुर, कैलाली': { np: 'पहलमानपुर, कैलाली', en: 'Pahalmanpur, Kailali' },
    'अत्तरिया, कैलाली': { np: 'अत्तरिया, कैलाली', en: 'Attariya, Kailali' },
    'धनगढी बजार, कैलाली': { np: 'धनगढी बजार, कैलाली', en: 'Dhangadhi Bazar, Kailali' },
    'गोदावरी, कैलाली': { np: 'गोदावरी, कैलाली', en: 'Godawari, Kailali' },
    'हसनपुर, धनगढी': { np: 'हसनपुर, धनगढी', en: 'Hasanpur, Dhangadhi' },
    'हसनपुर, धनगढी-५': { np: 'हसनपुर, धनगढी-५', en: 'Hasanpur, Dhangadhi-5' },
    'एल.एन. चोक, धनगढी': { np: 'एल.एन. चोक, धनगढी', en: 'L.N. Chowk, Dhangadhi' },
    'चटकपुर, धनगढी': { np: 'चटकपुर, धनगढी', en: 'Chatakpur, Dhangadhi' },
    'टीकापुर राजमार्ग, कैलाली': { np: 'टीकापुर राजमार्ग, कैलाली', en: 'Tikapur Highway, Kailali' },
    'लम्की, कैलाली': { np: 'लम्की, कैलाली', en: 'Lamki, Kailali' },
    'धनगढी-६, कैलाली': { np: 'धनगढी-६, कैलाली', en: 'Dhangadhi-6, Kailali' },
    'मोहनपुर, धनगढी': { np: 'मोहनपुर, धनगढी', en: 'Mohanpur, Dhangadhi' },
    'कृष्णपुर, कञ्चनपुर': { np: 'कृष्णपुर, कञ्चनपुर', en: 'Krishnapur, Kanchanpur' },
    'महेन्द्रनगर, कञ्चनपुर': { np: 'महेन्द्रनगर, कञ्चनपुर', en: 'Mahendranagar, Kanchanpur' },
  }
  return map[address.trim()]?.[lang] || address
}

export const translateTestimonial = (testimonial: any, lang: 'np' | 'en') => {
  const map: Record<string, { name: string, role: string, message: string }> = {
    'testimonial-1': {
      name: lang === 'np' ? 'अन्जना राई' : 'Anjana Rai',
      role: lang === 'np' ? 'घर खरिदकर्ता' : 'Home Buyer',
      message: lang === 'np' 
        ? 'भूमिराजको टिमले हाम्रो आवश्यकता बुझेर उपयुक्त घर छान्न धेरै सहयोग गर्‍यो।' 
        : 'The Bhumiraj team helped us understand our needs and choose the right house.',
    },
    'testimonial-2': {
      name: lang === 'np' ? 'सुमन कार्की' : 'Suman Karki',
      role: lang === 'np' ? 'बिक्रीकर्ता' : 'Seller',
      message: lang === 'np' 
        ? 'सम्पत्ति बिक्री प्रक्रियामा पारदर्शिता र नियमित follow-up निकै राम्रो लाग्यो।' 
        : 'I really liked the transparency and regular follow-ups during the property sale process.',
    },
    'testimonial-3': {
      name: lang === 'np' ? 'मिना श्रेष्ठ' : 'Mina Shrestha',
      role: lang === 'np' ? 'जग्गा खरिदकर्ता' : 'Land Buyer',
      message: lang === 'np' 
        ? 'जग्गाको विवरण र लोकेसन स्पष्ट भएकाले निर्णय गर्न सजिलो भयो।' 
        : 'Having clear land details and location made it easy to make a decision.',
    },
  }
  const data = map[testimonial._id ?? testimonial.id]
  if (data) {
    return {
      ...testimonial,
      clientName: data.name,
      role: data.role,
      message: data.message,
    }
  }
  return testimonial
}

export const translateFaq = (faq: any, lang: 'np' | 'en') => {
  const map: Record<string, { question: string, answer: string }> = {
    'faq-1': {
      question: lang === 'np' ? 'सम्पत्ति हेर्न जान मिल्छ?' : 'Can I visit the property?',
      answer: lang === 'np' 
        ? 'अवश्य। inquiry पठाउनुहोस् वा फोन गर्नुहोस्, हाम्रो टिमले समय मिलाएर देखाउँछ।' 
        : 'Absolutely. Please send an inquiry or call us, and our team will arrange a visit.',
    },
    'faq-2': {
      question: lang === 'np' ? 'मूल्य नेपाली रुपैयाँमा हो?' : 'Is the price in Nepalese Rupees?',
      answer: lang === 'np' 
        ? 'हो, सबै मूल्य NPR/Rs. मा देखाइन्छ।' 
        : 'Yes, all prices are displayed in NPR/Rs.',
    },
    'faq-3': {
      question: lang === 'np' ? 'मेरो जग्गा वा घर बिक्रीका लागि राख्न मिल्छ?' : 'Can I list my land or house for sale?',
      answer: lang === 'np' 
        ? 'मिल्छ। सम्पत्तिको विवरण र फोटोसहित सम्पर्क गर्नुहोस्।' 
        : 'Yes. Please contact us with the property details and photos.',
    },
    'faq-4': {
      question: lang === 'np' ? 'कम्पनीले कुन सेवा दिन्छ?' : 'What services does the company provide?',
      answer: lang === 'np' 
        ? 'जग्गा खरिद–बिक्री, घर बिक्री, प्लटिङ तथा रियल इस्टेट लगानीसम्बन्धी परामर्श।' 
        : 'Land buying & selling, house sales, plotting, and real estate investment consultation.',
    },
  }
  const data = map[faq._id ?? faq.id]
  if (data) {
    return {
      ...faq,
      question: data.question,
      answer: data.answer,
    }
  }
  return faq
}

export const translateBlog = (blog: any, lang: 'np' | 'en') => {
  const map: Record<string, { title: string, content: string }> = {
    'things-to-know-before-buying-property-1783': {
      title: lang === 'np' 
        ? 'सम्पत्ति किन्नु अघि जान्नुपर्ने कुराहरू' 
        : 'Important Things to Know Before Buying Property',
      content: lang === 'np'
        ? `सुरक्षित, पारदर्शी र भरपर्दो कारोबारका लागि छोटो जानकारी।\n\nसम्पत्ति खरिद गर्दा कागजातको प्रमाणिकरण (लालपुर्जा, नक्सा, मालपोत तिरेको रसिद) राम्ररी रुजु गर्नुपर्छ। घर वा जग्गाको बाटोको चौडाई, खानेपानी, र बिजुलीको सुविधा छ कि छैन भन्ने कुराको स्थलगत निरीक्षण गर्न अत्यन्त आवश्यक हुन्छ।\n\nभूमिराज रियल इस्टेटमार्फत कारोबार गर्दा यी सबै कुराहरू टिमले पहिले नै जाँचबुझ गरी ग्राहकलाई सुरक्षित लगानी सुनिश्चित गराउँदछ।`
        : `Important guidelines for a safe, transparent, and reliable transaction.\n\nWhen purchasing property, it is critical to verify all legal documents including land ownership certificate (Lalpurja), map details, and recent tax receipts. Conducting an on-site physical inspection to check road width, water supply, and electricity connectivity is highly recommended.\n\nBy dealing through Bhumiraj Real Estate, our professional team handles all documentation checks in advance, guaranteeing you a safe and stress-free investment.`,
    },
  }
  const data = map[blog.slug ?? blog._id ?? blog.id]
  if (data) {
    return {
      ...blog,
      title: data.title,
      content: data.content,
    }
  }
  return blog
}
