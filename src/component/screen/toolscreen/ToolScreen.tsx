import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface Square {
  x: number;
  y: number;
  size: number;
}
const FreeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<Boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [squares, setSquares] = useState<Square[]>([]);

  const drawAllSquares = (ctx: CanvasRenderingContext2D, preview?: Square) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    // Draw existing squares
    squares.forEach((square) => {
      ctx.beginPath();
      ctx.rect(square.x, square.y, square.size, square.size);
      ctx.stroke();
    });

    // Draw preview square if exists
    if (preview) {
      ctx.beginPath();
      ctx.rect(preview.x, preview.y, preview.size, preview.size);
      ctx.stroke();
    }
  };
  useEffect(() => {
    if (context) {
      drawAllSquares(context);
    }
  }, [squares, context]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#333";
        setContext(ctx);
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartX(x);
    setStartY(y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const canvas = canvasRef.current!;
    const ctx = context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const side = Math.max(
      Math.abs(currentX - startX),
      Math.abs(currentY - startY)
    );

    const endX = currentX < startX ? startX - side : startX;
    const endY = currentY < startY ? startY - side : startY;

    drawAllSquares(context, { x: endX, y: endY, size: side });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !isDrawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const size = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));

    const x = endX < startX ? startX - size : startX;
    const y = endY < startY ? startY - size : startY;

    const newSquare: Square = { x, y, size };
    setSquares((prev) => [...prev, newSquare]);

    drawAllSquares(context);
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        border: "1px solid",
        cursor: "crosshair",
        display: "block",
      }}
    />
  );
};
export default FreeCanvas;
