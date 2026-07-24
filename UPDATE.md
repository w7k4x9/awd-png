# awd-png v4 업데이트 (sharp 전환)

기존 저장소에서 **3개 파일만** 갈아끼우면 됩니다. fonts 폴더는 그대로 두세요.

1. GitHub 저장소(awd-png) 접속 → Add file ▸ Upload files
2. 이 압축을 푼 api 폴더, fontconfig 폴더, package.json 을 통째로 드래그 → Commit
   (같은 경로 파일은 자동으로 덮어써지고, fontconfig 는 새로 생깁니다)
3. Vercel이 커밋을 감지해 1~2분 내 자동 재배포됩니다 (Deployments 탭에서 Ready 확인)
4. 테스트: 브라우저에서
   https://<도메인>/api/png?u=https%3A%2F%2Fsj1.uk%2Fawd%2F%EB%8B%AC%EB%A0%A5%3Fm%3D10%26d%3D15
   → 한글 달력 PNG 확인
5. 워커의 YOUR-PROJECT.vercel.app 을 실제 도메인으로 교체 → 워커 재배포 → 안드로이드 새 턴 확인

## 폰트 매핑 (api/png.js 의 STAGE 표에서 언제든 수정 가능)
- 주간 노트 전체 = 그리운 프롬솔
- 일기·편지 본문 = 캐릭터×단계 필체 (bab~pre 윤 초록우산 민국/만세 → tee 그리운오엔/칠곡할매
  → yth 위씨리스트/학교안심꼬꼬마 → adu 심경하체/나눔손편지체), 날짜 등 UI 라벨 = 프리텐다드
- 그 외 위젯(달력·폰·나이 등) = 프리텐다드
