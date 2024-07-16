# prisma-generator-types-crud

Generates full types (including relations) for TypeScript from a Prisma schema

# Install

```sh-session
npm install -D prisma-generator-types-crud@latest
  or
yarn add -D prisma-generator-types-crud@latest
```

# Usage

```sh-session
npx prisma-generator-types-crud <output path> <schema.prisma path> [--useType] [--prettier]
```

# Example Usage Generate

```sh-session
npx prisma-generator-types-crud ./prisma/generated/ ./prisma/schema.prisma --useType --prettier
```

### Generate types for data to be inserted

If using this package to generate types that will be assigned to data to be inserted into a database, use the `--generateInsertionTypes` flag. Using this option will result in a few differences:

- Prisma `DateTime` fields are mapped to `Date | string` insead of just `Date`. This is because most database clients support inserting date fields using either the native `Date` type or an ISO 8601 compliant `string`.
- Fields marked with a `@default` value are made optional because they are populated automatically if not provided when inserting a new data row.

### Use `type` instead of `interface`

By default, types are generated as an `interface`. If your use case requires using `type` instead, use the `--useType` flag.

# Example Structure Folder Generate

```sh-session
[output folder]/
      /enum
          /[name enum]
              /index.ts
      /types
          /[model prisma name]
              /createType
              /deleteType
              /entityType
              /updateType
```

<!-- prettier-ignore-start -->
# Example Schema Prisma

### Input Schema

```prisma
datasource db {
  url      = env("DATABASE_URL")
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String   @db.VarChar(255)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

enum Role {
  USER
  ADMIN
}
```

### Generated `enum/Role/index.ts` 

```typescript
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
```

### Generated `types/User/createType.ts`

```typescript
// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { Role } from "../../enum/Role";

export type UserCreateType = {
  createdAt?: Date | string;
  email: string;
  name?: string | null;
  role?: Role;
};
```

### Generated `types/User/deleteType.ts`

```typescript
// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

export type UserDeleteType = {
  id: number;
};
```

### Generated `types/User/entityType.ts`

```typescript
// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { PostEntityType } from "../Post/entityType";
import { Role } from "../../enum/Role";

export type UserEntityType = {
  id: number;
  createdAt: Date;
  email: string;
  name?: string;
  role: Role;
  posts: PostEntityType[];
};

```

### Generated `types/User/updateType.ts`

```typescript
// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { Role } from "../../enum/Role";

export type UserUpdateType = {
  id: number;
  createdAt: Date;
  email: string;
  name?: string;
  role: Role;
};

```
<!-- prettier-ignore-end -->
