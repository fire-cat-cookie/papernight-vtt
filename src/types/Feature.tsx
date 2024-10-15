import { EffectTag } from "./EffectTag";

export interface Feature {
  name: string;
  source: string;
  description: string;
  effectTags: EffectTag[];
  tag_info: string;
}
