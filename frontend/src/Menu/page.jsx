import FooterSection from "../components/FooterSection/FooterSection";
import MenuSection from "./menu";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <main>
        <MenuSection />
      </main>
      <FooterSection />
    </div>
  );
}
