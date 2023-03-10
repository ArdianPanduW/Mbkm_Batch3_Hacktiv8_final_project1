const { validationResult } = require('express-validator');
const db = require('../config/db');

class ReflectionsController {
    /**
     * Get Reflections
     */
    static async getReflections(req, res) {
        try {
            const userData = res.locals.user;

            let results = await db.query('SELECT r.id,u.email,r.success,r.low_point,r.take_away,r.created_date,r.modified_date FROM reflections as r JOIN users as u ON(u.id = r.owner_id) WHERE u.id = $1',[userData.id]);

            return res.status(200).json(results.rows);
        } catch (error) {
            return res.status(500).json({
                message:error
            });
        }
    }

    /**
     * Create Reflections
     */
    static async createReflections(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "bad request",
                    errors: errors.mapped()
                });
            }
            else {
                const userData = res.locals.user;

                const time = new Date().toISOString();
                const lowPoint = req.body.low_point;
                const takeAway = req.body.take_away;
                const success = req.body.success;

                let results = await db.query('INSERT INTO reflections (owner_id,success,low_point,take_away,created_date,modified_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,success,low_point,take_away,owner_id,created_date,modified_date',[userData.id,success,lowPoint,takeAway,time,time]);
    
                return res.status(201).json(results.rows[0]);
            }
        } catch (error) {
            return res.status(500).json({
                message:error
            });
        }
    }

    /**
     * Update Reflections
     */
    static async updateReflections(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "bad request",
                    errors: errors.mapped()
                });
            }
            else {
                let reflId = req.params.id || 0;

                const time = new Date().toISOString();
                const lowPoint = req.body.low_point;
                const takeAway = req.body.take_away;
                const success = req.body.success;
    
                await db.query('UPDATE reflections SET success=$2,low_point=$3,take_away=$4,modified_date=$5 WHERE id=$1',[reflId,success,lowPoint,takeAway,time]);
    
                return res.status(200).json({message:`relfections with id (${reflId}) successfully updated`});
            }

        } catch (error) {
            return res.status(500).json({
                message:error
            });
        }
    }

    /**
     * Delete Reflections
     */
    static async deleteReflections(req, res) {
        try {
            let reflId = req.params.id || 0;

            await db.query('DELETE FROM reflections WHERE id=$1',[reflId]);

            return res.status(200).json({message:`relfections with id (${reflId}) successfully deleted`});
        } catch (error) {
            return res.status(500).json({
                message:error
            });
        }
    }
}

module.exports = ReflectionsController;