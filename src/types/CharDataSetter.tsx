import { CharData } from "./CharData";

export type CharDataSetter = {
  charData: CharData;
  setCharData: React.Dispatch<React.SetStateAction<CharData>>;
};
