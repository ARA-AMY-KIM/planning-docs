/* ============================================================
   최종 업데이트 배지 — 공용 스크립트
   사용법: 각 목업 HTML 맨 끝에 아래 한 줄만 추가
     <script src="/internet-product/assets/updated.js" defer></script>

   - 우하단 고정 배지. 그 문서의 최종 업데이트 일시를 표기합니다.
   - 일시는 아래 DATES 표에서 읽습니다. 문서를 고치면 해당 줄만 바꾸세요.
   - pointer-events:none 이라 아래 버튼 클릭을 막지 않습니다.
   - 디자인 변경은 이 파일 하나만 고치면 전 목업에 반영됩니다.

   ※ document.lastModified 를 쓰지 않는 이유:
     Netlify는 배포할 때마다 모든 파일에 새 타임스탬프를 찍습니다.
     그래서 내용을 안 고친 문서까지 날짜가 같이 바뀌어, 4개가 늘 동일하게 나왔습니다.
   ============================================================ */
(function () {
  if (window.__updBadge) return;
  window.__updBadge = 1;

  /* ------------------------------------------------------------
     문서별 최종 업데이트 날짜 — 여기만 고치면 됩니다.
     키는 경로(뒤 슬래시 포함), 값은 'YYYY-MM-DD HH:MM' (한국 시간).
     새 문서를 추가하면 여기에 한 줄 추가하세요.
  ------------------------------------------------------------ */
  var DATES = {
    '/internet-product/tags/':          '2026-10-01 13:30',  // 태그 관리
    '/internet-product/products/':   '2026-09-30 13:10',  // 인터넷 상품 관리
    '/internet-product/products-v2/':   '2026-10-01 21:33',  // 인터넷 상품 관리 V2
    '/internet-product/product-links/':   '2026-09-30 14:35',  // 상품 연결 관리
    '/internet-product/product-links-v2/':   '2026-10-01 21:33',  // 상품 조합 관리 V2
    '/internet-product/glossary/':   '2026-10-01 21:33',  // 용어집
    '/internet-product/attributes/':    '2026-09-28 13:59',  // 상품속성 관리
    '/internet-product/wbs/':           '2026-09-22 20:53'   // WBS
  };

  var CSS =
    '.updfab{position:fixed;right:18px;bottom:18px;z-index:40;display:flex;align-items:center;gap:7px;' +
    'padding:7px 13px;background:#131314;border-radius:999px;box-shadow:0 3px 12px rgba(19,19,20,.22);' +
    'font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;' +
    'font-size:12px;line-height:1;letter-spacing:-.2px;white-space:nowrap;color:rgba(255,255,255,.62);' +
    'font-feature-settings:"tnum";user-select:none;pointer-events:none}' +
    '.updfab i{width:6px;height:6px;border-radius:50%;background:#10A10E;flex:none;font-style:normal}' +
    '.updfab b{color:#fff;font-weight:600}' +
    '@media print{.updfab{display:none}}' +
    '@media(max-width:860px){.updfab{right:10px;bottom:10px;font-size:11.5px;padding:6px 11px}}';

  /* 현재 경로로 날짜 조회. /index.html 로 들어와도, 뒤 슬래시가 없어도 찾습니다. */
  function lookup() {
    var p = location.pathname.replace(/index\.html$/, '');
    if (p.charAt(p.length - 1) !== '/') p += '/';
    if (DATES[p]) return DATES[p];

    /* 표에 없으면, 스크립트 태그의 data-updated 값을 차선책으로 사용 */
    var tag = document.querySelector('script[src*="updated.js"][data-updated]');
    return tag ? tag.getAttribute('data-updated') : '';
  }

  function mount() {
    var t = lookup();
    if (!t) return;                                   // 일시를 못 찾으면 아예 안 띄움
    if (document.querySelector('.updfab')) return;    // 중복 방지

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var el = document.createElement('div');
    el.className = 'updfab';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i></i>최종 업데이트 <b></b>';
    el.querySelector('b').textContent = t;
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
