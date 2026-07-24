/* awd SVG → PNG 래스터 함수 (Vercel 무료 플랜용)
 * 사용: /api/png?u=<sj1.uk의 SVG 위젯 URL>
 * 안드로이드 앱이 SVG를 못 그리는 문제를 서버측 PNG 변환으로 우회한다.
 * 폰트: fonts/ 폴더 동봉분(프리텐다드=고딕, 노토 세리프 KR=일기·편지)만 사용. */
const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const FONT_DIR = path.join(process.cwd(), "fonts");
const FONTS = fs
  .readdirSync(FONT_DIR)
  .filter((f) => /\.(ttf|otf)$/i.test(f))
  .map((f) => fs.readFileSync(path.join(FONT_DIR, f)));

module.exports = async (req, res) => {
  try {
    const u = req.query.u || "";
    // 우리 워커 도메인만 허용 (개방 프록시 방지)
    if (!/^https:\/\/(sj1\.uk|s2gye\.uk)\//.test(u)) {
      res.status(400).send("bad url");
      return;
    }
    const r = await fetch(u, { headers: { "User-Agent": "awd-raster/1.0" } });
    if (!r.ok) {
      res.status(502).send("origin " + r.status);
      return;
    }
    const svg = await r.text();
    const resvg = new Resvg(svg, {
      font: {
        fontBuffers: FONTS,
        loadSystemFonts: false,
        defaultFontFamily: "Pretendard",
        sansSerifFamily: "Pretendard",
        serifFamily: "Noto Serif KR",
      },
      fitTo: { mode: "width", value: 840 }, // 레티나 2배 폭
      background: "rgba(0,0,0,0)",
    });
    const png = resvg.render().asPng();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");
    res.status(200).send(Buffer.from(png));
  } catch (e) {
    res.status(500).send("render error: " + (e && e.message));
  }
};
