export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <a className="logo" href="/">
          <img src="/icons/movie.svg" alt="" width={24} height={24} />
          <span>UMCine</span>
        </a>
        <nav className="nav">
          <a className="nav__link nav__link--active" href="/">영화</a>
          <a className="nav__link" href="/">검색</a>
          <a className="nav__link" href="/">내 정보</a>
        </nav>
      </div>
      <div className="header__right">
        <button type="button" className="icon-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" width={20} height={20} />
        </button>
        <button type="button" className="login-button">로그인</button>
      </div>
    </header>
  );
}