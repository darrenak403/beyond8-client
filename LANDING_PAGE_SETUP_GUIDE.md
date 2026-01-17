# Hướng Dẫn Setup Landing Page (Home Page)

## Tổng Quan

Landing page trong project này được xây dựng theo kiến trúc **component-based** với Next.js App Router, sử dụng **Framer Motion** cho animations và **Shadcn UI** cho components.

---

## 1. Cấu Trúc Thư Mục

```
app/(user)/
├── page.tsx                              → Entry point (/)
├── layout.tsx                            → Layout với Header
└── landingpage/
    └── components/
        ├── LandingPage.tsx               → Main landing page component
        ├── buyability/
        │   ├── BuyAbilitySection.tsx     → Property listings sections
        │   ├── PropertyCard.tsx          → Property card component
        │   └── ...
        └── feature/
            ├── FeatureSection.tsx        → Feature cards section
            └── FeatureCard.tsx           → Individual feature card
```

---

## 2. Entry Point Setup

### File: `app/(user)/page.tsx`

```typescript
import LandingPage from './landingpage/components/LandingPage';

export default function Home() {
  return <LandingPage />;
}
```

**Đơn giản và clean:** Page chỉ import và render LandingPage component.

---

## 3. Layout Configuration

### File: `app/(user)/layout.tsx`

```typescript
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Revoland - Nền Tảng Công Nghệ Bất Động Sản Toàn Diện',
  description: 'Revoland - Giải pháp bất động sản...',
};

export default function PropertiesLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
```

**Layout bao gồm:**
- Header component (navigation bar)
- Metadata cho SEO
- Children (landing page content)

---

## 4. Main Landing Page Component

### File: `app/(user)/landingpage/components/LandingPage.tsx`


**Cấu trúc component:**

```typescript
'use client';
import React from 'react';
import BuyAbilitySection from './buyability/BuyAbilitySection';
import Footer from '@/components/Footer';
import FeatureSection from './feature/FeatureSection';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const { location } = useGeolocation();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      {/* 2. Login Prompt (if not authenticated) */}
      {/* 3. Property Listings */}
      {/* 4. Feature Section */}
      {/* 5. Footer */}
    </div>
  );
}
```

**Các sections chính:**
1. Hero Section - Full screen với background image
2. Login Prompt - Chỉ hiện khi chưa đăng nhập
3. BuyAbilitySection - Danh sách bất động sản
4. FeatureSection - 3 feature cards
5. Footer - Thông tin công ty

---

## 5. Hero Section Chi Tiết

### Cấu trúc Hero Section

```typescript
<div className="relative w-full h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)]">
  {/* Background Image */}
  <Image
    src="/bg_hero.jpg"
    alt="Landing Background"
    fill
    className="object-cover object-center brightness-90"
    priority
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/30" />
  
  {/* Content */}
  <div className="relative z-10 flex flex-col items-start justify-center h-full px-3 sm:px-6 lg:px-8">
    {/* Badge with animation */}
    {/* Title with animation */}
    {/* Description with animation */}
  </div>
</div>
```

### Animated Badge Component

```typescript
<motion.div
  className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full shadow-lg"
  initial={{ opacity: 0, width: 'auto' }}
  animate={{ opacity: 1, width: 'auto' }}
  transition={{ duration: 0.4, delay: 0.8, ease: 'easeOut' }}
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }}
>
  {/* Green dot indicator */}
  <motion.div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
  
  {/* Typewriter text effect */}
  {'Nền tảng công nghệ bất động sản.'.split('').map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.05, delay: 1.0 + index * 0.03 }}
    >
      {char}
    </motion.span>
  ))}
</motion.div>
```

### Animated Title

```typescript
<motion.div
  className="font-sans text-white text-3xl md:text-8xl font-medium"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
>
  <div>Mua Bán.</div>
  <div>Cho Thuê.</div>
</motion.div>
```

**Animation timeline:**
- Badge: delay 0.5s → 0.8s
- Title: delay 0.2s
- Description: delay 0.3s

---

## 6. Login Prompt Section

```typescript
{!isAuthenticated ? (
  <section className="w-full flex flex-col lg:flex-row justify-center gap-6 mt-20 py-12">
    {/* Left: Text & Button */}
    <div className="w-full max-w-[500px]">
      <h2 className="font-bold text-4xl mb-3">Gợi ý nhà phù hợp</h2>
      <p className="text-muted-foreground mb-6">
        Đăng nhập để nhận trải nghiệm cá nhân hóa...
      </p>
      <button onClick={() => window.location.href = '/login'}>
        Đăng nhập
      </button>
    </div>
    
    {/* Right: Property Card Preview */}
    <div className="w-full max-w-[500px]">
      <div className="relative rounded-2xl shadow-2xl">
        {/* Floating badges */}
        <Image src="/proper.jpg" />
        <div className="font-bold text-2xl">Vinhome Grandpark</div>
      </div>
    </div>
  </section>
) : (
  <></>
)}
```

