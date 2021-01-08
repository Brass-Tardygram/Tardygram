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
            `SELECT * FROM postgram WHERE id=$1`,
            [id]
        );

        if(!rows[0]) throw new Error(`No posts with id ${id} found`);

        return new Postgram(rows[0]);
    }
        
}
