import type {
  AdminLoginPayload,
  AuthResponse,
  AuthUser,
  InquiryPayload,
  LoginPayload,
  SignupPayload,
} from '../api/auth'
import type { Banner, BannerFormPayload } from '../api/banners'
import type { Faq, FaqFormPayload } from '../api/faqs'
import type { Favorite } from '../api/favorites'
import type { ProfileTextPayload } from '../api/profile'
import type { Property, PropertyFormPayload } from '../api/properties'
import type { SubscribePayload } from '../api/subscribers'
import type { Testimonial, TestimonialFormPayload } from '../api/testimonials'
import { companyInfo } from '../constants/companyInfo'

export const USE_MOCK_API = false

type MockState = {
  properties: Property[]
  banners: Banner[]
  faqs: Faq[]
  testimonials: Testimonial[]
  users: AuthUser[]
  inquiries: Array<InquiryPayload & { _id: string; createdAt: string }>
  subscribers: Array<SubscribePayload & { _id: string; isActive: boolean }>
  favorites: Favorite[]
  blogs: any[]
}

const MOCK_STORAGE_KEY = 'realStateMockApiStateV2'
const MOCK_DELAY_MS = 180

const imageUrls = {
  hero:
    '/hero-image.png',
  villa:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82',
  apartment:
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=82',
  land:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=82',
  commercial:
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82',
  bungalow:
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=82',
  interior:
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=82',
  clientOne:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  clientTwo:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
  clientThree:
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80',
}

