// Renders the Anschreiben (cover letter) generator inside the dashboard shell.
import AnschreibenClient from '../../anschreiben-generator/AnschreibenClient'
import '../../anschreiben-generator/anschreiben.css'

export default function DashboardCoverLetterPage() {
  return <AnschreibenClient />
}
