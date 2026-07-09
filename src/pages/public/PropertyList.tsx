import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import {
  getProperties,
  getPropertyCategoryName,
  getPropertyStatusName,
  type Property,
} from '../../api/properties'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { PropertyCard } from '../../components/property/PropertyCard'
import { useLanguage } from '../../context/LanguageContext'

type Filters = {
  search: string
  category: string
  status: string
  sort: 'default' | 'price-asc' | 'price-desc'
}

const defaultFilters: Filters = {
  search: '',
  category: '',
  status: '',
  sort: 'default',
}

const toNum = (price?: string | number) =>
  Number(String(price ?? '0').replace(/[^0-9.]/g, '')) || 0

export function PropertyList() {
  const { t, language } = useLanguage()
  const isNp = language === 'np'
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const categories = useMemo(() => {
    const seen = new Set<string>()
    const result: { key: string; label: string }[] = []
    for (const p of properties) {
      const name = getPropertyCategoryName(p)
      if (name && !seen.has(name)) {
        seen.add(name)
        result.push({ key: name, label: name })
      }
    }
    return result
  }, [properties])

  const statuses = useMemo(() => {
    const seen = new Set<string>()
    const result: { key: string; label: string }[] = []
    for (const p of properties) {
      const name = getPropertyStatusName(p)
      if (name && !seen.has(name)) {
        seen.add(name)
        result.push({ key: name, label: name })
      }
    }
    return result
  }, [properties])

  const filtered: Property[] = useMemo(() => {
    let result = [...properties]

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(
        (p) =>
          (p.title ?? '').toLowerCase().includes(q) ||
          (p.address ?? '').toLowerCase().includes(q),
      )
    }

    if (filters.category) {
      result = result.filter(
        (p) => getPropertyCategoryName(p) === filters.category,
      )
    }

    if (filters.status) {
      result = result.filter(
        (p) => getPropertyStatusName(p) === filters.status,
      )
    }

    if (filters.sort === 'price-asc') {
      result.sort((a, b) => toNum(a.price) - toNum(b.price))
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => toNum(b.price) - toNum(a.price))
    }

    return result
  }, [properties, filters])

  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.status,
    filters.sort !== 'default' ? 'x' : '',
  ].filter(Boolean).length

  const resetFilters = () => setFilters(defaultFilters)

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  return (
    <main className="property-listing-page">
      {/* Page Header */}
      <section className="property-listing-hero">
        <Container>
          <div className="property-listing-hero__content">
            <span className="property-listing-hero__badge">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {isNp ? 'सम्पत्ति सूची' : 'Property Listings'}
            </span>
            <h1 className="property-listing-hero__title">
              {t('featuredProperties')}
            </h1>
            <p className="property-listing-hero__subtitle">
              {isNp
                ? 'घर, जग्गा, अपार्टमेन्ट र व्यावसायिक सम्पत्तिहरू खोज्नुहोस्।'
                : 'Browse houses, land, apartments, and commercial properties from a trusted local team.'}
            </p>
          </div>
        </Container>
      </section>

      {/* Filters + Results */}
      <section className="property-listing-body">
        <Container>
          {/* Filter Bar */}
          <div className="pf-bar">
            <div className="pf-bar__search-wrap">
              <InputGroup className="pf-bar__search">
                <InputGroup.Text>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  placeholder={isNp ? 'शीर्षक वा स्थान खोज्नुहोस्…' : 'Search by title or location…'}
                  value={filters.search}
                  onChange={(e) => set('search', e.target.value)}
                  id="prop-search"
                />
              </InputGroup>
            </div>

            <div className="pf-bar__filters">
              <Form.Select
                id="prop-category"
                value={filters.category}
                onChange={(e) => set('category', e.target.value)}
                className="pf-bar__select"
              >
                <option value="">{isNp ? 'सबै प्रकार' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </Form.Select>

              <Form.Select
                id="prop-status"
                value={filters.status}
                onChange={(e) => set('status', e.target.value)}
                className="pf-bar__select"
              >
                <option value="">{isNp ? 'बिक्री र भाडा' : 'Sale & Rent'}</option>
                {statuses.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </Form.Select>

              <Form.Select
                id="prop-sort"
                value={filters.sort}
                onChange={(e) => set('sort', e.target.value as Filters['sort'])}
                className="pf-bar__select"
              >
                <option value="default">{isNp ? 'क्रम: पूर्वनिर्धारित' : 'Sort: Default'}</option>
                <option value="price-asc">{isNp ? 'मूल्य: कम → बढी' : 'Price: Low → High'}</option>
                <option value="price-desc">{isNp ? 'मूल्य: बढी → कम' : 'Price: High → Low'}</option>
              </Form.Select>

              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="pf-bar__clear">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {isNp ? 'हटाउनुहोस्' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {!isLoading && !isError && (
            <div className="pf-results-bar">
              <p className="pf-results-bar__count">
                {isNp ? (
                  <>{filtered.length} मध्ये <strong>{properties.length}</strong> सम्पत्तिहरू</>
                ) : (
                  <>Showing <strong>{filtered.length}</strong> of <strong>{properties.length}</strong> properties</>
                )}
              </p>
              {activeFilterCount > 0 && (
                <span className="pf-results-bar__badge">
                  {activeFilterCount} {isNp ? 'फिल्टर सक्रिय' : `filter${activeFilterCount > 1 ? 's' : ''} active`}
                </span>
              )}
            </div>
          )}

          {/* States */}
          {isLoading ? <Loader label={isNp ? 'सम्पत्तिहरू लोड हुँदैछ…' : 'Loading properties…'} /> : null}
          {isError ? (
            <ErrorState
              title={isNp ? 'सम्पत्तिहरू लोड गर्न सकिएन' : 'Could not load properties'}
              message={error instanceof Error ? error.message : undefined}
            />
          ) : null}

          {!isLoading && !isError && filtered.length === 0 ? (
            <EmptyState
              title={
                activeFilterCount > 0
                  ? (isNp ? 'कुनै सम्पत्ति भेटिएन' : 'No properties match your filters')
                  : (isNp ? 'हाल कुनै सम्पत्ति छैन' : 'No properties listed yet')
              }
              message={
                activeFilterCount > 0
                  ? (isNp ? 'फिल्टरहरू बदल्नुहोस् वा हटाउनुहोस्।' : 'Try adjusting or clearing your filters.')
                  : (isNp ? 'छिट्टै नयाँ सम्पत्ति थपिनेछ।' : 'Please check back soon for newly added listings.')
              }
            />
          ) : null}

          {/* Property Grid */}
          {!isLoading && !isError && filtered.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filtered.map((property) => (
                <Col key={String(property._id ?? property.id ?? property.title)}>
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>
          ) : null}
        </Container>
      </section>
    </main>
  )
}
