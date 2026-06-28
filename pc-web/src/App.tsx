import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  addFavorite,
  fetchCategories,
  fetchFavoritePage,
  fetchProductDetail,
  fetchProducts,
  loginWithPassword,
  removeFavorite,
  type Category,
  type FavoriteItem,
  type ProductCard,
  type ProductDetail,
  type ProductImage,
  type ProductSku,
} from './api';

const DEMO_PHONE = '13800000000';
const DEMO_PASSWORD = '123456';
const TOKEN_KEY = 'wudong-pc-token';
const ASSET_BASE = 'http://127.0.0.1:3000/heritage-products';

const HERO_POSTERS = [
  `${ASSET_BASE}/miaoxiu-jacket/01.jpg`,
  `${ASSET_BASE}/zharan-dress/01.jpg`,
  `${ASSET_BASE}/xiuhua-handbag/01.jpg`,
];

const COPY = {
  brandTitle: '\u7269\u52a8 \u00b7 \u975e\u9057\u9986',
  navHome: '\u7b56\u5c55\u6d4f\u89c8',
  navFavorites: '\u6536\u85cf\u5f52\u6863',
  statusOn: '\u6536\u85cf\u529f\u80fd\u5df2\u5f00\u542f',
  statusOff: '\u767b\u5f55\u540e\u53ef\u540c\u6b65\u6536\u85cf',
  enterCollection: '\u8fdb\u5165\u5c55\u89c8',
  viewFavorites: '\u67e5\u770b\u6211\u7684\u6536\u85cf',
  collectorAccess: '\u6536\u85cf\u5e2d\u4f4d',
  signedIn: '\u5df2\u8fdb\u5165\u4e2a\u4eba\u6536\u85cf\u6a21\u5f0f',
  signInPrompt: '\u89e3\u9501\u4f60\u7684\u79c1\u4eba\u5c55\u67dc',
  signOut: '\u9000\u51fa',
  phone: '\u624b\u673a\u53f7',
  password: '\u5bc6\u7801',
  signingIn: '\u767b\u5f55\u4e2d...',
  refreshSession: '\u5237\u65b0\u767b\u5f55',
  signInAndSave: '\u767b\u5f55\u5e76\u5f00\u542f\u6536\u85cf',
  demo: '\u6f14\u793a\u8d26\u53f7\uff1a13800000000 / 123456',
  signInFailed: '\u767b\u5f55\u5931\u8d25',
  favoriteGate: '\u8bf7\u5148\u767b\u5f55\u540e\u518d\u8fdb\u884c\u6536\u85cf\u3002',
  viewDetails: '\u67e5\u770b\u8be6\u60c5',
  removeFavorite: '\u53d6\u6d88\u6536\u85cf',
  saveFavorite: '\u52a0\u5165\u6536\u85cf',
  searchProducts: '\u641c\u7d22\u5355\u54c1',
  back: '\u8fd4\u56de',
  backToList: '\u8fd4\u56de\u5217\u8868',
  openArchive: '\u524d\u5f80\u6536\u85cf\u9875',
  saveThisPiece: '\u6536\u85cf\u8fd9\u4ef6\u4f5c\u54c1',
  favoritesGate: '\u767b\u5f55\u540e\u624d\u80fd\u67e5\u770b\u6536\u85cf\u5f52\u6863\u3002',
  favoritesLoadFailed: '\u6536\u85cf\u52a0\u8f7d\u5931\u8d25',
  removeFavoriteFailed: '\u53d6\u6d88\u6536\u85cf\u5931\u8d25',
  returnCollection: '\u56de\u5230\u7b56\u5c55\u5217\u8868',
} as const;

const CURATION_POINTS = [
  '\u771f\u5b9e\u7684\u5206\u7c7b\u3001\u8be6\u60c5\u3001\u767b\u5f55\u548c\u6536\u85cf\u94fe\u8def\u5168\u90e8\u4fdd\u7559\u3002',
  '\u9996\u5c4f\u5148\u7528\u6c14\u8d28\u5438\u5f15\u4eba\uff0c\u518d\u7528\u7b5b\u9009\u548c\u641c\u7d22\u5b8c\u6210\u51b3\u7b56\u3002',
  '\u6bcf\u4ef6\u5355\u54c1\u90fd\u628a\u5de5\u827a\u3001\u56fe\u50cf\u3001\u4f20\u627f\u548c\u4ef7\u683c\u653e\u8fdb\u540c\u4e00\u6bb5\u53d9\u4e8b\u91cc\u3002',
];

const MATERIAL_TAGS = [
  '\u523a\u7ee3',
  '\u67d3\u7ec7',
  '\u670d\u9970',
  '\u914d\u9970',
];

