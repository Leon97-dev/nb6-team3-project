declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      employeeNumber: string;
      phoneNumber: string;
      imageUrl: string | null;
      isAdmin: boolean;
      companyId: number;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
