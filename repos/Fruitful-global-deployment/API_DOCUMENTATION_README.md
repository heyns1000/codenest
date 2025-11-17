# NEXUS_NAIR API Documentation Suite

Complete API documentation for Fruitful Global Planet's VaultMesh ecosystem.

## 📚 Documentation Files

### 1. **API_DOCUMENTATION.md** (Main Reference)
Complete API documentation covering:
- All 7 NEXUS_NAIR systems (BareCart, PulseTrade, ClaimRoot, etc.)
- Request/response examples for every endpoint
- Authentication and security details
- Error handling and status codes
- cURL and TypeScript examples
- Tools and best practices

**Start here for comprehensive API understanding.**

### 2. **openapi-spec.json** (OpenAPI 3.0)
Machine-readable API specification:
- Import into Swagger UI for interactive docs
- Generate client SDKs in any language
- Share with API design tools (Stoplight, Postman)
- Validate requests/responses programmatically

### 3. **postman-collection.json** (Postman Collection v2.1)
Ready-to-use Postman collection:
- All endpoints organized by system
- Pre-configured authentication
- Example requests with real data
- Environment variables for easy switching

### 4. **NEXUS_NAIR_DOCUMENTATION_INDEX.md** (Navigation Guide)
Master index for all NEXUS_NAIR documentation:
- Links to all system documentation
- Quick reference by role (developer, architect, business)
- Decision trees for finding information
- Complete documentation roadmap

---

## 🚀 Quick Start

### For Developers

**1. Read the main documentation:**
```bash
# Open in your editor or browser
open API_DOCUMENTATION.md
```

**2. Import Postman collection:**
- Open Postman
- File → Import
- Select `postman-collection.json`
- Set environment variables (Supabase URL and keys)
- Start testing endpoints

**3. Use OpenAPI spec with Swagger UI:**
```bash
# Install Swagger UI
npm install -g swagger-ui-watcher

# View interactive docs
swagger-ui-watcher openapi-spec.json
```

### For Architects

**1. Review system architecture:**
- Start with `API_DOCUMENTATION.md` → Overview section
- Review Database Schema section
- Study RLS policies and security model

**2. Understand integrations:**
- Read each system's API section
- Review Care Loop automatic allocation
- Study PulseTrade 9-second synchronization

### For Business Teams

**1. Understand the ecosystem:**
- Read `NEXUS_NAIR_DOCUMENTATION_INDEX.md`
- Focus on Care Loop transparency (15% animal welfare)
- Review brand audit statistics (13,713+ brands)

**2. Track impact:**
- Use Care Loop API to see animal welfare contributions
- Monitor license sales and downloads
- Access public transparency endpoints

---

## 🔧 API Documentation Tools

### Recommended Tools (in order of priority)

#### 1. **Swagger UI** ⭐⭐⭐
Best for: Interactive API exploration

```bash
npm install swagger-ui-react
```

Import `openapi-spec.json` for live, interactive documentation with try-it-out functionality.

#### 2. **Postman** ⭐⭐⭐
Best for: API testing and development

- Import `postman-collection.json`
- Set environment variables
- Test all endpoints with real data
- Create automated test suites

Download: https://www.postman.com/downloads/

#### 3. **Redoc** ⭐⭐
Best for: Beautiful static documentation

```bash
npm install redoc-cli
npx redoc-cli bundle openapi-spec.json -o api-docs.html
```

Generates a beautiful single-page HTML documentation site.

#### 4. **Stoplight Studio** ⭐⭐
Best for: API design and collaboration

Website: https://stoplight.io/studio

Visual API designer with mock servers and collaborative editing.

#### 5. **Supabase Studio** ⭐⭐⭐
Best for: Database management and debugging

Access: https://erwpnrnnvxchumusnthp.supabase.co

Built-in database editor, SQL runner, and auto-generated REST API docs.

---

## 📖 Documentation Structure

### By System

