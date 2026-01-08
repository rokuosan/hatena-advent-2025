"use client";
import type { Palette } from "@vibrant/color";
import Image from "next/image";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

export const ImageLoader = () => {
  const [palette, setPalette] = useState<Palette | null>(null);
  const src = "https://avatars.githubusercontent.com/u/85651386?v=4";

  useEffect(() => {
    const extract = async () => {
      const vibrant = new Vibrant(src);
      const palette = await vibrant.getPalette();
      console.log(palette);
      setPalette(palette);
    };
    extract();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <div>
        <p>Original</p>
        <Image
          src={src}
          alt="original"
          width={160}
          height={160}
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
        {palette ? (
          Object.entries(palette).map(([name, swatch]) =>
            swatch ? (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "160px",
                    height: "160px",
                    backgroundColor: swatch.hex,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: swatch.titleTextColor,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                  }}
                >
                  {name}
                </div>
                <p
                  style={{
                    marginTop: "8px",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {swatch.hex}
                </p>
              </div>
            ) : null
          ))
        : (
          <p>Loading palette...</p>
        )}
      </div>
    </div>
  );
};
