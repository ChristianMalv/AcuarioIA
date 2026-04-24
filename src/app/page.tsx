import Header from "@/components/Header"
import Hero from "@/components/Hero"
import ProductCategories from "@/components/ProductCategories"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductCategories />
      <Footer />
    </main>
  )
}
