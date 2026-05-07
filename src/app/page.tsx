import Header from "@/components/Header"
import Hero from "@/components/Hero"
import ProductCategories from "@/components/ProductCategories"
import GoogleReviewsSection from "@/components/GoogleReviewsSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductCategories />
      <GoogleReviewsSection minStars={4} />
      <Footer />
    </main>
  )
}
