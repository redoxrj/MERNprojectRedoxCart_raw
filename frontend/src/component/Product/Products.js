import React, { useEffect, useState } from 'react'
import './Products.css'
import {useDispatch,useSelector} from 'react-redux'
import {clearErrors, getProduct} from '../../actions/productAction'
import Loader from  '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom';
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {useAlert} from 'react-alert'
import MetaData from '../layout/MetaData';


const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Games",
    "Camera",
    "SmartPhones",
  ];


const Products = () => {
    
    const {keyword} = useParams();
    const dispatch = useDispatch()
    const alert = useAlert()
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0,99000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)
    

    const {products,loading,error,productsCount,resultsPerPage} = useSelector(state=>state.products)

    const setCurrentPageNo =(e)=>{
        setCurrentPage(e)

    }
    const priceHandler =(event,newPrice)=>{
        setPrice(newPrice)

    }
    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors)
        }
      dispatch(getProduct(keyword,currentPage,price,category,ratings)) // agar param mien kuch ni mila toh default keyword ''(blank) hi rhega as stated in getProduct function in product Action
    },[dispatch,keyword,currentPage,price,category,ratings,error,alert]);

  return (
    <>
      {loading ? <Loader/> : 
      <> 
       <MetaData title={'Products : ECOMMERCE'}/>
       <h2 className="productsHeading">Products</h2>

       <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
          <Typography>Price</Typography>
          <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={100000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>

          </div>

          {resultsPerPage < productsCount && <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultsPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>}


       </>}
    </>
  )
}

export default Products
