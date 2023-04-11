import { Section } from "./Section";

export interface SectionFormatter {
  formatSection(section: Section): string;
}
