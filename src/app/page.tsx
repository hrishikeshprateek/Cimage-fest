import Navbar from "@/components/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import Speakers from "@/components/sections/Speakers";
import Sponsors from "@/components/sections/Sponsors";
import Gallery from "@/components/sections/Gallery";
import Register from "@/components/sections/Register";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Events />
        <Speakers />
        <Sponsors />
        <Gallery />
        <Register />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
