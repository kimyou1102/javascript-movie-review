var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _movies, _isLoading, _page, _searchKeyword, _searchPage, _mode, _show;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class TitleSearchBar {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
  }
  render() {
    const $div = document.createElement("div");
    $div.classList.add("title-search-bar");
    const $searchBar = document.createElement("form");
    $searchBar.classList.add("search-bar");
    const $input = document.createElement("input");
    $input.placeholder = "검색어를 입력하세요.";
    $input.classList.add("search-input");
    const $button = document.createElement("button");
    $button.classList.add("search-button");
    const $img = document.createElement("img");
    $img.setAttribute("src", "./images/Search.png");
    $div.innerHTML = /*html*/
    `
    <h1 class="logo">
      <img src="./images/logo.png" alt="MovieList" />
    </h1>
    `;
    $div.appendChild($searchBar);
    $searchBar.appendChild($input);
    $searchBar.appendChild($button);
    $button.appendChild($img);
    $searchBar.addEventListener("submit", this.onSubmit);
    return $div;
  }
}
class Thumbnail {
  constructor(movie) {
    this.movie = movie;
  }
  render() {
    const $div = document.createElement("div");
    $div.classList.add("background-container");
    $div.style.backgroundImage = `url("${this.movie.backdrop_path}")`;
    $div.innerHTML = /*html*/
    `
        <div class="overlay" aria-hidden="true"></div>
        <div class="top-rated-container">
          <div class="top-rated-movie">
            <div class="rate">
              <img src="./images/star_empty.png" class="star" />
              <span class="rate-value">${this.movie.vote_average}</span>
            </div>
            <div class="title">${this.movie.title}</div>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    `;
    return $div;
  }
}
class Button {
  render() {
    const $button = document.createElement("button");
    $button.classList.add("more-button");
    $button.textContent = "더보기";
    return $button;
  }
}
class Footer {
  render() {
    const $footer = document.createElement("footer");
    $footer.classList.add("footer");
    $footer.innerHTML = /*html*/
    `
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="./images/woowacourse_logo.png" width="180" /></p>
    `;
    return $footer;
  }
}
async function getFetchData(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${void 0}`
    }
  });
  if (!response.ok) {
    throw new Error("HTTP-Error: " + response.status);
  }
  const jsonData = await response.json();
  return jsonData;
}
async function getPopularityMovie(page) {
  try {
    const data = await getFetchData(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`
    );
    return data;
  } catch (error) {
    return null;
  }
}
async function searchMovie(page, searchKeyword) {
  try {
    const data = await getFetchData(
      `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}&include_adult=false&language=ko-KR&page=${page}`
    );
    return data;
  } catch (error) {
    return null;
  }
}
class MovieItem {
  constructor(movie, isLoading) {
    this.movie = movie;
    this.isLoading = isLoading;
  }
  render() {
    const $li = document.createElement("li");
    if (this.isLoading) {
      $li.classList.add("skeleton-box");
      return $li;
    }
    const { title, poster_path, vote_average } = this.movie;
    $li.innerHTML = /*html*/
    `
    
        <div class="item">
            <img
            class="thumbnail"
            src=${poster_path === "https://image.tmdb.org/t/p/w300null" ? "./images/nullImage.png" : poster_path}
            alt=${title}
            />
            <div class="item-desc">
            <p class="rate">
                <img src="./images/star_empty.png" class="star" /><span
                >${vote_average}</span
                >
            </p>
            <strong>${title}</strong>
            </div>
        </div>
    
    `;
    return $li;
  }
}
class EmptyView {
  constructor(text) {
    this.text = text;
  }
  render() {
    const $div = document.createElement("div");
    $div.classList.add("info-text-wrap");
    const $p = document.createElement("p");
    const $img = document.createElement("img");
    $p.textContent = this.text;
    $div.appendChild($img);
    $div.appendChild($p);
    $img.setAttribute("src", "./images/noResult.png");
    return $div;
  }
}
class MovieListSection {
  constructor(title, movies, isLoading) {
    this.title = title;
    this.movies = movies;
    this.isLoading = isLoading;
  }
  render() {
    const $section = document.createElement("section");
    const $title = document.createElement("h2");
    $title.textContent = this.getTitle();
    const $ul = document.createElement("ul");
    $ul.classList.add("thumbnail-list");
    if (this.movies === null) {
      const $div = new EmptyView("오류가 발생했습니다.").render();
      $section.appendChild($div);
      return $section;
    }
    const totalMovie = this.movies.length;
    const startIndex = Math.max(0, totalMovie - 20);
    if (totalMovie === 0) {
      const $div = new EmptyView("검색 결과가 없습니다.").render();
      $section.appendChild($title);
      $section.appendChild($div);
      return $section;
    }
    $section.appendChild($title);
    if (totalMovie <= 20) {
      this.renderMovieItemByArray(this.movies, $ul);
      $section.appendChild($ul);
      return $section;
    }
    this.renderMovieItemByArray(this.movies.slice(0, startIndex), $ul);
    this.renderMovieItemByArray(this.movies.slice(startIndex), $ul);
    $section.append($title, $ul);
    return $section;
  }
  renderMovieItemByArray(movies, $ul) {
    return movies.forEach((movie) => {
      const $item = new MovieItem(movie, this.isLoading).render();
      $ul.appendChild($item);
    });
  }
  getTitle() {
    if (this.title === void 0) {
      return "지금 인기 있는 영화";
    }
    return `"${this.title}" 검색 결과`;
  }
}
class App {
  constructor() {
    __privateAdd(this, _movies);
    __privateAdd(this, _isLoading);
    __privateAdd(this, _page);
    __privateAdd(this, _searchKeyword);
    __privateAdd(this, _searchPage);
    __privateAdd(this, _mode);
    __privateAdd(this, _show);
    __publicField(this, "setSearchKeyword", async (searchKeyword) => {
      __privateSet(this, _searchKeyword, searchKeyword);
      const { results, totalPage } = await this.getSearchMovies();
      if (totalPage === __privateGet(this, _searchPage)) {
        this.setShow(false);
      }
      this.setMovies(results);
    });
    __publicField(this, "setMode", (mode) => {
      __privateSet(this, _mode, mode);
      this.render();
    });
    __publicField(this, "onSubmit", async (e) => {
      e.preventDefault();
      const $input = document.querySelector(".search-input");
      __privateSet(this, _searchPage, 1);
      this.setShow(true);
      await this.setSearchKeyword($input.value);
      this.setMode("search");
    });
    __publicField(this, "handleButtonClick", async () => {
      if (__privateGet(this, _mode) === "popular") {
        __privateSet(this, _page, __privateGet(this, _page) + 1);
        const { results: results2, totalPage: totalPage2 } = await this.getMoviesResults();
        this.setMovies([...__privateGet(this, _movies), ...results2]);
        if (totalPage2 === __privateGet(this, _page)) {
          this.setShow(false);
        }
        return;
      }
      __privateSet(this, _searchPage, __privateGet(this, _searchPage) + 1);
      const { results, totalPage } = await this.getSearchMovies();
      if (totalPage <= __privateGet(this, _searchPage)) {
        this.setShow(false);
      }
      this.setMovies([...__privateGet(this, _movies), ...results]);
    });
    __privateSet(this, _movies, []);
    __privateSet(this, _isLoading, false);
    __privateSet(this, _page, 1);
    __privateSet(this, _searchPage, 1);
    __privateSet(this, _mode, "popular");
    __privateSet(this, _show, true);
  }
  async init() {
    const { results } = await this.getMoviesResults();
    if (results === null) {
      this.setMovies(null);
      return;
    }
    this.setMovies([...__privateGet(this, _movies), ...results]);
  }
  setShow(show) {
    __privateSet(this, _show, show);
    this.render();
  }
  setMovies(newMovies) {
    __privateSet(this, _movies, newMovies);
    this.render();
  }
  setIsLoading(isLoading) {
    __privateSet(this, _isLoading, isLoading);
    this.render();
  }
  async getMoviesResults() {
    return this.getMovies(getPopularityMovie, [__privateGet(this, _page)]);
  }
  async getSearchMovies() {
    return this.getMovies(searchMovie, [__privateGet(this, _searchPage), __privateGet(this, _searchKeyword)]);
  }
  async getMovies(apiCall, params) {
    this.setIsLoading(true);
    const data = await apiCall(...params);
    if (data !== null) {
      this.setIsLoading(false);
      const results = data.results.map((movie) => ({
        ...movie,
        poster_path: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
        vote_average: movie.vote_average.toFixed(1),
        backdrop_path: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      }));
      return { results, totalPage: data.total_pages };
    }
    return { results: null };
  }
  render() {
    const body = document.querySelector("body");
    body.innerHTML = "";
    const $wrap = document.createElement("div");
    $wrap.id = "wrap";
    const $header = new TitleSearchBar(this.onSubmit).render();
    if (this.hasMovies()) {
      const $thumbnail = new Thumbnail(__privateGet(this, _movies)[0]).render();
      $wrap.append($thumbnail);
    }
    const $container = document.createElement("div");
    $container.classList.add("container");
    const $main = document.createElement("main");
    const $movieListSection = new MovieListSection(
      __privateGet(this, _searchKeyword),
      __privateGet(this, _movies),
      __privateGet(this, _isLoading)
    ).render();
    body.appendChild($wrap);
    $wrap.append($header);
    $wrap.appendChild($container);
    $container.appendChild($main);
    $main.appendChild($movieListSection);
    if (this.hasMovies() && __privateGet(this, _show)) {
      const $moreButton = new Button().render();
      $main.appendChild($moreButton);
      $moreButton.addEventListener("click", this.handleButtonClick);
    }
    const $footer = new Footer().render();
    body.appendChild($footer);
  }
  hasMovies() {
    return __privateGet(this, _movies) !== null && __privateGet(this, _movies).length !== 0;
  }
}
_movies = new WeakMap();
_isLoading = new WeakMap();
_page = new WeakMap();
_searchKeyword = new WeakMap();
_searchPage = new WeakMap();
_mode = new WeakMap();
_show = new WeakMap();
const app = new App();
(async function() {
  await app.init();
})();
