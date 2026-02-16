import Header from "@/components/Header"
import Hero from "@/components/Hero"
import ProductCategories from "@/components/ProductCategories"
import FeaturedProducts from "@/components/FeaturedProducts"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductCategories />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}
