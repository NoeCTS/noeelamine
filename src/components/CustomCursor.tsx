import { useEffect, useRef } from 'react';

interface CustomCursorProps {
  cursorRef: React.RefObject<HTMLDivElement>;
}

const CustomCursor = ({ cursorRef }: CustomCursorProps) => {
  return <div ref={cursorRef} className="cursor" />;
};

export default CustomCursor;