**Logic:**
- Chỉ hiển thị khi `!isAuthenticated`
- Có CTA button redirect đến `/login`
- Preview card với floating badges

---

## 7. BuyAbility Section (Property Listings)

### File: `app/(user)/landingpage/components/buyability/BuyAbilitySection.tsx`

**Props:**
```typescript
interface BuyAbilitySectionProps {
  userLocation?: string | null;
  userBoundingBox?: BoundingBox | null;
}
```

**Các sections:**
1. Bất động sản gần bạn (dựa trên geolocation)
2. Bất động sản mới nhất - Bán
3. Bất động sản mới nhất - Cho thuê
4. Nhà phố bán
5. Chung cư bán
6. Chung cư cho thuê
7. Đất bán

### Cấu trúc mỗi section

```typescript
<div className="w-full max-w-8xl mx-auto mb-12">
  {/* Header with navigation */}
  <div className="flex justify-between items-center mb-4 px-24">
    <Link href="/properties?transactionType=ForSale">
      <h2 className="text-xl font-semibold">Bất động sản mới nhất - Bán</h2>
      <ChevronRight />
    </Link>
    
    {/* Carousel controls */}
    <div className="flex gap-2">
      <Button onClick={() => carouselApi?.scrollPrev()}>
        <ChevronLeft />
      </Button>
      <Button onClick={() => carouselApi?.scrollNext()}>
        <ChevronRight />
      </Button>
    </div>
  </div>
  
  {/* Carousel */}
  <Carousel setApi={setCarouselApi}>
    <CarouselContent>
      {isLoading ? (
        // Skeleton loading
        Array.from({ length: 8 }).map((_, i) => (
          <CarouselItem key={i}>
            <PropertySkeleton />
          </CarouselItem>
        ))
      ) : (
        // Property cards
        properties.map(property => (
          <CarouselItem key={property.id}>
            <PropertyCard property={property} />
          </CarouselItem>
        ))
      )}
    </CarouselContent>
  </Carousel>
</div>
```

### Fetch data với useProperties hook

```typescript
const { properties: saleProperties, isLoading: isLoadingSale } = useProperties({
  transactionType: TransactionType.FOR_SALE,
  pageSize: 8,
  pageNumber: 1,
  sortBy: 'createdAt',
  isDescending: true,
  isFeatured: true,
});
```

### Carousel State Management

```typescript
const [carouselApi, setCarouselApi] = useState<CarouselApi>();
const [canScrollPrev, setCanScrollPrev] = useState(false);
const [canScrollNext, setCanScrollNext] = useState(false);

useEffect(() => {
  if (!carouselApi) return;
  
  const updateScrollState = () => {
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  };
  
  updateScrollState();
  carouselApi.on('select', updateScrollState);
  carouselApi.on('reInit', updateScrollState);
  
  return () => {
    carouselApi.off('select', updateScrollState);
    carouselApi.off('reInit', updateScrollState);
  };
}, [carouselApi]);
```

---

## 8. Feature Section

### File: `app/(user)/landingpage/components/feature/FeatureSection.tsx`

```typescript
export default function FeatureSection() {
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      image: '/45.svg',
      title: 'Mua nhà đất',
      description: 'Tìm ngôi nhà phù hợp...',
      buttonText: 'Xem nhà',
      link: '/properties?transactionType=ForSale',
    },
    {
      image: '/46.svg',
      title: 'Bán nhà đất',
      description: 'Dù bạn chọn con đường nào...',
      buttonText: 'Xem các lựa chọn',
      link: isAuthenticated 
        ? '/hosting/property/new' 
        : '/login?redirect=/hosting/property/new',
    },
    {
      image: '/47.svg',
      title: 'Thuê nhà đất',
      description: 'Chúng tôi đang tạo ra...',
      buttonText: 'Tìm nhà thuê',
      link: '/properties?transactionType=ForRent',
    },
  ];
  
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map(f => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </section>
  );
}
```

### FeatureCard Component

```typescript
export default function FeatureCard({
  image, title, description, buttonText, link
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl border p-8 flex flex-col items-center">
      <Image src={image} alt={title} width={100} height={100} />
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link href={link}>
        <Button className="rounded-full bg-red-600">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
```

