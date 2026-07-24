# awd-png — 안드로이드용 SVG→PNG 변환기 (Vercel 무료)

안드로이드 앱이 SVG 위젯을 못 그리는 문제를, 이 함수가 한글 폰트(프리텐다드·노토 세리프 KR 동봉)로
서버에서 PNG로 구워 해결합니다. 비용 0원.

## 따라하기 (웹만으로 가능, 약 10분)
1. github.com 가입(이미 있으면 생략) → github.com/new 에서 저장소 `awd-png` 생성(Public).
2. 저장소 첫 화면의 "uploading an existing file" 클릭 → 이 압축을 푼 **내용물 전부**
   (api 폴더, fonts 폴더, package.json, .gitignore)를 드래그해 업로드 → Commit.
   ※ node_modules 폴더는 올리지 않습니다(자동 설치됨).
3. vercel.com 가입 → "Continue with GitHub" → Add New… ▸ Project → `awd-png` Import → 설정 그대로 **Deploy**.
4. 배포 완료 화면의 도메인 복사 (예: `awd-png-abc123.vercel.app`).
5. 작동 확인: 브라우저에서
   `https://<도메인>/api/png?u=https%3A%2F%2Fsj1.uk%2Fawd%2F%EB%8B%AC%EB%A0%A5%3Fm%3D10%26d%3D15`
   → 한글 달력 PNG가 뜨면 성공.
6. 워커 파일 상단의 `RASTER_PNG` 상수에서 `YOUR-PROJECT.vercel.app`을 위 도메인으로 교체 → 워커 재배포.
7. 안드로이드에서 새 턴 확인. (교체 전까지는 wsrv.nl 임시 폴백=글자가 □로 나올 수 있음)

## 참고
- 일기·편지의 명조 느낌이 필요 없거나 변환이 느리면 fonts/NotoSerifKR.ttf 를 지우세요(속도 ↑, 전부 프리텐다드).
- 허용 원본은 sj1.uk / s2gye.uk 로 제한되어 있어 개방 프록시로 악용될 수 없습니다.
