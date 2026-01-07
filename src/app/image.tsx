"use client";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

export const ImageLoader = () => {
  const [swatches, setSwatches] = useState<Array<{
    name: string;
    hex: string;
  }> | null>(null);
  const src = "https://avatars.githubusercontent.com/u/85651386?v=4";
  const keys = [
    "Vibrant",
    "Muted",
    "DarkVibrant",
    "DarkMuted",
    "LightVibrant",
    "LightMuted",
  ] as const;

  useEffect(() => {
    const extract = async () => {
      const vibrant = new Vibrant(src);
      const palette = await vibrant.getPalette();
      const list: Array<{ name: string; hex: string }> = [];
      const p = palette;
      for (const k of keys) {
        const hex = p[k]?.hex;
        if (hex) list.push({ name: k, hex });
      }
      setSwatches(list);
    };
    extract();
  }, [keys]);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <div>
        <p>Original</p>
        {/** biome-ignore lint/performance/noImgElement: <img> is used for demonstration purposes */}
        <img
          src={src}
          alt="original"
          style={{ width: "160px", height: "160px", objectFit: "cover" }}
          crossOrigin="anonymous"
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 160px)",
          gap: "12px",
        }}
      >
        {swatches ? (
          swatches.map(({ name, hex }) => (
            <div key={name}>
              <p style={{ margin: 0 }}>
                {name}: {hex}
              </p>
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  backgroundColor: hex,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ))
        ) : (
          <p>Loading palette...</p>
        )}
      </div>
    </div>
  );
};
