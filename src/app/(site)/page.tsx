
import HomeTemplate from "@/components/home/HomeTemplate"

export default function HomePage() {
  // Configuration for the Home Template
  const config = {
    whatsappLink: "https://wa.me/559888281228", // Atualize com o número real
    instagramLink: "https://instagram.com/aerotechdronebrasil",
    phoneLink: "tel:+559888281228"
  }

  return (
    <HomeTemplate
      whatsappLink={config.whatsappLink}
      instagramLink={config.instagramLink}
      phoneLink={config.phoneLink}
    />
  )
}