function priceLabel(minPrice: number, maxPrice: number) {
  if (Number(minPrice) === Number(maxPrice)) {
    return `CNY ${Number(minPrice).toFixed(2)}`;
  }
  return `CNY ${Number(minPrice).toFixed(2)} - CNY ${Number(maxPrice).toFixed(2)}`;
}

function productLead(product: ProductCard) {
  return (
    product.subtitle ||
    product.statusText ||
    `\u4ece${product.categoryName}\u7684\u89c6\u89d2\u5207\u5165\uff0c\u628a\u975e\u9057\u5de5\u827a\u653e\u8fdb\u5f53\u4ee3\u751f\u6d3b\u573a\u666f\u91cc\u91cd\u65b0\u89c2\u770b\u3002`
  );
}

function resolveSkuSpecs(specs: ProductSku['specs']) {
  if (Array.isArray(specs)) {
    const values = specs
      .map(item => String(item).trim())
      .filter(Boolean);
    return values.length ? values.join(' / ') : '\u6807\u51c6\u89c4\u683c';
  }
  if (typeof specs === 'string' && specs.trim()) {
    return specs.trim();
  }
  return '\u6807\u51c6\u89c4\u683c';
}

function routeMeta(pathname: string) {
  if (pathname.startsWith('/favorites')) {
    return {
      eyebrow: 'Collected Pieces',
      headlineLines: [
        '\u628a\u6536\u85cf\u53d8\u6210',
        '\u79c1\u4eba\u7684\u5c55\u5899\u3002',
      ],
      description:
        '\u6536\u85cf\u9875\u4e0d\u53ea\u662f\u529f\u80fd\u5217\u8868\uff0c\u800c\u662f\u4f60\u5bf9\u6750\u8d28\u3001\u5de5\u827a\u4e0e\u7a7f\u7740\u60f3\u8c61\u7684\u6301\u7eed\u5f52\u6863\u3002',
      documentTitle: '\u7269\u52a8 \u00b7 \u6536\u85cf\u5f52\u6863',
      tone: 'favorites',
    };
  }

  if (pathname.startsWith('/products/')) {
    return {
      eyebrow: 'Single Object Study',
      headlineLines: [
        '\u50cf\u7ffb\u5de5\u827a\u753b\u518c',
        '\u8bfb\u61c2\u4e00\u4ef6\u4f5c\u54c1\u3002',
      ],
      description:
        '\u56fe\u7247\u3001\u5de5\u827a\u4ecb\u7ecd\u3001\u4f20\u627f\u4eba\u4fe1\u606f\u548c\u5e93\u5b58\u72b6\u6001\u88ab\u91cd\u65b0\u6392\u7248\uff0c\u6d4f\u89c8\u4e0d\u518d\u53ea\u662f\u770b\u53c2\u6570\u3002',
      documentTitle: '\u7269\u52a8 \u00b7 \u5355\u54c1\u8be6\u60c5',
      tone: 'detail',
    };
  }

  return {
    eyebrow: 'Heritage Curation',
    headlineLines: [
      '\u8ba9\u975e\u9057\u50cf\u5c55\u89c8\u4e00\u6837',
      '\u88ab\u89c2\u770b\uff0c\u4e5f\u88ab\u5e26\u8d70\u3002',
    ],
    description:
      '\u4e0d\u662f\u628a\u5546\u54c1\u586b\u8fdb\u4e00\u6392\u6392\u5361\u7247\uff0c\u800c\u662f\u8ba9\u6750\u8d28\u3001\u5de5\u827a\u3001\u4ef7\u683c\u548c\u7a7f\u7740\u60f3\u8c61\u5728\u540c\u4e00\u5c4f\u91cc\u53d1\u751f\u3002',
    documentTitle: '\u7269\u52a8 \u00b7 \u975e\u9057\u5c55\u9648',
    tone: 'home',
  };
}