const createInitialState = (): MockState => ({
  properties: [
    {
      _id: 'prop-1',
      title: 'धनगढी नजिक आधुनिक पारिवारिक घर',
      description:
        'खुला बसोबास क्षेत्र, पार्किङ र शान्त वातावरण भएको घर। परिवारका लागि उपयुक्त, सुरक्षित र सहज पहुँच भएको सम्पत्ति।',
      price: 14500000,
      address: 'धनगढी-७, मनेरा',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-house', name: 'House' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Parking', 'Water supply', 'Road access'],
      propertyImages: [imageUrls.villa, imageUrls.interior],
      isFeatured: true,
      area: '8.5 aana',
      roadSize: '16 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-2',
      title: 'बजार नजिक सुविधायुक्त अपार्टमेन्ट',
      description:
        'बजार, विद्यालय र यातायात नजिक रहेको सजिलो अपार्टमेन्ट। पहिलो पटक घर खोज्ने ग्राहकका लागि व्यवहारिक विकल्प।',
      price: 7200000,
      address: 'पहलमानपुर, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-apartment', name: 'Apartment' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Balcony', 'Security', 'Market nearby'],
      propertyImages: [imageUrls.apartment, imageUrls.interior],
      isHot: true,
      area: '4.2 aana',
      roadSize: '14 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-3',
      title: 'मुख्य सडकसँग जोडिएको जग्गा',
      description:
        'सफा सिमाना र सडक पहुँच भएको प्लट। घर निर्माण वा दीर्घकालीन लगानीका लागि उपयुक्त।',
      price: 9800000,
      address: 'अत्तरिया, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-land', name: 'Land' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Road access', 'Clear boundary'],
      propertyImages: [imageUrls.land],
      isFeatured: true,
      area: '10 Dhur',
      roadSize: '20 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-4',
      title: 'व्यावसायिक प्रयोजनका लागि स्पेस',
      description:
        'चल्तीको सडकमा रहेको ग्राउन्ड-फ्लोर स्पेस। अफिस, सानो पसल, कन्सल्टेन्सी वा शो-रूमका लागि उपयुक्त।',
      price: 55000,
      address: 'धनगढी बजार, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-commercial', name: 'Commercial' },
      status: { _id: 'status-rent', name: 'For Rent' },
      amenities: ['Main road', 'Shutter access', 'Parking nearby'],
      propertyImages: [imageUrls.commercial],
      isHot: true,
      area: '1.2 Kattha',
      roadSize: '30 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-5',
      title: 'बगैंचासहित शान्त बंगला',
      description:
        'बाहिरी खुला ठाउँ, प्राकृतिक उज्यालो र शान्त छिमेक भएको आरामदायी बंगला।',
      price: 17800000,
      address: 'गोदावरी, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-house', name: 'House' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Garden', 'Parking', 'Peaceful area'],
      propertyImages: [imageUrls.bungalow, imageUrls.interior],
      isFeatured: true,
      area: '12 aana',
      roadSize: '18 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-6',
      title: 'धनगढी हसनपुरमा आकर्षक घडेरी बिक्रीमा',
      description:
        'आवासीय वा व्यावसायिक प्रयोजनका लागि उपयुक्त आकर्षक घडेरी। सडक पहुँच र शान्त वातावरण।',
      price: 6500000,
      address: 'हसनपुर, धनगढी',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-land', name: 'Land' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Road access', 'Clear boundary', 'Peaceful area'],
      propertyImages: [imageUrls.land],
      isHot: true,
      area: '10 Dhur',
      roadSize: '20 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-7',
      title: 'सुन्दर पश्चिम चोकमा २.५ तल्लाको घर',
      description:
        'शान्त आवासीय क्षेत्रमा निर्माण गरिएको आधुनिक बुट्टेदार घर। बस्न र भाडामा दिन दुवैका लागि उपयुक्त।',
      price: 18500000,
      address: 'हसनपुर, धनगढी-५',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-house', name: 'House' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Parking', 'Water supply', 'Road access', 'Garden'],
      propertyImages: [imageUrls.villa],
      isFeatured: true,
      area: '10 aana',
      roadSize: '16 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-8',
      title: 'मुख्य बजारमा व्यावसायिक सटर भाडामा',
      description:
        'भीडभाड हुने व्यापारिक केन्द्रमा अवस्थित सटर। व्यापार व्यवसायका लागि अत्यन्त उपयुक्त ठाउँ।',
      price: 35000,
      address: 'एल.एन. चोक, धनगढी',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-commercial', name: 'Commercial' },
      status: { _id: 'status-rent', name: 'For Rent' },
      amenities: ['Main road', 'Parking nearby', 'Security'],
      propertyImages: [imageUrls.commercial],
      isHot: true,
      area: '450 Sq.Ft.',
      roadSize: '40 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-9',
      title: 'शान्त वातावरणमा नयाँ मोडर्न अपार्टमेन्ट',
      description:
        'सबै आधुनिक सुविधाहरू भएको आरामदायक अपार्टमेन्ट। सुरक्षा र शान्तिको पूर्ण प्रत्याभूति।',
      price: 11000000,
      address: 'चटकपुर, धनगढी',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-apartment', name: 'Apartment' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Balcony', 'Elevator', 'Security', 'Gym'],
      propertyImages: [imageUrls.apartment],
      isFeatured: true,
      area: '3 BHK',
      roadSize: '18 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-10',
      title: 'टीकापुर राजमार्गमा व्यावसायिक जग्गा',
      description:
        'मुख्य राजमार्गसँग जोडिएको व्यावसायिक प्रयोजनका लागि उत्तम जग्गा। पेट्रोल पम्प, होटल वा गोदामका लागि उपयुक्त।',
      price: 25000000,
      address: 'टीकापुर राजमार्ग, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-land', name: 'Land' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Main road', 'Clear boundary', 'Road access'],
      propertyImages: [imageUrls.land],
      isFeatured: true,
      area: '1 Bigha',
      roadSize: '40 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-11',
      title: 'लम्कीचुहामा सस्तो जग्गा बिक्रीमा',
      description:
        'कृषियोग्य तथा आवासीय दुवै प्रयोजनका लागि उपयुक्त जग्गा। शान्त वातावरण र पानीको सुविधा।',
      price: 3200000,
      address: 'लम्की, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-land', name: 'Land' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Water supply', 'Peaceful area', 'Clear boundary'],
      propertyImages: [imageUrls.land],
      isHot: true,
      area: '15 Dhur',
      roadSize: '12 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-12',
      title: 'धनगढी उपमहानगरमा कर्नर प्लट',
      description:
        'दुई तर्फबाट सडक पहुँच भएको कर्नर प्लट। घर बनाउन वा लगानीका लागि प्रिमियम लोकेसन।',
      price: 12500000,
      address: 'धनगढी-६, कैलाली',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-land', name: 'Land' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Road access', 'Clear boundary', 'Market nearby'],
      propertyImages: [imageUrls.land, imageUrls.villa],
      isFeatured: true,
      area: '6 aana',
      roadSize: '20 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-13',
      title: 'नयाँ बनेको ३ तल्लाको आवासीय घर',
      description:
        'पूर्ण रूपमा सक्किएको ३ तल्लाको घर। प्रत्येक तल्लामा बाथरुम, किचन र बैठक कोठा। तुरुन्तै बस्न मिल्ने।',
      price: 22000000,
      address: 'मोहनपुर, धनगढी',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-house', name: 'House' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Parking', 'Water supply', 'Road access', 'Balcony'],
      propertyImages: [imageUrls.villa, imageUrls.interior],
      isHot: true,
      area: '5 aana',
      roadSize: '14 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-14',
      title: 'कृष्णपुरमा आकर्षक कृषि जग्गा',
      description:
        'सिँचाइ सुविधा भएको उपजाऊ कृषि जग्गा। खेती तथा पशुपालनका लागि उत्तम अवसर।',
      price: 4800000,
      address: 'कृष्णपुर, कञ्चनपुर',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-land', name: 'Land' },
      status: { _id: 'status-sale', name: 'For Sale' },
      amenities: ['Water supply', 'Clear boundary', 'Peaceful area'],
      propertyImages: [imageUrls.land],
      area: '2 Kattha',
      roadSize: '10 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
    {
      _id: 'prop-15',
      title: 'महेन्द्रनगरमा फ्ल्याट भाडामा',
      description:
        'सबै सुविधायुक्त फ्ल्याट भाडामा उपलब्ध। विद्यार्थी, कर्मचारी तथा सानो परिवारका लागि उपयुक्त।',
      price: 18000,
      address: 'महेन्द्रनगर, कञ्चनपुर',
      locationLink: 'https://maps.google.com',
      category: { _id: 'cat-flats', name: 'Flats' },
      status: { _id: 'status-rent', name: 'For Rent' },
      amenities: ['Water supply', 'Security', 'Market nearby'],
      propertyImages: [imageUrls.apartment, imageUrls.interior],
      area: '2 BHK',
      roadSize: '16 Feet',
      agencyName: 'Bhumiraj Real Estate',
      agencyPropertiesCount: 42,
    },
  ],
  banners: [
    {
      _id: 'banner-1',
      title: companyInfo.taglineNp,
      imageUrl: imageUrls.hero,
    },
  ],
  faqs: [
    {
      _id: 'faq-1',
      question: 'सम्पत्ति हेर्न जान मिल्छ?',
      answer: 'अवश्य। inquiry पठाउनुहोस् वा फोन गर्नुहोस्, हाम्रो टिमले समय मिलाएर देखाउँछ।',
      category: 'खरिद',
    },
    {
      _id: 'faq-2',
      question: 'मूल्य नेपाली रुपैयाँमा हो?',
      answer: 'हो, सबै मूल्य NPR/Rs. मा देखाइन्छ।',
      category: 'मूल्य',
    },
    {
      _id: 'faq-3',
      question: 'मेरो जग्गा वा घर बिक्रीका लागि राख्न मिल्छ?',
      answer: 'मिल्छ। सम्पत्तिको विवरण र फोटोसहित सम्पर्क गर्नुहोस्।',
      category: 'बिक्री',
    },
    {
      _id: 'faq-4',
      question: 'कम्पनीले कुन सेवा दिन्छ?',
      answer:
        'जग्गा खरिद–बिक्री, घर बिक्री, प्लटिङ तथा रियल इस्टेट लगानीसम्बन्धी परामर्श।',
      category: 'सेवा',
    },
  ],
  testimonials: [
    {
      _id: 'testimonial-1',
      clientName: 'Anjana Rai',
      role: 'Home buyer',
      company: 'Itahari',
      message:
        'भूमिराजको टिमले हाम्रो आवश्यकता बुझेर उपयुक्त घर छान्न धेरै सहयोग गर्‍यो।',
      rating: 5,
      avatarUrl: imageUrls.clientOne,
    },
    {
      _id: 'testimonial-2',
      clientName: 'Suman Karki',
      role: 'Seller',
      company: 'Dharan',
      message:
        'सम्पत्ति बिक्री प्रक्रियामा पारदर्शिता र नियमित follow-up निकै राम्रो लाग्यो।',
      rating: 5,
      avatarUrl: imageUrls.clientTwo,
    },
    {
      _id: 'testimonial-3',
      clientName: 'Mina Shrestha',
      role: 'Land buyer',
      company: 'Morang',
      message:
        'जग्गाको विवरण र लोकेसन स्पष्ट भएकाले निर्णय गर्न सजिलो भयो।',
      rating: 4,
      avatarUrl: imageUrls.clientThree,
    },
  ],
  users: [
    {
      _id: 'user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '9800000000',
      avatarUrl: imageUrls.clientOne,
      dob: '1995-05-10',
    },
  ],
  inquiries: [
    {
      _id: 'inq-1',
      name: 'Ramesh Thapa',
      email: 'ramesh@example.com',
      phone: '9812345678',
      message: 'धनगढी नजिकको घर हेर्न चाहन्छु। कृपया समय मिलाइदिनुहोस्।',
      createdAt: new Date().toISOString(),
    },
  ],
  subscribers: [
    { _id: 'sub-1', email: 'buyer@example.com', isActive: true },
    { _id: 'sub-2', email: 'investor@example.com', isActive: true },
  ],
  favorites: [
    { _id: 'fav-1', userId: 'user-1', propertyId: 'prop-1' },
    { _id: 'fav-2', userId: 'user-1', propertyId: 'prop-3' },
  ],
  blogs: [
    {
      _id: 'blog-1',
      title: 'सम्पत्ति किन्दा ध्यान दिनुपर्ने कुराहरू',
      slug: 'things-to-know-before-buying-property-1783',
      content: 'सम्पत्ति वा जग्गा किन्दा जहिले पनि लालपूर्जा, बाटोको चौडाई, र सरकारी नक्सा जाँच गर्नुपर्छ। सुरक्षित कारोबारका लागि हाम्रो परामर्श लिनुहोस्।',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
      author: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'blog-2',
      title: 'नेपालमा रियल इस्टेट लगानीका फाइदाहरू',
      slug: 'benefits-of-real-estate-investment-nepal-2894',
      content: 'रियल इस्टेट लगानी सुरक्षित र दीर्घकालीन फाइदा दिने क्षेत्र हो। सही ठाउँमा गरिएको लगानीले भविष्यमा राम्रो प्रतिफल दिन्छ।',
      coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80',
      author: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
})

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const wait = async () =>
  new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_DELAY_MS)
  })

