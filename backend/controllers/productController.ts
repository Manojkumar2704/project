import  {Request,Response}  from "express";
const Products =require("../model/productModel")


const uploadProduct= async (req: Request, res: Response) => {
    const data=req.body;
    const image=req.file?.filename
    const newProduct=await new Products({
        name:data.name,
        description:data.description,
        price:data.price,
        quantity:data.quantity,
        image:image,
    })
    try {
    const result=await newProduct.save();
    res.status(200).json({message:"product added successfully",result})
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error ", error });
  }
}



const uploadProducts= async (req: Request, res: Response) => {
  const data=req.body;
  const images = req.files && Array.isArray(req.files) ? req.files.map((item) => `http://localhost:7000/images/${item.filename}`) : [];
  const newProduct=await new Products({
      name:data.name,
      description:data.description,
      price:data.price,
      quantity:data.quantity,
      image:images
  })
  try {
  const result=await newProduct.save();
  res.status(200).json({message:"product added successfully",result})
  } catch (error) {
  console.log(error);
  res.status(500).json({ message: "Error ", error });
}
}



const allproducts=async(req:Request,res:Response)=>{
  try {
    const result=await Products.find();
  res.status(200).send(result)
  } catch (error) {
    res.status(404).json({error})
  }
  
}



const deleteProduct=async(req:Request,res:Response)=>{
  try {
  const id=req.params.id;
  const result=await Products.findByIdAndDelete(id)
  res.status(200).json({message:"Product deleted"})
  } catch (error) {
    res.status(404).send(error)
  }
  
}

const updateProduct=async (req:Request,res:Response)=>{
  try {
    const data=req.body
    const id=req.params.id
    const result=await Products.findByIdAndUpdate(id,data)
    res.status(200).json({message:"product updated"})
  } catch (error) {
    res.status(400).send(error)
  }
}
export {uploadProduct,uploadProducts,allproducts,deleteProduct,updateProduct}