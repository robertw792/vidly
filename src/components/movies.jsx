import _ from "lodash";
import React, { Component } from "react";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import { getMovies, deleteMovie } from "../services/movieService";
import MoviesTable from "./moviesTable.jsx";
import Pagination from "./common/pagination";
import ListGroup from "./common/listgroup";
import SearchBox from "./common/SearchBox.jsx";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    genres: [],
    sortColumn: { path: "title", order: "asc" },
  };

  handleGenreSelect = (genre) => {
    // when setState is used, movie component is rerendered
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };
  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };
  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }
  handleDelete = async (movie) => {
    //returns all instances of array except one we select
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");
      this.setState({ movies: originalMovies });
    }
  };
  handleLike = (movie) => {
    // clone to get the current state
    const movies = [...this.state.movies];
    //find index of the object (whatr youre selecting)
    const index = movies.indexOf(movie);
    //set to a new object (because we don't want to change state directly)
    movies[index] = { ...movies[index] };
    // this bit toggles the like button
    movies[index].liked = !movies[index].liked;
    //tell react to update state
    this.setState({ movies });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      movies: allMovies,
      selectedGenre,
      searchQuery,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: countOfMovies } = this.state.movies;
    const {
      pageSize,
      sortColumn,
      currentPage,
      searchQuery,
      selectedGenre,
      genres,
    } = this.state;

    if (countOfMovies === 0) return <p>There are no movies in the database</p>;
    const { totalCount, data: movies } = this.getPageData();
    return (
      <div>
        <div className="container">
          <Link
            className="btn btn-primary"
            to="/movies/new"
            style={{ marginBottom: 20 }}
          >
            Add Movie
          </Link>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
        </div>
        <div className="row">
          <ListGroup
            items={genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={selectedGenre}
          />
          <div className="col">
            <p>Showing {totalCount} movies in the database</p>
            <MoviesTable
              movies={movies}
              sortColumn={sortColumn}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
