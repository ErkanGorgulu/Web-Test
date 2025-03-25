import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      {children}
    </div>
  );
}
