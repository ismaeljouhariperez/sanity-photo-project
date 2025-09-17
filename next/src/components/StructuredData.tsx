export function PhotographyPortfolioStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Ismael Perez León - Portfolio Photographique",
    "creator": {
      "@type": "Person",
      "name": "Ismael Perez León",
      "jobTitle": "Photographer",
      "url": "https://ismaelperezleon.com"
    },
    "description": "Portfolio de photographie analogique présentant des collections en noir et blanc et en couleur",
    "artMedium": "Photography",
    "artform": "Analog Photography",
    "genre": ["Black and White Photography", "Color Photography", "Analog Photography"],
    "inLanguage": "fr",
    "url": "https://ismaelperezleon.com",
    "image": "https://ismaelperezleon.com/images/og-default.jpg"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}