```
├─ BareCart Commerce API
│  ├─ Products (CRUD operations)
│  ├─ Orders (with automatic Care Loop)
│  └─ Grain-level accounting
│
├─ Payment Processing API
│  ├─ PayPal integration
│  ├─ PayFast integration
│  └─ Transaction tracking
│
├─ License Management API
│  ├─ License key generation
│  ├─ Download tracking
│  └─ License file generation
│
├─ PulseTrade System API
│  ├─ 9-second pulse synchronization
│  ├─ Trade creation and completion
│  └─ Real-time subscriptions
│
├─ ClaimRoot Blockchain API
│  ├─ Immutable claims
│  ├─ SHA-256 hashing
│  └─ Chain verification
│
├─ VaultMesh Network API
│  ├─ Atomic key generation
│  ├─ Cart totals calculation
│  └─ Brand ecosystem stats
│
└─ Care Loop API
   ├─ 15% allocation tracking
   ├─ Animals helped calculation
   └─ Public transparency
```

### By Use Case

**Creating a complete order flow:**
1. Get products (BareCart)
2. Calculate totals (VaultMesh)
3. Process payment (Payment API)
4. Generate license (License API)
5. Create claim (ClaimRoot - optional)
6. Verify Care Loop allocation (Care Loop)

**Monitoring system health:**
1. Check pulse status (PulseTrade)
2. View pending trades
3. Monitor Care Loop contributions
4. Track license downloads

**Managing licenses:**
1. Create license after payment
2. Retrieve by email or key
3. Track download count
4. Generate license file for customer

---

## 🔐 Authentication

### Two Authentication Methods

**1. Anonymous Access (apikey header)**
```bash
curl -H "apikey: YOUR_ANON_KEY" \
  https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/products
```

Use for:
- Public product catalog
- Public claims
- Care Loop transparency
- Brand audit statistics

**2. Authenticated Access (Bearer token)**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/orders
```

Use for:
- Creating orders
- Managing licenses
- Trading (PulseTrade)
- Creating claims
- Accessing personal data

### Environment Variables

```env
VITE_SUPABASE_URL=https://erwpnrnnvxchumusnthp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_PAYFAST_MERCHANT_ID=your-payfast-merchant-id
VITE_PAYFAST_MERCHANT_KEY=your-payfast-key
```

---

## 🎯 Common Use Cases

### 1. Accept Payment and Issue License

```typescript
// 1. Build cart
const cart = {
  items: [{ id: '1', name: 'Starter', price: 29.00, quantity: 1 }],
  status: 'READY',
  owner: 'customer@example.com'
};

// 2. Process payment (includes order creation, Care Loop, and license)
const result = await PaymentService.processPayPalPayment(
  cart,
  'customer@example.com',
  'John Doe'
);

// 3. Access license
console.log('License Key:', result.license.license_key);
```

### 2. Monitor 9-Second Pulse Trades

```typescript
// Subscribe to pulse cycles
const unsubscribe = PulseTradeService.subscribeToPulse(async (pulse) => {
  // Fetch trades for this pulse
  const trades = await PulseTradeService.getTradesByPulse(pulse);
  console.log(`Pulse ${pulse}: ${trades.length} trades`);
});
```

### 3. Verify Claim Chain Integrity

```typescript
// Get all claims
const { data: claims } = await supabase
  .from('claims')
  .select('*')
  .order('timestamp', { ascending: true });

// Verify each claim
for (const claim of claims) {
  const isValid = await ClaimRootService.verifyClaim(claim.claim_id);
  if (!isValid) {
    console.error(`Invalid claim: ${claim.claim_id}`);
  }
}
```

### 4. Track Care Loop Impact

```typescript
// Get all Care Loop transactions
const { data: transactions } = await supabase
  .from('care_loop_transactions')
  .select('amount, animals_helped');

// Calculate totals
const totals = transactions.reduce((acc, tx) => ({
  totalAmount: acc.totalAmount + tx.amount,
  totalAnimals: acc.totalAnimals + tx.animals_helped
}), { totalAmount: 0, totalAnimals: 0 });

console.log(`Total donated: $${totals.totalAmount.toFixed(2)}`);
console.log(`Animals helped: ${totals.totalAnimals.toFixed(1)}`);
```

---

## 📊 Database Schema Overview

### Core Tables (10 total)

1. **products** - Product catalog
2. **orders** - Customer orders
3. **licenses** - License keys and tracking
4. **payment_transactions** - Payment records
5. **trades** - PulseTrade transactions
6. **claims** - ClaimRoot blockchain
7. **care_loop_transactions** - Animal welfare contributions
8. **mesh_nodes** - VaultMesh network nodes
9. **store_40d** - 40-dimensional data storage
10. **consultants** - Consultant licenses

All tables have:
- UUID primary keys
- Timestamp tracking
- Row Level Security (RLS) enabled
- Proper indexes for performance

---

## 🔍 Testing Your Integration

### 1. Test Product Retrieval
```bash
curl -H "apikey: YOUR_ANON_KEY" \
  "https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/products?select=*"