---

## 9. Footer Component

### File: `components/Footer.tsx`

**Sections:**
1. Company Info với logo
2. Contact Information (địa chỉ, phone, email)
3. Social Media Links
4. Quick Links (navigation)
5. Newsletter Subscription
6. Copyright

```typescript
export default function Footer() {
  return (
    <footer className="w-full bg-white text-zinc-900">
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image src="/logo_revoland_red.png" />
              <span>Revoland</span>
            </Link>
            
            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin />
                <div>Số 40 Đường D2A...</div>
              </div>
              <div className="flex items-center gap-3">
                <Phone />
                <Link href="tel:+84968070478">(096) 807-0478</Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail />
                <Link href="mailto:revolandcom@gmail.com">
                  revolandcom@gmail.com
                </Link>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <Link href="https://facebook.com/...">
                <Button variant="outline" size="icon">
                  <Facebook />
                </Button>
              </Link>
              <Link href="https://instagram.com/...">
                <Button variant="outline" size="icon">
                  <Instagram />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Links, Services, etc. */}
        </div>
      </div>
    </footer>
  );
}
```

---

## 10. Hooks Sử Dụng

### useGeolocation

```typescript
const { location } = useGeolocation();
// location.nearestCity: string
// location.boundingBox: { swLatitude, neLatitude, swLongitude, neLongitude }
```

**Mục đích:** Lấy vị trí user để hiển thị "Bất động sản gần bạn"

### useAuth

```typescript
const { isAuthenticated, user, logout } = useAuth();
```

**Mục đích:** Check authentication status để show/hide login prompt

### useProperties

```typescript
const { properties, isLoading, error } = useProperties({
  transactionType: TransactionType.FOR_SALE,
  type: PropertyType.APARTMENT,
  pageSize: 8,
  sortBy: 'createdAt',
  isDescending: true,
  isFeatured: true,
});
```

**Mục đích:** Fetch property listings từ API

### useIsMobile

```typescript
const isMobile = useIsMobile();
```

**Mục đích:** Responsive design, adjust card size

---

## 11. Responsive Design

### Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Hero Section Responsive

```typescript
className="h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)]"
// Mobile: subtract 7rem (header height)
// Desktop: subtract 5rem
```

### Text Responsive

```typescript
className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-8xl"
// Gradually increase font size
```

### Carousel Items Responsive

```typescript
className="basis-8/12 sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
// Mobile: 8/12 width (1.5 items visible)
// Tablet: 1/2 (2 items)
// Desktop: 1/3 (3 items)
// Large: 1/4 (4 items)
// XL: 1/5 (5 items)
```

---

## 12. Performance Optimization

### Image Optimization

```typescript
<Image
  src="/bg_hero.jpg"
  alt="Landing Background"
  fill
  priority  // Load immediately for hero
  className="object-cover"
/>
```

**priority prop:** Dùng cho hero image để load ngay

### Lazy Loading

```typescript
<PropertyCard
  property={property}
  priority={false}  // Lazy load for non-hero images
  size={isMobile ? 'sm' : 'md'}
/>
```

### Skeleton Loading

```typescript
{isLoading ? (
  Array.from({ length: 8 }).map((_, i) => (
    <PropertySkeleton key={i} />
  ))
) : (
  properties.map(property => <PropertyCard />)
)}
```

---

## 13. SEO Optimization

### Metadata

```typescript
export const metadata: Metadata = {
  title: 'Revoland - Nền Tảng Công Nghệ Bất Động Sản Toàn Diện',
  description: 'Revoland - Giải pháp bất động sản toàn diện...',
  keywords: ['bất động sản', 'mua nhà', 'cho thuê'],
  openGraph: {
    title: 'Revoland',
    description: '...',
    images: ['/og-image.jpg'],
  },
};
```

### Structured Data

```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Revoland",
  "url": "https://revoland.vn",
  "logo": "https://revoland.vn/logo.png"
}
</script>
```

---

## 14. Áp Dụng Cho Project Khác

### Checklist Setup Landing Page

**Bước 1: Tạo cấu trúc thư mục**
```
app/
├── page.tsx
├── layout.tsx
└── landing/
    └── components/
        ├── LandingPage.tsx
        ├── HeroSection.tsx
        ├── FeaturesSection.tsx
        └── ...
```

**Bước 2: Setup Entry Point**
```typescript
// app/page.tsx
import LandingPage from './landing/components/LandingPage';

export default function Home() {
  return <LandingPage />;
}
```

