"use client";
import { Vibrant } from "node-vibrant/browser";
import { useCallback, useEffect, useState } from "react";

type BlogTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
};

export const BlogDemo = () => {
  const [imageSource, setImageSource] = useState<string>(
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  );
  const [urlInput, setUrlInput] = useState<string>("");
  const [theme, setTheme] = useState<BlogTheme | null>(null);
  const [loading, setLoading] = useState(false);

  const extractColors = useCallback(async (src: string) => {
    setLoading(true);
    try {
      // Image要素を作成してcrossOriginを設定
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      // 画像読み込み完了を待つ
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
      });

      const vibrant = new Vibrant(img);
      const palette = await vibrant.getPalette();

      const primary = palette.Vibrant?.hex ?? "#3b82f6";
      const secondary = palette.Muted?.hex ?? "#64748b";
      const accent = palette.LightVibrant?.hex ?? "#f59e0b";
      const background = palette.LightMuted?.hex ?? "#f8fafc";
      const text = palette.DarkVibrant?.hex ?? "#1e293b";
      const textMuted = palette.DarkMuted?.hex ?? "#64748b";

      setTheme({ primary, secondary, accent, background, text, textMuted });
      setImageSource(src);
    } catch (error) {
      console.error("Color extraction failed:", error);
      alert("色の抽出に失敗しました。画像URLを確認してください。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    extractColors(imageSource);
  }, [extractColors, imageSource]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      extractColors(urlInput.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        extractColors(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme?.background ?? "#f8fafc",
      }}
    >
      {/* 記事ヘッダー画像 */}
      <div
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "400px",
          overflow: "hidden",
        }}
      >
        {/** biome-ignore lint/performance/noImgElement: demonstration */}
        <img
          src={imageSource}
          alt="article header"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          crossOrigin="anonymous"
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${theme?.background ?? "#f8fafc"} 100%)`,
          }}
        />
      </div>

      {/* 記事コンテナ */}
      <article
        style={{
          maxWidth: "800px",
          margin: "-100px auto 0",
          padding: "0 1.5rem 4rem",
          position: "relative",
        }}
      >
        {/* 記事ヘッダー */}
        <header
          style={{
            backgroundColor: "white",
            padding: "2.5rem",
            borderRadius: "1rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
            border: `3px solid ${theme?.primary ?? "#3b82f6"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme?.accent ?? "#f59e0b",
                color: "white",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              技術記事
            </span>
            <span
              style={{
                color: theme?.textMuted ?? "#64748b",
                fontSize: "0.875rem",
                padding: "0.5rem 0",
              }}
            >
              2026年1月8日
            </span>
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "1rem 0",
              lineHeight: 1.3,
              color: theme?.text ?? "#1e293b",
            }}
          >
            画像から抽出した色で動的にブログデザインを変える技術
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: theme?.textMuted ?? "#64748b",
              lineHeight: 1.6,
              margin: "1rem 0 0 0",
            }}
          >
            node-vibrantライブラリを使って、画像から主要な色を抽出し、
            それをWebサイトのデザインに反映させる実装方法を詳しく解説します。
          </p>
        </header>

        {/* 画像変更UI */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            marginBottom: "2rem",
            border: `2px solid ${theme?.secondary ?? "#e2e8f0"}`,
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              marginBottom: "1rem",
              color: theme?.text ?? "#1e293b",
              fontWeight: "bold",
            }}
          >
            🎨 ヘッダー画像を変更してテーマを試す
          </h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="画像URLを入力..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit(e)}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "0.5rem 0.75rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme?.primary ?? "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: loading ? "wait" : "pointer",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              {loading ? "処理中..." : "適用"}
            </button>
            <label
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme?.secondary ?? "#64748b",
                color: "white",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              ファイル選択
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {/* 記事本文 */}
        <div
          style={{
            backgroundColor: "white",
            padding: "2.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            lineHeight: 1.8,
          }}
        >
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginTop: "2rem",
              marginBottom: "1rem",
              color: theme?.primary ?? "#3b82f6",
              borderLeft: `4px solid ${theme?.accent ?? "#f59e0b"}`,
              paddingLeft: "1rem",
            }}
          >
            はじめに
          </h2>
          <p
            style={{
              marginBottom: "1.5rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            Webサイトのデザインにおいて、色彩は非常に重要な要素です。
            この記事では、画像から自動的に色を抽出し、それをサイトのテーマカラーとして適用する方法を紹介します。
          </p>

          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginTop: "2.5rem",
              marginBottom: "1rem",
              color: theme?.primary ?? "#3b82f6",
              borderLeft: `4px solid ${theme?.accent ?? "#f59e0b"}`,
              paddingLeft: "1rem",
            }}
          >
            node-vibrantとは
          </h2>
          <p
            style={{
              marginBottom: "1.5rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            node-vibrantは、画像から支配的な色を抽出するJavaScriptライブラリです。
            Googleが開発したAndroid向けのPaletteライブラリをJavaScriptに移植したもので、
            画像の中から以下のような色のパレットを生成します。
          </p>

          <ul
            style={{
              marginBottom: "1.5rem",
              paddingLeft: "2rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                Vibrant
              </strong>
              : 鮮やかな色
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                Muted
              </strong>
              : 落ち着いた色
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                DarkVibrant
              </strong>
              : 暗めの鮮やかな色
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                DarkMuted
              </strong>
              : 暗めの落ち着いた色
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                LightVibrant
              </strong>
              : 明るめの鮮やかな色
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                LightMuted
              </strong>
              : 明るめの落ち着いた色
            </li>
          </ul>

          <div
            style={{
              backgroundColor: theme?.background ?? "#f8fafc",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              borderLeft: `4px solid ${theme?.accent ?? "#f59e0b"}`,
            }}
          >
            <p style={{ margin: 0, color: theme?.text ?? "#1e293b" }}>
              <strong style={{ color: theme?.primary ?? "#3b82f6" }}>
                💡 このページの色
              </strong>
              <br />
              現在のヘッダー画像から抽出された色がこのページ全体のデザインに適用されています。
              異なる画像を試すことで、全く違った雰囲気のデザインに変化します。
            </p>
          </div>

          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginTop: "2.5rem",
              marginBottom: "1rem",
              color: theme?.primary ?? "#3b82f6",
              borderLeft: `4px solid ${theme?.accent ?? "#f59e0b"}`,
              paddingLeft: "1rem",
            }}
          >
            実装のポイント
          </h2>

          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginTop: "2rem",
              marginBottom: "1rem",
              color: theme?.secondary ?? "#64748b",
            }}
          >
            1. CORS対応
          </h3>
          <p
            style={{
              marginBottom: "1.5rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            外部の画像を使用する場合、CORS（Cross-Origin Resource
            Sharing）への対応が必要です。 node-vibrantでは、Image要素を作成して
            <code
              style={{
                backgroundColor: theme?.background ?? "#f1f5f9",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                color: theme?.accent ?? "#f59e0b",
              }}
            >
              img.crossOrigin = "anonymous"
            </code>
            を設定し、読み込み完了後にそのImage要素をVibrantのコンストラクタに渡します。
            これによりCanvasでの画像処理が可能になります。
          </p>

          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginTop: "2rem",
              marginBottom: "1rem",
              color: theme?.secondary ?? "#64748b",
            }}
          >
            2. 色の適用戦略
          </h3>
          <p
            style={{
              marginBottom: "1.5rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            抽出された色をどのように使うかは重要なポイントです。
            このページでは以下のような戦略で色を適用しています：
          </p>
          <ul
            style={{
              marginBottom: "1.5rem",
              paddingLeft: "2rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              見出しやリンクには Vibrant カラー
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              背景には LightMuted カラー
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              強調要素には LightVibrant カラー
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              本文テキストには DarkVibrant カラー
            </li>
          </ul>

          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginTop: "2.5rem",
              marginBottom: "1rem",
              color: theme?.primary ?? "#3b82f6",
              borderLeft: `4px solid ${theme?.accent ?? "#f59e0b"}`,
              paddingLeft: "1rem",
            }}
          >
            まとめ
          </h2>
          <p
            style={{
              marginBottom: "1.5rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            画像から色を抽出してデザインに反映させる技術は、
            ブログ記事やポートフォリオサイトなど、画像が重要な役割を果たすWebサイトで特に効果的です。
            ユーザーごとに異なる画像をアップロードするサービスでは、
            それぞれの画像に合わせた独自のデザインを自動生成することができます。
          </p>
          <p
            style={{
              marginBottom: "1.5rem",
              color: theme?.text ?? "#1e293b",
            }}
          >
            ぜひ、さまざまな画像で試してみて、色の組み合わせによってどのように雰囲気が変わるか体験してみてください。
          </p>

          <div
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              backgroundColor: theme?.primary ?? "#3b82f6",
              borderRadius: "0.5rem",
              color: "white",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: "bold" }}>
              この記事が役に立ったら、ぜひシェアしてください！
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};
