"use client";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

export const ImageLoader = () => {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect called");
    const palette = async () => {
      const vibrant = new Vibrant(
        "https://avatars.githubusercontent.com/u/85651386?v=4",
      );
      const palette = await vibrant.getPalette();
      console.log(palette);
      setColor(palette.Vibrant?.hex || null);
    };
    palette();
  }, []);

  return (
    <div>
      {color ? (
        <div>
          <p>Vibrant Color: {color}</p>
          <div
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: color,
            }}
          ></div>
        </div>
      ) : (
        <p>Loading color...</p>
      )}
    </div>
  );
};
