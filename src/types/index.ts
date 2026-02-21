export type CefrLevel = "A1" | "A2" | "B1" | "B2";
export type Variant = "bokmal" | "nynorsk";
export type Spor = "1" | "2" | "3";

export interface VocabularyItem {
  word: string;
  translation: string;
  example: string;
}

export interface ComprehensionQuestion {
  question: string;
  answer: string;
}

export interface GeneratedStorybook {
  title: string;
  story: string;
  vocabulary: VocabularyItem[];
  questions: ComprehensionQuestion[];
}

export interface Storybook {
  id: string;
  user_id: string;
  title: string;
  cefr_level: CefrLevel;
  theme: string;
  variant: Variant;
  spor: Spor | null;
  vocabulary_focus: string[];
  story_text: string;
  vocabulary_list: VocabularyItem[];
  comprehension_questions: ComprehensionQuestion[];
  word_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  label_nb: string;
  label_en: string;
  sort_order: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  school_name: string | null;
  preferred_variant: Variant;
  created_at: string;
  updated_at: string;
}
