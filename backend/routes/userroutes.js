import express from "express"
import { deleteUser, test,updateUser, userListings,getUser } from "../controllers/usercontroller.js"
import { verifyUser } from "../middleware/verify.js"

const router = express.Router()

router.get("/test",test)
router.post("/update/:id",verifyUser,updateUser)
router.post("/delete/:id",verifyUser,deleteUser)
router.get("/listings/:id",verifyUser,userListings)
router.get("/:id",getUser)

export default router