const pool = require('../utils/pool');

module.exports = class Postgram {
    id;
    userId;
    photoURL;
    caption;
    tags;

    constructor(row) {
      this.id = row.id;
      this.userId = row.user_id;
      this.photoURL = row.photo_url;
      this.caption = row.caption;
      this.tags = row.tags;
    }

    static async insert({ userId, photoURL, caption, tags }) {
      const { rows } = await pool.query(
        'INSERT INTO postgram (user_id, photo_url, caption, tags) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, photoURL, caption, tags]
      );
      return new Postgram(rows[0]);
    }

    static async find() { 
      const { rows } = await pool.query(
        'SELECT * FROM postgram'
      );
      return rows.map(row => new Postgram(row));
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT 
          postgram.*,
          array_to_json(array_agg(users.*)) AS users,
          array_to_json(array_agg(comment.*)) AS comment 
          FROM postgram 
          JOIN users 
          ON postgram.user_id = users.id
          LEFT JOIN comment
          ON users.id = comment.comment_by
          WHERE postgram.id=$1
          GROUP BY postgram.id`,
        [id]
      );

      if(!rows[0]) throw new Error(`No posts with id ${id} found`);

      return new Postgram(rows[0]);
    }

    static async findPopular() {
      const { rows } = await pool.query(
        `SELECT
              postgram.*,
              COUNT(comment.comment)
              FROM comment
              JOIN postgram
              ON comment.post = postgram.id
              GROUP BY postgram.id
              ORDER BY count DESC
              LIMIT 10`
      );

      return rows.map(row => new Postgram(row));
    }
    
    static async update(id, postgram) {
      const { rows } = await pool.query(
        `UPDATE postgram 
            SET 
                caption=$1
            WHERE id=$2
            RETURNING *
            `,
        [postgram.caption, id]
      );

      if(!rows[0]) throw new Error(`No posts with id ${id} found`);

      return new Postgram(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM postgram WHERE id=$1 RETURNING *', 
        [id]
      );
        
      if(!rows[0]) throw new Error(`No posts with id ${id} found`);

      return new Postgram(rows[0]);
    }

};
