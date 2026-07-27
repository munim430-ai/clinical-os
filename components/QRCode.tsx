import { qrcodegen } from "@/lib/qrcodegen";
import { useMemo } from "react";
import { Rect, Svg } from "react-native-svg";

interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const QUIET_ZONE = 4;

export function QRCode({
  value,
  size = 120,
  color = "#000000",
  backgroundColor = "#FFFFFF",
}: QRCodeProps) {
  const qr = useMemo(
    () => qrcodegen.QrCode.encodeText(value, qrcodegen.QrCode.Ecc.MEDIUM),
    [value],
  );

  const dimension = qr.size + QUIET_ZONE * 2;
  const cell = size / dimension;

  const rects: { x: number; y: number }[] = [];
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) rects.push({ x, y });
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill={backgroundColor} />
      {rects.map((r) => (
        <Rect
          key={`${r.x}-${r.y}`}
          x={(r.x + QUIET_ZONE) * cell}
          y={(r.y + QUIET_ZONE) * cell}
          width={cell}
          height={cell}
          fill={color}
        />
      ))}
    </Svg>
  );
}