function App() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [phone, setPhone] = useState(DEMO_PHONE);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [favoriteVersion, setFavoriteVersion] = useState(0);

  const meta = routeMeta(location.pathname);
  const isHome = location.pathname === '/';

  useEffect(() => {
    document.title = meta.documentTitle;
  }, [meta.documentTitle]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const result = await loginWithPassword(phone, password);
      setToken(result.token);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : COPY.signInFailed);
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
  }

  return (
    <div className={`app-shell tone-${meta.tone}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="global-header">
        <Link to="/" className="brandmark">
          <span className="brandmark-kicker">WUDONG CURATION</span>
          <span className="brandmark-title">{COPY.brandTitle}</span>
        </Link>

        <nav className="global-nav">
          <Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to="/">
            {COPY.navHome}
          </Link>
          <Link
            className={location.pathname.startsWith('/favorites') ? 'nav-link active' : 'nav-link'}
            to="/favorites"
          >
            {COPY.navFavorites}
          </Link>
        </nav>

        <div className="status-pill">
          <span className="status-dot" />
          {token ? COPY.statusOn : COPY.statusOff}
        </div>
      </header>

      {isHome ? (
        <section className="masthead">
          <div className="masthead-copy">
            <p className="eyebrow">{meta.eyebrow}</p>
            <h1>
              {meta.headlineLines.map(line => (
                <span className="headline-line" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="masthead-description">{meta.description}</p>

            <div className="masthead-actions">
              <Link to="/" className="solid-button">
                {COPY.enterCollection}
              </Link>
              <Link to="/favorites" className="ghost-button light">
                {COPY.viewFavorites}
              </Link>
            </div>

            <div className="masthead-signature">
              <span>Craft In Motion</span>
              <strong>{MATERIAL_TAGS.join(' / ')}</strong>
            </div>

            <ul className="fact-list">
              {CURATION_POINTS.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="masthead-visual">
            <div className="visual-watermark">WU DONG</div>
            <div className="poster poster-main">
              <img src={HERO_POSTERS[0]} alt="Miao embroidery jacket" />
            </div>
            <div className="poster poster-offset">
              <img src={HERO_POSTERS[1]} alt="Tie-dye dress" />
            </div>
            <div className="poster poster-tall">
              <img src={HERO_POSTERS[2]} alt="Embroidered handbag" />
            </div>
            <div className="visual-caption">
              <span>Online Exhibition</span>
              <strong>
                {'\u628a\u523a\u7ee3\u3001\u67d3\u7ec7\u3001\u4f20\u627f\u4eba\u4e0e\u6536\u85cf\u6b32\u671b\uff0c\u7f1d\u8fdb\u540c\u4e00\u6b21\u6d4f\u89c8\u4f53\u9a8c\u91cc\u3002'}
              </strong>
            </div>
          </div>

          <form className="session-panel" onSubmit={handleLogin}>
            <div className="session-panel-head">
              <div>
                <p className="panel-label">{COPY.collectorAccess}</p>
                <h2>{token ? COPY.signedIn : COPY.signInPrompt}</h2>
              </div>
              {token ? (
                <button type="button" className="text-button" onClick={handleLogout}>
                  {COPY.signOut}
                </button>
              ) : null}
            </div>

            <label className="field">
              <span>{COPY.phone}</span>
              <input value={phone} onChange={event => setPhone(event.target.value)} />
            </label>
            <label className="field">
              <span>{COPY.password}</span>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </label>

            <button type="submit" className="solid-button wide" disabled={loginLoading}>
              {loginLoading ? COPY.signingIn : token ? COPY.refreshSession : COPY.signInAndSave}
            </button>

            <p className="panel-note">{COPY.demo}</p>
            {loginError ? <p className="error-text">{loginError}</p> : null}
          </form>
        </section>
      ) : (
        <section className="inner-masthead">
          <div className="inner-masthead-copy">
            <p className="eyebrow">{meta.eyebrow}</p>
            <h1 className="inner-title">
              {meta.headlineLines.map(line => (
                <span className="headline-line" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="masthead-description">{meta.description}</p>

            <div className="masthead-actions">
              <Link to="/" className="solid-button">
                {COPY.enterCollection}
              </Link>
              <Link to="/favorites" className="ghost-button light">
                {COPY.viewFavorites}
              </Link>
            </div>
          </div>

          <div className="inner-masthead-side">
            <div className="inner-visual-card">
              <div className="inner-visual-intro">
                <span>Curated Interior</span>
                <strong>
                  {location.pathname.startsWith('/products/')
                    ? '\u5355\u54c1\u7ec6\u8282\u3001\u5de5\u827a\u63d0\u8981\u4e0e\u8d2d\u4e70\u4fe1\u606f\u88ab\u91cd\u65b0\u7f16\u6392\u6210\u4e00\u6bb5\u5b8c\u6574\u9605\u8bfb\u3002'
                    : '\u6536\u85cf\u4e0d\u53ea\u662f\u540d\u5355\uff0c\u800c\u662f\u4f60\u81ea\u5df1\u7684\u5ba1\u7f8e\u8def\u5f84\u4e0e\u6750\u8d28\u504f\u597d\u3002'}
                </strong>
              </div>
              <div className="inner-visual-stack">
                <div className="inner-poster inner-poster-large">
                  <img
                    src={location.pathname.startsWith('/products/') ? HERO_POSTERS[0] : HERO_POSTERS[2]}
                    alt="Curated visual"
                  />
                </div>
                <div className="inner-poster inner-poster-small">
                  <img
                    src={location.pathname.startsWith('/products/') ? HERO_POSTERS[1] : HERO_POSTERS[0]}
                    alt="Curated visual detail"
                  />
                </div>
              </div>
            </div>

            <form className="session-panel session-panel-compact" onSubmit={handleLogin}>
              <div className="session-panel-head">
                <div>
                  <p className="panel-label">{COPY.collectorAccess}</p>
                  <h2>{token ? COPY.signedIn : COPY.signInPrompt}</h2>
                </div>
                {token ? (
                  <button type="button" className="text-button" onClick={handleLogout}>
                    {COPY.signOut}
                  </button>
                ) : null}
              </div>

              {token ? (
                <div className="session-brief">
                  <p>{'\u6536\u85cf\u529f\u80fd\u5df2\u53ef\u7528\uff0c\u73b0\u5728\u53ef\u4ee5\u76f4\u63a5\u5bf9\u6bd4\u3001\u6536\u85cf\u6216\u56de\u770b\u4f60\u611f\u5174\u8da3\u7684\u5355\u54c1\u3002'}</p>
                </div>
              ) : (
                <>
                  <label className="field">
                    <span>{COPY.phone}</span>
                    <input value={phone} onChange={event => setPhone(event.target.value)} />
                  </label>
                  <label className="field">
                    <span>{COPY.password}</span>
                    <input
                      type="password"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                    />
                  </label>

                  <button type="submit" className="solid-button wide" disabled={loginLoading}>
                    {loginLoading ? COPY.signingIn : COPY.signInAndSave}
                  </button>
                </>
              )}

              <p className="panel-note">{COPY.demo}</p>
              {loginError ? <p className="error-text">{loginError}</p> : null}
            </form>
          </div>
        </section>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              token={token}
              favoriteVersion={favoriteVersion}
              onFavoriteChange={() => setFavoriteVersion(value => value + 1)}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <DetailPage
              token={token}
              onFavoriteChange={() => setFavoriteVersion(value => value + 1)}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              token={token}
              favoriteVersion={favoriteVersion}
              onFavoriteChange={() => setFavoriteVersion(value => value + 1)}
            />
          }
        />
      </Routes>
    </div>
  );
}

function HomePage(props: {
  token: string | null;
  favoriteVersion: number;
  onFavoriteChange: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [keyWord, setKeyWord] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadData() {
    setLoading(true);
    setMessage('');
    try {
      const [categoryList, productPage] = await Promise.all([
        fetchCategories(),
        fetchProducts({
          page: 1,
          pageSize: 12,
          categoryId: activeCategory,
          keyWord: keyWord.trim() || undefined,
        }),
      ]);
      setCategories(categoryList);
      setProducts(productPage.list);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '\u52a0\u8f7d\u5931\u8d25');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [activeCategory, props.favoriteVersion]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData();
  }

  async function toggleFavorite(product: ProductCard) {
    if (!props.token) {
      setMessage(COPY.favoriteGate);
      return;
    }
    try {
      if (product.isFavorite) {
        await removeFavorite(props.token, product.id);
      } else {
        await addFavorite(props.token, product.id);
      }
      props.onFavoriteChange();
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '\u6536\u85cf\u5931\u8d25');
    }
  }

  const featuredProduct = products[0];
  const visibleProducts = featuredProduct ? products.slice(1) : products;

  return (
    <main className="page page-home">
      <section className="home-spotlight">
        <article className="editorial-card">
          <p className="eyebrow">Curator&apos;s Note</p>
          <h2>
            {
              '\u8fd9\u4e0d\u662f\u666e\u901a\u7684\u5355\u54c1\u5217\u8868\uff0c\u800c\u662f\u4e00\u6761\u628a\u5de5\u827a\u3001\u6750\u8d28\u4e0e\u5f53\u4ee3\u4f7f\u7528\u573a\u666f\u91cd\u65b0\u7f16\u6392\u8fc7\u7684\u6d4f\u89c8\u8def\u7ebf\u3002'
            }
          </h2>
          <p>
            {
              '\u5148\u7528\u6c14\u8d28\u5efa\u7acb\u7b2c\u4e00\u773c\u8bb0\u5fc6\uff0c\u518d\u7528\u5206\u7c7b\u4e0e\u641c\u7d22\u5b8c\u6210\u9009\u54c1\uff0c\u6700\u540e\u628a\u6bcf\u4ef6\u5355\u54c1\u8bb2\u6210\u4e00\u9875\u503c\u5f97\u505c\u7559\u7684\u5185\u5bb9\u3002'
            }
          </p>
          <div className="editorial-metrics">
            <div>
              <strong>{products.length || 8}</strong>
              <span>{'\u5f53\u524d\u5c55\u54c1'}</span>
            </div>
            <div>
              <strong>{categories.length || 3}</strong>
              <span>{'\u7b56\u5c55\u5206\u533a'}</span>
            </div>
            <div>
              <strong>{props.token ? 'ON' : 'OFF'}</strong>
              <span>{'\u6536\u85cf\u540c\u6b65'}</span>
            </div>
          </div>
        </article>

        {featuredProduct ? (
          <article className="featured-piece">
            <div className="featured-piece-image">
              <img src={featuredProduct.coverImage} alt={featuredProduct.title} />
            </div>
            <div className="featured-piece-copy">
              <p className="eyebrow">{featuredProduct.categoryName}</p>
              <h3>{featuredProduct.title}</h3>
              <p className="featured-subtitle">
                {featuredProduct.subtitle || '\u672c\u671f\u7b56\u5c55\u91cc\u7684\u7126\u70b9\u5355\u54c1'}
              </p>
              <p className="featured-description">{productLead(featuredProduct)}</p>
              <div className="featured-footer">
                <p className="price">{priceLabel(featuredProduct.minPrice, featuredProduct.maxPrice)}</p>
                <Link to={`/products/${featuredProduct.id}`} className="solid-button">
                  {'\u8fdb\u5165\u5355\u54c1\u753b\u518c'}
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <article className="featured-piece empty-piece">
            <p className="empty-state">{'\u5b9e\u65f6\u8f7d\u5165\u7cbe\u9009\u5355\u54c1\u4e2d...'}</p>
          </article>
        )}
      </section>

      <section className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="sidebar-block">
            <p className="eyebrow">Browse by</p>
            <h3>{'\u5206\u7c7b\u4e0e\u641c\u7d22'}</h3>
            <p className="sidebar-copy">
              {'\u5148\u6309\u5de5\u827a\u65b9\u5411\u7f29\u5c0f\u8303\u56f4\uff0c\u518d\u8fdb\u5165\u5355\u54c1\u753b\u518c\u9875\u505a\u7ec6\u770b\u4e0e\u6536\u85cf\u3002'}
            </p>
          </div>

          <form className="search-panel" onSubmit={handleSearch}>
            <label className="field">
              <span>{'\u641c\u7d22\u5173\u952e\u8bcd'}</span>
              <input
                value={keyWord}
                onChange={event => setKeyWord(event.target.value)}
                placeholder={'\u4f8b\u5982\uff1a\u523a\u7ee3\u3001\u67d3\u7ec7\u3001\u76d8\u6263'}
              />
            </label>
            <button type="submit" className="solid-button wide">
              {COPY.searchProducts}
            </button>
          </form>

          <div className="sidebar-block">
            <div className="sidebar-title-row">
              <h3>{'\u7b56\u5c55\u5206\u533a'}</h3>
              <span>{categories.length || 3}</span>
            </div>
            <div className="category-stack">
              <button
                className={activeCategory === undefined ? 'chip active' : 'chip'}
                type="button"
                onClick={() => setActiveCategory(undefined)}
              >
                <span>{'\u5168\u90e8\u5355\u54c1'}</span>
                <small>{'\u6d4f\u89c8\u5b8c\u6574\u7b56\u5c55\u6e05\u5355'}</small>
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={activeCategory === category.id ? 'chip active' : 'chip'}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <small>{category.remark || '\u975e\u9057\u4e3b\u9898\u7cfb\u5217'}</small>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="catalog-stage">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Collection View</p>
              <h2>
                {
                  '\u628a\u5355\u54c1\u5f53\u6210\u5c55\u54c1\u6765\u6392\uff0c\u800c\u4e0d\u662f\u628a\u4fe1\u606f\u538b\u6210\u4e00\u7ec4\u7ec4\u5e38\u89c4\u5546\u54c1\u5361\u7247\u3002'
                }
              </h2>
            </div>
            <p className="section-copy">
              {
                '\u4ef7\u683c\u3001\u72b6\u6001\u548c\u6536\u85cf\u64cd\u4f5c\u4ecd\u7136\u5728\uff0c\u4f46\u7b2c\u4e00\u89c6\u89c9\u6c38\u8fdc\u5148\u7531\u56fe\u7247\u3001\u6807\u9898\u548c\u6c14\u8d28\u6765\u8bf4\u8bdd\u3002'
              }
            </p>
          </div>

          {message ? <p className="error-text">{message}</p> : null}
          {loading ? <p className="empty-state">{'\u5355\u54c1\u8f7d\u5165\u4e2d...'}</p> : null}
          {!loading && products.length === 0 ? (
            <p className="empty-state">{'\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u6682\u65e0\u5355\u54c1\u3002'}</p>
          ) : null}

          <div className="product-gallery">
            {visibleProducts.map((product, index) => (
              <article
                className={`product-tile ${index % 5 === 0 ? 'product-tile-wide' : ''}`}
                key={product.id}
              >
                <div className="product-tile-image">
                  <img src={product.coverImage} alt={product.title} />
                  <div className="product-tile-overlay">
                    <span className={product.soldOut ? 'badge sold-out' : 'badge on-sale'}>
                      {product.soldOut ? '\u5df2\u552e\u7f44' : '\u53ef\u8d2d\u4e70'}
                    </span>
                    <p className="category-tag">{product.categoryName}</p>
                  </div>
                </div>
                <div className="product-tile-copy">
                  <div>
                    <h3>{product.title}</h3>
                    <p className="subtitle">{product.subtitle || '\u6682\u65e0\u526f\u6807\u9898'}</p>
                  </div>
                  <div className="product-tile-footer">
                    <div>
                      <p className="price">{priceLabel(product.minPrice, product.maxPrice)}</p>
                      <p className="meta-note">
                        {product.soldOut
                          ? '\u5f53\u524d\u65e0\u53ef\u552e\u5e93\u5b58'
                          : product.statusText || '\u6b63\u5728\u5c55\u9648\u4e2d'}
                      </p>
                    </div>
                    <div className="product-actions">
                      <Link to={`/products/${product.id}`} className="ghost-button">
                        {COPY.viewDetails}
                      </Link>
                      <button
                        type="button"
                        className={product.isFavorite ? 'ghost-button active-favorite' : 'ghost-button'}
                        onClick={() => toggleFavorite(product)}
                      >
                        {product.isFavorite ? COPY.removeFavorite : COPY.saveFavorite}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function DetailPage(props: { token: string | null; onFavoriteChange: () => void }) {
  const params = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  async function loadDetail() {
    setLoading(true);
    setMessage('');
    try {
      const data = await fetchProductDetail(Number(params.id));
      setDetail(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : '\u5355\u54c1\u8be6\u60c5\u52a0\u8f7d\u5931\u8d25',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
  }, [params.id]);

  useEffect(() => {
    if (detail?.images.length) {
      setSelectedImageId(detail.images[0].id);
    } else {
      setSelectedImageId(null);
    }
  }, [detail]);

  async function toggleFavorite() {
    if (!detail) {
      return;
    }
    if (!props.token) {
      setMessage(COPY.favoriteGate);
      return;
    }
    try {
      if (detail.isFavorite) {
        await removeFavorite(props.token, detail.id);
      } else {
        await addFavorite(props.token, detail.id);
      }
      props.onFavoriteChange();
      await loadDetail();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '\u6536\u85cf\u5931\u8d25');
    }
  }

  if (loading) {
    return (
      <main className="page page-detail">
        <p className="empty-state">{'\u5355\u54c1\u753b\u518c\u8f7d\u5165\u4e2d...'}</p>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="page page-detail">
        <p className="error-text">{message || '\u8be5\u5355\u54c1\u5f53\u524d\u4e0d\u53ef\u7528\u3002'}</p>
        <button type="button" className="ghost-button" onClick={() => navigate('/')}>
          {COPY.backToList}
        </button>
      </main>
    );
  }

  const galleryImages: ProductImage[] = detail.images.length
    ? detail.images
    : [{ id: 0, url: HERO_POSTERS[0], isMain: 1, sortOrder: 0 }];
  const activeImage = galleryImages.find(image => image.id === selectedImageId) ?? galleryImages[0];
  const totalStock =
    typeof detail.totalStock === 'number'
      ? detail.totalStock
      : detail.skus.reduce((sum, sku) => sum + Number(sku.stock || 0), 0);

  return (
    <main className="page page-detail">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        {COPY.back}
      </button>

      <section className="detail-stage">
        <div className="detail-visual-area">
          <div className="detail-main-visual">
            <img src={activeImage.url} alt={detail.title} />
            <div className="detail-image-float">
              <span>{detail.categoryName}</span>
              <strong>{`${galleryImages.length} \u5f20\u5c55\u56fe`}</strong>
            </div>
          </div>

          <div className="thumbnail-rail">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={image.id === activeImage.id ? 'thumb active' : 'thumb'}
                onClick={() => setSelectedImageId(image.id)}
              >
                <img src={image.url} alt={`${detail.title}-${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-story">
          <p className="eyebrow">{detail.categoryName}</p>
          <h2>{detail.title}</h2>
          <p className="subtitle detail-subtitle">{detail.subtitle || '\u6682\u65e0\u526f\u6807\u9898'}</p>
          <p className="detail-body">{detail.description || '\u6682\u65e0\u5355\u54c1\u8bf4\u660e\u3002'}</p>

          <div className="price-band">
            <div>
              <span>{'\u5c55\u9648\u552e\u4ef7'}</span>
              <strong>{priceLabel(detail.minPrice, detail.maxPrice)}</strong>
            </div>
            <div>
              <span>{'\u5e93\u5b58\u72b6\u6001'}</span>
              <strong>
                {detail.soldOut ? '\u5f53\u524d\u552e\u7f44' : `${totalStock} \u4ef6\u53ef\u552e`}
              </strong>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" className="solid-button" onClick={toggleFavorite}>
              {detail.isFavorite ? COPY.removeFavorite : COPY.saveThisPiece}
            </button>
            <Link to="/favorites" className="ghost-button">
              {COPY.openArchive}
            </Link>
          </div>

          <dl className="detail-facts">
            <div>
              <dt>{'\u4f20\u627f\u4eba'}</dt>
              <dd>{detail.inheritorName || '\u6682\u65e0\u4fe1\u606f'}</dd>
            </div>
            <div>
              <dt>{'SKU \u6570\u91cf'}</dt>
              <dd>{detail.skus.length}</dd>
            </div>
            <div>
              <dt>{'\u6d4f\u89c8\u72b6\u6001'}</dt>
              <dd>
                {detail.soldOut
                  ? '\u5355\u54c1\u5f53\u524d\u4ec5\u4f9b\u6d4f\u89c8'
                  : '\u652f\u6301\u6536\u85cf\u4e0e\u7ee7\u7eed\u9605\u8bfb'}
              </dd>
            </div>
          </dl>

          {message ? <p className="error-text">{message}</p> : null}
        </div>
      </section>

      <section className="detail-columns">
        <article className="narrative-panel">
          <p className="eyebrow">Craft Intro</p>
          <h3>{'\u5de5\u827a\u63d0\u8981'}</h3>
          <p>{detail.craftIntro || '\u6682\u65e0\u5de5\u827a\u4ecb\u7ecd\u3002'}</p>
        </article>

        <article className="inheritor-panel">
          <p className="eyebrow">Inheritor</p>
          <h3>{detail.inheritorName || '\u6682\u65e0\u4f20\u627f\u4eba\u4fe1\u606f'}</h3>
          <p>{detail.inheritorIntro || '\u6682\u65e0\u4f20\u627f\u4eba\u4ecb\u7ecd\u3002'}</p>
        </article>
      </section>

      <section className="sku-section">
        <div className="section-intro compact">
          <div>
            <p className="eyebrow">Available SKUs</p>
            <h2>
              {
                '\u8d2d\u4e70\u4fe1\u606f\u4ecd\u7136\u6e05\u695a\u3001\u7ed3\u6784\u5316\uff0c\u4f46\u5448\u73b0\u65b9\u5f0f\u66f4\u50cf\u5c55\u7b7e\uff0c\u800c\u4e0d\u662f\u51b7\u51b0\u51b0\u7684\u540e\u53f0\u5b57\u6bb5\u3002'
              }
            </h2>
          </div>
        </div>

        <div className="sku-list">
          {detail.skus.map(sku => (
            <article className="sku-row" key={sku.id}>
              <div>
                <p className="category-tag">{sku.code || 'SKU'}</p>
                <h4>{sku.name}</h4>
                <p className="subtitle">{resolveSkuSpecs(sku.specs)}</p>
              </div>
              <div className="sku-price">
                <span>{'\u552e\u4ef7'}</span>
                <strong>CNY {Number(sku.salePrice).toFixed(2)}</strong>
              </div>
              <div className="sku-meta">
                <span>{`Original CNY ${Number(sku.originalPrice).toFixed(2)}`}</span>
                <span>{`Stock ${sku.stock}`}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function FavoritesPage(props: {
  token: string | null;
  favoriteVersion: number;
  onFavoriteChange: () => void;
}) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadFavorites() {
    if (!props.token) {
      setItems([]);
      setMessage(COPY.favoritesGate);
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const page = await fetchFavoritePage(props.token);
      setItems(page.list);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY.favoritesLoadFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, [props.token, props.favoriteVersion]);

  async function handleRemove(productId: number) {
    if (!props.token) {
      return;
    }
    try {
      await removeFavorite(props.token, productId);
      props.onFavoriteChange();
      await loadFavorites();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY.removeFavoriteFailed);
    }
  }

  const firstItem = items[0];

  return (
    <main className="page page-favorites">
      <section className="favorites-stage">
        <article className="favorites-note">
          <p className="eyebrow">Saved Selection</p>
          <h2>
            {
              '\u628a\u559c\u6b22\u7684\u5355\u54c1\u6536\u8fdb\u4e00\u5904\uff0c\u6162\u6162\u5f62\u6210\u4f60\u81ea\u5df1\u7684\u9009\u54c1\u89c6\u89d2\u3002'
            }
          </h2>
          <p>
            {
              '\u6536\u85cf\u9875\u6cbf\u7528\u540c\u4e00\u5957\u5c55\u9648\u8bed\u8a00\uff0c\u8ba9\u201c\u6211\u60f3\u518d\u770b\u4e00\u904d\u201d\u8fd9\u4ef6\u4e8b\u4e5f\u663e\u5f97\u6709\u7f8e\u611f\uff0c\u800c\u4e0d\u662f\u53ea\u5269\u4e0b\u4e00\u6392\u529f\u80fd\u6309\u94ae\u3002'
            }
          </p>
        </article>

        <article className="favorites-cover">
          {firstItem ? (
            <>
              <img src={firstItem.coverImage} alt={firstItem.title} />
              <div className="favorites-cover-copy">
                <span>{firstItem.categoryName}</span>
                <strong>{firstItem.title}</strong>
              </div>
            </>
          ) : (
            <div className="favorites-cover-empty">
              {'\u767b\u5f55\u540e\u6536\u85cf\u4f60\u60f3\u7559\u4e0b\u7684\u5355\u54c1\u3002'}
            </div>
          )}
        </article>
      </section>

      <div className="section-intro compact">
        <div>
          <p className="eyebrow">Favorites Archive</p>
          <h2>{'\u5c55\u7b7e\u5f0f\u5f52\u6863'}</h2>
        </div>
        <Link to="/" className="ghost-button">
          {COPY.returnCollection}
        </Link>
      </div>

      {loading ? <p className="empty-state">{'\u6536\u85cf\u5f52\u6863\u8f7d\u5165\u4e2d...'}</p> : null}

      {!loading && items.length === 0 ? (
        <section className="archive-empty">
          <div className="archive-empty-copy">
            <p className="eyebrow">Archive Empty</p>
            <h3>
              {props.token
                ? '\u8fd9\u91cc\u8fd8\u6ca1\u6709\u88ab\u4f60\u7559\u4e0b\u7684\u5355\u54c1\u3002'
                : '\u5148\u767b\u5f55\uff0c\u628a\u60f3\u7559\u4e0b\u7684\u5355\u54c1\u6536\u8fdb\u8fd9\u91cc\u3002'}
            </h3>
            <p>
              {props.token
                ? '\u4ece\u5217\u8868\u9875\u6311\u9009\u4f60\u60f3\u56de\u770b\u7684\u4f5c\u54c1\uff0c\u8fd9\u91cc\u4f1a\u6162\u6162\u53d8\u6210\u4f60\u81ea\u5df1\u7684\u5c55\u7b7e\u6e05\u5355\u3002'
                : '\u767b\u5f55\u4e4b\u540e\uff0c\u6536\u85cf\u7684\u5355\u54c1\u4f1a\u5728\u8fd9\u91cc\u6309\u7167\u4f60\u7684\u6750\u8d28\u504f\u597d\u4e0e\u9009\u54c1\u8def\u5f84\u88ab\u91cd\u65b0\u5f52\u6863\u3002'}
            </p>
            <div className="archive-empty-actions">
              <Link to="/" className="solid-button">
                {COPY.enterCollection}
              </Link>
              <div className="archive-empty-tags">
                {MATERIAL_TAGS.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          {message ? <p className="error-text">{message}</p> : null}
        </section>
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="favorite-archive">
          {items.map(item => (
            <article className="favorite-entry" key={item.favoriteId}>
              <div className="favorite-entry-image">
                <img src={item.coverImage} alt={item.title} />
              </div>
              <div className="favorite-entry-copy">
                <p className="category-tag">{item.categoryName}</p>
                <h3>{item.title}</h3>
                <p className="subtitle">{item.subtitle || '\u6682\u65e0\u526f\u6807\u9898'}</p>
              </div>
              <div className="favorite-entry-meta">
                <p className="price">{priceLabel(item.minPrice, item.maxPrice)}</p>
                <p className="meta-note">
                  {item.soldOut ? '\u5f53\u524d\u5df2\u552e\u7f44' : '\u4ecd\u53ef\u7ee7\u7eed\u9605\u8bfb\u4e0e\u5bf9\u6bd4'}
                </p>
              </div>
              <div className="favorite-entry-actions">
                <Link className="ghost-button" to={`/products/${item.productId}`}>
                  {COPY.viewDetails}
                </Link>
                <button
                  type="button"
                  className="ghost-button active-favorite"
                  onClick={() => handleRemove(item.productId)}
                >
                  {COPY.removeFavorite}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </main>
  );
}

export default App;
