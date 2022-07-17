import { Router } from "express"
import express from "express"
import { checkAccess } from "./checkAccess.js"

let router = express.Router();
let accessChecker = new checkAccess();

router.get('/', (req: any, res) => {
    res.json({ "message": "ok" });
});
router.get('/:location/:badgeId', async (req: any, res) => {
    const hasAccess = await accessChecker.checkBadgeId(req.params.badgeId, req.params.location)
    if(hasAccess)
        res.send('true');
    else res.send('false');
    // res.json({
    //     "location: ": req.params.location,
    //     "badgeId": req.params.badgeId
    // });
})

export { router };