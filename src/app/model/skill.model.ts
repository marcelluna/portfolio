export interface Skill {
  /** Display name of the technology/tool (same across locales, kept literal). */
  name: string;
  /** Competence rating, 1–5, rendered as stars. */
  rating: number;
}

export interface SkillCategory {
  /** i18n key for the category title. */
  titleKey: string;
  skills: Skill[];
}
