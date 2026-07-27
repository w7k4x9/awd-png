/* awd SVG → PNG 래스터 함수 v4 (Vercel 무료 · sharp/libvips+pango)
 * /api/png?u=<sj1.uk SVG 위젯 URL>
 * v4: resvg의 폰트 패밀리 매칭 결함으로 sharp로 전환. pango+fontconfig가
 * fonts/ 폴더를 색인하므로 패밀리 매칭이 브라우저 수준으로 동작한다.
 * 폰트 선택 = 렌더 직전 SVG의 font-family를 정확한 패밀리명으로 리태깅. */
process.env.FONTCONFIG_PATH = require("path").join(process.cwd(), "fontconfig");
const sharp = require("sharp");

/* fc-list 실측 패밀리명 */
const UI = "Pretendard";
const STAGE = {
  /* 카시엘: 단계별 필체 유지. adu만 심경하체 → 나눔 바른정신체로 교체했다. */
  cas: { bab: "Yoon Childfundkorea MinGuk", kid: "Yoon Childfundkorea MinGuk", pre: "Yoon Childfundkorea MinGuk",
         tee: "Griun On handwriting", yth: "Ownglyph wiseelist", adu: "Nanum BaReunJeongSin" },
  bel: { bab: "Yoon Childfundkorea ManSeh", kid: "Yoon Childfundkorea ManSeh", pre: "Yoon Childfundkorea ManSeh",
         tee: "Chilgok_ljh", yth: "Hakgyoansim Kkokkoma", adu: "Nanum SonPyeonJiCe" },
};
const WEEKLY = "Griun Fromsol";

function pickFams(u) {
  let route = "", q = new URLSearchParams();
  try { const url = new URL(u); route = decodeURIComponent(url.pathname.split("/").pop() || ""); q = url.searchParams; } catch (e) {}
  if (/주간|week|todo|할일/i.test(route)) return { serif: WEEKLY, sans: WEEKLY };
  if (/나이|age/i.test(route)) return { serif: WEEKLY, sans: WEEKLY };   // 알약=주간과 동일 필체
  if (/일기|diary|편지|letter/i.test(route)) {
    // 경로 뒤 이름 추출(/일기카시엘 → 카시엘). 캐릭터명이 아니면 유저 시점.
    const seg = route.replace(/^(일기|편지|diary|letter|mail)/, "");
    const isCas = /카시|cas/i.test(seg) || q.get("c") === "1";
    const isBel = /벨리|벨리알|베리|bel/i.test(seg) || q.get("c") === "2" || /벨|bel/i.test(q.get("w") || "");
    const nameIsUser = seg.trim() && !isCas && !isBel;
    // 유저 시점(경로 이름이 캐릭터 아님, 또는 c=0/uwriter) = 그리운 프롬솔
    if (nameIsUser || q.get("c") === "0" || q.get("uwriter") === "1") return { serif: WEEKLY, sans: WEEKLY };
    const st = (q.get("s") || "adu").toLowerCase().slice(0, 3);
    return { serif: (STAGE[isBel ? "bel" : "cas"] || {})[st] || UI, sans: UI };
  }
  return { serif: UI, sans: UI };
}

/* 세리프 계열 스택(Batang·Myungjo·serif)=본문 필체, 그 외=산세리프(UI) */
function retag(svg, fams) {
  /* 브라우저용 반응형 선언(style width:100%)은 래스터 크기 계산을 흐리므로 제거 */
  svg = svg.replace(/(<svg[^>]*?)\s+style="[^"]*"/, "$1");
  const decide = (v) => (/batang|myungjo|(^|[^-])serif/i.test(v) && !/sans-serif/i.test(v) ? fams.serif : fams.sans);
  return svg
    .replace(/font-family\s*:\s*([^;}"<]+)/g, (m, v) => "font-family:'" + decide(v) + "'")
    .replace(/font-family\s*=\s*"([^"]*)"/g, (m, v) => 'font-family="' + decide(v).replace(/"/g, "") + '"');
}

module.exports = async (req, res) => {
  try {
    const u = req.query.u || "";
    if (!/^https:\/\/(sj1\.uk|s2gye\.uk)\//.test(u)) { res.status(400).send("bad url"); return; }
    const r = await fetch(u, { headers: { "User-Agent": "awd-raster/4.0" } });
    if (!r.ok) { res.status(502).send("origin " + r.status); return; }
    const svg = retag(await r.text(), pickFams(u));
    /* 해상도: 채팅 컬럼(1080px+) 기준 선명도 확보.
     * 알약(원판 420px)=3배(1260px), 그 외 위젯(원판 840px)=2배(1680px). */
    /* 출력 폭을 픽셀로 직접 고정(density는 viewBox 물리크기에 좌우돼 들쭉날쭉).
     * 고해상도 렌더를 위해 density를 넉넉히 준 뒤 정확한 폭으로 리사이즈. */
    const TARGET_W = 1680;
    const png = await sharp(Buffer.from(svg), { density: 384 })
      .resize({ width: TARGET_W })
      .png({ compressionLevel: 9 })
      .toBuffer();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");
    res.status(200).send(png);
  } catch (e) {
    res.status(500).send("render error: " + (e && e.message));
  }
};
