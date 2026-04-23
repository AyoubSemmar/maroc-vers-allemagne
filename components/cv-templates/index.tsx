import { CVData, TemplateId } from '../cv-builder/types'
import TemplateClassic from './TemplateClassic'
import TemplateModern from './TemplateModern'
import TemplateMinimal from './TemplateMinimal'
import TemplateDark from './TemplateDark'
import TemplateCompact from './TemplateCompact'

export default function CVTemplate({ data, template }: { data: CVData; template: TemplateId }) {
  switch (template) {
    case 'modern':  return <TemplateModern data={data} />
    case 'minimal': return <TemplateMinimal data={data} />
    case 'dark':    return <TemplateDark data={data} />
    case 'compact': return <TemplateCompact data={data} />
    case 'classic':
    default:        return <TemplateClassic data={data} />
  }
}
