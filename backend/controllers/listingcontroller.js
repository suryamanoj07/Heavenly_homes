import Listing from "../models/listingmodel.js"

export const createListing = async(req,res)=>{
    try{
        const list = await Listing.create(req.body)
        res.json({success:true,list})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}

export const deleteListing = async(req,res)=>{
    const listing = await Listing.findById(req.params.id)

    if(!listing){
        res.json({success:false,message:"Listing not found"})
    }

    if(req.body.userId!==listing.userRef){
        res.json({success:false,message:"You can only delete your listing"})
    }
    if(req.body.userId===listing.userRef){
    await Listing.findByIdAndDelete(req.params.id)
    res.json({success:true,message:"Listing deleted successfully"})}
}

export const updateListing = async(req,res)=>{
    try{
    const listing = await Listing.findById(req.params.id)

    if(!listing){
        res.json({success:false,message:"Listing not found"})
    }
    if(req.body.userId!==listing.userRef){
        res.json({success:false,message:"You can only update your listing"})
    }
        const updatedlisting=await Listing.findByIdAndUpdate(req.params.id,req.body)
        res.json({success:true,message:"updated successfully"})
    }catch(e){
        res.json({success:false,message:e.message})
    }
}

export const getListing = async(req,res)=>{
    try{
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            res.json({success:false,message:"Listing not found"})
        }
        res.json({success:true,message:listing})
    }catch(e){
        res.json({success:false,message:e.message})
    }}

    export const getListings = async(req,res)=>{
        try{
                const limit = parseInt(req.query.limit) || 9;
                const startIndex = parseInt(req.query.startIndex) || 0;
                let offer = req.query.offer;
            
                if (offer === undefined || offer === 'false') {
                  offer = { $in: [false, true] };
                }
            
                let furnished = req.query.furnished;
            
                if (furnished === undefined || furnished === 'false') {
                  furnished = { $in: [false, true] };
                }
            
                let parking = req.query.parking;
            
                if (parking === undefined || parking === 'false') {
                  parking = { $in: [false, true] };
                }
            
                let type = req.query.type;
            
                if (type === undefined || type === 'all') {
                  type = { $in: ['sale', 'rent'] };
                }
            
                const searchTerm = req.query.searchTerm || '';
            
                const sort = req.query.sort || 'createdAt';
            
                const order = req.query.order || 'desc';
            
                const listings = await Listing.find({
                  name: { $regex: searchTerm, $options: 'i' },
                  offer,
                  furnished,
                  parking,
                  type,
                })
                  .sort({ [sort]: order })
                  .limit(limit)
                  .skip(startIndex);

            return res.json({success:true,message:listings})
            
        }
        catch(err){
            res.json({success:false,message:err.message})
        }
    }