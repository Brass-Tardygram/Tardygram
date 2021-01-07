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

    static async insert(postgram) {
        const { rows } = pool.query(
            'INSERT INTO postgram (user_id, photo_url, caption, tags) VALUES ($1, $2,$3, $4) RETURNING *',
            [postgram.userId, postgram.photoURL, postgram.caption, postgram.tags]
        );
        return new Postgram(rows[0]);
    }
}