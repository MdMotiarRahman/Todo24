import {Router} from "express"
import {pool} from '../helpers/db.js'
import {emptyOrRows} from '../helpers/utils.js'
import { auth } from '../helpers/auth.js' 

const todoRouter = Router()


// Get All Tasks
todoRouter.get('/', async (req, res, next) => {
  pool.query('SELECT * FROM task', (error, result) => {
    if(error){
      return next(error)
    }
    return res.status(200).json(emptyOrRows(result))
  })
});
  
// Add a New Task
todoRouter.post('/create', auth, (req, res, next) => {
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *',
        [req.body.description],
        (error, result) => {
          if(error){return next(error)}
          return res.status(200).json({id: result.rows[0].id})
    })
});
  
// Delete a Task
todoRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM task WHERE id = $1', [id]);
      res.status(200).json({ id:id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export { todoRouter };
