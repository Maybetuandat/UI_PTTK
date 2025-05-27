import BoundingBox from "./BoundingBox";

export interface FraudTemplate {
  id: number;
  imageUrl: string;
  name: string;
  createAt: string;
  width: number;
  height: number;
  boundingBoxes: BoundingBox[];
}
