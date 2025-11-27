const db = require('../config/database');

class Contact {
    /**
     * Create a new contact submission
     */
    static create(data) {
        return new Promise((resolve, reject) => {
            const { name, email, phone, subject, message } = data;
            
            const query = `
                INSERT INTO contacts (name, email, phone, subject, message)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            db.run(query, [name, email, phone, subject, message], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        ...data,
                        createdAt: new Date()
                    });
                }
            });
        });
    }

    /**
     * Get all contacts
     */
    static getAll(limit = 100, offset = 0) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM contacts
                ORDER BY createdAt DESC
                LIMIT ? OFFSET ?
            `;
            
            db.all(query, [limit, offset], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Get contact by ID
     */
    static getById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM contacts WHERE id = ?';
            
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Update contact status
     */
    static updateStatus(id, status, notes = '') {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE contacts
                SET status = ?, notes = ?
                WHERE id = ?
            `;
            
            db.run(query, [status, notes, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, status, notes });
                }
            });
        });
    }

    /**
     * Delete contact
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM contacts WHERE id = ?';
            
            db.run(query, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, deleted: true });
                }
            });
        });
    }

    /**
     * Get contacts by status
     */
    static getByStatus(status) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM contacts
                WHERE status = ?
                ORDER BY createdAt DESC
            `;
            
            db.all(query, [status], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Get contact count
     */
    static getCount() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM contacts';
            
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }
}

module.exports = Contact;
