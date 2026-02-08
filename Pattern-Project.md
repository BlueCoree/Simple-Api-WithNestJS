# Architecture & Design Pattern

## Project Overview

Simple REST API yang menggunakan NestJS dengan TypeScript yang mengimplementasikan User Management dan Contact Management.

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 5.10.2
- **Authentication**: JWT 
- **Validation**: Zod
- **Testing**: Jest
- **Logger**: Winston

## Pattern yang Digunakan

### 1. **Layered Architecture (3-Layer Architecture)**

Project ini menggunakan **Layered Architecture** dengan pemisahan yang jelas antara:

#### **Controller Layer** (`*.controller.ts`)
- Bertanggung jawab untuk handle HTTP requests/responses
- Validasi input dari user 
- Memanggil service layer untuk business logic

#### **Service Layer** (`*.service.ts`)
- Berisi business logic aplikasi
- Melakukan validasi data menggunakan Zod
- Berinteraksi dengan database melalui Prisma

#### **Data Access Layer** (Prisma)
- Prisma Service sebagai abstraksi untuk database operations
- Schema migration menggunakan Prisma Migrate
- Type-safe database queries

---

### 2. **Module Pattern**

Setiap feature memiliki module sendiri yang self-contained:

```
src/
├── user/
│   ├── user.module.ts      # Module definition
│   ├── user.controller.ts  # HTTP endpoints
│   ├── user.service.ts     # Business logic
│   └── user.validation.ts  # Validation schema
├── contact/
│   ├── contact.module.ts
│   ├── contact.controller.ts
│   ├── contact.service.ts
│   └── contact.validation.ts
└── auth/
    ├── auth.module.ts
    └── auth.guard.ts
```

**Keuntungan:**
- **Separation of Concerns**: Setiap module fokus pada satu domain
- **Reusability**: Module dapat di-import dan digunakan kembali
- **Maintainability**: Mudah untuk dimaintain
- **Scalability**: Mudah scale feature dimasa depan

---

### 3. **Dependency Injection (DI)**

NestJS menggunakan DI pattern untuk manage dependencies:

```typescript
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
}
```

**Keuntungan:**
- **Testability**: Mudah untuk mock dependencies saat testing
- **Loose Coupling**: Service tidak perlu tahu cara membuat dependencies
- **Single Responsibility**: Setiap service fokus pada tugasnya

---

### 4. **DTO (Data Transfer Object) Pattern**

Menggunakan class/interface untuk define struktur data yang ditransfer:

```typescript
// Request DTO
export class CreateContactRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// Response DTO
export class ContactResponse {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}
```

**Keuntungan:**
- **Type Safety**: TypeScript dapat validate tipe data
- **Clear Contract**: API contract jelas antara client dan server
- **Separation**: Request dan Response memiliki struktur terpisah
- **Security**: Tidak expose internal database schema

---

### 5. **Repository Pattern (via Prisma)**

Prisma Service bertindak sebagai repository yang mengabstraksi database access:

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Centralized database access
}
```

**Keuntungan:**
- **Abstraction**: Business logic tidak perlu tahu detail SQL
- **Type Safety**: Prisma generate types dari schema
- **Migration**: Schema changes dikelola dengan migration
- **Centralized**: Satu tempat untuk configuration (logging, connection pool)

---

### 6. **Guard Pattern untuk Authorization**

Menggunakan NestJS Guards untuk protect routes:

```typescript
@UseGuards(AuthGuard)
@Controller('/api/users')
export class UserController {
  @Get('/current')
  async get(@Auth() user: User) {
    // Only authenticated users can access
  }
}
```

**Keuntungan:**
- **Reusable**: Guard dapat digunakan di multiple routes
- **Declarative**: Authorization logic terpisah dari business logic
- **Clean**: Controller fokus pada business flow, bukan auth

---

### 7. **Validation Pattern (Schema-based)**

Menggunakan Zod untuk runtime validation:

```typescript
export class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserRequest> = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });
}
```

**Keuntungan:**
- **Runtime Safety**: Validation di runtime, bukan hanya compile time
- **Centralized**: Semua validation rules di satu tempat
- **Type Inference**: Zod dapat infer TypeScript types
- **Clear Error Messages**: Error messages yang jelas untuk debugging

---

## Struktur Folder

```
src/
├── common/                    # Shared modules & services
│   ├── common.module.ts       # Module untuk shared services
│   ├── prisma.service.ts      # Database connection & logging
│   ├── validation.service.ts  # Zod validation wrapper
│   └── auth.decorator.ts      # Custom decorator untuk extract user
│
├── model/                     # DTOs & Response models
│   ├── user.model.ts          # User DTOs
│   ├── contact.model.ts       # Contact DTOs
│   └── web.model.ts           # Generic response wrapper
│
├── user/                      # User feature module
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.validation.ts
│
├── contact/                   # Contact feature module
│   ├── contact.module.ts
│   ├── contact.controller.ts
│   ├── contact.service.ts
│   └── contact.validation.ts
│
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   └── auth.guard.ts          # JWT verification guard
│
├── app.module.ts              # Root module
└── main.ts                    # Application entry point

test/                          # E2E tests
├── test.module.ts
├── test.service.ts            # Test helpers
├── user.spec.ts               # User endpoint tests
└── contact.spec.ts            # Contact endpoint tests

prisma/
├── schema.prisma              # Database schema
└── migrations/                # Migration history
```

---

## Mengapa Pattern Ini?

### 1. **Scalability**
- Mudah menambah feature baru sebagai module terpisah
- Module dapat di-deploy terpisah jika diperlukan microservices
- Clear boundaries antara features

### 2. **Maintainability**
- Separation of concerns membuat code mudah dibaca
- Setiap layer punya tanggung jawab yang jelas
- Bug mudah di-trace karena flow yang terstruktur

### 3. **Testability**
- DI pattern memudahkan unit testing dengan mocks
- Service layer dapat ditest tanpa HTTP layer
- E2E tests dapat menggunakan test helpers (TestService)

### 4. **Team Collaboration**
- Tim dapat bekerja pada module berbeda tanpa conflict
- Convention yang jelas membuat onboarding developer baru lebih mudah
- Code review lebih mudah karena struktur yang konsisten

---

## Kesimpulan

Pattern yang dipilih memberikan balance antara:
- **Simplicity**: Tidak over-engineered untuk simple REST API
- **Scalability**: Mudah untuk grow jika requirement bertambah
- **Maintainability**: Code mudah dibaca dan di-maintain
- **Testability**: Comprehensive testing strategy

