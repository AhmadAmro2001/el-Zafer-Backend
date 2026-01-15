import multer from "multer";

export const MulterHost = ( allowedExtnesions = [])=>{
    
    // diskstorage or memory storage
    const storage = multer.diskStorage({
        
        // filename
        filename: function(req , file , cb){
            console.log(file);//before upload
            
            cb(null, file.originalname );
        }
    })

    const fileFilter = (req,file ,cb)=>{
        if(allowedExtnesions.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error('Invalid file type'),false);
        }
    }
    const upload = multer({fileFilter,storage})
    return upload;
}