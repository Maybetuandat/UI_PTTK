import { FraudLabel } from "./FraudLabel";
import { FraudTemplate } from "./FraudTemplate";

export default interface BoundingBox {
  id: number;
  xCenter: number;
  yCenter: number;
  width: number;
  height: number;
  xPixel: number;
  yPixel: number;
  widthPixel: number;
  heightPixel: number;
  fraudTemplate: FraudTemplate;
  fraudLabel: FraudLabel;
}
