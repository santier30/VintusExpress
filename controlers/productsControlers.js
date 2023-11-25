const Wine = require('../schemas/Wine')
const Users = require('../schemas/User')
const getWinesData = async(req, res)=> {
  try {
    const wines = await Wine.find() 

    let lBrands = [];
    wines.forEach((wine) => {
  if (!lBrands.includes(wine.brand)) {
    lBrands.push(wine.brand);
  }
});
    
let winePrices = wines.map((wine) => wine.price);
let biggestPrice = Math.max(...winePrices);
const winesSend = {wines:wines.slice(0,12),brands:lBrands,biggest:biggestPrice};
res.setHeader('Content-Type', 'application/json');
res.status(200).json(winesSend);
  
  } catch (error) {
    console.log(error);
    res.status(404).json(error.message);
  }

  



}
const getKnowData = async(req, res)=> {
try {
  const know = await Wine.find({know:{$exists:true}});
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(know);
} catch (error) {
  console.log(error);
  res.status(404).json(error.message);
}


}

const getExclusiveData = async(req, res)=> {
try {
  const know = await Wine.find({exclusive:{$exists:true}});
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(know);
} catch (error) {
  console.log(error);
  res.status(404).json(error.message);
}


}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const postNewItem = async(req,res)=>{
    const data = req.newWine;
    console.log(data);
  try {
    const wine = new Wine(data);
    const response = await wine.save();
    console.log(response);
 
    res.status(200).json({ message: "Data posted successfully", response });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }

  }
//////////////////////////////////////////////////////////////////////////////

  const filterWines = async(req , res)=>{
    try {
        const { type, brand, priceRangeFrom, priceRangeUpTo, search } = req.query;
        let filter = {}
        if (type) {
          const types = type.split(',');
          filter.category = { $in: types };
        }
        if (brand) {
          const brands = brand.split(',');
          filter.brand = { $in: brands };
        }
        if (priceRangeUpTo > 0) {
          filter.price = { $lte: Number(priceRangeUpTo) };
        }
        if (priceRangeFrom > 0) {
          filter.price = { $gte: Number(priceRangeFrom) };
        }
        if (search) {
          filter.name = new RegExp(search, 'i');
        }

const wines = await Wine.find(filter).limit(12)
console.log("filtered")
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(wines);
      } catch (error) {
        console.error("Error filtering wine data:", error);
        res.status(500).send('Error filtering wine data');
      }

}
const getItem = async(req , res)=>{
  const name = req.params.wine;
  console.log(name)
try {
  const wine = await Wine.findOne({name:`${name}`});
res.setHeader('Content-Type', 'application/json');
res.status(200).json(wine);
} catch (error) {
  console.log(error);
  res.status(404).json(error.message);
}



}

//MIDLEWARE////////////////////////////////
const modulate = (req, res , next) => {
    const {
        name,
        category,
        brand,
        image,
        short_description,
        long_description,
        price,
        stock,
      } = req.body.newWine;

    req.newWine = {
        "name": name.trim().replace(/\s+/g, ' '),
        "category": category,
        "brand": brand.trim().replace(/\s+/g, ' '),
        "image":image ,
        "short_description": short_description.trim().replace(/\s+/g, ' ') ,
        "long_description":  long_description.trim().replace(/\s+/g, ' '),
        "price": price ,
        "stock": stock
      }
      next();
}

const validate = async(req, res , next) => {
  
  const user = await Users.findOne({email:req.body.email,apiKey:req.body.apiKey},{ password: 0 })
  console.log(user.admin)
  if(user.admin){
    console.log("admin true")
    next();
  }else{
    res.status(500).json("Not admin")
  }


 
    
}




module.exports ={
    getWinesData,
    postNewItem,
    modulate,
    filterWines,
    getKnowData,
    getExclusiveData,
    getItem,
    validate
}