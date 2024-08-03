import express from 'express'
import { createListing,deleteListing,updateListing,getListing,getListings} from '../controllers/listingcontroller.js';
import { verifyUser } from '../middleware/verify.js';

const router = express.Router()

router.post("/create",verifyUser,createListing)
router.post("/delete/:id",verifyUser,deleteListing)
router.post("/update/:id",verifyUser,updateListing)
router.get("/get/:id",getListing)
router.get("/get",getListings)

export default router;