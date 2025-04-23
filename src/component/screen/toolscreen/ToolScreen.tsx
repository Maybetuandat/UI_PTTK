import { useState, useRef, useEffect } from "react";

interface BoundingBox {
  xPixel: number;
  yPixel: number;
  widthPixel: number;
  heightPixel: number;
  fraudLabelId: number;
}

export default function BoundingBoxTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [drawing, setDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const scale = { x: 1, y: 1 }; // Assuming no scaling for simplicity

  // Draw the canvas whenever boxes, current box, or drawing state changes
  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [boxes, currentBox, drawing, imageLoaded]);

  // Initialize canvas when the component mounts
  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      if (image.complete) {
        setImageLoaded(true);
      } else {
        image.onload = () => {
          setImageLoaded(true);
        };
        image.onerror = (e) => {
          console.error("Error loading image:", e);
        };
      }
    }

    return () => {
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, []);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw existing boxes
    boxes.forEach((box) => {
      ctx.strokeStyle = "#00BCD4";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        box.xPixel * scale.x,
        box.yPixel * scale.y,
        box.widthPixel * scale.x,
        box.heightPixel * scale.y
      );
    });

    // Draw the current box being created
    if (currentBox && drawing) {
      ctx.strokeStyle = "#F44336";
      ctx.lineWidth = 2;
      const width = currentBox.endX - currentBox.startX;
      const height = currentBox.endY - currentBox.startY;
      ctx.strokeRect(currentBox.startX, currentBox.startY, width, height);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox({ startX: x, startY: y, endX: x, endY: y });
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentBox) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox({ ...currentBox, endX: x, endY: y });
  };

  const handleMouseUp = () => {
    if (!drawing || !currentBox) return;

    // Calculate the dimensions of the box
    const startX = Math.min(currentBox.startX, currentBox.endX);
    const startY = Math.min(currentBox.startY, currentBox.endY);
    const width = Math.abs(currentBox.endX - currentBox.startX);
    const height = Math.abs(currentBox.endY - currentBox.startY);

    // Only add box if it has some size
    if (width > 3 && height > 3) {
      const newBox: BoundingBox = {
        xPixel: startX / scale.x,
        yPixel: startY / scale.y,
        widthPixel: width / scale.x,
        heightPixel: height / scale.y,
        fraudLabelId: 1, // Dummy label ID
      };

      setBoxes((prev) => [...prev, newBox]);
    }

    setDrawing(false);
    setCurrentBox(null);
  };

  const handleMouseLeave = () => {
    if (drawing) {
      handleMouseUp(); // Complete the box when mouse leaves the canvas
    }
  };

  return (
    <div className="relative w-full max-w-4xl">
      <img
        ref={imageRef}
        src="http://localhost:8080/images/3e841da1-564e-4085-97ed-aa10a49f2742_-405-_jpg.rf.6c61b9307345dd4c81764fff992f260c.jpg"
        alt="Image for annotation"
        className="hidden" // Image is hidden but still loaded for canvas
        onLoad={() => setImageLoaded(true)}
        onError={(e) => console.error("Error loading image:", e)}
      />
      {imageLoaded ? (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-96 bg-gray-100">
          Loading image...
        </div>
      )}
    </div>
  );
}
