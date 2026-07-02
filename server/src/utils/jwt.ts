import jwt from "jsonwebtoken";

export const generateToken = (id: string, tenantId: string): string => {
  return jwt.sign({ id, tenantId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
