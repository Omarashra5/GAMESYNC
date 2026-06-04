import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { LoginModal } from "./LoginModal";
import { Toaster } from "sonner";

export function RootLayout() {
  return (
    <div className="min-h-screen " style={{ background: "#0B0F1A" }}>
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <LoginModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111827",
            border: "1px solid rgba(59,130,246,0.2)",
            color: "#E2E8F0",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </div>
  );
}
