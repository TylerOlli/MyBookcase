import React, { Fragment } from "react";
import "./App.css";

class Book extends React.Component {
  updateBook(shelf) {
    this.props.onChangeShelf(this.props.book, shelf);
  }

  render() {
    const { book } = this.props;
    return (
      <Fragment>
        <li key={book.id}>
          <div className='book'>
            <div className='book-top'>
              <div
                className='book-cover'
                style={{
                  width: 128,
                  height: 193,
                  backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ""})`,
                }}
              />
              <div className='book-shelf-changer'>
                <select
                  value={book.shelf}
                  onChange={(e) => this.updateBook(e.target.value)}
                >
                  <option value='move' disabled>
                    Move to...
                  </option>
                  <option value='currentlyReading'>Currently Reading</option>
                  <option value='wantToRead'>Want to Read</option>
                  <option value='read'>Read</option>
                  <option value='none'>None</option>
                </select>
              </div>
            </div>
            <div className='book-title'>{book.title}</div>
            <div className='book-authors'>{book.authors}</div>
          </div>
        </li>
      </Fragment>
    );
  }
}

export default Book;
