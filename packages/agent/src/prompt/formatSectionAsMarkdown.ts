import { FormatSectionFunction } from "./FormatSectionFunction";
import { Section } from "./Section";

export const formatSectionAsMarkdown: FormatSectionFunction = (
  section: Section
): string => `## ${section.title.toUpperCase()}\n${section.content}`;
