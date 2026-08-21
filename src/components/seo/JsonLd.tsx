/**
 * Injectează date structurate. `</` este escapat pentru a nu putea închide
 * prematur tag-ul `<script>` dacă un text de conținut l-ar conține.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      // Conținut generat de noi, din date tipate. Nu provine din input de utilizator.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
