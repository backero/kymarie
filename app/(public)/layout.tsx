import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PageTransition } from "@/components/animations";
import { SplashScreen } from "@/components/public/SplashScreen";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { getSettings } from "@/actions/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen">
        <SplashScreen />
        <Navbar
          freeShippingThreshold={settings.freeShippingThreshold}
          shippingFee={settings.shippingFee}
        />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
