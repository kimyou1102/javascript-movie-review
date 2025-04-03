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
var _rate, _movieId, _movie, _movie2, _isLoading, _show, _movies, _isLoading2, _searchKeyword, _page, _searchPage, _mode, _lastPage, _movieId2, _searchKeyword2, _mode2;
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
  constructor(onSubmit, $target) {
    this.onSubmit = onSubmit;
    this.$target = $target;
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
    $button.type = "submit";
    const $img = document.createElement("img");
    $img.setAttribute("src", "./images/Search.png");
    const $h1 = document.createElement("h1");
    $h1.classList.add("logo");
    const $logoImg = document.createElement("img");
    $logoImg.setAttribute("src", "./images/logo.png");
    $logoImg.setAttribute("alt", "MovieList");
    $h1.addEventListener("click", this.handleLogoClick);
    $div.appendChild($h1);
    $h1.appendChild($logoImg);
    $div.appendChild($searchBar);
    $searchBar.appendChild($input);
    $searchBar.appendChild($button);
    $button.appendChild($img);
    $searchBar.addEventListener("submit", this.onSubmit);
    this.$target.appendChild($div);
  }
  handleLogoClick() {
    const isGithubPages = window.location.hostname.includes("github.io");
    if (isGithubPages) {
      const repoName = window.location.pathname.split("/")[1];
      location.replace(`${location.origin}/${repoName}/`);
    }
    if (!isGithubPages) {
      location.replace(location.origin);
    }
  }
}
class Thumbnail {
  constructor(movie, $target, setMovieId) {
    __publicField(this, "handleButtonClick", () => {
      this.setMovieId(this.movie.id);
    });
    this.movie = movie;
    this.$target = $target;
    this.setMovieId = setMovieId;
  }
  render() {
    const $div = document.createElement("div");
    $div.classList.add("background-container");
    if (!this.movie) {
      $div.classList.add("thumbnail-skeleton-box");
      $div.innerHTML = /*html*/
      `
        <div class="overlay" aria-hidden="true"></div>
        <div class="top-rated-container">
          <div class="top-rated-movie">
            <div class="empty-rate">
              <span class="rate-empty-value"> </span>
            </div>
            <div class="empty-title"> </div>
            <button class="primary detail">자세히 보기</button>
          </div>
        </div>
      </div>
    `;
      this.$target.appendChild($div);
      return;
    }
    $div.style.backgroundImage = `url("${this.movie.backdrop_path}")`;
    const $overlay = document.createElement("div");
    $overlay.classList.add("overlay");
    $overlay.setAttribute("aria-hidden", true);
    const $topRatedContainer = document.createElement("div");
    $topRatedContainer.classList.add("top-rated-container");
    const $topRatedMovie = document.createElement("div");
    $topRatedMovie.classList.add("top-rated-movie");
    $topRatedMovie.innerHTML = /*html*/
    `
      <div class="rate">
        <img src="./images/star_empty.png" class="star" />
        <span class="rate-value">${this.movie.vote_average}</span>
      </div>
      <div class="title">${this.movie.title}</div>
    `;
    const $button = document.createElement("button");
    $button.className = "primary detail";
    $button.textContent = "자세히 보기";
    $button.addEventListener("click", this.handleButtonClick);
    $div.appendChild($overlay);
    $div.appendChild($topRatedContainer);
    $topRatedContainer.appendChild($topRatedMovie);
    $topRatedMovie.appendChild($button);
    this.$target.appendChild($div);
  }
}
class Footer {
  constructor($target) {
    this.$target = $target;
  }
  render() {
    const $footer = document.createElement("footer");
    $footer.classList.add("footer");
    $footer.innerHTML = /*html*/
    `
    <p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="./images/woowacourse_logo.png" width="180" /></p>
    `;
    this.$target.appendChild($footer);
  }
}
async function getFetchData(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTI1NWE1YTJlMTg4NDg2MGRhZDEwNWE5YjBhNDg2ZSIsIm5iZiI6MTc0MjI3MjQ4Ny4wNzgsInN1YiI6IjY3ZDhmN2U3YmI0MzM5NTFhNzM2NTMwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k0QMsKwC8spe0-5uOU_QprzUuGlPTQoRUpi2t5ywK1A"}`
    }
  });
  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new Error("요청이 잘못되었습니다. 입력값을 확인해주세요.");
      case 401:
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case 403:
        throw new Error("접근 권한이 없습니다.");
      case 404:
        throw new Error("요청한 정보를 찾을 수 없습니다.");
      case 429:
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      case 500:
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      case 502:
        throw new Error("잘못된 게이트웨이입니다. 다시 시도해주세요.");
      case 503:
        throw new Error("서비스가 일시적으로 중단되었습니다.");
      case 504:
        throw new Error(
          "서버 응답이 지연되고 있습니다. 나중에 다시 시도해주세요."
        );
      default:
        throw new Error(
          `알 수 없는 오류가 발생했습니다. (code: ${response.status})`
        );
    }
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
  constructor(movie, isLoading, onMovieItemClick, $target) {
    this.movie = movie;
    this.isLoading = isLoading;
    this.onMovieItemClick = onMovieItemClick;
    this.$target = $target;
  }
  render() {
    const $li = document.createElement("li");
    if (this.isLoading) {
      $li.classList.add("skeleton-box");
      this.$target.appendChild($li);
      return;
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
    $li.addEventListener("click", () => this.onMovieItemClick(this.movie.id));
    this.$target.appendChild($li);
  }
}
class EmptyView {
  constructor(text, $target) {
    this.text = text;
    this.$target = $target;
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
    this.$target.appendChild($div);
  }
}
async function getMovieDetail(movieId) {
  try {
    const data = await getFetchData(
      `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
    );
    return data;
  } catch (error) {
    return null;
  }
}
const isQuotaExceededError = (err) => {
  return err instanceof DOMException && (err.code === 22 || err.code === 1014 || err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
};
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (isQuotaExceededError(err)) {
      alert("현재 사용 가능한 스토리지 공간이 부족합니다.");
    } else {
      alert("예기치 못한 오류가 발생했습니다.");
    }
  }
};
function getItem(key, defaultValue) {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
const MOVIE_REVIEW = "movieReview";
class Rate {
  constructor($target, movieId) {
    __privateAdd(this, _rate);
    __privateAdd(this, _movieId);
    __publicField(this, "handleRateButtonClick", (e) => {
      const $button = e.target.closest("button");
      this.setRate($button.id);
      const localValue = getItem(MOVIE_REVIEW, {});
      const copy = { ...localValue };
      copy[__privateGet(this, _movieId)] = __privateGet(this, _rate);
      setItem(MOVIE_REVIEW, copy);
    });
    this.$target = $target;
    __privateSet(this, _movieId, movieId);
    __privateSet(this, _rate, this.getRateByMovieId() ?? 0);
  }
  getRateByMovieId() {
    const movieRate = getItem(MOVIE_REVIEW);
    if (!movieRate) return;
    return movieRate[__privateGet(this, _movieId)];
  }
  setRate(rate) {
    __privateSet(this, _rate, rate);
    this.render();
  }
  render() {
    this.$target.innerHTML = "";
    const $div = document.createElement("div");
    $div.classList.add("rating-selector");
    $div.innerHTML = /*html*/
    `
    <div class="rate-button-wrap">
        ${Array.from({ length: 5 }, (v, i) => (i + 1) * 2).map(
      (value) => `<button class="rate-button" id=${value}>
                <img src=${__privateGet(this, _rate) < value ? "./images/star_empty.png" : "./images/star_filled.png"} class="star" />
              </button>`
    ).join("")}
    </div>
    <div class="rate-text-wrap">
      <span class="rate-text">${this.getRateText(__privateGet(this, _rate))}</span>
      <span class="rate-number">${__privateGet(this, _rate) === 0 ? "" : `(${__privateGet(this, _rate)}/10)`}</span>
    </div>
      `;
    $div.addEventListener("click", this.handleRateButtonClick);
    this.$target.appendChild($div);
  }
  getRateText(rate) {
    const obj = {
      0: "아직 평점을 매기지 않았어요",
      2: "최악이예요",
      4: "별로예요",
      6: "보통이에요",
      8: "재미있어요",
      10: "명작이에요"
    };
    return obj[rate];
  }
}
_rate = new WeakMap();
_movieId = new WeakMap();
class Spinner {
  constructor($target) {
    this.$target = $target;
  }
  render() {
    const $orbitSpinner = document.createElement("div");
    $orbitSpinner.classList.add("orbit-spinner");
    $orbitSpinner.style.scale = "1";
    const $planet = document.createElement("div");
    $planet.classList.add("planet");
    const $orbit = document.createElement("div");
    $orbit.classList.add("orbit");
    const $satellite1 = document.createElement("div");
    $satellite1.classList.add("satellite", "satellite-1");
    const $satellite2 = document.createElement("div");
    $satellite2.classList.add("satellite", "satellite-2");
    $orbit.appendChild($satellite1);
    $orbit.appendChild($satellite2);
    $orbitSpinner.appendChild($planet);
    $orbitSpinner.appendChild($orbit);
    this.$target.appendChild($orbitSpinner);
  }
}
class MovieDescription {
  constructor($target, movie) {
    __privateAdd(this, _movie);
    this.$target = $target;
    __privateSet(this, _movie, movie);
  }
  render() {
    const { title, vote_average, genres, release_date, id, overview } = __privateGet(this, _movie);
    const $modalDescription = document.createElement("div");
    $modalDescription.classList.add("modal-description");
    const $title = document.createElement("h2");
    $title.textContent = this.title;
    const $category = document.createElement("p");
    $category.classList.add("category");
    $category.textContent = `${release_date.substr(0, 4)} · ${genres.map((genre) => genre.name).join(", ")}`;
    const $averageContainer = document.createElement("div");
    $averageContainer.classList.add("average-container");
    const $averageInfoText = document.createElement("span");
    $averageInfoText.classList.add("average-info-text");
    $averageInfoText.textContent = "평균";
    const $rate = document.createElement("p");
    $rate.classList.add("rate");
    const $starImg = document.createElement("img");
    $starImg.src = "./images/star_filled.png";
    $starImg.classList.add("star");
    const $rateSpan = document.createElement("span");
    $rateSpan.textContent = vote_average.toFixed(1);
    $rate.appendChild($starImg);
    $rate.appendChild($rateSpan);
    $averageContainer.appendChild($averageInfoText);
    $averageContainer.appendChild($rate);
    const $hr = document.createElement("hr");
    const $infoText = document.createElement("p");
    $infoText.classList.add("info-text");
    $infoText.textContent = "내 별점";
    const $rateContainer = document.createElement("div");
    $rateContainer.classList.add("rate-container");
    $modalDescription.appendChild($title);
    $modalDescription.appendChild($category);
    $modalDescription.appendChild($averageContainer);
    $modalDescription.appendChild($hr);
    $modalDescription.appendChild($infoText);
    $modalDescription.appendChild($rateContainer);
    new Rate($modalDescription.querySelector(".rate-container"), id).render();
    const $hr2 = document.createElement("hr");
    const $overviewText = document.createElement("p");
    $overviewText.classList.add("info-text");
    $overviewText.textContent = "줄거리";
    const $detail = document.createElement("p");
    $detail.classList.add("detail");
    $detail.textContent = overview;
    $modalDescription.append($hr2, $overviewText, $detail);
    this.$target.appendChild($modalDescription);
  }
}
_movie = new WeakMap();
const _Modal = class _Modal {
  constructor($target, setMovieId) {
    __privateAdd(this, _movie2);
    __privateAdd(this, _isLoading);
    __privateAdd(this, _show);
    __publicField(this, "handleKeyDown", (e) => {
      if (e.key === "Escape") {
        this.handleCloseButtonClick();
      }
    });
    __publicField(this, "handleModalBackClick", (e) => {
      if (!e.target.closest(".modal") && !e.target.closest(".rating-selector")) {
        this.handleCloseButtonClick();
      }
    });
    __publicField(this, "handleCloseButtonClick", () => {
      this.setMovieId(void 0);
      this.$div.classList.remove("active");
    });
    this.$target = $target;
    this.setMovieId = setMovieId;
    __privateGet(this, _movie2);
    __privateSet(this, _show, false);
    __privateSet(this, _isLoading, false);
    this.$div;
  }
  async init(movieId) {
    if (_Modal.currentKeydownHandler) {
      document.removeEventListener("keydown", _Modal.currentKeydownHandler);
    }
    document.addEventListener("keydown", this.handleKeyDown);
    _Modal.currentKeydownHandler = this.handleKeyDown;
    this.movieId = movieId;
    if (this.movieId && !__privateGet(this, _movie2) || __privateGet(this, _movie2) && this.movieId && __privateGet(this, _movie2).id !== this.movieId) {
      const movieDetail = await this.getMovieDetailData();
      this.setMovie(movieDetail);
    }
  }
  setIsLoading(isLoading) {
    __privateSet(this, _isLoading, isLoading);
    this.render();
  }
  setShow(show) {
    __privateSet(this, _show, show);
    this.render();
  }
  setMovie(newMovie) {
    __privateSet(this, _movie2, newMovie);
    this.render();
  }
  async getMovieDetailData() {
    this.setIsLoading(true);
    this.setShow(true);
    const data = await getMovieDetail(this.movieId);
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    if (data !== null) {
      this.setIsLoading(false);
      return data;
    }
  }
  render() {
    this.$target.innerHTML = "";
    this.$div = document.createElement("div");
    this.$div.classList.add("modal-background");
    this.$div.id = "modalBackground";
    this.$div.addEventListener("click", this.handleModalBackClick);
    if (__privateGet(this, _show)) this.$div.classList.add("active");
    if (__privateGet(this, _isLoading)) {
      const $modal2 = document.createElement("div");
      $modal2.className = "modal loading";
      const $closeButton2 = document.createElement("button");
      $closeButton2.classList.add("close-modal");
      $closeButton2.id = "closeModal";
      const $img2 = document.createElement("img");
      $img2.setAttribute("src", "./images/modal_button_close.png");
      $closeButton2.appendChild($img2);
      $closeButton2.addEventListener("click", this.handleCloseButtonClick);
      const $modalContainer2 = document.createElement("div");
      $modalContainer2.classList.add("modal-container");
      $modal2.appendChild($closeButton2);
      new Spinner($modalContainer2).render();
      $modal2.appendChild($modalContainer2);
      this.$div.appendChild($modal2);
      this.$target.appendChild(this.$div);
      return;
    }
    if (!__privateGet(this, _movie2) || !this.movieId) return;
    const {
      title,
      poster_path,
      vote_average,
      genres,
      release_date,
      overview,
      id
    } = __privateGet(this, _movie2);
    const $modal = document.createElement("div");
    $modal.classList.add("modal");
    const $closeButton = document.createElement("button");
    $closeButton.classList.add("close-modal");
    $closeButton.id = "closeModal";
    const $img = document.createElement("img");
    $img.setAttribute("src", "./images/modal_button_close.png");
    $closeButton.appendChild($img);
    $closeButton.addEventListener("click", this.handleCloseButtonClick);
    const $modalContainer = document.createElement("div");
    $modalContainer.classList.add("modal-container");
    const $modalImageDiv = document.createElement("div");
    $modalImageDiv.classList.add("modal-image");
    const $modalImg = document.createElement("img");
    $modalImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300${poster_path}`
    );
    $modalContainer.appendChild($modalImageDiv);
    $modalImageDiv.appendChild($modalImg);
    new MovieDescription($modalContainer, __privateGet(this, _movie2)).render();
    $modal.appendChild($closeButton);
    $modal.appendChild($modalContainer);
    this.$div.appendChild($modal);
    this.$target.appendChild(this.$div);
  }
};
_movie2 = new WeakMap();
_isLoading = new WeakMap();
_show = new WeakMap();
__publicField(_Modal, "currentKeydownHandler", null);
let Modal = _Modal;
const MOVIE = {
  MAX_MOVIES_PER_PAGE: 20
};
class MovieListSection {
  constructor(title, movies, isLoading, $target, loadMoreMovies, isLastPage, setMovieId) {
    __publicField(this, "handleMovieItemClick", (movieId) => {
      this.setMovieId(movieId);
    });
    this.title = title;
    this.movies = movies;
    this.isLoading = isLoading;
    this.$target = $target;
    this.loadMoreMovies = loadMoreMovies;
    this.isLastPage = isLastPage;
    this.setMovieId = setMovieId;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => this.handleIntersect(entry));
      },
      { threshold: 0 }
    );
  }
  async render() {
    this.$target.innerHTML = "";
    const $section = document.createElement("section");
    const $title = document.createElement("h2");
    $title.textContent = this.getTitle();
    $section.appendChild($title);
    const $ul = document.createElement("ul");
    $ul.classList.add("thumbnail-list");
    if (this.movies === null) {
      new EmptyView("오류가 발생했습니다.", $section).render();
      this.$target.appendChild($section);
      return;
    }
    const totalMovie = this.movies.length;
    if (this.isLoading && totalMovie === 0) {
      this.renderMovieItemByArray(
        Array(MOVIE.MAX_MOVIES_PER_PAGE).fill(0),
        $ul,
        this.isLoading
      );
      $section.appendChild($ul);
      this.$target.appendChild($section);
    }
    if (totalMovie === 0) {
      $section.appendChild($title);
      new EmptyView("검색 결과가 없습니다.", $section).render();
      this.$target.appendChild($section);
      return;
    }
    this.renderMovieItemByArray(this.movies, $ul, false);
    if (this.isLoading) {
      this.renderMovieItemByArray(
        Array(MOVIE.MAX_MOVIES_PER_PAGE).fill(0),
        $ul,
        this.isLoading
      );
    }
    this.$target.append($title, $ul);
    const $nextLi = $ul.querySelector("li:last-child");
    if ($nextLi !== null) {
      this.observer.observe($nextLi);
    }
  }
  handleIntersect(entry) {
    if (entry.isIntersecting && !this.isLoading && !this.isLastPage()) {
      this.loadMoreMovies(entry);
    }
  }
  renderMovieItemByArray(movies, $ul, isLoading) {
    movies.forEach((movie) => {
      new MovieItem(movie, isLoading, this.handleMovieItemClick, $ul).render();
    });
  }
  getTitle() {
    if (this.title === "") {
      return "지금 인기 있는 영화";
    }
    return `"${this.title}" 검색 결과`;
  }
}
class MoviesCotainer {
  constructor(searchKeyword, mode, $target) {
    __privateAdd(this, _movies);
    __privateAdd(this, _isLoading2);
    __privateAdd(this, _searchKeyword);
    __privateAdd(this, _page);
    __privateAdd(this, _searchPage);
    __privateAdd(this, _mode);
    __privateAdd(this, _lastPage);
    __privateAdd(this, _movieId2);
    __publicField(this, "setMovieId", (movieId) => {
      __privateSet(this, _movieId2, movieId);
      this.render();
    });
    __publicField(this, "isLastPage", () => {
      if (__privateGet(this, _mode) === "popular") {
        return __privateGet(this, _lastPage) === __privateGet(this, _page);
      }
      return __privateGet(this, _lastPage) === __privateGet(this, _searchPage);
    });
    __publicField(this, "loadMoreMovies", async () => {
      if (__privateGet(this, _mode) === "popular") {
        __privateSet(this, _page, __privateGet(this, _page) + 1);
        const { results: results2, totalPage: totalPage2 } = await this.getMoviesResults();
        this.setLastPage(totalPage2);
        this.setMovies([...__privateGet(this, _movies), ...results2]);
        return;
      }
      __privateSet(this, _searchPage, __privateGet(this, _searchPage) + 1);
      const { results, totalPage } = await this.getSearchMovies();
      this.setLastPage(totalPage);
      if (totalPage < __privateGet(this, _searchPage)) {
        return;
      }
      this.setMovies([...__privateGet(this, _movies), ...results]);
    });
    __privateSet(this, _movies, []);
    __privateSet(this, _isLoading2, false);
    __privateSet(this, _page, 1);
    __privateSet(this, _searchPage, 1);
    __privateSet(this, _searchKeyword, searchKeyword);
    __privateSet(this, _mode, mode);
    this.$target = $target;
    __privateSet(this, _lastPage, 0);
    this.renderModal();
  }
  async init() {
    if (__privateGet(this, _searchKeyword) !== "") {
      const { results: results2, totalPage: totalPage2 } = await this.getSearchMovies();
      if (results2 === null) {
        this.setMovies(null);
        return;
      }
      this.setLastPage(totalPage2);
      this.setMovies([...__privateGet(this, _movies), ...results2]);
      return;
    }
    const { results, totalPage } = await this.getMoviesResults();
    if (results === null) {
      this.setMovies(null);
      return;
    }
    this.setLastPage(totalPage);
    this.setMovies([...__privateGet(this, _movies), ...results]);
  }
  renderModal() {
    const $body = document.querySelector("body");
    const $modalContainer = document.createElement("div");
    $modalContainer.classList.add("modal-background-container");
    $body.appendChild($modalContainer);
    this.modal = new Modal($modalContainer, this.setMovieId);
  }
  setLastPage(lastPage) {
    __privateSet(this, _lastPage, lastPage);
    this.render();
  }
  setMovies(newMovies) {
    __privateSet(this, _movies, newMovies);
    this.render();
  }
  setIsLoading(isLoading) {
    __privateSet(this, _isLoading2, isLoading);
    this.render();
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
  async getSearchMovies() {
    return this.getMovies(searchMovie, [__privateGet(this, _searchPage), __privateGet(this, _searchKeyword)]);
  }
  async getMoviesResults() {
    return this.getMovies(getPopularityMovie, [__privateGet(this, _page)]);
  }
  render() {
    this.$target.innerHTML = "";
    const $container = document.createElement("div");
    $container.classList.add("container");
    if (__privateGet(this, _searchKeyword) === "") {
      new Thumbnail(__privateGet(this, _movies)[0], this.$target, this.setMovieId).render();
    }
    if (__privateGet(this, _searchKeyword) !== "") $container.classList.add("margin-top");
    const $main = document.createElement("main");
    const $div = document.createElement("div");
    new MovieListSection(
      __privateGet(this, _searchKeyword),
      __privateGet(this, _movies),
      __privateGet(this, _isLoading2),
      $div,
      this.loadMoreMovies,
      this.isLastPage,
      this.setMovieId
    ).render();
    $container.appendChild($main);
    $main.appendChild($div);
    this.$target.appendChild($container);
    this.modal.init(__privateGet(this, _movieId2));
  }
}
_movies = new WeakMap();
_isLoading2 = new WeakMap();
_searchKeyword = new WeakMap();
_page = new WeakMap();
_searchPage = new WeakMap();
_mode = new WeakMap();
_lastPage = new WeakMap();
_movieId2 = new WeakMap();
class App {
  constructor() {
    __privateAdd(this, _searchKeyword2);
    __privateAdd(this, _mode2);
    __publicField(this, "setSearchKeyword", async (searchKeyword) => {
      __privateSet(this, _searchKeyword2, searchKeyword);
      await this.render();
    });
    __publicField(this, "setMode", async (mode) => {
      __privateSet(this, _mode2, mode);
      await this.render();
    });
    __publicField(this, "onSubmit", async (e) => {
      e.preventDefault();
      const $input = document.querySelector(".search-input");
      if ($input.value === "") return;
      await this.setSearchKeyword($input.value);
      await this.setMode("search");
    });
    __privateSet(this, _mode2, "popular");
    __privateSet(this, _searchKeyword2, "");
  }
  async render() {
    const body = document.querySelector("body");
    body.innerHTML = "";
    const $wrap = document.createElement("div");
    $wrap.id = "wrap";
    new TitleSearchBar(this.onSubmit, $wrap).render();
    const $container = document.createElement("div");
    const moviesContainer = new MoviesCotainer(
      __privateGet(this, _searchKeyword2),
      __privateGet(this, _mode2),
      $container
    );
    body.appendChild($wrap);
    $wrap.appendChild($container);
    new Footer(body).render();
    moviesContainer.init();
  }
}
_searchKeyword2 = new WeakMap();
_mode2 = new WeakMap();
const app = new App();
(async function() {
  await app.render();
})();
