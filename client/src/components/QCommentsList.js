import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QCommentsList(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(props.comments);
  const commentsPerPage = 3;

  const qid = props.qid;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/questions/${qid}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments(); // Fetch comments when component mounts or when qid prop changes

    return () => {
    };
  }, [qid]); // Trigger effect when qid prop or comments changes

  // Pagination
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const endIndex = currentPage * commentsPerPage;
  const startIndex = endIndex - commentsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (validateCommentForm(newComment)) {

    try {
      // Send POST request to add new comment

      console.log(qid);

      await axios.post(`http://localhost:8000/question/${qid}/comments`, { content: newComment }, {
        headers: {
            'Content-Type': 'application/json'
        }
      });
      
      // Clear input after submission
      setNewComment('');

      // refresh comments
      const response = await axios.get(`http://localhost:8000/questions/${qid}/comments`);
      setComments(response.data); // Update state with fetched comments

      props.changeActive('Answers', qid);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }};

  const onCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleUpvote = async (commentId) => {
    try {
      await axios.put(`http://localhost:8000/questions/comments/${commentId}/votes`);

    const response = await axios.get(`http://localhost:8000/questions/${qid}/comments`);
    setComments(response.data); // Update state with fetched comments

    props.changeActive('Answers', qid);

    } catch (error) {
      console.error('Error updating votes:', error);
    }
  };
  
  return (
    <div className="comments-container">
      {/* Display current comments */}
      <div className="comments-list">
        {comments.slice(startIndex, endIndex).map((comment) => (
          <div key={comment._id} className="q-comment-item">
            <button className="qcomment-upvote-btn" onClick={() => handleUpvote(comment._id)}>Upvote</button>
            <p>{comment.votes}     {comment.content} commented {formatTime(comment.createdAt)}</p>
            {/* <span>{comment.content}   </span> */}
            {/* <span> */}
              {/* TODO: add username */}
                {/* <span className="cUser">{comment.user.username}</span> */}
                {/* <span> commented {formatTime(comment.createdAt)}</span> */}
            {/* </span> */}
          </div>
        ))}
      </div>

      <div className="comments-pagination">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={() => paginate(
              currentPage === totalPages ? 1 : currentPage + 1)}
          >
            Next
          </button>
        </div>  

      {/* Input field for adding new comments */}
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          name="comment"
          placeholder="Add a new comment..."
          value={newComment}
          onChange={onCommentChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

function formatTime(date) {
  const now = new Date();
  date = new Date(date); // JSON passes everything as Strings, so convert to Date here
  const diff = Math.floor((now - date) / 1000); // difference in seconds
  if (diff < 60) { return `${diff} seconds ago`; }
  if (diff < 3600) { return Math.floor(diff / 60) + " minutes ago"; } // less than an hour
  if (diff < 86400) { return Math.floor(diff / 3600) + " hours ago"; } // less than a day
  const month = date.toLocaleString('default', { month: 'short' }); // get shortened month name
  const day = date.getDate();
  const hour = ('0'+date.getHours()).slice(-2); // slice for leading 0s
  const minute = ('0'+date.getMinutes()).slice(-2); // slice for leading 0s
  if (diff < 31536000) { return `${month} ${day} at ${hour}:${minute}`; } // less than a year
  const year = date.getFullYear();
  return `${month} ${day}, ${year} at ${hour}:${minute}`;
}

// TODO: add reputation constraint
function validateCommentForm(content) {
  if (content.length > 140) {
    alert("Comment content should be 140 characters or less.");
    return false;
}
  return true;
}