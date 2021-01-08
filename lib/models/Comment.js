const pool = require('../utils/pool');

module.exports = class Comment {
    id;
    commentBy;
    post;
    comment;

    constructor(row) {
      this.id = row.id;
      this.commentBy = row.comment_by;
      this.post = row.post;
      this.comment = row.comment;
    }

    static async insert({ commentBy, post, comment }) {
      const { rows } = await pool.query(
        'INSERT INTO comment (comment_by, post, comment) VALUES ($1, $2, $3) RETURNING *',
        [commentBy, post, comment]
      );

      return new Comment(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM comment WHERE id=$1 RETURNING *',
        [id]
      );

      if(!rows[0]) throw new Error(`No comments with id ${id} found`);

      return new Comment(rows[0]);
    }
};