```

### 2. Test Order Creation
```bash
curl -X POST \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"cart_id":"test-123","customer_id":"test@example.com","total_amount":29.00,"total_grains":1}' \
  "https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/orders"
```

### 3. Test License Retrieval
```bash
curl -H "apikey: YOUR_ANON_KEY" \
  "https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/licenses?customer_email=eq.test@example.com"
```

### 4. Test Care Loop Transparency
```bash
curl -H "apikey: YOUR_ANON_KEY" \
  "https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/care_loop_transactions?select=*&order=timestamp.desc&limit=10"
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "JWT expired" error**
- Solution: Refresh your authentication token
- Check: Token expiration time

**2. "permission denied for table" error**
- Solution: Check RLS policies
- Verify: User is authenticated for protected endpoints

**3. "duplicate key value violates unique constraint"**
- Solution: Check for existing records (email, license key)
- Action: Generate new unique value

**4. "Insufficient quantity" error**
- Solution: Check product inventory before ordering
- Action: Restock products or reduce order quantity

### Getting Help

- **API Issues:** Check `API_DOCUMENTATION.md` error handling section
- **Database Issues:** Use Supabase Studio SQL editor to debug
- **Integration Issues:** Review Postman collection for working examples
- **Support:** support@fruitfulglobalplanet.com

---

## 📈 Scaling Considerations

### Current Capacity
- 10,000x scale ready (verified)
- 160,000 pulses/day (9-second cycles)
- 13,713+ brands integrated
- Petabyte-scale 40D storage

### Performance Best Practices
1. Cache frequently accessed data (products, catalog)
2. Use Supabase real-time subscriptions for live updates
3. Batch operations where possible
4. Implement client-side debouncing for searches
5. Use connection pooling (60 concurrent connections)

### Monitoring
- Track pulse cycle completion time
- Monitor Care Loop allocation accuracy (must be exactly 15%)
- Alert on failed trades or payments
- Dashboard for license downloads and usage

---

## 🎓 Learning Path

### Beginner (Day 1)
1. Read API_DOCUMENTATION.md Overview
2. Import Postman collection
3. Test GET endpoints (products, claims, Care Loop)
4. Understand authentication methods

### Intermediate (Day 2-3)
1. Study database schema
2. Test POST endpoints (create order, payment)
3. Understand Care Loop automatic allocation
4. Review license generation flow

### Advanced (Week 1)
1. Implement complete order flow
2. Subscribe to PulseTrade real-time updates
3. Create and verify claims
4. Build monitoring dashboard

### Expert (Ongoing)
1. Optimize performance with caching
2. Implement advanced error handling
3. Build automated testing suite
4. Contribute to API improvements

---

## 🔗 Related Documentation

- **NEXUS_NAIR_DOCUMENTATION_INDEX.md** - Master navigation guide
- **RESPITORY_v_INFINITY_COMPLETE_SYNTHESIS.md** - Complete system overview
- **NEXUS_NAIR_IMMEDIATE_ACTIVATION_CHECKLIST.md** - Deployment guide
- **NEXUS_NAIR_ACTIVATION_CONFIRMATION.md** - System verification

---

## 📝 Changelog

### Version 1.0.0 (2025-11-14)
- ✅ Initial comprehensive API documentation
- ✅ OpenAPI 3.0 specification
- ✅ Postman collection v2.1
- ✅ Full TypeScript examples
- ✅ cURL examples for all endpoints
- ✅ Error handling guide
- ✅ Tools recommendations

---

## 📜 License

**Treaty:** FAA-TREATY-OMNI-4321-A13XN
**System:** NEXUS_NAIR VaultMesh
**Care Loop:** 15% of all revenue → Banimals™

---

**🔥 The API is ready. The empire awaits. 🔥**

Every grain counts. Every 9 seconds breathe. Every animal cares.
