/* ============================================================
   최종 업데이트 배지 — 공용 스크립트
   사용법: 각 목업 HTML 맨 끝에 아래 한 줄만 추가
     <script src="/internet-product/assets/updated.js" defer></script>

   - 우하단 고정 배지. 페이지(HTML 파일) 자신의 최종 수정 시각을 표기합니다.
   - 날짜는 document.lastModified 에서 자동 계산 → 손으로 고칠 일 없음.
   - pointer-events:none 이라 아래 버튼 클릭을 막지 않습니다.
   - 디자인 변경은 이 파일 하나만 고치면 전 목업에 반영됩니다.
   ============================================================ */
(function () {
  if (window.__updBadge) return;
  window.__updBadge = 1;

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

  function z(n) { return (n < 10 ? '0' : '') + n; }

  function stamp() {
    var d = new Date(document.lastModified);
    if (isNaN(d)) return '';
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) +
           ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
  }

  function mount() {
    var t = stamp();
    if (!t) return;                                   // 시각을 못 읽으면 아예 안 띄움
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
