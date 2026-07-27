# 인수인계 메모 — 발신프로필 매트릭스 도구

이 문서는 Cowork가 이 도구를 이어받아 수정·배포할 때 참고하는 인수인계 메모입니다.
작업 지시를 받으면 이 메모의 규칙을 우선 따르세요.

---

## 1. 이 도구가 하는 일

비즈뿌리오(BizPpurio) 발신프로필을 **bizId별로 정리·대조**하는 단일 HTML 도구입니다.

- 입력: 각 bizId의 발신프로필 조회 API(`POST /v3/kakao/profile/use`) 응답 JSON
- 처리: senderKey 기준 중복 제거 → 프로필 union → bizId별 O/X 매트릭스 생성
- 출력: 화면 매트릭스 + 스프레드시트 붙여넣기용 TSV 복사

**중요 배경:** 이 API 응답은 같은 호출에서도 senderKey가 중복되어 오는 경우가 있습니다. 그래서 senderKey 기준 dedup은 이 도구의 핵심 기능이며, 절대 제거하면 안 됩니다.

---

## 2. 파일 위치 / 배포

- 저장소: `ARA-AMY-KIM/planning-docs` (GitHub, Netlify 자동 배포 연결됨)
- 파일 경로: `tools/profile-matrix/index.html`
- 배포 주소: `https://[Netlify 사이트도메인]/tools/profile-matrix/`
- 배포 방식: 로컬 폴더에서 파일 수정 → GitHub Desktop `Commit to main` → `Push origin` → Netlify가 자동 빌드/배포

**수정 반영 절차 (Cowork가 할 일):**
1. 로컬 `planning-docs\tools\profile-matrix\index.html`을 수정본으로 교체(파일명 `index.html` 유지)
2. GitHub Desktop으로 커밋 + push
3. push는 되돌리기 어려운 쓰기 작업이므로, 실행 전 변경 내용을 주인에게 한 번 요약해 확인받고 진행

---

## 3. 설계 결정 (바꾸기 전 반드시 확인할 것)

아래는 주인이 명시적으로 내린 결정입니다. 임의로 되돌리지 마세요.

- **이력·보관은 스프레드시트가 담당한다.** 이 도구는 "응답 → 시트 붙여넣기용 매트릭스 생성기"로만 쓴다. 회차별 기록은 시트에 쌓는다.
- **브라우저 저장(localStorage)은 "마지막 상태 임시 유지" 용도로만 넣었다.** 이력 보관 수단이 아니다. 캐시 삭제·다른 기기·다른 브라우저에서 사라진다는 한계를 주인은 이미 인지하고 수용했다. 이 한계를 근거로 저장 방식을 바꾸자고 먼저 제안하지 말 것(주인이 요청하면 그때 논의).
- **"조회 일시"의 정의:** 주인이 그 bizId 응답을 도구에 붙여넣은(추가/갱신한) 시각이다. 비즈뿌리오의 `modifiedAt`(프로필이 실제 바뀐 시각)이 아니다. 이 둘을 혼동해서 구현을 바꾸지 말 것. 용도는 "이 컬럼 데이터가 언제 조회한 것인지 = 데이터 신선도" 확인이다.

---

## 4. 현재 구현된 기능

- bizId 라벨 + 응답 JSON 입력 → 추가/갱신 (같은 라벨 재입력 시 덮어쓰기)
- senderKey 기준 dedup, 제거된 중복 건수 표시
- union 매트릭스: 행=프로필(등록일 최신순), 열=bizId, 셀=O/X
- 채널 상태 표시: 정상 / 휴면 / 차단·비활성 (block, dormant, profileStatus 기준)
- 휴면 행 회색, 미등록(X) 셀 노란색 강조
- 열별 등록 수 합계 행
- localStorage 자동 저장 + 페이지 로드 시 복원 + 전체 초기화 버튼
- 각 bizId 조회 일시 표시 (목록 / 매트릭스 헤더 / TSV 최상단 "조회일" 행)
- "시트용으로 복사" (TSV, 클립보드)

---

## 5. 기술 메모 (수정 시 참고)

- 순수 단일 HTML 파일. 빌드 과정 없음. 외부 의존성은 Pretendard 폰트 CDN 하나뿐.
- 프레임워크 없음(바닐라 JS). 상태는 전역 `responses` 배열.
  - 각 원소: `{ label, profiles:[{senderKey,uuid,name,createdAt,status}], raw, dup, updatedAt }`
- localStorage 키: `bizppurio_profile_matrix_v1`
- 디자인 토큰(주인 프로덕트와 통일): Pretendard, primary blue `#145CE6`, border-radius 6px
- 주인은 복잡한 코드 설명을 원하지 않음. 수정 후에는 "무엇이 어떻게 바뀌는지"를 짧게 설명하고, 코드 덤프는 지양.

---

## 6. 하면 안 되는 것

- senderKey dedup 로직 제거 금지 (API 중복 대응의 핵심)
- 주인 승인 없이 저장 방식(localStorage → 서버/파일 등) 임의 변경 금지
- "조회 일시"를 `modifiedAt`으로 바꾸지 말 것
- 확인 없이 GitHub push 하지 말 것 (변경 요약 후 진행)

---

## 7. 알려진 한계 / 향후 후보 (주인이 요청하면)

- 이 도구는 정리·대조 도구이지 조회 도구가 아니다. 각 bizId API 호출은 주인이 포스트맨 등으로 직접 수행해 응답을 붙여넣는다. (apiKey를 브라우저 정적 파일에 두면 노출되므로 조회 자동화는 범위 밖)
- 회차 간 diff(신규 등록 / 삭제 / 상태 전환만 추출)는 현재 없음. 주인이 "변경분만 보고 싶다"고 하면 그때 추가 검토.
