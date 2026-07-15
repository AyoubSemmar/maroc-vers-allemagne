import Icon, { type IconName } from '@/components/ui/Icon'
import type { Skill } from '@/lib/learn-german/assignmentAI'

// Professional line icons for the four exam skills — replaces the emoji
// set (📖🎧✍️🧩) that read as childish next to the rest of the brand.
const SKILL_ICON: Record<Skill, IconName> = {
  lesen: 'book',
  hoeren: 'headphones',
  schreiben: 'pen',
  grammar: 'language',
}

export default function SkillIcon({ skill, size = 18, className }: { skill: Skill; size?: number; className?: string }) {
  return <Icon name={SKILL_ICON[skill]} size={size} className={className} />
}
