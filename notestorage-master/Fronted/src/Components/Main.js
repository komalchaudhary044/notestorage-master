import React from 'react'
import { Link } from 'react-router-dom'
export default function Main() {
  return (
    <div>
      <section class="image-slider">
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
        aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
        aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
        aria-label="Slide 3"></button>
    </div>

    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="/images/details-slide-2.jpg" class="d-block w-100 carousel-img" alt="Slide 1" />
      </div>
      <div class="carousel-item">
        <img src="/images/3.jpg" class="d-block w-100 carousel-img" alt="Slide 2" />
      </div>
      <div class="carousel-item">
        <img src="/images/niteshhh.webp" class="d-block w-100 carousel-img" alt="Slide 3" />
      </div>
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>

    <div class="overlay">
      <p>Your Notebook in cloud is safe and secure.</p>
      <Link to="/welcome" class="btn btn-primary">Start Now</Link>
    </div>
  </div>
</section>


    <div class="container marketing">
      <div class="row my-5 text-center">  
          <div class="col-lg-4 col-md-6 mb-4">
              <img src="/images/edit.jpg" class="d-block w-50 mx-auto rounded-circle" alt="Edit Notes"/>
              <h2 class="fw-normal mt-3">Insert Notes</h2>
              <p>Some representative placeholder content for inserting notes.</p>
              <p><a class="btn btn-success" href="#">Insert Notes »</a></p>
          </div>
          
          <div class="col-lg-4 col-md-6 mb-4">
              <img src="/images/update1.jpg" class="d-block w-50 mx-auto rounded-circle" alt="Update Notes"/>
              <h2 class="fw-normal mt-3">Update Notes</h2>
              <p>Modify your existing notes with ease.</p>
              <p><a class="btn btn-warning" href="#">Update Notes »</a></p>
          </div>
          <div class="col-lg-4 col-md-12">
              <img src="/images/delete.jpg" class="d-block w-50 mx-auto rounded-circle" alt="Delete Notes"/>
              <h2 class="fw-normal mt-3">Delete Notes</h2>
              <p>Remove notes you no longer need.</p>
              <p><a class="btn btn-danger" href="#">Delete Notes »</a></p>
          </div>
      </div>
  </div>
    
    <hr class="featurette-divider"/>
    
    <div class="row featurette">
      <div class="col-md-7">
        <h2 class="featurette-heading fw-normal lh-1">Insert the notes and access it... </h2>
        <p class="lead">Some great placeholder content for the first featurette here. </p>
      </div>
      <div class="col-md-5">
     <img src="/images/student.webp" class="d-block w-100" alt="Second slide"/>
      </div>
    </div>

    <hr class="featurette-divider"/> 

    <div class="row featurette">
      <div class="col-md-7 order-md-2">
        <h2 class="featurette-heading fw-normal lh-1">Update the notes and Access Anytime..... </h2>
        <p class="lead">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
      </div>
      <div class="col-md-5 order-md-1">
             <img src="/images/about-1.jpg" class="d-block w-100" alt="Second slide"/>

      </div>
    </div>

    <hr class="featurette-divider"/>

    <div class="row featurette">
      <div class="col-md-7">
        <h2 class="featurette-heading fw-normal lh-1">And lastly, this one. <span class="text-body-secondary">Delete.</span></h2>
        <p class="lead">And yes, You can easily delete the notes related And search that notes if you want .</p>
      </div>
      <div class="col-md-5">
                     <img src="/images/carousel-2.jpg" class="d-block w-100" alt="Second slide"/>

      </div>
    </div>

    <hr class="featurette-divider"/>
  </div>
  )
}
 