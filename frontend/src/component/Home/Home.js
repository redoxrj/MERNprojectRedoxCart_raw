import React, { useEffect } from 'react'
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard"
import MetaData from '../layout/MetaData';
import {clearErrors, getProduct} from '../../actions/productAction'
import {useSelector, useDispatch} from 'react-redux'
import Loader from  '../layout/Loader/Loader'
import {useAlert} from 'react-alert'

const Home = () => {
  const alert = useAlert()
  const dispatch = useDispatch();
  const {loading,products,error} = useSelector(state=>state.products)  // konsi naam ki state access krni h
  
  useEffect(() => {  
    if(error){
       alert.error(error)
       dispatch(clearErrors())
    }
   
    dispatch(getProduct()); // ek baar toh run krega hi after componentDidMount
  }, [dispatch,error,alert]);  // after that kab-kab run krega(render krega) uski condition( jab jab ye wala specific varaible change/update hoga {manually} | if dependcy array not given by default: run everytime if anything updates in the Main component)
  // in useeffect we can alos use componentWillUnmount using return 
  // basically in useEffect we can use componentDidMount, componentWillUpdate,componentWillUnmount

  return ( 
    <>
    {loading ? <Loader/>:  
    <>
    <MetaData title={'Home : RedoxCart'}/>
       <div className="banner">
            <p>Welcome to RedoxCart</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container"> 
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
          {products && products.map(product=>(   // dont use {}bracket use () 
            <ProductCard product={product} key={product._id}/>
           
           ))} 
          </div> 

    </>
  }
  </>
  )
}

export default Home
