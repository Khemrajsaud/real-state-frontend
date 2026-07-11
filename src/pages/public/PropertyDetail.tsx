import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { submitInquiryRequest, type InquiryPayload } from '../../api/auth'
import {
  formatNprPrice,
  getPropertyById,
  getPropertyAmenityNames,
  getPropertyCategoryName,
  getPropertyStatusName,
} from '../../api/properties'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { FavoriteButton } from '../../components/property/FavoriteButton'
import { PropertyGallery } from '../../components/property/PropertyGallery'
import { companyInfo } from '../../constants/companyInfo'
import { useLanguage } from '../../context/LanguageContext'
import {
  translateCategory,
  translateStatus,
  translatePropertyTitle,
  translatePropertyDesc,
  translateAddress,
  translateAmenity,
} from '../../utils/translateHelpers'

type TabType = 'about' | 'features' | 'location' | 'inquiry'

export function PropertyDetail() {
  const { propertyId } = useParams()
  const { language } = useLanguage()
  const isNp = language === 'np'
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const { register: regInquiry, handleSubmit: handleInquiry, reset: resetInquiry, formState: { errors: inquiryErrors } } = useForm<InquiryPayload>()

  const inquiryMutation = useMutation({
    mutationFn: submitInquiryRequest,
    onSuccess: () => resetInquiry(),
  })

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId ?? ''),
    enabled: Boolean(propertyId),
  })

  if (!propertyId) {
    return (
      <Container className="py-5">
        <ErrorState title={isNp ? 'सम्पत्ति फेला परेन' : 'Property not found'} message={isNp ? 'अवैध सम्पत्ति लिङ्क।' : 'The property link is invalid.'} />
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container className="py-5">
        <Loader label={isNp ? 'विवरण लोड हुँदैछ…' : 'Loading property details...'} />
      </Container>
    )
  }

  if (isError || !property) {
    return (
      <Container className="py-5">
        <ErrorState
          title={isNp ? 'लोड गर्न सकिएन' : 'Could not load this property'}
          message={error instanceof Error ? error.message : undefined}
        />
      </Container>
    )
  }

  const categoryName = translateCategory(
    getPropertyCategoryName(property) ?? '',
    language
  )
  const statusName = translateStatus(
    getPropertyStatusName(property) ?? '',
    language
  )

  const title = translatePropertyTitle(property.title ?? '', language)
  const description = translatePropertyDesc(property.description ?? '', language)
  const address = translateAddress(property.address, language)
  const amenities = getPropertyAmenityNames(property)

  // Feature variables
  const area = (property.area as string) || ''
  const roadSize = (property.roadSize as string) || ''
  const agencyName = (property.agencyName as string) || (isNp ? 'भूमिराज रियल इस्टेट' : 'Bhumiraj Real Estate')

  return (
    <main className="pd-page">
      <Container className="py-4">
        {/* Back Link */}
        <Link to="/properties" className="pd-back-btn d-inline-flex align-items-center mb-4 text-decoration-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="me-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {isNp ? 'सम्पत्ति सूचीमा फर्कनुहोस्' : 'Back to listings'}
        </Link>

        {/* Title Header Block */}
        <div className="pd-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="pd-header__title">{title}</h1>
            <div className="pd-header__location d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="me-1 text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{address}</span>
            </div>
          </div>
          <div className="text-md-end">
            <div className="pd-header__price">{formatNprPrice(property.price)}</div>
            <div className="pd-header__status-badge mt-1">{statusName}</div>
          </div>
        </div>

        {/* Showcase Image / Gallery */}
        <div className="pd-gallery-section mb-4">
          <PropertyGallery property={property} />
        </div>

        {/* Key Specifications Horizontal Banner */}
        <div className="pd-specs-banner d-flex justify-content-around flex-wrap gap-3 mb-4 text-center">
          <div className="pd-specs-banner__item">
            <span className="pd-specs-banner__label">{isNp ? 'क्षेत्रफल (Area)' : 'Area Covered'}</span>
            <span className="pd-specs-banner__value">{area || (isNp ? 'नखुलेको' : 'N/A')}</span>
          </div>
          <div className="pd-specs-banner__item">
            <span className="pd-specs-banner__label">{isNp ? 'सडक पहुँच' : 'Road Access'}</span>
            <span className="pd-specs-banner__value">{roadSize || (isNp ? 'नखुलेको' : 'N/A')}</span>
          </div>
          <div className="pd-specs-banner__item">
            <span className="pd-specs-banner__label">{isNp ? 'सम्पत्ति प्रकार' : 'Property Type'}</span>
            <span className="pd-specs-banner__value">{categoryName}</span>
          </div>
          <div className="pd-specs-banner__item">
            <span className="pd-specs-banner__label">{isNp ? 'स्थिति' : 'Project Status'}</span>
            <span className="pd-specs-banner__value">{statusName}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pd-tabs d-flex gap-2 mb-4 overflow-auto pb-1">
          <button
            type="button"
            className={`pd-tabs__btn ${activeTab === 'about' ? 'pd-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            {isNp ? 'सम्पत्ति बारे' : 'ABOUT PROPERTY'}
          </button>
          <button
            type="button"
            className={`pd-tabs__btn ${activeTab === 'features' ? 'pd-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            {isNp ? 'विशेषताहरू' : 'FEATURES'}
          </button>
          {property.locationLink ? (
            <button
              type="button"
              className={`pd-tabs__btn ${activeTab === 'location' ? 'pd-tabs__btn--active' : ''}`}
              onClick={() => setActiveTab('location')}
            >
              {isNp ? 'नक्सा' : 'MAP'}
            </button>
          ) : null}
          <button
            type="button"
            className={`pd-tabs__btn ${activeTab === 'inquiry' ? 'pd-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab('inquiry')}
          >
            {isNp ? 'सोधपुछ' : 'INQUIRY'}
          </button>
        </div>

        {/* 2 Column Content Layout */}
        <Row className="g-4">
          {/* Left Side Content */}
          <Col lg={8}>
            <div className="pd-content-card bg-white p-4 rounded-4 shadow-sm h-100">
              {activeTab === 'about' && (
                <div className="pd-section animate-fade-in">
                  <h2 className="pd-section__title mb-3">{isNp ? 'सम्पत्तिको विवरण' : 'About Property'}</h2>
                  <p className="pd-section__text">{description || (isNp ? 'कुनै विवरण उपलब्ध छैन।' : 'No description available for this listing.')}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="pd-section animate-fade-in">
                  <h2 className="pd-section__title mb-3">{isNp ? 'सुविधाहरू' : 'Amenities & Features'}</h2>
                  {amenities.length > 0 ? (
                    <div className="pd-amenities-grid">
                      {amenities.map((amenity) => {
                        return (
                          <div key={amenity} className="pd-amenity-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="me-2 text-success">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{translateAmenity(amenity, language)}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-muted">{isNp ? 'सुविधाहरू उल्लेख गरिएको छैन।' : 'No amenities listed.'}</p>
                  )}
                </div>
              )}

              {activeTab === 'inquiry' && (
                <div className="pd-section animate-fade-in">
                  <h2 className="pd-section__title mb-1">{isNp ? 'सोधपुछ पठाउनुहोस्' : 'Send an Inquiry'}</h2>
                  <p className="text-muted small mb-4">{isNp ? 'तपाईंको जानकारी भर्नुहोस्, हामी छिट्टै सम्पर्क गर्नेछौं।' : 'Fill in your details and we will get back to you shortly.'}</p>

                  {inquiryMutation.isSuccess && (
                    <Alert variant="success" className="mb-3">
                      {isNp ? '✅ तपाईंको सोधपुछ सफलतापूर्वक पठाइयो!' : '✅ Your inquiry was submitted successfully!'}
                    </Alert>
                  )}
                  {inquiryMutation.isError && (
                    <Alert variant="danger" className="mb-3">
                      {isNp ? 'सोधपुछ पठाउन असफल भयो। पुनः प्रयास गर्नुहोस्।' : 'Failed to submit. Please try again.'}
                    </Alert>
                  )}

                  <Form onSubmit={handleInquiry((data) => inquiryMutation.mutate({
                    ...data,
                    message: `[${property.title ?? 'Property'}] ${data.message}`,
                  }))}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label className="fw-medium">{isNp ? 'पूरा नाम' : 'Full Name'} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          placeholder={isNp ? 'तपाईंको नाम' : 'Your full name'}
                          isInvalid={!!inquiryErrors.name}
                          {...regInquiry('name', { required: true })}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-medium">{isNp ? 'फोन नम्बर' : 'Phone Number'} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          placeholder={isNp ? 'तपाईंको फोन' : 'Your phone number'}
                          isInvalid={!!inquiryErrors.phone}
                          {...regInquiry('phone', { required: true })}
                        />
                      </Col>
                      <Col md={12}>
                        <Form.Label className="fw-medium">{isNp ? 'इमेल' : 'Email'} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email"
                          placeholder={isNp ? 'तपाईंको इमेल' : 'Your email address'}
                          isInvalid={!!inquiryErrors.email}
                          {...regInquiry('email', { required: true })}
                        />
                      </Col>
                      <Col md={12}>
                        <Form.Label className="fw-medium">{isNp ? 'सन्देश' : 'Message'} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder={isNp ? 'यस सम्पत्तिबारे तपाईंको प्रश्न वा चासो लेख्नुहोस्...' : 'Write your question or interest about this property...'}
                          isInvalid={!!inquiryErrors.message}
                          {...regInquiry('message', { required: true })}
                        />
                      </Col>
                      <Col md={12}>
                        <Button type="submit" className="w-100 py-2" disabled={inquiryMutation.isPending}>
                          {inquiryMutation.isPending
                            ? <><Spinner size="sm" className="me-2" />{isNp ? 'पठाउँदैछ...' : 'Submitting...'}</>
                            : (isNp ? 'सोधपुछ पठाउनुहोस्' : 'Submit Inquiry')
                          }
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}

              {activeTab === 'location' && property.locationLink && (
                <div className="pd-section animate-fade-in">
                  <h2 className="pd-section__title mb-3">{isNp ? 'लोकेसन नक्सा' : 'Location Map'}</h2>
                  <p className="mb-4">{isNp ? 'यस सम्पत्तिको लोकेसन गुगल म्याप्समा हेर्न तलको बटनमा थिच्नुहोस्।' : 'Click the button below to view the official property location in Google Maps.'}</p>
                  <Button
                    href={property.locationLink}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    className="px-4 py-2 rounded-3"
                  >
                    {isNp ? 'गुगल म्याप्समा हेर्नुहोस्' : 'Open in Google Maps'}
                  </Button>
                </div>
              )}
            </div>
          </Col>

          {/* Right Side Contact & Agency Card */}
          <Col lg={4}>
            <div className="pd-contact-card bg-white p-4 rounded-4 shadow-sm border border-light">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="pd-contact-card__avatar">
                  {agencyName.charAt(0)}
                </div>
                <div>
                  <h3 className="pd-contact-card__agency-name">{agencyName}</h3>
                  <p className="pd-contact-card__agency-tagline text-muted">{isNp ? 'भरोसा र विश्वासिलो रियल इस्टेट सेवा' : 'Trusted Local Real Estate Agent'}</p>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <Button
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}?text=I am interested in ${encodeURIComponent(title)} (${window.location.href})`}
                  target="_blank"
                  rel="noreferrer"
                  variant="success"
                  className="w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                  {isNp ? 'व्हाट्सएपमा सम्पर्क गर्नुहोस' : 'Contact on WhatsApp'}
                </Button>

                {property.locationLink ? (
                  <Button
                    href={property.locationLink}
                    target="_blank"
                    rel="noreferrer"
                    variant="outline-secondary"
                    className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {isNp ? 'लोकेसन हेर्नुहोस्' : 'View location'}
                  </Button>
                ) : null}

                <div className="w-100 mt-2">
                  <FavoriteButton property={property} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
