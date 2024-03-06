/* ./routes/sql.js */
const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Has some GPT code as a placeholder. need to refine this and ensure all is understood fully.
router.get("/sql", function (req, res) {
    let db = new sqlite3.Database('./public/db/data.db');

    const page = req.query.page || 1; // Default to page 1
    const itemsPerPage = 10; // Number of items per page

    const offset = (page - 1) * itemsPerPage;

    const countQuery = 'SELECT COUNT(*) as totalCount FROM weather';

    // Execute the query to get the total row count
    db.get(countQuery, (err, result) => {
        if (err) {
            console.error(err.message);
            return;
        }

        const totalCount = result.totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        // Define the SQL query with LIMIT and OFFSET
        const query = `SELECT * FROM weather ORDER BY date DESC LIMIT ${itemsPerPage} OFFSET ${offset}`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            // Check if any rows were returned
            if (rows.length > 0) {
                res.render("sql.ejs", { rows, currentPage: page, totalPages });
            } else {
                console.log('No matching records found.');
            }

            // Close the database connection
            db.close();
        });
    });
});



module.exports = router;


