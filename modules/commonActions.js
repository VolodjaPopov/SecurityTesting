export class CommonActions {
  constructor(page) {
    this.page = page;
  }

  async convertMovieIdToTitle(id) {
    let movies = [
      "G.I. Joe: Retaliation",
      "Iron Man",
      "Man of Steel",
      "Terminator Salvation",
      "The Amazing Spider-Man",
      "The Cabin in the Woods",
      "The Dark Knight Rises",
      "The Fast and the Furious",
      "The Incredible Hulk",
      "World War Z",
    ];
    return movies[id - 1];
  }
}
