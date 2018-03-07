import React from 'react';
import {Link, IndexLink} from 'react-router';

function Dir(props) {
    //console.log(props);
    const dir = props.params.dir;
    const books = props.route.books[dir];

    return (
        <div className="mdl-grid">
            {books.map(book => 
                <div key={book.slug} className="book-card mdl-cell mdl-cell--6-col mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__content">
                        <img src={book.cover} className="book-card__image" />

                        <div className="book-card__details">
                            <h2 className="book-card__title">{book.title}</h2>

                            <div className="book-card__info">
                                <p>{book.author}</p>
                                <p>{book.publisher}, {book.year}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mdl-card__actions mdl-card--border">
                        <Link to={`/pages/${dir}/${book.slug}`} className="mdl-button mdl-button--colored">More</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dir;
