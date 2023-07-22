import { format, formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
const SinglePost = ({ _id, title, cover, createdAt, summary, author }) => {
  return (
    <div className="post">
      {/* ###### */}
      <Link to={`/post/${_id}`}>
        <div className="image">
          <img src={"http://localhost:4000/" + cover} alt="Post Image" />
        </div>
      </Link>
      {/* ##### */}
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          {/* <time>{format(new Date(createdAt),'MMM d, yyy HH:mm')}</time> */}
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
      {/* ##### */}
    </div>
  );
};

export default SinglePost;
