
<template>
  <div class="sidenav">
    <router-link class="active" to="/home">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/clients">Clients</router-link>
    <router-link to="/contact">Contact</router-link>
  </div>
</template>

<style scoped>
/* Sidebar container */
.sidenav {
  height: 100%;            /* Full-height */
  width: 170px;            /* Sidebar width */
  position: fixed;         /* Stay fixed on screen */
  top: 0;
  left: 0;
  background-color: #9ee294;  /* Dark background */
  padding-top: 20px;
}

/* Style the links */
.sidenav a {
  display: block; 
  gap: 20px;         /* Make links stack vertically */
  color: rgb(102, 125, 103);
  padding: 12px;
  text-decoration: none;
  font-size: 20px;
} 

/* Hover effect */
.sidenav a:hover {
    
  background-color: #13b110;
  color: #fff;
}
</style>