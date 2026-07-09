import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { companyInfo } from '../../constants/companyInfo'
import { useLanguage } from '../../context/LanguageContext'

const contactItems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
      </svg>
    ),
    labelNp: 'ठेगाना',
    labelEn: 'Address',
    value: companyInfo.addressNp,
    href: null,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/>
      </svg>
    ),
    labelNp: 'फोन',
    labelEn: 'Phone',
    value: companyInfo.phones.join('  /  '),
    href: `tel:${companyInfo.phones[0]}`,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
      </svg>
    ),
    labelNp: 'इमेल',
    labelEn: 'Email',
    value: companyInfo.email,
    href: `mailto:${companyInfo.email}`,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
      </svg>
    ),
    labelNp: 'WhatsApp',
    labelEn: 'WhatsApp',
    value: companyInfo.whatsapp,
    href: `https://wa.me/${companyInfo.whatsapp}`,
    external: true,
    green: true,
  },
]

export function About() {
  const { language } = useLanguage()
  const isNp = language === 'np'

  return (
    <main className="about-page">
      <div className="about-hero-banner">
        <Container>
          <p className="eyebrow">{isNp ? 'हाम्रो बारेमा' : 'About Us'}</p>
          <h1>{companyInfo.nameNp}</h1>
          <p className="about-hero-tagline">{companyInfo.taglineNp}</p>
        </Container>
      </div>

      <Container className="about-content">
        <Row className="g-5 align-items-start">


          <Col lg={4} className="d-flex flex-column gap-4">
            <div className="about-founder-card">
              <img
                src="/founder.png"
                alt={companyInfo.founderTitleNp}
                className="about-founder-card__img"
              />
              <div className="about-founder-card__footer">
                <strong>{companyInfo.founderTitleNp}</strong>
                <span>{companyInfo.nameNp}</span>
              </div>
            </div>
          </Col>


          <Col lg={8}>
            <div className="about-story">
              <div className="about-story__section">
                <h2 className="about-story__section-title">
                  {isNp ? 'हाम्रो परिचय' : 'Our Story'}
                </h2>
                <p>
                  भूमिराज रियल इस्टेट प्रा. लि. विगत १० वर्षदेखि नेपालको रियल इस्टेट
                  क्षेत्रमा विश्वासका साथ सेवा प्रदान गर्दै आएको एक प्रतिष्ठित कम्पनी हो।
                  हामी जग्गा किनबेच, घर बिक्री, प्लटिङ तथा रियल इस्टेट लगानीसम्बन्धी
                  सल्लाह र सेवा दिँदै आएका छौं।
                </p>
              </div>

              <div className="about-story__section">
                <h2 className="about-story__section-title">
                  {isNp ? 'हाम्रो लक्ष्य' : 'Our Mission'}
                </h2>
                <p>
                  हाम्रो लक्ष्य ग्राहकलाई सुरक्षित, पारदर्शी र भरपर्दो सेवा दिँदै
                  सही सम्पत्ति छान्न मदत गर्नु हो। इमानदारी, व्यावसायिकता र ग्राहकको
                  सन्तुष्टि नै हाम्रो सफलताको आधार हो।
                </p>
                <p>
                  १० वर्षको अनुभवसँगै हामी हरेक ग्राहकको जरुरत बुझेर सही समाधान दिन
                  तयार छौं। भूमिराज रियल इस्टेट प्रा. लि. तपाईंको सुरक्षित लगानी र
                  राम्रो भविष्यका लागि सधैं साथ रहनेछ।
                </p>
              </div>


              <figure className="about-pullquote">
                <blockquote>
                  "{companyInfo.founderMessageNp}"
                </blockquote>
                <figcaption>
                  — {companyInfo.founderTitleNp}, {companyInfo.nameNp}
                </figcaption>
              </figure>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mt-5">
          <Col lg={6}>
            <div className="about-contact-card h-100">
              <h2 className="about-contact-card__title">
                {isNp ? 'सम्पर्क' : 'Contact'}
              </h2>
              <ul className="about-contact-card__list">
                {contactItems.map((item) => (
                  <li key={item.labelEn}>
                    <span className="about-contact-card__icon text-primary">{item.icon}</span>
                    <span className="about-contact-card__details">
                      <small>{isNp ? item.labelNp : item.labelEn}</small>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noreferrer' : undefined}
                          className={item.green ? 'text-success fw-semibold' : 'text-primary'}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/properties"
                className="btn btn-primary w-100 mt-3"
              >
                {isNp ? 'सम्पत्ति हेर्नुहोस्' : 'View Properties'}
              </Link>
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-contact-card h-100">
              <h2 className="about-contact-card__title">
                {isNp ? 'हाम्रो शाखा कार्यालय (नक्सा)' : 'Our Branch Location'}
              </h2>
              <div className="ratio ratio-4x3 rounded-3 overflow-hidden border">
                <iframe
                  title="Branch Office Google Map Location"
                  src="https://maps.google.com/maps?q=Dhangadhi%207%20Manera%20Kailali%20Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen
                  loading="lazy"
                  style={{ border: 0 }}
                ></iframe>
              </div>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                {isNp 
                  ? 'शाखा: धनगढी-७, मनेरा (कैलाली, नेपाल)' 
                  : 'Branch: Dhangadhi-7, Manera (Kailali, Nepal)'}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
