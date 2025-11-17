# NEXUS_NAIR API Documentation

**Version:** 1.0.0
**Base URL:** `https://erwpnrnnvxchumusnthp.supabase.co`
**Last Updated:** 2025-11-14
**Treaty ID:** FAA-TREATY-OMNI-4321-A13XN

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Environment Setup](#environment-setup)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
   - [BareCart Commerce API](#barecart-commerce-api)
   - [Payment Processing API](#payment-processing-api)
   - [License Management API](#license-management-api)
   - [PulseTrade System API](#pulsetrade-system-api)
   - [ClaimRoot Blockchain API](#claimroot-blockchain-api)
   - [VaultMesh Network API](#vaultmesh-network-api)
   - [Care Loop API](#care-loop-api)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)
8. [Rate Limiting](#rate-limiting)
9. [Testing & Tools](#testing--tools)

---

## Overview

The NEXUS_NAIR API powers Fruitful Global Planet's VaultMesh ecosystem, a comprehensive e-commerce platform featuring:

- **BareCart™** - Zero-waste commerce with grain-level precision ($0.01 units)
- **PulseTrade™** - 9-second pulse trading synchronization
- **ClaimRoot™** - Blockchain-style immutable claims
- **VaultMesh™** - DNA node network with atomic key generation
- **Care Loop™** - Automatic 15% allocation to animal welfare (Banimals)
- **License System** - Digital license key generation and management
- **40D Store** - Multi-dimensional data storage

All APIs are built on Supabase PostgreSQL with Row Level Security (RLS) and real-time capabilities.

---

## Authentication

### Supabase Client Setup

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://erwpnrnnvxchumusnthp.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Authentication Methods

**Anonymous Access:**
- Product catalog viewing
- Public claim verification
- Care Loop transaction transparency

**Authenticated Access Required:**
- Creating orders
- Managing licenses
- Trading on PulseTrade
- Creating claims
- Accessing personal data

### Row Level Security (RLS)

All tables enforce RLS policies:
- Users can only access their own orders, trades, and licenses
- Public read access for products, claims, and care loop transactions
- System operations bypass RLS for automated processes (Care Loop, license generation)

---

## Environment Setup

### Required Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://erwpnrnnvxchumusnthp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Payment Gateways
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_PAYFAST_MERCHANT_ID=your-payfast-merchant-id
VITE_PAYFAST_MERCHANT_KEY=your-payfast-key

# Optional: AI Integration
VITE_GEMINI_API_KEY=your-gemini-key
```

### Installation

```bash
npm install @supabase/supabase-js
```

---

## Database Schema

### Core Tables

#### 1. **products** (BareCart)
```sql
item_id              uuid PRIMARY KEY
name                 text NOT NULL
price                numeric NOT NULL (USD)
quantity             integer DEFAULT 0
grains_per_unit      integer DEFAULT 1
created_at           timestamptz DEFAULT now()
```

#### 2. **orders** (BareCart)
```sql
order_id             uuid PRIMARY KEY
cart_id              text NOT NULL
customer_id          text NOT NULL
total_amount         numeric NOT NULL (USD)
total_grains         bigint DEFAULT 0
timestamp            timestamptz DEFAULT now()
status               text DEFAULT 'completed'
```

#### 3. **licenses** (License System)
```sql
license_id           uuid PRIMARY KEY
license_key          text UNIQUE NOT NULL
order_id             uuid REFERENCES orders
customer_email       text NOT NULL
customer_name        text NOT NULL
product_name         text NOT NULL
product_price        numeric NOT NULL
payment_method       text ('paypal' | 'payfast')
payment_transaction_id text
status               text DEFAULT 'active'
issued_at            timestamptz DEFAULT now()
expires_at           timestamptz (null for lifetime)
download_count       integer DEFAULT 0
last_downloaded_at   timestamptz
```

#### 4. **payment_transactions** (Payment System)
```sql
transaction_id       uuid PRIMARY KEY
order_id             uuid REFERENCES orders
gateway              text ('paypal' | 'payfast')
gateway_transaction_id text
amount               numeric NOT NULL
currency             text DEFAULT 'USD'
status               text DEFAULT 'pending'
customer_email       text NOT NULL
payment_data         jsonb
created_at           timestamptz DEFAULT now()
completed_at         timestamptz
```

#### 5. **trades** (PulseTrade)
```sql
trade_id             uuid PRIMARY KEY
from_id              text NOT NULL
to_id                text NOT NULL
asset                text NOT NULL
amount               numeric NOT NULL
pulse_number         bigint NOT NULL
timestamp            timestamptz DEFAULT now()
status               text DEFAULT 'pending'
```

#### 6. **claims** (ClaimRoot)
```sql
claim_id             uuid PRIMARY KEY
owner                text NOT NULL
asset                text NOT NULL
timestamp            timestamptz DEFAULT now()
previous_hash        text (null for first claim)
current_hash         text NOT NULL (SHA-256)
metadata             jsonb DEFAULT '{}'
```

#### 7. **care_loop_transactions** (Care Loop)
```sql
transaction_id       uuid PRIMARY KEY
source_order_id      uuid (references order)
amount               numeric NOT NULL (15% of order)
beneficiary          text DEFAULT 'Banimals'
timestamp            timestamptz DEFAULT now()
animals_helped       numeric (estimated impact)
```

#### 8. **mesh_nodes** (VaultMesh)
```sql
node_id              uuid PRIMARY KEY
node_type            text ('genome' | 'dna' | 'vault')
genome_hash          text
dna_count            integer DEFAULT 0
open_source          boolean DEFAULT false
created_at           timestamptz DEFAULT now()
```

#### 9. **store_40d** (40D Storage)
```sql
data_id              uuid PRIMARY KEY
data                 text NOT NULL
dimensions           jsonb (40-dimensional coordinates)
timestamp            timestamptz DEFAULT now()
```

#### 10. **consultants** (Consultant System)
```sql
consultant_id        uuid PRIMARY KEY
email                text UNIQUE NOT NULL
name                 text NOT NULL
paypal_transaction_id text
license_date         timestamptz DEFAULT now()
status               text DEFAULT 'active'
```

---

## API Endpoints

## BareCart Commerce API

### Create Product

**Method:** `POST`
**Endpoint:** Direct Supabase query via SDK

```typescript
import { BareCartService } from './services/barecart';

// Create a new product
const product = await BareCartService.createProduct(
  'VaultMesh Starter License',
  29.00,
  100,
  1
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Product name |
| price | number | Yes | Price in USD |
| quantity | number | Yes | Available quantity |
| grainsPerUnit | number | No | Grain count per unit (default: 1) |

**Response:**
```json
{
  "item_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "VaultMesh Starter License",
  "price": 29.00,
  "quantity": 100,
  "grains_per_unit": 1,
  "created_at": "2025-11-14T10:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid price or quantity
- `500 Internal Server Error` - Database error

---

### Get All Products

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const products = await BareCartService.getAllProducts();
```

**Response:**
```json
[
  {
    "item_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "VaultMesh Starter License",
    "price": 29.00,
    "quantity": 100,
    "grains_per_unit": 1,
    "created_at": "2025-11-14T10:30:00Z"
  },
  {
    "item_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "FAA Sovereign License",
    "price": 20138.16,
    "quantity": 5,
    "grains_per_unit": 1000,
    "created_at": "2025-11-14T09:15:00Z"
  }
]
```

**Note:** Products are ordered by `created_at DESC` (newest first)

---

### Get Single Product

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const product = await BareCartService.getProduct(itemId);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| itemId | string (uuid) | Yes | Product ID |

**Response:**
```json
{
  "item_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "VaultMesh Starter License",
  "price": 29.00,
  "quantity": 100,
  "grains_per_unit": 1,
  "created_at": "2025-11-14T10:30:00Z"
}
```

**Errors:**
- `404 Not Found` - Product does not exist
- `500 Internal Server Error` - Database error

---

### Update Product Quantity

**Method:** `PATCH`
**Endpoint:** Direct Supabase query via SDK

```typescript
// Decrease quantity (e.g., after purchase)
const updated = await BareCartService.updateProductQuantity(itemId, -5);

// Increase quantity (e.g., restocking)
const restocked = await BareCartService.updateProductQuantity(itemId, 50);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| itemId | string (uuid) | Yes | Product ID |
| quantityChange | number | Yes | Change amount (positive or negative) |

**Response:**
```json
{
  "item_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "VaultMesh Starter License",
  "price": 29.00,
  "quantity": 95,
  "grains_per_unit": 1,
  "created_at": "2025-11-14T10:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Insufficient quantity (would result in negative)
- `404 Not Found` - Product does not exist
- `500 Internal Server Error` - Database error

---

### Create Order

**Method:** `POST`
**Endpoint:** Direct Supabase query via SDK

```typescript
const order = await BareCartService.createOrder(
  'cart-abc123',
  'customer@example.com',
  [
    { itemId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 },
    { itemId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1 }
  ]
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cartId | string | Yes | Unique cart identifier |
| customerId | string | Yes | Customer identifier (email) |
| items | Array | Yes | Array of { itemId, quantity } |

**Request Example:**
```typescript
{
  cartId: 'cart-abc123',
  customerId: 'customer@example.com',
  items: [
    { itemId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }
  ]
}
```

**Response:**
```json
{
  "order_id": "660e8400-e29b-41d4-a716-446655440000",
  "cart_id": "cart-abc123",
  "customer_id": "customer@example.com",
  "total_amount": 58.00,
  "total_grains": 2,
  "timestamp": "2025-11-14T11:00:00Z",
  "status": "completed"
}
```

**Side Effects:**
- Product quantities are automatically decreased
- Care Loop transaction created (15% of total)
- Animals helped calculated: `careLoopAmount / 12.5`

**Care Loop Calculation:**
```typescript
totalAmount = 58.00
careLoopAmount = 58.00 * 0.15 = 8.70
animalsHelped = 8.70 / 12.5 = 0.696
```

**Errors:**
- `400 Bad Request` - Insufficient quantity for one or more items
- `404 Not Found` - One or more products not found
- `500 Internal Server Error` - Database error

---

### Get Orders by Customer

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const orders = await BareCartService.getOrdersByCustomer('customer@example.com');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| customerId | string | Yes | Customer identifier (email) |

**Response:**
```json
[
  {
    "order_id": "660e8400-e29b-41d4-a716-446655440000",
    "cart_id": "cart-abc123",
    "customer_id": "customer@example.com",
    "total_amount": 58.00,
    "total_grains": 2,
    "timestamp": "2025-11-14T11:00:00Z",
    "status": "completed"
  }
]
```

**Note:** Orders are sorted by `timestamp DESC` (newest first)

---

### Get Single Order

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const order = await BareCartService.getOrder(orderId);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | string (uuid) | Yes | Order ID |

**Response:**
```json
{
  "order_id": "660e8400-e29b-41d4-a716-446655440000",
  "cart_id": "cart-abc123",
  "customer_id": "customer@example.com",
  "total_amount": 58.00,
  "total_grains": 2,
  "timestamp": "2025-11-14T11:00:00Z",
  "status": "completed"
}
```

**Errors:**
- `404 Not Found` - Order does not exist
- `500 Internal Server Error` - Database error

---

### Calculate Grains

**Method:** Local calculation (no API call)

```typescript
const totalGrains = BareCartService.calculateGrains([
  { price: 29.00, quantity: 2, grainsPerUnit: 1 },
  { price: 499.00, quantity: 1, grainsPerUnit: 100 }
]);
// Returns: 102 grains
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| items | Array | Yes | Array of { price, quantity, grainsPerUnit } |

**Returns:** `number` - Total grain count

**Calculation:**
```typescript
totalGrains = items.reduce((sum, item) =>
  sum + (item.grainsPerUnit * item.quantity), 0
);
```

---

## Payment Processing API

### Create Payment Transaction

**Method:** `POST`
**Endpoint:** Direct Supabase query via SDK

```typescript
import { PaymentService } from './services/payment';

const transaction = await PaymentService.createPaymentTransaction(
  orderId,
  'paypal',
  29.00,
  'customer@example.com',
  'ZAR'
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | string (uuid) | Yes | Related order ID |
| gateway | 'paypal' \| 'payfast' | Yes | Payment gateway |
| amount | number | Yes | Payment amount |
| customerEmail | string | Yes | Customer email |
| currency | string | No | Currency code (default: 'ZAR') |

**Response:**
```json
{
  "transaction_id": "770e8400-e29b-41d4-a716-446655440000",
  "order_id": "660e8400-e29b-41d4-a716-446655440000",
  "gateway": "paypal",
  "gateway_transaction_id": null,
  "amount": 29.00,
  "currency": "ZAR",
  "status": "pending",
  "customer_email": "customer@example.com",
  "payment_data": {},
  "created_at": "2025-11-14T11:05:00Z",
  "completed_at": null
}
```

**Errors:**
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Order does not exist
- `500 Internal Server Error` - Database error

---

### Complete Payment Transaction

**Method:** `PATCH`
**Endpoint:** Direct Supabase query via SDK

```typescript
await PaymentService.completePaymentTransaction(
  transactionId,
  'PAYPAL-12345-ABCDE',
  {
    cart_items: cart.items,
    paypal_order_id: 'ORDER-123',
    payer_id: 'PAYER-456'
  }
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| transactionId | string (uuid) | Yes | Transaction ID |
| gatewayTransactionId | string | Yes | External payment ID |
| paymentData | object | Yes | Raw payment gateway response |

**Response:** `void` (no return value on success)

**Side Effects:**
- Transaction status updated to `'completed'`
- `completed_at` timestamp set
- `gateway_transaction_id` recorded
- `payment_data` stored for audit trail

**Errors:**
- `404 Not Found` - Transaction does not exist
- `500 Internal Server Error` - Database error

---

### Process PayPal Payment

**Method:** `POST`
**Endpoint:** Direct service call via SDK

```typescript
const result = await PaymentService.processPayPalPayment(
  cart,
  'customer@example.com',
  'John Doe'
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cart | Cart | Yes | Shopping cart object |
| customerEmail | string | Yes | Customer email |
| customerName | string | Yes | Customer full name |

**Cart Object Structure:**
```typescript
interface Cart {
  items: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
  }>;
  status: 'BUILDING' | 'READY' | 'COMPLETED';
  owner: string;
  atomicKey?: string;
}
```

**Response (Success):**
```json
{
  "success": true,
  "transaction": {
    "transaction_id": "770e8400-e29b-41d4-a716-446655440000",
    "order_id": "660e8400-e29b-41d4-a716-446655440000",
    "gateway": "paypal",
    "gateway_transaction_id": "PAYPAL-1731600000000-ABC123",
    "amount": 29.00,
    "currency": "ZAR",
    "status": "completed",
    "customer_email": "customer@example.com",
    "payment_data": { "cart_items": [...] },
    "created_at": "2025-11-14T11:05:00Z",
    "completed_at": "2025-11-14T11:05:05Z"
  },
  "license": {
    "license_id": "880e8400-e29b-41d4-a716-446655440000",
    "license_key": "ABCD-EFGH-JKLM-NPQR-STUW",
    "order_id": "660e8400-e29b-41d4-a716-446655440000",
    "customer_email": "customer@example.com",
    "customer_name": "John Doe",
    "product_name": "VaultMesh Starter License",
    "product_price": 29.00,
    "payment_method": "paypal",
    "payment_transaction_id": "PAYPAL-1731600000000-ABC123",
    "status": "active",
    "issued_at": "2025-11-14T11:05:05Z",
    "expires_at": null,
    "download_count": 0,
    "last_downloaded_at": null
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "transaction": {},
  "error": "Insufficient quantity for VaultMesh Starter License"
}
```

**Automatic Operations:**
1. Calculate cart totals (subtotal + Care Loop 15%)
2. Create order via VaultMesh service
3. Create payment transaction record
4. Generate mock PayPal transaction ID
5. Complete payment transaction
6. Generate and issue license
7. Return complete result with license

**Errors:**
- `400 Bad Request` - Invalid cart or customer data
- `500 Internal Server Error` - Payment processing failed

---

### Process PayFast Payment

**Method:** `POST`
**Endpoint:** Direct service call via SDK

```typescript
const result = await PaymentService.processPayFastPayment(
  cart,
  'customer@example.com',
  'Jane Smith'
);
```

**Parameters:** Same as PayPal payment

**Response:** Same structure as PayPal payment, but with:
- `gateway: 'payfast'`
- `gateway_transaction_id: 'PAYFAST-1731600000000-XYZ789'`
- `payment_method: 'payfast'`

**Note:** Currently uses mock PayFast integration. For production, integrate with actual PayFast API.

---

## License Management API

### Generate License Key

**Method:** Local generation (no API call)

```typescript
import { LicenseService } from './services/license';

const licenseKey = LicenseService.generateLicenseKey();
// Returns: "A3BC-D4FG-H7JK-M9NP-Q2RS"
```

**Format:**
- 5 segments separated by hyphens
- 4 characters per segment
- Uppercase letters (excluding I, O to avoid confusion)
- Numbers 2-9 (excluding 0, 1 to avoid confusion)
- Total length: 24 characters (20 + 4 hyphens)

**Character Set:** `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`

**Example Keys:**
- `ABCD-EFGH-JKLM-NPQR-STUW`
- `2345-6789-ABCD-EFGH-JKLM`
- `WXYZ-2345-6789-ABCD-EFGH`

---

### Create License

**Method:** `POST`
**Endpoint:** Direct Supabase query via SDK

```typescript
const license = await LicenseService.createLicense(
  orderId,
  'customer@example.com',
  'John Doe',
  'VaultMesh Starter License',
  29.00,
  'paypal',
  'PAYPAL-12345-ABCDE'
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | string (uuid) | Yes | Related order ID |
| customerEmail | string | Yes | Customer email |
| customerName | string | Yes | Customer full name |
| productName | string | Yes | Product purchased |
| productPrice | number | Yes | Price paid |
| paymentMethod | 'paypal' \| 'payfast' | Yes | Payment gateway used |
| paymentTransactionId | string | Yes | External transaction ID |

**Response:**
```json
{
  "license_id": "880e8400-e29b-41d4-a716-446655440000",
  "license_key": "ABCD-EFGH-JKLM-NPQR-STUW",
  "order_id": "660e8400-e29b-41d4-a716-446655440000",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "product_name": "VaultMesh Starter License",
  "product_price": 29.00,
  "payment_method": "paypal",
  "payment_transaction_id": "PAYPAL-12345-ABCDE",
  "status": "active",
  "issued_at": "2025-11-14T11:05:05Z",
  "expires_at": null,
  "download_count": 0,
  "last_downloaded_at": null
}
```

**Errors:**
- `400 Bad Request` - Invalid parameters
- `409 Conflict` - License key collision (extremely rare, retry with new key)
- `500 Internal Server Error` - Database error

---

### Get Licenses by Email

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const licenses = await LicenseService.getLicensesByEmail('customer@example.com');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Customer email address |

**Response:**
```json
[
  {
    "license_id": "880e8400-e29b-41d4-a716-446655440000",
    "license_key": "ABCD-EFGH-JKLM-NPQR-STUW",
    "order_id": "660e8400-e29b-41d4-a716-446655440000",
    "customer_email": "customer@example.com",
    "customer_name": "John Doe",
    "product_name": "VaultMesh Starter License",
    "product_price": 29.00,
    "payment_method": "paypal",
    "payment_transaction_id": "PAYPAL-12345-ABCDE",
    "status": "active",
    "issued_at": "2025-11-14T11:05:05Z",
    "expires_at": null,
    "download_count": 3,
    "last_downloaded_at": "2025-11-14T15:30:00Z"
  }
]
```

**Note:** Licenses are sorted by `issued_at DESC` (newest first)

**Errors:**
- `500 Internal Server Error` - Database error

---

### Get License by Key

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const license = await LicenseService.getLicenseByKey('ABCD-EFGH-JKLM-NPQR-STUW');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| licenseKey | string | Yes | License key (format: XXXX-XXXX-XXXX-XXXX-XXXX) |

**Response:**
```json
{
  "license_id": "880e8400-e29b-41d4-a716-446655440000",
  "license_key": "ABCD-EFGH-JKLM-NPQR-STUW",
  "order_id": "660e8400-e29b-41d4-a716-446655440000",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "product_name": "VaultMesh Starter License",
  "product_price": 29.00,
  "payment_method": "paypal",
  "payment_transaction_id": "PAYPAL-12345-ABCDE",
  "status": "active",
  "issued_at": "2025-11-14T11:05:05Z",
  "expires_at": null,
  "download_count": 3,
  "last_downloaded_at": "2025-11-14T15:30:00Z"
}
```

**Returns:** `null` if license not found

**Errors:**
- `500 Internal Server Error` - Database error

---

### Increment Download Count

**Method:** `PATCH`
**Endpoint:** Direct Supabase query via SDK or RPC

```typescript
await LicenseService.incrementDownloadCount(licenseId);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| licenseId | string (uuid) | Yes | License ID |

**Response:** `void` (no return value on success)

**Side Effects:**
- `download_count` incremented by 1
- `last_downloaded_at` updated to current timestamp

**Implementation:**
1. First tries RPC function `increment_license_download`
2. Falls back to manual update if RPC not available
3. Atomic operation to prevent race conditions

**Errors:**
- `404 Not Found` - License does not exist
- `500 Internal Server Error` - Database error

---

### Generate License File

**Method:** Local generation (no API call)

```typescript
const licenseText = LicenseService.generateLicenseFile(license, cart);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| license | License | Yes | License object |
| cart | Cart | Yes | Shopping cart with purchased items |

**Returns:** `string` - Formatted license text

**Example Output:**
```
═══════════════════════════════════════════════════════════════
                    FRUITFUL GLOBAL PLANET
                   VAULTMESH TREATY LICENSE
═══════════════════════════════════════════════════════════════

LICENSE KEY: ABCD-EFGH-JKLM-NPQR-STUW

CUSTOMER INFORMATION:
  Name:  John Doe
  Email: customer@example.com

PURCHASE DETAILS:
  Order ID:      660e8400-e29b-41d4-a716-446655440000
  Transaction:   PAYPAL-12345-ABCDE
  Payment Method: PAYPAL
  Amount Paid:   R29.00

LICENSED PRODUCTS:
  - VaultMesh Starter License (Qty: 1) - R29.00

LICENSE STATUS:
  Status:     ACTIVE
  Issued:     11/14/2025, 11:05:05 AM
  Expires:    Lifetime License

TREATY INFORMATION:
  Treaty ID:  FAA-TREATY-OMNI-4321-A13XN
  System:     NEXUS_NAIR VaultMesh
  Care Loop:  15% contributed to Banimals

TERMS & CONDITIONS:
  This license grants you access to the purchased VaultMesh systems
  and services. The license is non-transferable and is valid only
  for the customer email listed above. Misuse or sharing of this
  license key may result in immediate revocation.

  For support or questions, contact: support@fruitfulglobalplanet.com

═══════════════════════════════════════════════════════════════
              Thank you for supporting the Care Loop!
    Every grain counts. Every 9 seconds breathe. Every animal cares.
═══════════════════════════════════════════════════════════════
```

---

### Download License File

**Method:** Client-side download (browser only)

```typescript
LicenseService.downloadLicenseFile(licenseText, licenseKey);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| licenseText | string | Yes | Generated license file content |
| licenseKey | string | Yes | License key for filename |

**Behavior:**
- Creates text/plain blob from license content
- Triggers browser download
- Filename format: `FruitfulGlobalPlanet_License_{LICENSE_KEY}.txt`
- Example: `FruitfulGlobalPlanet_License_ABCD-EFGH-JKLM-NPQR-STUW.txt`

**Side Effects:**
- File downloaded to user's default download folder
- No server-side storage required
- No return value

---

## PulseTrade System API

### Understanding the 9-Second Pulse

The PulseTrade system synchronizes all trades to 9-second intervals ("pulses"):

**Constants:**
- `PULSE_INTERVAL = 9000 ms` (9 seconds)
- Base timestamp: Unix epoch (0)
- Pulses run continuously since epoch

**Pulse Calculation:**
```typescript
currentPulse = Math.floor(Date.now() / 9000)
```

**Example:**
```
Current time: 1731600000000 ms (Nov 14, 2025, 11:00:00 UTC)
Current pulse: 192400000
Next pulse: 192400001 (at 11:00:09 UTC)
Time until next: 9000 - (1731600000000 % 9000) = 0 ms
```

---

### Get Current Pulse

**Method:** Local calculation (no API call)

```typescript
import { PulseTradeService } from './services/pulsetrade';

const pulseNumber = PulseTradeService.getCurrentPulse();
// Returns: 192400000 (example)
```

**Returns:** `number` - Current pulse number

**Calculation:**
```typescript
pulseNumber = Math.floor(Date.now() / 9000);
```

---

### Get Next Pulse Time

**Method:** Local calculation (no API call)

```typescript
const nextPulseTimestamp = PulseTradeService.getNextPulseTime();
// Returns: 1731600009000 (example - Unix timestamp in ms)
```

**Returns:** `number` - Unix timestamp of next pulse

**Calculation:**
```typescript
currentPulse = getCurrentPulse();
nextPulseTime = (currentPulse + 1) * 9000;
```

---

### Get Time Until Next Pulse

**Method:** Local calculation (no API call)

```typescript
const millisecondsRemaining = PulseTradeService.getTimeUntilNextPulse();
// Returns: 3457 (example - milliseconds)
```

**Returns:** `number` - Milliseconds until next pulse

**Calculation:**
```typescript
timeUntilNext = getNextPulseTime() - Date.now();
```

---

### Create Trade

**Method:** `POST`
**Endpoint:** Direct Supabase query via SDK

```typescript
const trade = await PulseTradeService.createTrade(
  'user-123',
  'user-456',
  'VaultMesh-License',
  1
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fromId | string | Yes | Sender identifier |
| toId | string | Yes | Recipient identifier |
| asset | string | Yes | Asset being traded |
| amount | number | Yes | Trade amount (must be > 0) |

**Response:**
```json
{
  "trade_id": "990e8400-e29b-41d4-a716-446655440000",
  "from_id": "user-123",
  "to_id": "user-456",
  "asset": "VaultMesh-License",
  "amount": 1,
  "pulse_number": 192400000,
  "timestamp": "2025-11-14T11:00:00Z",
  "status": "pending"
}
```

**Automatic Operations:**
- Pulse number captured at creation time
- Status defaults to `'pending'`
- Timestamp automatically set

**Errors:**
- `400 Bad Request` - Invalid amount (must be > 0)
- `500 Internal Server Error` - Database error

---

### Complete Trade

**Method:** `PATCH`
**Endpoint:** Direct Supabase query via SDK

```typescript
const completedTrade = await PulseTradeService.completeTrade(tradeId);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tradeId | string (uuid) | Yes | Trade ID |

**Response:**
```json
{
  "trade_id": "990e8400-e29b-41d4-a716-446655440000",
  "from_id": "user-123",
  "to_id": "user-456",
  "asset": "VaultMesh-License",
  "amount": 1,
  "pulse_number": 192400000,
  "timestamp": "2025-11-14T11:00:00Z",
  "status": "completed"
}
```

**Side Effects:**
- Status updated to `'completed'`

**Errors:**
- `404 Not Found` - Trade does not exist
- `500 Internal Server Error` - Database error

---

### Get Pending Trades

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const pendingTrades = await PulseTradeService.getPendingTrades();
```

**Response:**
```json
[
  {
    "trade_id": "990e8400-e29b-41d4-a716-446655440000",
    "from_id": "user-123",
    "to_id": "user-456",
    "asset": "VaultMesh-License",
    "amount": 1,
    "pulse_number": 192400000,
    "timestamp": "2025-11-14T11:00:00Z",
    "status": "pending"
  }
]
```

**Note:** Trades sorted by `pulse_number DESC` (most recent pulse first)

**Errors:**
- `500 Internal Server Error` - Database error

---

### Get Trades by Pulse

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const tradesInPulse = await PulseTradeService.getTradesByPulse(192400000);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pulseNumber | number | Yes | Pulse cycle number |

**Response:**
```json
[
  {
    "trade_id": "990e8400-e29b-41d4-a716-446655440000",
    "from_id": "user-123",
    "to_id": "user-456",
    "asset": "VaultMesh-License",
    "amount": 1,
    "pulse_number": 192400000,
    "timestamp": "2025-11-14T11:00:00Z",
    "status": "completed"
  },
  {
    "trade_id": "990e8400-e29b-41d4-a716-446655440001",
    "from_id": "user-789",
    "to_id": "user-012",
    "asset": "Data-Stream",
    "amount": 5,
    "pulse_number": 192400000,
    "timestamp": "2025-11-14T11:00:03Z",
    "status": "completed"
  }
]
```

**Note:** Trades sorted by `timestamp DESC` within the pulse

**Use Case:** Analyze all trading activity within a specific 9-second window

**Errors:**
- `500 Internal Server Error` - Database error

---

### Get User Trades

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const userTrades = await PulseTradeService.getUserTrades('user-123');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User identifier |

**Response:**
```json
[
  {
    "trade_id": "990e8400-e29b-41d4-a716-446655440000",
    "from_id": "user-123",
    "to_id": "user-456",
    "asset": "VaultMesh-License",
    "amount": 1,
    "pulse_number": 192400000,
    "timestamp": "2025-11-14T11:00:00Z",
    "status": "completed"
  },
  {
    "trade_id": "990e8400-e29b-41d4-a716-446655440002",
    "from_id": "user-789",
    "to_id": "user-123",
    "asset": "Data-Stream",
    "amount": 3,
    "pulse_number": 192399999,
    "timestamp": "2025-11-14T10:59:54Z",
    "status": "completed"
  }
]
```

**Note:**
- Returns trades where user is sender OR recipient
- Trades sorted by `timestamp DESC` (newest first)

**Errors:**
- `500 Internal Server Error` - Database error

---

### Subscribe to Pulse

**Method:** Real-time subscription (client-side)

```typescript
const unsubscribe = PulseTradeService.subscribeToPulse((pulseNumber) => {
  console.log(`New pulse: ${pulseNumber}`);
  // Trigger UI updates, fetch new trades, etc.
});

// Later: cleanup
unsubscribe();
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | Called every pulse with pulse number |

**Returns:** `Function` - Cleanup function to stop subscription

**Behavior:**
- Callback fired immediately with current pulse
- Callback fired every 9 seconds with new pulse number
- Cleanup function clears interval

**Example Usage:**
```typescript
// React hook example
useEffect(() => {
  const unsubscribe = PulseTradeService.subscribeToPulse((pulse) => {
    setPulseNumber(pulse);
    // Fetch new trades for this pulse
    fetchTradesForPulse(pulse);
  });

  return () => unsubscribe();
}, []);
```

---

## ClaimRoot Blockchain API

### Understanding Claims

ClaimRoot™ provides blockchain-style immutable ownership claims:

**Features:**
- SHA-256 hashing for integrity
- Chain linking via previous hash
- Immutable once created
- Public verification
- Metadata storage

**Hash Calculation:**
```typescript
dataToHash = owner + asset + timestamp + previousHash
currentHash = SHA-256(dataToHash)
```

---

### Create Claim

**Method:** `POST`
**Endpoint:** Direct Supabase query via SDK

```typescript
import { ClaimRootService } from './services/claimroot';

const claim = await ClaimRootService.createClaim(
  'user-123',
  'VaultMesh-License-ABCD',
  {
    license_key: 'ABCD-EFGH-JKLM-NPQR-STUW',
    payment_id: 'PAYPAL-12345-ABCDE',
    jurisdiction: 'ZA'
  }
);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| owner | string | Yes | Owner identifier |
| asset | string | Yes | Asset being claimed |
| metadata | object | No | Additional claim data (default: {}) |

**Response:**
```json
{
  "claim_id": "aa0e8400-e29b-41d4-a716-446655440000",
  "owner": "user-123",
  "asset": "VaultMesh-License-ABCD",
  "timestamp": "2025-11-14T11:10:00Z",
  "previous_hash": "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
  "current_hash": "5d41402abc4b2a76b9719d911017c592af0d08e8ec0e6a6c8a3d2a1f3b4c5d6e",
  "metadata": {
    "license_key": "ABCD-EFGH-JKLM-NPQR-STUW",
    "payment_id": "PAYPAL-12345-ABCDE",
    "jurisdiction": "ZA"
  }
}
```

**Automatic Operations:**
1. Fetch last claim's hash (chain linking)
2. Generate timestamp
3. Calculate SHA-256 hash of: `owner + asset + timestamp + previousHash`
4. Store claim with hashes

**First Claim:**
- If no previous claims exist, `previous_hash` is `null`
- First hash calculated from: `owner + asset + timestamp`

**Errors:**
- `400 Bad Request` - Invalid owner or asset
- `500 Internal Server Error` - Database or hashing error

---

### Verify Claim

**Method:** `GET`
**Endpoint:** Direct service call with verification

```typescript
const isValid = await ClaimRootService.verifyClaim(claimId);
// Returns: true or false
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| claimId | string (uuid) | Yes | Claim ID to verify |

**Returns:** `boolean` - `true` if claim is valid, `false` otherwise

**Verification Process:**
1. Fetch claim from database
2. Recalculate hash: `owner + asset + timestamp + previousHash`
3. Compare calculated hash with stored `current_hash`
4. Return `true` if match, `false` if mismatch

**Example:**
```typescript
const claim = await ClaimRootService.createClaim('user-123', 'Asset-A');
const isValid = await ClaimRootService.verifyClaim(claim.claim_id);
// Returns: true (hash matches)

// If someone tampered with the database:
// Returns: false (hash mismatch)
```

**Use Cases:**
- Audit trail verification
- Ownership dispute resolution
- Chain integrity checking
- Compliance proof

**Errors:**
- `404 Not Found` - Claim does not exist
- `500 Internal Server Error` - Database error

---

### Get Claims by Owner

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const ownerClaims = await ClaimRootService.getClaimsByOwner('user-123');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| owner | string | Yes | Owner identifier |

**Response:**
```json
[
  {
    "claim_id": "aa0e8400-e29b-41d4-a716-446655440000",
    "owner": "user-123",
    "asset": "VaultMesh-License-ABCD",
    "timestamp": "2025-11-14T11:10:00Z",
    "previous_hash": "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
    "current_hash": "5d41402abc4b2a76b9719d911017c592af0d08e8ec0e6a6c8a3d2a1f3b4c5d6e",
    "metadata": {
      "license_key": "ABCD-EFGH-JKLM-NPQR-STUW"
    }
  },
  {
    "claim_id": "aa0e8400-e29b-41d4-a716-446655440001",
    "owner": "user-123",
    "asset": "Data-Stream-XYZ",
    "timestamp": "2025-11-14T10:05:00Z",
    "previous_hash": null,
    "current_hash": "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
    "metadata": {}
  }
]
```

**Note:** Claims sorted by `timestamp DESC` (newest first)

**Errors:**
- `500 Internal Server Error` - Database error

---

### Get Claims by Asset

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const assetClaims = await ClaimRootService.getClaimsByAsset('VaultMesh-License-ABCD');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| asset | string | Yes | Asset identifier |

**Response:**
```json
[
  {
    "claim_id": "aa0e8400-e29b-41d4-a716-446655440000",
    "owner": "user-123",
    "asset": "VaultMesh-License-ABCD",
    "timestamp": "2025-11-14T11:10:00Z",
    "previous_hash": "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
    "current_hash": "5d41402abc4b2a76b9719d911017c592af0d08e8ec0e6a6c8a3d2a1f3b4c5d6e",
    "metadata": {
      "license_key": "ABCD-EFGH-JKLM-NPQR-STUW"
    }
  }
]
```

**Note:** Claims sorted by `timestamp DESC` (newest first)

**Use Cases:**
- Asset ownership history
- Transfer tracking
- Provenance verification
- Multi-owner assets

**Errors:**
- `500 Internal Server Error` - Database error

---

## VaultMesh Network API

### Understanding VaultMesh

VaultMesh™ provides:
- Atomic key generation with quantum-inspired decoherence tracking
- Cart totals with mandatory 15% Care Loop allocation
- Treaty-sealed transactions (FAA-TREATY-OMNI-4321-A13XN)
- Multi-tier brand ecosystem (13,713+ brands)

**Key Constants:**
```typescript
ROOT_KEY = "0f19bb22-ad64-45d2-abc9-ad5686a978dc"
LOCK_TIMESTAMP_MS = 1730013441000  // Nov 27, 2024
COLLAPSE_INTERVAL_MS = 900  // 0.9 seconds
CARE_RATE = 0.15  // 15%
```

---

### Calculate Totals

**Method:** Local calculation (no API call)

```typescript
import { VaultMeshService } from './services/vaultmesh';

const cart = {
  items: [
    { id: '1', name: 'Starter', price: 29.00, unit: 'USD', quantity: 1 },
    { id: '2', name: 'ProGrid', price: 230.00, unit: 'USD', quantity: 1 }
  ],
  status: 'READY',
  owner: 'customer@example.com'
};

const totals = VaultMeshService.calculateTotals(cart);
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cart | Cart | Yes | Shopping cart object |

**Response:**
```json
{
  "subtotal": 259.00,
  "careSplit": 38.85,
  "totalDue": 297.85
}
```

**Calculation:**
```typescript
subtotal = sum(item.price * item.quantity)
careSplit = subtotal * 0.15
totalDue = subtotal + careSplit
```

**Note:** Care Loop 15% is ADDED to subtotal, not deducted

---

### Generate Atomic Key

**Method:** Local calculation (no API call)

```typescript
const atomicKey = VaultMeshService.generateAtomicKey(Date.now());
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userCreationTimeMs | number | Yes | User creation timestamp (Unix ms) |

**Returns:** `string` - Atomic key with quantum-inspired decoherence tracking

**Example Output:**
```
[TR:00BA34F2]{ID:12345.678}<DC:1371.60493>[ANCHOR:0f19bb22]
```

**Format Breakdown:**
- `TR:` - Total strikes (hex) = time elapsed / 900ms
- `ID:` - Store ID = time elapsed in seconds (3 decimals)
- `DC:` - Decoherence trace = time * (0.1/0.9) ratio
- `ANCHOR:` - Root key first 8 chars

**Calculation:**
```typescript
timeElapsedMs = userCreationTimeMs - LOCK_TIMESTAMP_MS
totalStrikes = floor(timeElapsedMs / 900)
storeID = (timeElapsedMs / 1000).toFixed(3)
decoherenceTrace = (timeElapsedMs / 1000 * 0.1111).toFixed(10)
```

**Use Cases:**
- Unique cart identification
- Temporal tracking
- Quantum-inspired provenance
- Treaty seal verification

---

### Create Order

**Method:** `POST`
**Endpoint:** Direct service call with Supabase operations

```typescript
const result = await VaultMeshService.createOrder(cart, 'paypal');
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cart | Cart | Yes | Shopping cart object |
| paymentMethod | 'paypal' \| 'payfast' | Yes | Payment gateway |

**Response:**
```json
{
  "order": {
    "order_id": "bb0e8400-e29b-41d4-a716-446655440000",
    "cart_id": "[TR:00BA34F2]{ID:12345.678}<DC:1371.60493>[ANCHOR:0f19bb22]",
    "customer_id": "customer@example.com",
    "total_amount": 297.85,
    "total_grains": 2,
    "timestamp": "2025-11-14T11:15:00Z",
    "status": "completed"
  },
  "atomicKey": "[TR:00BA34F2]{ID:12345.678}<DC:1371.60493>[ANCHOR:0f19bb22]"
}
```

**Automatic Operations:**
1. Calculate totals (subtotal + Care Loop 15%)
2. Generate atomic key
3. Create order with atomic key as cart_id
4. Create Care Loop transaction (15% of subtotal)
5. Calculate animals helped: `careLoopAmount / 12.5`
6. Return order and atomic key

**Care Loop Calculation Example:**
```
Subtotal: $259.00
Care Loop: $259.00 * 0.15 = $38.85
Animals Helped: $38.85 / $12.50 = 3.108 animals
```

**Errors:**
- `400 Bad Request` - Invalid cart or payment method
- `500 Internal Server Error` - Database error

---

### Get Brand Audit Stats

**Method:** Local constant (no API call)

```typescript
import { BRAND_AUDIT_DATA } from './services/vaultmesh';

const stats = BRAND_AUDIT_DATA;
```

**Response:**
```json
{
  "totalBrands": 13713,
  "waterSeedTarget": 9000,
  "achievementPercent": 152.4,
  "validatedPercent": 84.1,
  "placeholderPercent": 15.9,
  "tierBreakdown": [
    {
      "tier": "Sovereign",
      "count": 440,
      "avgFee": 20138.16,
      "avgRoyalty": 20.14
    },
    {
      "tier": "Dynastic",
      "count": 1202,
      "avgFee": 10910.51,
      "avgRoyalty": 19.71
    },
    {
      "tier": "Operational",
      "count": 1098,
      "avgFee": 6553.71,
      "avgRoyalty": 15.63
    },
    {
      "tier": "Market",
      "count": 4604,
      "avgFee": 3351.61,
      "avgRoyalty": 7.86
    }
  ]
}
```

**Use Cases:**
- Display brand ecosystem statistics
- Marketing materials
- Investor presentations
- Platform transparency

---

### Get Product Catalog

**Method:** Local constant (no API call)

```typescript
import { PRODUCT_CATALOG } from './services/vaultmesh';

const products = PRODUCT_CATALOG;
```

**Response:**
```json
{
  "Sovereign": {
    "name": "FAA Sovereign License",
    "price": 20138.16,
    "unit": "ECR/R"
  },
  "Starter": {
    "name": "VM-HS-Starter-7038-KEY",
    "price": 29.00,
    "unit": "USD"
  },
  "Data": {
    "name": "Multi-Dim Data Stream",
    "price": 4000.00,
    "unit": "ECR/R"
  },
  "ProGrid": {
    "name": "MineNest Pro Grid License",
    "price": 230.00,
    "unit": "USD"
  },
  "Banimal": {
    "name": "Banimal Loop Plan",
    "price": 499.00,
    "unit": "USD"
  }
}
```

**Use Cases:**
- Frontend product display
- Price references
- Cart item validation

---

## Care Loop API

### Understanding Care Loop

Care Loop™ is a mandatory 15% allocation from ALL revenue to animal welfare:

**Key Principles:**
- 15% of every transaction → Banimals™
- Automatic, non-negotiable
- Transparent public record
- Animals helped calculation: `amount / 12.5`

**Example:**
```
Order Total: $100.00
Care Loop: $100.00 * 0.15 = $15.00
Animals Helped: $15.00 / $12.50 = 1.2 animals
```

---

### Get Care Loop Transactions

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const { data, error } = await supabase
  .from('care_loop_transactions')
  .select('*')
  .order('timestamp', { ascending: false });
```

**Response:**
```json
[
  {
    "transaction_id": "cc0e8400-e29b-41d4-a716-446655440000",
    "source_order_id": "bb0e8400-e29b-41d4-a716-446655440000",
    "amount": 38.85,
    "beneficiary": "Banimals",
    "timestamp": "2025-11-14T11:15:00Z",
    "animals_helped": 3.108
  },
  {
    "transaction_id": "cc0e8400-e29b-41d4-a716-446655440001",
    "source_order_id": "bb0e8400-e29b-41d4-a716-446655440001",
    "amount": 4.35,
    "beneficiary": "Banimals",
    "timestamp": "2025-11-14T10:30:00Z",
    "animals_helped": 0.348
  }
]
```

**Note:** Sorted by `timestamp DESC` (newest first)

**Public Access:** Anyone can view Care Loop transactions for transparency

---

### Get Care Loop by Order

**Method:** `GET`
**Endpoint:** Direct Supabase query via SDK

```typescript
const { data, error } = await supabase
  .from('care_loop_transactions')
  .select('*')
  .eq('source_order_id', orderId)
  .maybeSingle();
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | string (uuid) | Yes | Source order ID |

**Response:**
```json
{
  "transaction_id": "cc0e8400-e29b-41d4-a716-446655440000",
  "source_order_id": "bb0e8400-e29b-41d4-a716-446655440000",
  "amount": 38.85,
  "beneficiary": "Banimals",
  "timestamp": "2025-11-14T11:15:00Z",
  "animals_helped": 3.108
}
```

**Use Cases:**
- Display Care Loop impact on receipt
- Verify Care Loop allocation
- Audit trail for specific order

---

### Get Total Care Loop Impact

**Method:** `GET` with aggregation
**Endpoint:** Direct Supabase query via SDK

```typescript
const { data, error } = await supabase
  .from('care_loop_transactions')
  .select('amount, animals_helped');

const totals = data.reduce((acc, tx) => ({
  totalAmount: acc.totalAmount + tx.amount,
  totalAnimals: acc.totalAnimals + tx.animals_helped
}), { totalAmount: 0, totalAnimals: 0 });
```

**Response:**
```json
{
  "totalAmount": 12543.87,
  "totalAnimals": 1003.51
}
```

**Use Cases:**
- Platform-wide impact dashboard
- Marketing materials
- Transparency reports
- Annual summaries

---

## Error Handling

### Supabase Error Format

All Supabase operations return errors in this format:

```typescript
{
  data: null,
  error: {
    message: "Error description",
    details: "Additional details",
    hint: "Suggestion for fixing",
    code: "ERROR_CODE"
  }
}
```

### Common Error Codes

#### Database Errors

**23505 - Unique Violation**
```json
{
  "message": "duplicate key value violates unique constraint",
  "code": "23505"
}
```
**Causes:** Duplicate email, license key collision
**Resolution:** Retry with different value

**23503 - Foreign Key Violation**
```json
{
  "message": "insert or update on table violates foreign key constraint",
  "code": "23503"
}
```
**Causes:** Referenced order/product doesn't exist
**Resolution:** Verify related records exist first

**23514 - Check Violation**
```json
{
  "message": "new row violates check constraint",
  "code": "23514"
}
```
**Causes:** Invalid status, negative amount, invalid payment method
**Resolution:** Check value constraints in schema

#### Authentication Errors

**PGRST301 - JWT Expired**
```json
{
  "message": "JWT expired",
  "code": "PGRST301"
}
```
**Resolution:** Refresh authentication token

**PGRST302 - Insufficient Privileges**
```json
{
  "message": "permission denied for table",
  "code": "PGRST302"
}
```
**Resolution:** Check RLS policies, ensure user authenticated

#### Application Errors

**Custom Errors** (thrown by services)
```typescript
throw new Error('Insufficient quantity');
throw new Error('Failed to create license');
throw new Error('Payment processing failed');
```

### Error Handling Pattern

```typescript
try {
  const product = await BareCartService.getProduct(itemId);
  // Use product
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);

    // Handle specific errors
    if (error.message.includes('Insufficient quantity')) {
      // Show out-of-stock message
    } else if (error.message.includes('not found')) {
      // Show 404 page
    } else {
      // Generic error handling
    }
  }
}
```

### Supabase Error Handling Pattern

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('item_id', itemId)
  .maybeSingle();

if (error) {
  console.error('Database error:', error);

  if (error.code === '23505') {
    // Duplicate key
  } else if (error.code === 'PGRST302') {
    // Permission denied
  } else {
    // Generic database error
  }

  return; // Stop execution
}

// Use data safely (type-checked as non-null)
console.log(data.name);
```

---

## Status Codes

### HTTP Status Codes

While Supabase SDK doesn't return HTTP codes directly, here are the equivalent HTTP status codes for different scenarios:

#### Success Codes

**200 OK** - Successful GET, PATCH
**201 Created** - Successful POST (creation)
**204 No Content** - Successful DELETE

#### Client Error Codes

**400 Bad Request**
- Invalid parameters
- Failed validation
- Constraint violations
- Insufficient quantity

**401 Unauthorized**
- Missing authentication
- Invalid credentials
- Expired JWT token

**403 Forbidden**
- RLS policy violation
- Insufficient permissions
- Accessing other user's data

**404 Not Found**
- Resource doesn't exist
- Invalid ID
- Deleted resource

**409 Conflict**
- Unique constraint violation
- Race condition
- Duplicate key

#### Server Error Codes

**500 Internal Server Error**
- Database connection failure
- Unexpected errors
- System errors

**503 Service Unavailable**
- Database maintenance
- Supabase downtime

### Status Code Mapping

| Operation | Success | Not Found | Permission | Error |
|-----------|---------|-----------|------------|-------|
| Get Product | 200 | 404 | - | 500 |
| Create Product | 201 | - | 403 | 500 |
| Update Product | 200 | 404 | 403 | 500 |
| Create Order | 201 | 404 (item) | - | 500 |
| Get License | 200 | 404 | 403 | 500 |
| Create Claim | 201 | - | 403 | 500 |
| Complete Trade | 200 | 404 | 403 | 500 |

---

## Rate Limiting

### Supabase Rate Limits

**Free Tier:**
- 50,000 monthly active users
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth

**API Limits:**
- No hard rate limits on free tier
- Fair use policy applies
- Connection pooling: 60 concurrent connections

**Best Practices:**
1. Implement client-side caching
2. Use batch operations where possible
3. Debounce frequent updates
4. Use real-time subscriptions for live data

### Recommended Client-Side Rate Limiting

```typescript
// Debounce frequent searches
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const products = await BareCartService.getAllProducts();
  // Filter by query
}, 500);

// Throttle pulse updates
import { throttle } from 'lodash';

const throttledPulseUpdate = throttle((pulse) => {
  // Update UI with new pulse
}, 1000);
```

---

## Testing & Tools

### Recommended Tools

#### 1. Swagger UI (Interactive API Docs)

**Installation:**
```bash
npm install swagger-ui-react swagger-ui-express
```

**Features:**
- Interactive API exploration
- Try endpoints directly
- Auto-generated from OpenAPI spec
- Beautiful documentation UI

**Use Case:** Developer portal, API testing

---

#### 2. Postman (API Testing)

**Setup:**
1. Import OpenAPI spec (see `OPENAPI_SPEC.json`)
2. Set environment variables (Supabase URL, anon key)
3. Create collections for each service
4. Add pre-request scripts for auth

**Features:**
- Request collections
- Environment management
- Automated testing
- Team collaboration

**Download:** https://www.postman.com/downloads/

---

#### 3. Supabase Studio (Database Management)

**Access:** https://erwpnrnnvxchumusnthp.supabase.co

**Features:**
- Visual database editor
- SQL editor
- Table browser
- RLS policy management
- Real-time subscriptions
- API auto-documentation

**Use Case:** Database administration, debugging

---

#### 4. Stoplight Studio (API Design)

**Website:** https://stoplight.io/studio

**Features:**
- Visual API designer
- OpenAPI spec editor
- Mock servers
- Documentation generation
- Linting and validation

**Use Case:** API design, spec maintenance

---

#### 5. Redoc (Static Documentation)

**Installation:**
```bash
npm install redoc redoc-cli
```

**Generate Docs:**
```bash
npx redoc-cli bundle openapi-spec.json -o api-docs.html
```

**Features:**
- Beautiful static docs
- Three-panel layout
- Search functionality
- Responsive design
- No runtime dependencies

**Use Case:** Public documentation, GitHub pages

---

### cURL Examples

#### Get All Products
```bash
curl -X GET \
  'https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/products?select=*' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

#### Create Product (Authenticated)
```bash
curl -X POST \
  'https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/products' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "quantity": 10,
    "grains_per_unit": 1
  }'
```

#### Get License by Email
```bash
curl -X GET \
  'https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/licenses?customer_email=eq.customer@example.com&select=*' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

#### Get Current Pulse Trades
```bash
# First get current pulse number locally
PULSE=$(node -e "console.log(Math.floor(Date.now() / 9000))")

curl -X GET \
  "https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/trades?pulse_number=eq.$PULSE&select=*" \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

---

### TypeScript SDK Examples

#### Complete Order Flow
```typescript
import { BareCartService } from './services/barecart';
import { PaymentService } from './services/payment';
import { VaultMeshService, PRODUCT_CATALOG } from './services/vaultmesh';

async function completeOrderFlow() {
  // Build cart
  const cart = {
    items: [
      {
        id: 'starter',
        name: PRODUCT_CATALOG.Starter.name,
        price: PRODUCT_CATALOG.Starter.price,
        unit: PRODUCT_CATALOG.Starter.unit,
        quantity: 1
      }
    ],
    status: 'READY',
    owner: 'customer@example.com'
  };

  // Process payment
  const result = await PaymentService.processPayPalPayment(
    cart,
    'customer@example.com',
    'John Doe'
  );

  if (result.success) {
    console.log('Order completed!');
    console.log('License Key:', result.license.license_key);
    console.log('Transaction ID:', result.transaction.gateway_transaction_id);
  } else {
    console.error('Payment failed:', result.error);
  }
}
```

#### Subscribe to Real-Time Pulse
```typescript
import { PulseTradeService } from './services/pulsetrade';
import { supabase } from './lib/supabase';

async function monitorPulseTrades() {
  // Subscribe to pulse cycles
  const unsubscribe = PulseTradeService.subscribeToPulse(async (pulse) => {
    console.log(`\nPulse ${pulse} started`);

    // Fetch all trades in this pulse
    const trades = await PulseTradeService.getTradesByPulse(pulse);
    console.log(`Trades in this pulse: ${trades.length}`);
  });

  // Also subscribe to real-time trade inserts
  const channel = supabase
    .channel('trades')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'trades' },
      (payload) => {
        console.log('New trade:', payload.new);
      }
    )
    .subscribe();

  // Cleanup after 1 minute
  setTimeout(() => {
    unsubscribe();
    channel.unsubscribe();
  }, 60000);
}
```

#### Verify Claim Chain
```typescript
import { ClaimRootService } from './services/claimroot';

async function verifyClaimChain(startClaimId: string) {
  const { data: claims } = await supabase
    .from('claims')
    .select('*')
    .order('timestamp', { ascending: true });

  let isValid = true;

  for (const claim of claims) {
    const valid = await ClaimRootService.verifyClaim(claim.claim_id);

    if (!valid) {
      console.error(`Invalid claim: ${claim.claim_id}`);
      isValid = false;
      break;
    }
  }

  if (isValid) {
    console.log('Entire claim chain is valid ✓');
  } else {
    console.error('Claim chain integrity compromised!');
  }
}
```

---

## Appendix

### TypeScript Type Definitions

All TypeScript interfaces are available in `src/lib/supabase.ts`:

```typescript
// Core Types
export interface Consultant { /* ... */ }
export interface Product { /* ... */ }
export interface Trade { /* ... */ }
export interface Claim { /* ... */ }
export interface CareLoopTransaction { /* ... */ }

// Payment Types
export interface PaymentTransaction { /* ... */ }
export interface PaymentResult { /* ... */ }

// License Types
export interface License { /* ... */ }

// VaultMesh Types
export interface Cart { /* ... */ }
export interface CartItem { /* ... */ }
export interface BrandAuditStats { /* ... */ }
```

### Supabase Direct REST API

While services abstract Supabase, you can also use direct REST API:

**Base URL:** `https://erwpnrnnvxchumusnthp.supabase.co/rest/v1/`

**Headers:**
```
apikey: YOUR_ANON_KEY
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json
Prefer: return=representation
```

**Query Operators:**
- `eq` - equals
- `neq` - not equals
- `gt` - greater than
- `lt` - less than
- `gte` - greater than or equal
- `lte` - less than or equal
- `like` - pattern matching
- `ilike` - case-insensitive pattern matching
- `in` - in list
- `is` - is null/not null

**Example:**
```bash
GET /rest/v1/products?price=gte.100&price=lte.500&select=*
```

### Support & Contact

**Documentation Issues:** Create issue in GitHub repo
**API Support:** support@fruitfulglobalplanet.com
**Supabase Status:** https://status.supabase.com
**Treaty Information:** FAA-TREATY-OMNI-4321-A13XN

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-14
**Maintained By:** Fruitful Global Planet
**License:** Treaty FAA-TREATY-OMNI-4321-A13XN
