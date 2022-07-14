require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT
const cors = require("cors");
const cloudinary = require("./cloudinary/cloudinary")

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true , limit: '50mb'}))


app.get("/", (req,res)=>{
    res.send("welcome on this page")
})


app.post("/", async(req,res)=>{
  const {images} = req.body;
  const uploadedImgs = images.map(async image=>{
   const upload =  await cloudinary.uploader.upload(image,
        { 
          upload_preset: 'unsigned_upload',
          allowed_formats : ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
      }, 
        function(error, result) {
            if(error){
                console.log(error)
            }
             });
    return upload
  })

  try{
    const fulfilled = await Promise.all(uploadedImgs).then(values=> {return values})
    const publicIds =  fulfilled.map(image=>{
        return image.public_id
    })
    console.log(publicIds)
    res.status(200).json(publicIds)
  }catch(err){
    res.status(500).json(err)
  }
    })






app.listen(port, _=> console.log(`app is listening on port ${port}`))