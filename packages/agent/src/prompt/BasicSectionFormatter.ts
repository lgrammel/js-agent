import { Section } from "./Section";
import { SectionFormatter } from "./SectionFormatter";

export class BasicSectionFormatter implements SectionFormatter {
  formatSection(section: Section): string {
    return `## ${section.title.toUpperCase()}\n${section.content}`;
  }
}
