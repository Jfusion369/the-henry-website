const db = require('../config/database');

class Newsletter {
    /**
     * Subscribe email to newsletter
     */
    static subscribe(email) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO newsletter_subscriptions (email)
                VALUES (?)
            `;
            
            db.run(query, [email], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Email already subscribed'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({
                        id: this.lastID,
                        email,
                        subscribedAt: new Date()
                    });
                }
            });
        });
    }

    /**
     * Get all active subscribers
     */
    static getActive() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM newsletter_subscriptions
                WHERE active = 1
                ORDER BY subscribedAt DESC
            `;
            
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Unsubscribe email
     */
    static unsubscribe(email) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE newsletter_subscriptions
                SET active = 0
                WHERE email = ?
            `;
            
            db.run(query, [email], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ email, unsubscribed: true });
                }
            });
        });
    }

    /**
     * Get subscriber count
     */
    static getCount() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE active = 1';
            
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

module.exports = Newsletter;
