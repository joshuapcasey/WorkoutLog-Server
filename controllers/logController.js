const Express = require('express');
const router = Express.Router();
const validateSession = require('../middleware/validate-session');
const { LogModel } = require('../models');

router.get("/practice", validateSession, (req, res) => {
    res.send("Hey!! This is a practice route!")
});

router.get('/about', (req, res) => {
    res.send('This is the about route!')
});

//* WORKING: post new log (req authorization)
router.post('/create', validateSession, async(req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ msg: `Oh no! Server error: ${err}`})
    }
    LogModel.create(logEntry)
});

//! BROKEN GET ALL WORKOUT LOG ENTRIES (module 12.3.4)
router.get("/all", async (req, res) => {
    try {
        const allLogs = await LogModel.findAll();
        res.status(200).json(allLogs);
    } catch (error) {
        res.status(500).json({ error: err });
    }
});

//* WORKING find all logs from given user 
router.get('/mine', validateSession, async(req, res)=>{
    try{
        const id = req.user.id;
        // const { id } = req.user;
        const userLogs = await LogModel.findAll({
            where: {owner_id: id}
        });
        res.status(200).json(userLogs)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

//! BROKEN find all logs by description (module 12.3.4)
router.get('/:description', async(req,res)=>{
    const { description } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { description: description }
        });
        res.status(200).json(results)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

// update individual logs (doesn't require user to be the same, i.e. any user can update anyones logs)
router.put('/:id', validateSession, async (req, res) => {
    const {description, definition, result} = req.body;

    try {
        const logUpdate = await LogModel.update({description, definition, result},
            {where: {id: req.params.id}})

            res.status(200).json({
                message: "Log successfully updated",
                logUpdate
            })
    }catch (err){
        res.status(500).json({
            message: `Failed to update log ${err}`
        })

    }
});

// router.put('/update/:entryId', validateSession, async(req, res)=>{
//     const { description, definition, result } = req.body;
//     const logId = req.params.entryId;
//     const userId = req.user.id;
//     // const ownerId = req.user.id;

//     const query = {
//         where: {
//             id: logId,
//             owner: userID
//         }
//     };

//     const updatedLog = {
//         description: description,
//         definition: definition,
//         result: result
//     };

//     try {
//         const update = await LogModel.update(updatedLog, query);
//         res.status(200).json(update);
//     } catch (err) {
//         res.status(500).json({error: err})
//     }
// });

//delete log
router.delete('/:id', validateSession, async(req, res)=>{
    try{
        const locatedLog = await LogModel.destroy({
            where: {id: req.params.id}
        })
        res.status(200).json({
            message: 'Log successfully deleted',
            deletedLog: locatedLog
            })
    } catch(err) {
        res.status(500).json({
            message: `Failed to delete log: ${err}`
        })
    }
})

module.exports = router;

// //find specific log from specific user (log id goes in address, owner id goes in body)
// router.get('/:id', async(req,res)=>{
//     try {
//         const { ownerId } = req.body;
//         const { id } = req.params;
//         const specificLog = await LogModel.findOne({
//             where: {owner_id: ownerId, id: id}
//         });
//         res.status(200).json(specificLog)
        
//     } catch (err) {
//         res.status(500).json({ error: err})
//     }
// })