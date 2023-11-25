const express = require('express')
const Wine = require('../schemas/Wine')
const controlers = require('../controlers/productsControlers')
const router = express.Router();

const {getWinesData, postNewItem,modulate,filterWines,getKnowData,getExclusiveData,getItem,validate} = controlers

router.get('/Shop',getWinesData)

router.get('/ShopScroll',async (req, res) => {

    try {
        const { type, brand, priceRangeFrom, priceRangeUpTo, search, page } = req.query;
        console.log(page)
        const perPage = 12;
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

const wines = await Wine.find(filter).skip((page) * perPage) 
.limit(perPage) 
.exec();

console.log("filtered")
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(wines);
      } catch (error) {
        console.error("Error filtering wine data:", error);
        res.status(500).send('Error filtering wine data');
      }

})

router.get('/Know',getKnowData)

router.get('/Exclusive',getExclusiveData)

router.post('/Add', validate, modulate, postNewItem)

router.get('/Filter',  filterWines)

router.get('/Buy/:wine',getItem)



module.exports = router;