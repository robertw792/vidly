import httpService from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/movies";

function movieUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getMovies() {
  return httpService.get(apiEndpoint);
}

export function deleteMovie(movieId) {
  return httpService.delete(movieUrl(movieId));
}
export function getMovie(movieId) {
  return httpService.get(movieUrl(movieId));
}

export function saveMovie(movie) {
  if (movie._id) {
    const body = { ...movie };
    delete body._id;
    return httpService.put(movieUrl(movie._id), body);
  }
  return httpService.post(apiEndpoint, movie);
}