**Bước 3: Tạo Layout với Header**
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

**Bước 4: Build Hero Section**
- Full screen background image
- Gradient overlay
- Animated text với Framer Motion
- CTA buttons

**Bước 5: Add Content Sections**
- Features grid
- Product/Service listings
- Testimonials
- Call-to-action

**Bước 6: Implement Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Test trên nhiều devices

**Bước 7: Optimize Performance**
- Image optimization với Next.js Image
- Lazy loading
- Skeleton loading states
- Code splitting

**Bước 8: SEO Setup**
- Metadata
- Structured data
- Semantic HTML
- Alt texts

---

## 15. Best Practices

### Component Organization

✅ **DO:**
- Tách sections thành components riêng
- Reusable components (FeatureCard, PropertyCard)
- Clear naming conventions
- Props interface với TypeScript

❌ **DON'T:**
- Viết tất cả code trong 1 file
- Hard-code values
- Inline styles (dùng Tailwind)
- Ignore responsive design

### Animation Guidelines

✅ **DO:**
- Subtle animations (0.3s - 0.8s)
- Stagger animations cho lists
- Use easing functions
- Test performance

❌ **DON'T:**
- Over-animate
- Block user interaction
- Animate too many elements
- Ignore reduced-motion preference

### Data Fetching

✅ **DO:**
- Use React Query/SWR
- Show loading states
- Handle errors gracefully
- Cache data appropriately

❌ **DON'T:**
- Fetch in useEffect without cleanup
- Ignore loading states
- Block rendering
- Fetch unnecessary data

---

## 16. Common Patterns

### Section Template

```typescript
export default function Section() {
  return (
    <section className="w-full max-w-8xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Section Title</h2>
        <p className="text-gray-600">Description</p>
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
      </div>
    </section>
  );
}
```

### Carousel Pattern

```typescript
const [api, setApi] = useState<CarouselApi>();
const [canScrollPrev, setCanScrollPrev] = useState(false);
const [canScrollNext, setCanScrollNext] = useState(false);

useEffect(() => {
  if (!api) return;
  
  const update = () => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };
  
  update();
  api.on('select', update);
  return () => api.off('select', update);
}, [api]);

return (
  <Carousel setApi={setApi}>
    <CarouselContent>
      {items.map(item => (
        <CarouselItem key={item.id}>
          <Card />
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
);
```

### Conditional Rendering Pattern

```typescript
{isAuthenticated ? (
  <AuthenticatedContent />
) : (
  <GuestContent />
)}

{isLoading ? (
  <SkeletonLoader />
) : error ? (
  <ErrorMessage />
) : (
  <Content data={data} />
)}
```

---

## 17. Troubleshooting

### Issue: Hero image không full screen

**Solution:**
```typescript
className="h-[calc(100vh-{header-height})]"
// Subtract header height from viewport height
```

### Issue: Animations lag trên mobile

**Solution:**
```typescript
// Reduce animation complexity
// Use transform instead of width/height
// Add will-change: transform
className="will-change-transform"
```

### Issue: Carousel không scroll

**Solution:**
```typescript
// Check carousel API is set
useEffect(() => {
  if (!carouselApi) {
    console.log('Carousel API not ready');
    return;
  }
}, [carouselApi]);
```

### Issue: Images load chậm

**Solution:**
```typescript
// Use priority for above-the-fold images
<Image priority />

// Use appropriate sizes
sizes="(max-width: 768px) 100vw, 50vw"
```

---

## 18. Testing Checklist

- [ ] Hero section hiển thị đúng trên mọi screen size
- [ ] Animations chạy mượt mà
- [ ] Carousel scroll hoạt động
- [ ] Loading states hiển thị
- [ ] Error handling hoạt động
- [ ] Links navigate đúng
- [ ] Images load với quality tốt
- [ ] Responsive trên mobile/tablet/desktop
- [ ] SEO metadata đầy đủ
- [ ] Performance score > 90 (Lighthouse)

---

## Tổng Kết

Landing page trong project này được xây dựng với:

**Architecture:**
- Next.js App Router
- Component-based structure
- TypeScript for type safety

**UI/UX:**
- Framer Motion animations
- Shadcn UI components
- Responsive design
- Skeleton loading

**Data:**
- React Query for data fetching
- Geolocation for personalization
- Authentication-aware content

**Performance:**
- Image optimization
- Lazy loading
- Code splitting
- Caching strategies

Áp dụng các patterns và best practices này, bạn có thể tạo landing page chuyên nghiệp cho bất kỳ project nào.
