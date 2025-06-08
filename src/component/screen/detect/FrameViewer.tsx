// import { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Modal,
//   IconButton,
// } from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";

// interface FrameViewerProps {
//   frame: any;
//   onClose: () => void;
// }

// const FrameViewer: React.FC<FrameViewerProps> = ({ frame, onClose }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const imgRef = useRef<HTMLImageElement>(null);
//   const [imgLoaded, setImgLoaded] = useState(false);

//   useEffect(() => {
//     if (imgLoaded && canvasRef.current && imgRef.current) {
//       const canvas = canvasRef.current;
//       const img = imgRef.current;
//       const ctx = canvas.getContext("2d");

//       if (!ctx) return;

//       // Set canvas dimensions to match image
//       canvas.width = img.width;
//       canvas.height = img.height;

//       // Draw image
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//       // Draw bounding boxes
//       if (
//         frame.listBoundingBoxDetection &&
//         frame.listBoundingBoxDetection.length > 0
//       ) {
//         frame.listBoundingBoxDetection.forEach((box: any) => {
//           // Get color from fraudLabel if available, or use default red
//           const color = box.fraudLabel?.color || "#FF0000";

//           ctx.strokeStyle = color;
//           ctx.lineWidth = 3;
//           ctx.setLineDash([]);

//           // Draw rectangle
//           ctx.beginPath();
//           ctx.rect(box.xCenter, box.yCenter, box.width, box.height);
//           ctx.stroke();

//           // Draw label text
//           if (box.fraudLabel) {
//             const labelText = `${box.fraudLabel.name || "Fraud"}: ${(
//               box.confidence * 100
//             ).toFixed(0)}%`;

//             // Background for text
//             ctx.fillStyle = color;
//             const textWidth = ctx.measureText(labelText).width;
//             ctx.fillRect(box.xCenter, box.yCenter - 20, textWidth + 10, 20);

//             // Text
//             ctx.fillStyle = "#FFFFFF";
//             ctx.font = "14px Arial";
//             ctx.fillText(labelText, box.xCenter + 5, box.yCenter - 5);
//           }
//         });
//       }
//     }
//   }, [imgLoaded, frame]);

//   return (
//     <Modal
//       open={true}
//       onClose={onClose}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           bgcolor: "background.paper",
//           boxShadow: 24,
//           p: 3,
//           maxWidth: "90vw",
//           maxHeight: "90vh",
//           overflow: "auto",
//           borderRadius: 1,
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
//           <IconButton onClick={onClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         <Box sx={{ position: "relative" }}>
//           {/* Sử dụng imageUrl đúng như đã được trả về từ API */}
//           <img
//             ref={imgRef}
//             src={frame.imageUrl}
//             alt="Detected frame"
//             style={{ display: "none" }}
//             onLoad={() => setImgLoaded(true)}
//           />
//           <canvas
//             ref={canvasRef}
//             style={{ maxWidth: "100%", height: "auto", display: "block" }}
//           />
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default FrameViewer;
