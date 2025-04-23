// // Trong file ParentComponent.tsx hoặc trang của bạn
// import { useState, useEffect } from "react";
// import Canvas from "./components/BoundingBoxEditor/Canvas";
// import {
//   BoundingBox,
//   FraudTemplate,
//   FraudLabel,
// } from "./components/BoundingBoxEditor/type";
// import axios from "axios";

// function TemplateViewer() {
//   const [template, setTemplate] = useState<FraudTemplate | undefined>(
//     undefined
//   );
//   const [boxes, setBoxes] = useState<BoundingBox[]>([]);
//   const [labels, setLabels] = useState<FraudLabel[]>([]);
//   const [selectedLabel, setSelectedLabel] = useState<FraudLabel | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Hàm để fetch template từ database
//     const fetchTemplate = async () => {
//       try {
//         setLoading(true);
//         // Ví dụ với templateId là 1, thay bằng ID thực tế của bạn
//         const templateId = 1;

//         // Fetch template
//         const templateResponse = await axios.get(
//           `/api/templates/${templateId}`
//         );
//         setTemplate(templateResponse.data);

//         // Fetch boxes cho template này
//         const boxesResponse = await axios.get(
//           `/api/bounding-boxes/template/${templateId}`
//         );
//         setBoxes(boxesResponse.data);

//         // Fetch labels
//         const labelsResponse = await axios.get("/api/fraud-labels");
//         setLabels(labelsResponse.data);

//         if (labelsResponse.data.length > 0) {
//           setSelectedLabel(labelsResponse.data[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplate();
//   }, []);

//   // Chỉ để đáp ứng props API của Canvas, không thực sự được dùng trong mode chỉ xem
//   const handleBoxAdd = (newBox: BoundingBox) => {
//     setBoxes((prev) => [...prev, newBox]);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ height: "500px", width: "100%" }}>
//       <h2>Template Viewer</h2>
//       <Canvas
//         fraudTemplate={template}
//         boxes={boxes}
//         labels={labels}
//         selectedLabel={selectedLabel}
//         onBoxAdd={handleBoxAdd}
//       />
//     </div>
//   );
// }

// export default TemplateViewer;
