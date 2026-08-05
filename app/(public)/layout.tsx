import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PageTransition } from "@/components/animations";
import { SplashScreen } from "@/components/public/SplashScreen";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen">
        <SplashScreen />
        <Navbar />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