const getState = (): MockState => {
  const storedState = localStorage.getItem(MOCK_STORAGE_KEY)

  if (!storedState) {
    const initialState = createInitialState()
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }

  try {
    return JSON.parse(storedState) as MockState
  } catch {
    const initialState = createInitialState()
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }
}

const setState = (state: MockState) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state))
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

const getPropertyFromForm = (payload: PropertyFormPayload, property?: Property): Property => ({
  ...property,
  _id: property?._id ?? makeId('prop'),
  title: payload.title,
  description: payload.description,
  price: payload.price,
  address: payload.address,
  locationLink: payload.locationLink,
  category: { _id: payload.categoryId, name: payload.categoryId || 'Property' },
  status: { _id: payload.statusId, name: payload.statusId || 'Available' },
  amenities: payload.amenityIds
    ? (Array.isArray(payload.amenityIds)
        ? payload.amenityIds
        : payload.amenityIds
            .replace(/[[\]"]/g, '')
            .split(',')
            .map((amenity) => amenity.trim())
            .filter(Boolean))
    : property?.amenities ?? ['Road access'],
  propertyImages:
    property?.propertyImages && property.propertyImages.length > 0
      ? property.propertyImages
      : [imageUrls.villa],
})

export const mockLogin = async (payload: LoginPayload): Promise<AuthResponse> => {
  await wait()
  const state = getState()
  const user =
    state.users.find((currentUser) => currentUser.email === payload.email) ??
    state.users[0]

  return { message: 'Mock login successful.', token: 'mock-user-token', user }
}

export const mockAdminLogin = async (
  payload: AdminLoginPayload,
): Promise<AuthResponse> => {
  await wait()
  return {
    message: 'Mock admin login successful.',
    token: 'mock-admin-token',
    user: {
      _id: 'admin-1',
      name: payload.username || 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  }
}

export const mockSignup = async (payload: SignupPayload): Promise<AuthResponse> => {
  await wait()
  const state = getState()
  const user = { _id: makeId('user'), ...payload }
  state.users.push(user)
  setState(state)

  return { message: 'Mock signup successful.', token: 'mock-user-token', user }
}

export const mockLogout = async () => {
  await wait()
  return { success: true, message: 'Logged out.' }
}

export const mockGetProperties = async () => {
  await wait()
  return clone(getState().properties)
}

export const mockGetPropertyById = async (propertyId: string) => {
  await wait()
  const property = getState().properties.find(
    (currentProperty) => String(currentProperty._id ?? currentProperty.id) === propertyId,
  )

  if (!property) {
    throw new Error('Property not found.')
  }

  return clone(property)
}

export const mockCreateProperty = async (payload: PropertyFormPayload) => {
  await wait()
  const state = getState()
  const property = getPropertyFromForm(payload)
  state.properties.unshift(property)
  setState(state)
  return clone(property)
}

export const mockUpdateProperty = async (
  propertyId: string | number,
  payload: PropertyFormPayload,
) => {
  await wait()
  const state = getState()
  const propertyIndex = state.properties.findIndex(
    (property) => String(property._id ?? property.id) === String(propertyId),
  )

  if (propertyIndex === -1) {
    throw new Error('Property not found.')
  }

  const property = getPropertyFromForm(payload, state.properties[propertyIndex])
  state.properties[propertyIndex] = property
  setState(state)
  return clone(property)
}

export const mockDeleteProperty = async (propertyId: string | number) => {
  await wait()
  const state = getState()
  state.properties = state.properties.filter(
    (property) => String(property._id ?? property.id) !== String(propertyId),
  )
  state.favorites = state.favorites.filter(
    (favorite) => String(favorite.propertyId) !== String(propertyId),
  )
  setState(state)
  return { success: true, message: 'Property deleted.' }
}

export const mockGetBanners = async () => {
  await wait()
  return clone(getState().banners)
}

export const mockCreateBanner = async (payload: BannerFormPayload) => {
  await wait()
  const state = getState()
  state.banners.unshift({
    _id: makeId('banner'),
    title: payload.title || 'New featured banner',
    imageUrl: imageUrls.hero,
  })
  setState(state)
  return { success: true, message: 'Banner created.' }
}

export const mockUpdateBanner = async (
  bannerId: string | number,
  payload: BannerFormPayload,
) => {
  await wait()
  const state = getState()
  state.banners = state.banners.map((banner) =>
    String(banner._id ?? banner.id) === String(bannerId)
      ? { ...banner, title: payload.title ?? banner.title }
      : banner,
  )
  setState(state)
  return { success: true, message: 'Banner updated.' }
}

export const mockDeleteBanner = async (bannerId: string | number) => {
  await wait()
  const state = getState()
  state.banners = state.banners.filter(
    (banner) => String(banner._id ?? banner.id) !== String(bannerId),
  )
  setState(state)
  return { success: true, message: 'Banner deleted.' }
}

export const mockGetFaqs = async () => {
  await wait()
  return clone(getState().faqs)
}

export const mockCreateFaq = async (payload: FaqFormPayload) => {
  await wait()
  const state = getState()
  state.faqs.push({ _id: makeId('faq'), ...payload })
  setState(state)
  return { success: true, message: 'FAQ created.' }
}

export const mockUpdateFaq = async (faqId: string | number, payload: FaqFormPayload) => {
  await wait()
  const state = getState()
  state.faqs = state.faqs.map((faq) =>
    String(faq._id ?? faq.id) === String(faqId) ? { ...faq, ...payload } : faq,
  )
  setState(state)
  return { success: true, message: 'FAQ updated.' }
}

export const mockDeleteFaq = async (faqId: string | number) => {
  await wait()
  const state = getState()
  state.faqs = state.faqs.filter((faq) => String(faq._id ?? faq.id) !== String(faqId))
  setState(state)
  return { success: true, message: 'FAQ deleted.' }
}

export const mockGetTestimonials = async () => {
  await wait()
  return clone(getState().testimonials)
}

export const mockCreateTestimonial = async (payload: TestimonialFormPayload) => {
  await wait()
  const state = getState()
  state.testimonials.unshift({
    _id: makeId('testimonial'),
    clientName: payload.clientName,
    role: payload.role,
    company: payload.company,
    message: payload.message,
    rating: payload.rating,
    avatarUrl: imageUrls.clientThree,
  })
  setState(state)
  return { success: true, message: 'Testimonial created.' }
}

export const mockDeleteTestimonial = async (testimonialId: string | number) => {
  await wait()
  const state = getState()
  state.testimonials = state.testimonials.filter(
    (testimonial) => String(testimonial._id ?? testimonial.id) !== String(testimonialId),
  )
  setState(state)
  return { success: true, message: 'Testimonial deleted.' }
}

export const mockGetFavorites = async (userId: string | number) => {
  await wait()
  const state = getState()
  const favorites = state.favorites
    .filter((favorite) => String(favorite.userId) === String(userId))
    .map((favorite) => ({
      ...favorite,
      property: state.properties.find(
        (property) => String(property._id ?? property.id) === String(favorite.propertyId),
      ),
    }))

  return clone(favorites)
}

export const mockToggleFavorite = async ({
  userId,
  propertyId,
}: {
  userId: string | number
  propertyId: string | number
}) => {
  await wait()
  const state = getState()
  const existingFavorite = state.favorites.find(
    (favorite) =>
      String(favorite.userId) === String(userId) &&
      String(favorite.propertyId) === String(propertyId),
  )

  if (existingFavorite) {
    state.favorites = state.favorites.filter(
      (favorite) => favorite._id !== existingFavorite._id,
    )
  } else {
    state.favorites.push({ _id: makeId('fav'), userId, propertyId })
  }

  setState(state)
  return { success: true, message: 'Favorite updated.' }
}

export const mockSubmitInquiry = async (payload: InquiryPayload) => {
  await wait()
  const state = getState()
  state.inquiries.unshift({
    _id: makeId('inq'),
    ...payload,
    createdAt: new Date().toISOString(),
  })
  setState(state)
  return { success: true, message: 'Thanks! Your inquiry has been saved in mock mode.' }
}

export const mockGetInquiries = async () => {
  await wait()
  return clone(getState().inquiries)
}

export const mockSubscribe = async (payload: SubscribePayload) => {
  await wait()
  const state = getState()
  const existingSubscriber = state.subscribers.find(
    (subscriber) => subscriber.email === payload.email,
  )

  if (existingSubscriber) {
    existingSubscriber.isActive = true
  } else {
    state.subscribers.push({ _id: makeId('sub'), ...payload, isActive: true })
  }

  setState(state)
  return { success: true, message: 'Subscribed in mock mode.' }
}

export const mockGetSubscribers = async () => {
  await wait()
  return clone(getState().subscribers)
}

export const mockGetUsers = async () => {
  await wait()
  return clone(getState().users)
}

export const mockGetProfile = async (userId: string | number) => {
  await wait()
  const user = getState().users.find(
    (currentUser) => String(currentUser._id ?? currentUser.id) === String(userId),
  )

  if (!user) {
    throw new Error('Profile not found.')
  }

  return clone(user)
}

export const mockUpdateProfileText = async (
  userId: string | number,
  payload: ProfileTextPayload,
) => {
  await wait()
  const state = getState()
  const userIndex = state.users.findIndex(
    (user) => String(user._id ?? user.id) === String(userId),
  )

  if (userIndex === -1) {
    throw new Error('Profile not found.')
  }

  state.users[userIndex] = { ...state.users[userIndex], ...payload }
  setState(state)
  return clone(state.users[userIndex])
}

export const mockUpdateProfileAvatar = async (userId: string | number) => {
  await wait()
  const state = getState()
  const userIndex = state.users.findIndex(
    (user) => String(user._id ?? user.id) === String(userId),
  )

  if (userIndex === -1) {
    throw new Error('Profile not found.')
  }

  state.users[userIndex] = { ...state.users[userIndex], avatarUrl: imageUrls.clientTwo }
  setState(state)
  return clone(state.users[userIndex])
}

export const mockDeleteProfile = async (userId: string | number) => {
  await wait()
  const state = getState()
  state.users = state.users.filter(
    (user) => String(user._id ?? user.id) !== String(userId),
  )
  setState(state)
  return { success: true, message: 'Account deleted.' }
}

export const mockGetBlogs = async () => {
  await wait()
  return clone(getState().blogs)
}

export const mockGetBlogBySlug = async (slug: string) => {
  await wait()
  const blog = getState().blogs.find((b) => b.slug === slug)
  if (!blog) throw new Error('Blog article not found.')
  return clone(blog)
}

export const mockCreateBlog = async (payload: any) => {
  await wait()
  const state = getState()
  const newBlog = {
    _id: makeId('blog'),
    title: payload.title,
    slug: `${payload.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${Date.now()}`,
    content: payload.content,
    author: payload.author || 'Admin',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  state.blogs.unshift(newBlog)
  setState(state)
  return clone(newBlog)
}

export const mockDeleteBlog = async (id: string | number) => {
  await wait()
  const state = getState()
  state.blogs = state.blogs.filter((b) => String(b._id ?? b.id) !== String(id))
  setState(state)
  return { success: true, message: 'Blog deleted successfully.' }
}
