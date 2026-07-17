import { User, Tenant } from "@prisma/client";

type AuthUser = User & {
  tenant: Pick<Tenant, "id" | "companyName" | "slug">;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      tenantId?: string;
    }
  }
}

export {};
